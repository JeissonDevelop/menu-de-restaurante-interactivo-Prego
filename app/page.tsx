"use client"

import Image from "next/image"
import Link from "next/link"
import { LanguageProvider } from "@/components/menu/language-provider"
import { LanguageSwitcher } from "@/components/menu/language-switcher"

const restaurants = [
  {
    slug: "prego",
    name: "PREGO",
    tagline: "Cucina italiana contemporánea",
    image: "/prego-hero.png",
  },
  {
    slug: "olea",
    name: "OLEA",
    tagline: "Mediterranean table by the sea",
    image: "/olea-hero.png",
  },
]

export default function HomePage() {
  return (
    <LanguageProvider dishes={[]} categories={[]}>
      <main className="min-h-dvh bg-background px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-5xl flex-col justify-center">
          <div className="mb-5 flex justify-end">
            <LanguageSwitcher />
          </div>
          <header className="mb-8 text-center sm:mb-12">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">Restaurantes</p>
            <h1 className="mt-3 font-serif text-4xl text-foreground sm:text-6xl">Elige tu mesa</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Descubre la carta del restaurante que quieres visitar.
            </p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant.slug}
              href={`/restaurante/${restaurant.slug}`}
              className="group relative min-h-[260px] overflow-hidden rounded-2xl border border-border shadow-sm transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:min-h-[360px]"
            >
              <Image src={restaurant.image} alt={`Interior de ${restaurant.name}`} fill priority className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">Carta</p>
                <h2 className="mt-2 font-serif text-3xl sm:text-4xl">{restaurant.name}</h2>
                <p className="mt-2 text-sm text-white/80">{restaurant.tagline}</p>
                <span className="mt-5 inline-flex min-h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black">Ver menú</span>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </main>
    </LanguageProvider>
  )
}
