import { cookies } from "next/headers"

const COOKIE_NAME = "prego_admin"

// Simple password protection for the hidden admin route.
// Set ADMIN_PASSWORD in your environment; falls back to a default for preview.
export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "prego2024"
}

export async function isAdminAuthed() {
  const store = await cookies()
  return store.get(COOKIE_NAME)?.value === getAdminPassword()
}

export async function setAdminCookie() {
  const store = await cookies()
  store.set(COOKIE_NAME, getAdminPassword(), {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function clearAdminCookie() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}
