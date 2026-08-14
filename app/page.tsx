import { getDishes } from "@/app/actions/dishes"
import { getCategories } from "@/app/actions/categories"
import { LanguageProvider } from "@/components/menu/language-provider"
import { MenuHeader } from "@/components/menu/menu-header"
import { MenuBrowser } from "@/components/menu/menu-browser"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [dishes, categories] = await Promise.all([getDishes(), getCategories()])
  const available = dishes.filter((d) => d.available)

  return (
    <LanguageProvider dishes={available} categories={categories}>
      <main className="min-h-dvh">
        <MenuHeader />
        <MenuBrowser dishes={available} categories={categories} />
        <footer className="border-t border-border py-10 text-center">
          <p className="font-serif text-2xl text-primary">PREGO</p>
          <p className="mt-2 text-sm text-muted-foreground">Cocina mediterranea de autor</p>
        </footer>
      </main>
    </LanguageProvider>
  )
}
