"use client"

import { useMemo, useState } from "react"
import { Star } from "lucide-react"
import type { Dish, Category } from "@/lib/db"
import { useLanguage } from "./language-provider"
import { DishCard } from "./dish-card"

export function MenuBrowser({ dishes, categories }: { dishes: Dish[]; categories: Category[] }) {
  const { t, categoryLabel } = useLanguage()
  const [active, setActive] = useState<string>("destacados")

  const featured = useMemo(() => dishes.filter((d) => d.featured), [dishes])

  // Only show categories that actually contain dishes.
  const usedCategories = useMemo(() => {
    const present = new Set(dishes.map((d) => d.category))
    return categories.filter((c) => present.has(c.slug))
  }, [dishes, categories])

  const tabs = useMemo(() => {
    const base: { id: string; label: string }[] = []
    if (featured.length > 0) base.push({ id: "destacados", label: t("featured") })
    base.push({ id: "todo", label: t("all") })
    for (const c of usedCategories) base.push({ id: c.slug, label: categoryLabel(c.slug, c.label) })
    return base
  }, [featured.length, usedCategories, t, categoryLabel])

  const visible = useMemo(() => {
    if (active === "destacados") return featured
    if (active === "todo") return dishes
    return dishes.filter((d) => d.category === active)
  }, [active, dishes, featured])

  // Fallback if there are no featured dishes.
  const effectiveActive = active === "destacados" && featured.length === 0 ? "todo" : active

  return (
    <section id="carta" className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
      {/* Category filter bar */}
      <div className="sticky top-0 z-30 -mx-4 mb-8 border-b border-border bg-background/85 px-4 py-3 backdrop-blur">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const isActive = effectiveActive === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {tab.id === "destacados" && <Star className="size-3.5 fill-current" />}
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">{t("noDishes")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </section>
  )
}
