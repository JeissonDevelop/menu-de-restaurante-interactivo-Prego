"use server"

import { pool, mapCategory, type CategoryRow, type Category } from "@/lib/db"
import { isAdminAuthed } from "@/lib/admin-auth"
import { revalidatePath } from "next/cache"

export async function getCategories(): Promise<Category[]> {
  const { rows } = await pool.query<CategoryRow>(
    "SELECT * FROM categories ORDER BY sort_order ASC, id ASC",
  )
  return rows.map(mapCategory)
}

async function assertAdmin() {
  if (!(await isAdminAuthed())) {
    throw new Error("No autorizado")
  }
}

// Turns "Pasta Fresca" into "pasta-fresca" for a URL-safe stable slug.
function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
}

async function uniqueSlug(base: string, excludeId?: number): Promise<string> {
  let slug = base || "categoria"
  let n = 1
  // Ensure uniqueness against existing rows.
  while (true) {
    const { rows } = await pool.query<{ id: number }>(
      "SELECT id FROM categories WHERE slug = $1",
      [slug],
    )
    const clash = rows.find((r) => r.id !== excludeId)
    if (!clash) return slug
    n += 1
    slug = `${base}-${n}`
  }
}

export async function createCategory(formData: FormData) {
  await assertAdmin()
  const label = ((formData.get("label") as string) || "").trim()
  if (!label) throw new Error("El nombre es obligatorio")
  const slug = await uniqueSlug(slugify(label))

  const { rows } = await pool.query<{ max: number | null }>(
    "SELECT MAX(sort_order) as max FROM categories",
  )
  const sortOrder = (rows[0]?.max ?? 0) + 1

  await pool.query("INSERT INTO categories (slug, label, sort_order) VALUES ($1,$2,$3)", [
    slug,
    label,
    sortOrder,
  ])
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function updateCategory(id: number, formData: FormData) {
  await assertAdmin()
  const label = ((formData.get("label") as string) || "").trim()
  if (!label) throw new Error("El nombre es obligatorio")
  await pool.query("UPDATE categories SET label = $1 WHERE id = $2", [label, id])
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function updateCategoryOrder(id: number, sortOrder: number) {
  await assertAdmin()
  await pool.query("UPDATE categories SET sort_order = $1 WHERE id = $2", [sortOrder, id])
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function deleteCategory(id: number) {
  await assertAdmin()
  const { rows } = await pool.query<CategoryRow>("SELECT * FROM categories WHERE id = $1", [id])
  const category = rows[0]
  if (!category) return

  // Block deletion if dishes still use this category.
  const { rows: countRows } = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::int AS count FROM dishes WHERE category = $1",
    [category.slug],
  )
  const count = Number(countRows[0]?.count ?? 0)
  if (count > 0) {
    throw new Error(
      `No se puede eliminar: hay ${count} plato(s) en esta categoría. Muévelos o elimínalos primero.`,
    )
  }

  await pool.query("DELETE FROM categories WHERE id = $1", [id])
  revalidatePath("/")
  revalidatePath("/admin")
}
