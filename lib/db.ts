import { Pool } from "pg"

// Single shared pg Pool for the whole app.
const globalForDb = globalThis as unknown as { _pgPool?: Pool }

export const pool =
  globalForDb._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
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
