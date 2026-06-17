"use client"

import Link from "next/link"
import Image from "next/image"
import { Box } from "lucide-react"
import type { Dish } from "@/lib/db"
import { useLanguage } from "./language-provider"

export function DishCard({ dish }: { dish: Dish }) {
  const { translateDish } = useLanguage()
  const tr = translateDish(dish)
  const image = dish.images[0] || "/placeholder.svg?height=400&width=600"

  return (
    <Link
      href={`/plato/${dish.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:glow-amber"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={tr.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        {dish.model3dUrl && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-xs font-medium text-primary backdrop-blur">
            <Box className="size-3" /> 3D
          </span>
        )}
        {!dish.available && (
          <span className="absolute left-3 top-3 rounded-full bg-background/80 px-2 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            No disponible
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-lg leading-tight text-balance">{tr.name}</h3>
          <span className="shrink-0 font-serif text-lg text-primary">
            {dish.price.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
          </span>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{tr.ingredients}</p>
      </div>
    </Link>
  )
}
