"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  UI_STRINGS,
  CATEGORY_LABELS_BY_LANG,
  type LanguageCode,
} from "@/lib/constants"
import type { Dish } from "@/lib/db"

type Translation = { name: string; ingredients: string; description: string }
type TranslationMap = Record<number, Translation>

type LanguageContextValue = {
  lang: LanguageCode
  setLang: (l: LanguageCode) => void
  t: (key: string) => string
  categoryLabel: (id: string, fallback: string) => string
  translateDish: (dish: Dish) => Translation
  translating: boolean
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({
  dishes,
  children,
}: {
  dishes: Dish[]
  children: React.ReactNode
}) {
  const [lang, setLangState] = useState<LanguageCode>(DEFAULT_LANGUAGE)
  const [translations, setTranslations] = useState<Record<string, TranslationMap>>({})
  const [translating, setTranslating] = useState(false)

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

  // Fetch translations whenever the language changes (skip Spanish base).
  useEffect(() => {
    if (lang === "es" || translations[lang] || dishes.length === 0) return
    const langMeta = LANGUAGES.find((l) => l.code === lang)
    if (!langMeta) return

    let cancelled = false
    setTranslating(true)
    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: lang,
        languageLabel: langMeta.label,
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
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setTranslating(false)
      })

    return () => {
      cancelled = true
    }
  }, [lang, dishes, translations])

  const t = useCallback(
    (key: string) => {
      return UI_STRINGS[lang]?.[key] ?? UI_STRINGS.en[key] ?? UI_STRINGS.es[key] ?? key
    },
    [lang],
  )

  const categoryLabel = useCallback(
    (id: string, fallback: string) => {
      return CATEGORY_LABELS_BY_LANG[lang]?.[id] ?? CATEGORY_LABELS_BY_LANG.en[id] ?? fallback
    },
    [lang],
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
