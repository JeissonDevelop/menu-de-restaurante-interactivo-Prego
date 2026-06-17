"use server"

import { getAdminPassword, setAdminCookie, clearAdminCookie } from "@/lib/admin-auth"

export async function loginAdmin(password: string): Promise<{ ok: boolean }> {
  if (password === getAdminPassword()) {
    await setAdminCookie()
    return { ok: true }
  }
  return { ok: false }
}

export async function logoutAdmin() {
  await clearAdminCookie()
}
