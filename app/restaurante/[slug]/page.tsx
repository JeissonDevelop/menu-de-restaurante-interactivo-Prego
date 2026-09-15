import { notFound } from "next/navigation"
import { pool, mapRestaurant } from "@/lib/db"
import { getDishes } from "@/app/actions/dishes"
import { getCategories } from "@/app/actions/categories"
import { LanguageProvider } from "@/components/menu/language-provider"
import { MenuHeader } from "@/components/menu/menu-header"
import { MenuBrowser } from "@/components/menu/menu-browser"

export const dynamic = "force-dynamic"

export default async function RestaurantMenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { rows } = await pool.query("SELECT id, slug, name, tagline, hero_image FROM restaurants WHERE slug = $1", [slug])
  const restaurant = rows[0] ? mapRestaurant(rows[0]) : null
  if (!restaurant) notFound()
  const [dishes, categories] = await Promise.all([getDishes(slug), getCategories(slug)])
  const available = dishes.filter((dish) => dish.available)

  return (
    <LanguageProvider dishes={available} categories={categories}>
      <main className="min-h-dvh">
        <MenuHeader name={restaurant.name} heroImage={restaurant.heroImage} />
        <div className="mx-auto max-w-6xl px-4 pt-4">
          <p className="text-center text-xs font-medium uppercase tracking-[0.24em] text-primary">{restaurant.name}</p>
          <p className="mt-2 text-center text-sm text-muted-foreground">{restaurant.tagline}</p>
        </div>
        <MenuBrowser dishes={available} categories={categories} />
        <footer className="border-t border-border py-10 text-center">
          <p className="font-serif text-2xl text-primary">{restaurant.name}</p>
          <p className="mt-2 text-sm text-muted-foreground">{restaurant.tagline}</p>
        </footer>
      </main>
    </LanguageProvider>
  )
}
