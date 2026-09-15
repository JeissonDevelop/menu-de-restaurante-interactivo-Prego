import { cookies } from "next/headers"

const COOKIE_NAME = "restaurant_admin"

type RestaurantSlug = "prego" | "olea"

function config(slug: RestaurantSlug) {
  const prefix = slug === "olea" ? "OLEA" : "PREGO"
  return {
    email: process.env[`${prefix}_ADMIN_EMAIL`] || process.env.ADMIN_EMAIL || "admin@prego.local",
    password: process.env[`${prefix}_ADMIN_PASSWORD`] || process.env.ADMIN_PASSWORD || "prego2024",
  }
}

export function getAdminPassword(slug: RestaurantSlug = "prego") {
  return config(slug).password
}

export async function isAdminAuthed(slug: RestaurantSlug = "prego") {
  const store = await cookies()
  return store.get(COOKIE_NAME)?.value === slug
}

export async function loginAdminCredentials(email: string, password: string, slug: RestaurantSlug) {
  const expected = config(slug)
  if (email.trim().toLowerCase() !== expected.email.toLowerCase() || password !== expected.password) return false
  const store = await cookies()
  store.set(COOKIE_NAME, slug, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
  return true
}

export async function setAdminCookie(slug: RestaurantSlug = "prego") {
  const store = await cookies()
  store.set(COOKIE_NAME, slug, { httpOnly: true, sameSite: "none", secure: true, path: "/", maxAge: 60 * 60 * 24 * 30 })
}

export async function clearAdminCookie() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}
