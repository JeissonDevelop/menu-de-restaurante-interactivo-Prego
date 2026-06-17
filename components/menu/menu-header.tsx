"use client"

import Image from "next/image"
import { useLanguage } from "./language-provider"
import { LanguageSwitcher } from "./language-switcher"

export function MenuHeader() {
  const { t } = useLanguage()

  return (
    <header className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0">
        <Image
          src="/prego-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
      </div>

      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="text-sm font-medium tracking-[0.3em] text-muted-foreground">RISTORANTE</span>
        <LanguageSwitcher />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-16 pt-10 text-center md:pb-24 md:pt-16">
        <span className="mb-4 h-px w-16 bg-primary" aria-hidden />
        <h1 className="font-serif text-6xl font-medium tracking-tight text-glow md:text-8xl">PREGO</h1>
        <p className="mt-4 max-w-md text-pretty text-base text-muted-foreground md:text-lg">
          {t("tagline")}
        </p>
        <a
          href="#carta"
          className="mt-8 rounded-full border border-primary/60 px-6 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          {t("menu")}
        </a>
      </div>
    </header>
  )
}
