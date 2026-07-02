export const maxDuration = 60

type DishInput = { id: number; name: string; ingredients: string; description: string }
type Translation = { name: string; ingredients: string; description: string }

// In-memory cache so repeated requests for the same language/dishes are instant.
const cache = new Map<string, Record<string, Translation>>()

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
    const { language, dishes } = (await req.json()) as {
      language: string
      languageLabel?: string
      dishes: DishInput[]
    }

    if (!language || language === "es") {
      return Response.json({ translations: {} })
    }

    // Map our internal language codes to Google Translate codes where they differ.
    const targetMap: Record<string, string> = {
      zh: "zh-CN",
      pt: "pt",
    }
    const target = targetMap[language] ?? language

    const cacheKey = `${language}:${dishes.map((d) => d.id).join(",")}`
    if (cache.has(cacheKey)) {
      return Response.json({ translations: cache.get(cacheKey) })
    }

    const results = await Promise.all(dishes.map((d) => translateDish(d, target)))

    const map: Record<string, Translation> = {}
    dishes.forEach((d, i) => {
      map[d.id] = results[i]
    })
    cache.set(cacheKey, map)

    return Response.json({ translations: map })
  } catch (error) {
    console.log("[v0] translation error:", (error as Error)?.message)
    return Response.json({ translations: {}, error: "translation_failed" }, { status: 200 })
  }
}
