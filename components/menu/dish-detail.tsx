"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { ArrowLeft, Box, ImageIcon } from "lucide-react"
import type { Dish } from "@/lib/db"
import { CATEGORIES } from "@/lib/constants"
import { LanguageProvider, useLanguage } from "./language-provider"
import { LanguageSwitcher } from "./language-switcher"

const DishModelViewer = dynamic(
  () => import("./dish-model-viewer").then((m) => m.DishModelViewer),
  { ssr: false, loading: () => <ViewerSkeleton /> },
)

function ViewerSkeleton() {
  return (
    <div className="flex h-[60vh] max-h-[520px] w-full items-center justify-center rounded-xl border border-border bg-card">
      <span className="text-sm text-muted-foreground">Cargando 3D...</span>
    </div>
  )
}

function DishDetailInner({ dish }: { dish: Dish }) {
  const { t, translateDish, categoryLabel } = useLanguage()
  const tr = translateDish(dish)
  const [mode, setMode] = useState<"photos" | "3d">("photos")
  const [activeImg, setActiveImg] = useState(0)

  const catLabel = categoryLabel(
    dish.category,
    CATEGORIES.find((c) => c.id === dish.category)?.label ?? dish.category,
  )
  const images = dish.images.length ? dish.images : ["/placeholder.svg?height=600&width=800"]

  return (
    <main className="mx-auto min-h-dvh w-full max-w-5xl px-4 pb-16">
      <div className="flex items-center justify-between py-5">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          {t("back")}
        </Link>
        <LanguageSwitcher />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Media column */}
        <div className="flex flex-col gap-4">
          {dish.model3dUrl && (
            <div className="flex gap-2">
              <button
                onClick={() => setMode("photos")}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  mode === "photos"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <ImageIcon className="size-4" /> {t("photos")}
              </button>
              <button
                onClick={() => setMode("3d")}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  mode === "3d"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <Box className="size-4" /> {t("view3d")}
              </button>
            </div>
          )}

          {mode === "3d" && dish.model3dUrl ? (
            <DishModelViewer url={dish.model3dUrl} />
          ) : (
            <>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-card">
                <Image
                  src={images[activeImg] || "/placeholder.svg"}
                  alt={tr.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                        i === activeImg ? "border-primary" : "border-border"
                      }`}
                    >
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`${tr.name} ${i + 1}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Info column */}
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            {catLabel}
          </span>
          <h1 className="mt-2 font-serif text-4xl leading-tight text-balance">{tr.name}</h1>
          <p className="mt-4 font-serif text-3xl text-primary">
            {dish.price.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
          </p>

          {tr.description && (
            <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">{tr.description}</p>
          )}

          <div className="mt-8">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide">{t("ingredients")}</h2>
            <p className="leading-relaxed text-muted-foreground">{tr.ingredients}</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export function DishDetail({ dish, allDishes }: { dish: Dish; allDishes: Dish[] }) {
  return (
    <LanguageProvider dishes={allDishes}>
      <DishDetailInner dish={dish} />
    </LanguageProvider>
  )
}
