import { isAdminAuthed } from "@/lib/admin-auth"
import { getDishes } from "@/app/actions/dishes"
import { getCategories } from "@/app/actions/categories"
import { AdminLogin } from "@/components/admin/admin-login"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { pool } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ restaurante?: string }> }) {
  const restaurantSlug = (await searchParams).restaurante === "olea" ? "olea" : "prego"
  const authed = await isAdminAuthed(restaurantSlug)

  if (!authed) return <AdminLogin restaurantSlug={restaurantSlug} />

  const { rows } = await pool.query<{ name: string }>("SELECT name FROM restaurants WHERE slug = $1", [restaurantSlug])
  const [dishes, categories] = await Promise.all([getDishes(restaurantSlug), getCategories(restaurantSlug)])
  return (
    <AdminDashboard
      dishes={dishes}
      categories={categories}
      restaurantSlug={restaurantSlug}
      restaurantName={rows[0]?.name ?? restaurantSlug.toUpperCase()}
    />
  )
}
