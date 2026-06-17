import { isAdminAuthed } from "@/lib/admin-auth"
import { getDishes } from "@/app/actions/dishes"
import { AdminLogin } from "@/components/admin/admin-login"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const authed = await isAdminAuthed()

  if (!authed) {
    return <AdminLogin />
  }

  const dishes = await getDishes()
  return <AdminDashboard dishes={dishes} />
}
