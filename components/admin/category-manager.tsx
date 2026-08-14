"use client"

import { useState, useTransition } from "react"
import { Plus, Pencil, Trash2, Check, X, Tag } from "lucide-react"
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/actions/categories"
import type { Category, Dish } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function CategoryManager({
  categories,
  dishes,
}: {
  categories: Category[]
  dishes: Dish[]
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [newLabel, setNewLabel] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editLabel, setEditLabel] = useState("")

  const countFor = (slug: string) => dishes.filter((d) => d.category === slug).length

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const label = newLabel.trim()
    if (!label) return
    const fd = new FormData()
    fd.set("label", label)
    startTransition(async () => {
      try {
        await createCategory(fd)
        setNewLabel("")
        toast.success("Categoría creada")
        router.refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al crear")
      }
    })
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id)
    setEditLabel(cat.label)
  }

  function handleUpdate(id: number) {
    const label = editLabel.trim()
    if (!label) return
    const fd = new FormData()
    fd.set("label", label)
    startTransition(async () => {
      try {
        await updateCategory(id, fd)
        setEditingId(null)
        toast.success("Categoría actualizada")
        router.refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al actualizar")
      }
    })
  }

  function handleDelete(cat: Category) {
    if (!confirm(`¿Eliminar la categoría "${cat.label}"?`)) return
    startTransition(async () => {
      try {
        await deleteCategory(cat.id)
        toast.success("Categoría eliminada")
        router.refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al eliminar")
      }
    })
  }

  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Tag className="size-4 text-primary" />
        <h2 className="font-serif text-lg">Categorías</h2>
        <span className="text-xs text-muted-foreground">({categories.length})</span>
      </div>

      <form onSubmit={handleCreate} className="mb-4 flex gap-2">
        <Input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Nueva categoría (p. ej. Ensaladas)"
          className="flex-1"
        />
        <Button type="submit" disabled={pending || !newLabel.trim()}>
          <Plus className="size-4" />
          <span className="hidden sm:inline">Añadir</span>
        </Button>
      </form>

      <ul className="flex flex-col divide-y divide-border">
        {categories.map((cat) => {
          const count = countFor(cat.slug)
          const isEditing = editingId === cat.id
          return (
            <li key={cat.id} className="flex items-center gap-3 py-2">
              {isEditing ? (
                <>
                  <Input
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="h-9 flex-1"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.nativeEvent.isComposing) handleUpdate(cat.id)
                      if (e.key === "Escape") setEditingId(null)
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleUpdate(cat.id)}
                    disabled={pending}
                    aria-label="Guardar"
                    className="text-primary"
                  >
                    <Check className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditingId(null)}
                    aria-label="Cancelar"
                  >
                    <X className="size-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 font-medium">{cat.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {count} {count === 1 ? "plato" : "platos"}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => startEdit(cat)}
                    aria-label="Editar categoría"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(cat)}
                    disabled={pending}
                    aria-label="Eliminar categoría"
                    className="text-destructive disabled:opacity-40"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </>
              )}
            </li>
          )
        })}
        {categories.length === 0 && (
          <li className="py-6 text-center text-sm text-muted-foreground">
            No hay categorías. Crea la primera arriba.
          </li>
        )}
      </ul>
    </section>
  )
}
