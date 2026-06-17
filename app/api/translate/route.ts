import { generateObject } from "ai"
import { z } from "zod"

export const maxDuration = 30

// Simple in-memory cache so repeated requests for the same language are instant.
const cache = new Map<string, Record<string, { name: string; ingredients: string; description: string }>>()

const schema = z.object({
  translations: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      ingredients: z.string(),
      description: z.string(),
    }),
  ),
})

export async function POST(req: Request) {
  try {
    const { language, languageLabel, dishes } = (await req.json()) as {
      language: string
      languageLabel: string
      dishes: { id: number; name: string; ingredients: string; description: string }[]
    }

    if (!language || language === "es") {
      return Response.json({ translations: {} })
    }

    const cacheKey = `${language}:${dishes.map((d) => d.id).join(",")}`
    if (cache.has(cacheKey)) {
      return Response.json({ translations: cache.get(cacheKey) })
    }

    const { object } = await generateObject({
      model: "openai/gpt-5-mini",
      schema,
      prompt:
        `You are a professional menu translator for an upscale Italian restaurant. ` +
        `Translate the following dish names, ingredient lists and descriptions from Spanish into ${languageLabel} (${language}). ` +
        `Keep Italian culinary proper nouns (e.g. "Carbonara", "Osso Buco", "Tiramisú", "Burrata") in their original form. ` +
        `Translate naturally and appetizingly, not literally. Return one entry per dish, preserving the id.\n\n` +
        `Dishes:\n${JSON.stringify(dishes)}`,
    })

    const map: Record<string, { name: string; ingredients: string; description: string }> = {}
    for (const t of object.translations) {
      map[t.id] = { name: t.name, ingredients: t.ingredients, description: t.description }
    }
    cache.set(cacheKey, map)

    return Response.json({ translations: map })
  } catch (error) {
    console.log("[v0] translation error:", (error as Error)?.message, (error as Error)?.stack)
    return Response.json(
      { translations: {}, error: "translation_failed", detail: (error as Error)?.message },
      { status: 200 },
    )
  }
}
