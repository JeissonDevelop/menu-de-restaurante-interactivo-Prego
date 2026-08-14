"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  UI_STRINGS,
  type LanguageCode,
} from "@/lib/constants"
import type { Dish, Category } from "@/lib/db"

type Translation = { name: string; ingredients: string; description: string }
type TranslationMap = Record<number, Translation>
type StringMap = Record<string, string>

type LanguageContextValue = {
  lang: LanguageCode
  setLang: (l: LanguageCode) => void
  t: (key: string) => string
  categoryLabel: (slug: string, fallback: string) => string
  translateDish: (dish: Dish) => Translation
  translating: boolean
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

// Right-to-left languages need the document direction flipped.
const RTL_LANGS = new Set<string>(["ar", "he"])

// Fixed interface labels are translated from their Spanish base values.
const UI_KEYS = Object.keys(UI_STRINGS.es)

export function LanguageProvider({
  dishes,
  categories,
  children,
}: {
  dishes: Dish[]
  categories: Category[]
  children: React.ReactNode
}) {
  const [lang, setLangState] = useState<LanguageCode>(DEFAULT_LANGUAGE)
  const [translations, setTranslations] = useState<Record<string, TranslationMap>>({})
  const [uiTranslations, setUiTranslations] = useState<Record<string, StringMap>>({})
  const [catTranslations, setCatTranslations] = useState<Record<string, StringMap>>({})
  const [translating, setTranslating] = useState(false)

  // Stable list of category slugs + their Spanish labels for translation.
  const categorySlugs = useMemo(() => categories.map((c) => c.slug), [categories])
  const categoryBaseLabels = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.slug, c.label])),
    [categories],
  )

  // Restore saved language preference.
  useEffect(() => {
    const saved = localStorage.getItem("prego_lang") as LanguageCode | null
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      setLangState(saved)
    }
  }, [])

  const setLang = useCallback((l: LanguageCode) => {
    setLangState(l)
    localStorage.setItem("prego_lang", l)
  }, [])

  // Reflect text direction for RTL languages.
  useEffect(() => {
    document.documentElement.dir = RTL_LANGS.has(lang) ? "rtl" : "ltr"
    document.documentElement.lang = lang
    return () => {
      document.documentElement.dir = "ltr"
    }
  }, [lang])

  // Fetch translations whenever the language changes (skip Spanish base).
  useEffect(() => {
    if (lang === "es") return
    // Skip if we already have both dish + UI translations cached client-side.
    if (translations[lang] && uiTranslations[lang]) return
    const langMeta = LANGUAGES.find((l) => l.code === lang)
    if (!langMeta) return

    let cancelled = false
    setTranslating(true)

    const texts = [
      ...UI_KEYS.map((k) => UI_STRINGS.es[k]),
      ...categorySlugs.map((slug) => categoryBaseLabels[slug]),
    ]

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: lang,
        languageLabel: langMeta.label,
        texts,
        dishes: dishes.map((d) => ({
          id: d.id,
          name: d.name,
          ingredients: d.ingredients,
          description: d.description,
        })),
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        setTranslations((prev) => ({ ...prev, [lang]: data.translations || {} }))

        const translatedTexts: string[] = Array.isArray(data.texts) ? data.texts : []
        if (translatedTexts.length > 0) {
          const uiMap: StringMap = {}
          UI_KEYS.forEach((k, i) => {
            if (translatedTexts[i]) uiMap[k] = translatedTexts[i]
          })
          const catMap: StringMap = {}
          categorySlugs.forEach((slug, i) => {
            const val = translatedTexts[UI_KEYS.length + i]
            if (val) catMap[slug] = val
          })
          setUiTranslations((prev) => ({ ...prev, [lang]: uiMap }))
          setCatTranslations((prev) => ({ ...prev, [lang]: catMap }))
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setTranslating(false)
      })

    return () => {
      cancelled = true
    }
  }, [lang, dishes, translations, uiTranslations, categorySlugs, categoryBaseLabels])

  const t = useCallback(
    (key: string) => {
      if (lang === "es") return UI_STRINGS.es[key] ?? key
      return (
        uiTranslations[lang]?.[key] ??
        UI_STRINGS[lang]?.[key] ??
        UI_STRINGS.en[key] ??
        UI_STRINGS.es[key] ??
        key
      )
    },
    [lang, uiTranslations],
  )

  const categoryLabel = useCallback(
    (slug: string, fallback: string) => {
      if (lang === "es") return fallback
      return catTranslations[lang]?.[slug] ?? fallback
    },
    [lang, catTranslations],
  )

  const translateDish = useCallback(
    (dish: Dish): Translation => {
      const tr = translations[lang]?.[dish.id]
      if (tr) return tr
      return { name: dish.name, ingredients: dish.ingredients, description: dish.description }
    },
    [lang, translations],
  )

  const value = useMemo(
    () => ({ lang, setLang, t, categoryLabel, translateDish, translating }),
    [lang, setLang, t, categoryLabel, translateDish, translating],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
