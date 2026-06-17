"use server"

import { pool, mapDish, type DishRow, type Dish } from "@/lib/db"
import { isAdminAuthed } from "@/lib/admin-auth"
import { put, del } from "@vercel/blob"
import { revalidatePath } from "next/cache"

export async function getDishes(): Promise<Dish[]> {
  const { rows } = await pool.query<DishRow>(
    "SELECT * FROM dishes ORDER BY sort_order ASC, id ASC",
  )
  return rows.map(mapDish)
}

export async function getDish(id: number): Promise<Dish | null> {
  const { rows } = await pool.query<DishRow>("SELECT * FROM dishes WHERE id = $1", [id])
  return rows[0] ? mapDish(rows[0]) : null
}

async function assertAdmin() {
  if (!(await isAdminAuthed())) {
    throw new Error("No autorizado")
  }
}

export async function createDish(formData: FormData) {
  await assertAdmin()
  const data = await parseDishForm(formData)
  await pool.query(
    `INSERT INTO dishes (name, ingredients, description, price, category, images, model_3d_url, featured, available, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [
      data.name,
      data.ingredients,
      data.description,
      data.price,
      data.category,
      JSON.stringify(data.images),
      data.model3dUrl,
      data.featured,
      data.available,
      data.sortOrder,
    ],
  )
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function updateDish(id: number, formData: FormData) {
  await assertAdmin()
  const data = await parseDishForm(formData)
  await pool.query(
    `UPDATE dishes SET name=$1, ingredients=$2, description=$3, price=$4, category=$5,
       images=$6, model_3d_url=$7, featured=$8, available=$9, sort_order=$10, updated_at=now()
     WHERE id=$11`,
    [
      data.name,
      data.ingredients,
      data.description,
      data.price,
      data.category,
      JSON.stringify(data.images),
      data.model3dUrl,
      data.featured,
      data.available,
      data.sortOrder,
      id,
    ],
  )
  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath(`/plato/${id}`)
}

export async function deleteDish(id: number) {
  await assertAdmin()
  await pool.query("DELETE FROM dishes WHERE id = $1", [id])
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function toggleFeatured(id: number, featured: boolean) {
  await assertAdmin()
  await pool.query("UPDATE dishes SET featured=$1, updated_at=now() WHERE id=$2", [featured, id])
  revalidatePath("/")
  revalidatePath("/admin")
}

// Uploads a single file to Blob and returns its public URL.
export async function uploadFile(formData: FormData): Promise<{ url: string }> {
  await assertAdmin()
  const file = formData.get("file") as File | null
  if (!file) throw new Error("No se ha proporcionado archivo")
  const blob = await put(`prego/${Date.now()}-${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  })
  return { url: blob.url }
}

export async function deleteBlob(url: string) {
  await assertAdmin()
  try {
    await del(url)
  } catch {
    // ignore failures (e.g. local public asset, not a blob)
  }
}

type ParsedDish = {
  name: string
  ingredients: string
  description: string
  price: number
  category: string
  images: string[]
  model3dUrl: string | null
  featured: boolean
  available: boolean
  sortOrder: number
}

async function parseDishForm(formData: FormData): Promise<ParsedDish> {
  const images = JSON.parse((formData.get("images") as string) || "[]")
  return {
    name: (formData.get("name") as string)?.trim() || "",
    ingredients: (formData.get("ingredients") as string)?.trim() || "",
    description: (formData.get("description") as string)?.trim() || "",
    price: Number(formData.get("price")) || 0,
    category: (formData.get("category") as string) || "entrantes",
    images: Array.isArray(images) ? images : [],
    model3dUrl: ((formData.get("model3dUrl") as string) || "").trim() || null,
    featured: formData.get("featured") === "true",
    available: formData.get("available") !== "false",
    sortOrder: Number(formData.get("sortOrder")) || 0,
  }
}
