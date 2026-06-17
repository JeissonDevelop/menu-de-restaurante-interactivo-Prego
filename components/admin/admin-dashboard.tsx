"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus, Pencil, Trash2, Star, LogOut, Eye, ExternalLink, X } from "lucide-react"
import { deleteDish, toggleFeatured } from "@/app/actions/dishes"
import { logoutAdmin } from "@/app/actions/auth"
import { DishForm } from "@/components/admin/dish-form"
import { CATEGORIES } from "@/lib/constants"
import type { Dish } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function AdminDashboard({ dishes }: { dishes: Dish[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<Dish | null>(null)
  const [creating, setCreating] = useState(false)
  const [pending, startTransition] = useTransition()

  const showForm = creating || editing !== null

  function handleDone() {
    setCreating(false)
    setEditing(null)
    router.refresh()
  }

  function handleDelete(dish: Dish) {
    if (!confirm(`¿Eliminar "${dish.name}"? Esta acción no se puede deshacer.`)) return
    startTransition(async () => {
      try {
        await deleteDish(dish.id)
        toast.success("Plato eliminado")
        router.refresh()
      } catch {
        toast.error("Error al eliminar")
      }
    })
  }

  function handleToggleFeatured(dish: Dish) {
    startTransition(async () => {
      try {
        await toggleFeatured(dish.id, !dish.featured)
        router.refresh()
      } catch {
        toast.error("Error al actualizar")
      }
    })
  }

  function handleLogout() {
    startTransition(async () => {
      await logoutAdmin()
      router.refresh()
    })
  }

  const categoryLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? id

  return (
    <main className="min-h-dvh">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <h1 className="font-serif text-xl leading-none">PREGO · Gestión</h1>
            <p className="mt-1 text-xs text-muted-foreground">{dishes.length} platos en la carta</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/" target="_blank">
                <Eye className="size-4" />
                <span className="hidden sm:inline">Ver carta</span>
              </Link>
            </Button>
            <Button onClick={() => setCreating(true)} size="sm">
              <Plus className="size-4" />
              <span className="hidden sm:inline">Nuevo plato</span>
            </Button>
            <Button onClick={handleLogout} variant="ghost" size="icon" aria-label="Cerrar sesión">
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6">
        <ul className="flex flex-col gap-3">
          {dishes.map((dish) => (
            <li
              key={dish.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-3"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                {dish.images[0] ? (
                  <Image
                    src={dish.images[0] || "/placeholder.svg"}
                    alt={dish.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate font-medium">{dish.name}</span>
                  {dish.featured && (
                    <Badge className="gap-1 bg-primary/15 text-primary hover:bg-primary/15">
                      <Star className="size-3 fill-current" /> Destacado
                    </Badge>
                  )}
                  {!dish.available && (
                    <Badge variant="outline" className="text-muted-foreground">
                      No disponible
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {categoryLabel(dish.category)} · {dish.price.toFixed(2)} €
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleFeatured(dish)}
                  disabled={pending}
                  aria-label={dish.featured ? "Quitar de destacados" : "Marcar como destacado"}
                  className={dish.featured ? "text-primary" : "text-muted-foreground"}
                >
                  <Star className={dish.featured ? "size-4 fill-current" : "size-4"} />
                </Button>
                <Button asChild variant="ghost" size="icon" aria-label="Ver plato">
                  <Link href={`/plato/${dish.id}`} target="_blank">
                    <ExternalLink className="size-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditing(dish)}
                  aria-label="Editar"
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(dish)}
                  disabled={pending}
                  aria-label="Eliminar"
                  className="text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
          {dishes.length === 0 && (
            <li className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
              No hay platos todavía. Crea el primero.
            </li>
          )}
        </ul>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-2xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-xl">
                {editing ? "Editar plato" : "Nuevo plato"}
              </h2>
              <button
                onClick={handleDone}
                aria-label="Cerrar"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>
            <DishForm dish={editing ?? undefined} onDone={handleDone} />
          </div>
        </div>
      )}
    </main>
  )
}
