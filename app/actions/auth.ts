"use server"

import { clearAdminCookie, loginAdminCredentials } from "@/lib/admin-auth"

export async function loginAdmin(email: string, password: string, restaurantSlug: "prego" | "olea") {
  const ok = await loginAdminCredentials(email, password, restaurantSlug)
  return { ok }
}

export async function logoutAdmin() {
  await clearAdminCookie()
}
