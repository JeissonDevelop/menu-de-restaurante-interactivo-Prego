export const maxDuration = 60

type DishInput = { id: number; name: string; ingredients: string; description: string }
type Translation = { name: string; ingredients: string; description: string }

// In-memory cache so repeated requests for the same language/dishes are instant.
const cache = new Map<string, Record<string, Translation>>()
// Separate cache for the fixed UI/interface labels, keyed by language.
const uiCache = new Map<string, string[]>()

// Free, key-less translation via Google's public endpoint.
// Returns the original text unchanged if the request fails.
async function translateText(text: string, target: string): Promise<string> {
  const clean = (text ?? "").trim()
  if (!clean) return text ?? ""
  try {
    const url =
      "https://translate.googleapis.com/translate_a/single?client=gtx&sl=es" +
      `&tl=${encodeURIComponent(target)}&dt=t&q=${encodeURIComponent(clean)}`
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      // Never cache at the fetch layer; we cache in-memory ourselves.
      cache: "no-store",
    })
    if (!res.ok) throw new Error(`status ${res.status}`)
    const data = (await res.json()) as [Array<[string]>]
    // data[0] is an array of translated segments -> join them back together.
    const segments = data?.[0]
    if (!Array.isArray(segments)) throw new Error("unexpected shape")
    return segments.map((s) => s?.[0] ?? "").join("")
  } catch (error) {
    console.log("[v0] translate segment failed:", (error as Error)?.message)
    return text ?? ""
  }
}

async function translateDish(dish: DishInput, target: string): Promise<Translation> {
  const [name, ingredients, description] = await Promise.all([
    translateText(dish.name, target),
    translateText(dish.ingredients, target),
    translateText(dish.description, target),
  ])
  return { name, ingredients, description }
}

export async function POST(req: Request) {
  try {
    const { language, dishes, texts } = (await req.json()) as {
      language: string
      languageLabel?: string
      dishes?: DishInput[]
      texts?: string[]
    }

    if (!language || language === "es") {
      return Response.json({ translations: {}, texts: texts ?? [] })
    }

    // Map our internal language codes to Google Translate codes where they differ.
    const targetMap: Record<string, string> = {
      zh: "zh-CN",
      no: "no",
      he: "iw",
    }
    const target = targetMap[language] ?? language

    // Translate the fixed interface labels (cached per language).
    let translatedTexts: string[] = texts ?? []
    if (texts && texts.length > 0) {
      if (uiCache.has(language)) {
        translatedTexts = uiCache.get(language)!
      } else {
        translatedTexts = await Promise.all(texts.map((s) => translateText(s, target)))
        uiCache.set(language, translatedTexts)
      }
    }

    // Translate dish content (cached per language + dish set).
    const dishList = dishes ?? []
    const cacheKey = `${language}:${dishList.map((d) => d.id).join(",")}`
    let map: Record<string, Translation> = {}
    if (dishList.length > 0) {
      if (cache.has(cacheKey)) {
        map = cache.get(cacheKey)!
      } else {
        const results = await Promise.all(dishList.map((d) => translateDish(d, target)))
        dishList.forEach((d, i) => {
          map[d.id] = results[i]
        })
        cache.set(cacheKey, map)
      }
    }

    return Response.json({ translations: map, texts: translatedTexts })
  } catch (error) {
    console.log("[v0] translation error:", (error as Error)?.message)
    return Response.json({ translations: {}, error: "translation_failed" }, { status: 200 })
  }
}
