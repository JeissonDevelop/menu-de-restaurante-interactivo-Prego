import { isAdminAuthed } from "@/lib/admin-auth"
import { getDishes } from "@/app/actions/dishes"
import { getCategories } from "@/app/actions/categories"
import { AdminLogin } from "@/components/admin/admin-login"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const authed = await isAdminAuthed()

  if (!authed) {
    return <AdminLogin />
  }

  const [dishes, categories] = await Promise.all([getDishes(), getCategories()])
  return <AdminDashboard dishes={dishes} categories={categories} />
}
