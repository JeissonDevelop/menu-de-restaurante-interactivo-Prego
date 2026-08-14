import { Pool } from "pg"

// Single shared pg Pool for the whole app.
const globalForDb = globalThis as unknown as { _pgPool?: Pool }

function buildConnectionString() {
  const url = process.env.DATABASE_URL ?? ""
  if (!url) return url
  if (url.includes("sslmode=")) return url
  return url + (url.includes("?") ? "&" : "?") + "sslmode=require"
}

export const pool =
  globalForDb._pgPool ??
  new Pool({
    connectionString: buildConnectionString(),
    ssl: { rejectUnauthorized: false },
  })

if (process.env.NODE_ENV !== "production") {
  globalForDb._pgPool = pool
}

export type DishRow = {
  id: number
  name: string
  ingredients: string
  description: string
  price: string
  category: string
  images: string[]
  model_3d_url: string | null
  featured: boolean
  available: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type Dish = {
  id: number
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

export type CategoryRow = {
  id: number
  slug: string
  label: string
  sort_order: number
  created_at: string
}

export type Category = {
  id: number
  slug: string
  label: string
  sortOrder: number
}

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    label: row.label,
    sortOrder: row.sort_order,
  }
}

export function mapDish(row: DishRow): Dish {
  return {
    id: row.id,
    name: row.name,
    ingredients: row.ingredients,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    images: Array.isArray(row.images) ? row.images : [],
    model3dUrl: row.model_3d_url,
    featured: row.featured,
    available: row.available,
    sortOrder: row.sort_order,
  }
}
