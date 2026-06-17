"use client"

import { Globe, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LANGUAGES } from "@/lib/constants"
import { useLanguage } from "./language-provider"

export function LanguageSwitcher() {
  const { lang, setLang, translating } = useLanguage()
  const current = LANGUAGES.find((l) => l.code === lang)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-sm font-medium backdrop-blur transition-colors hover:border-primary/60 hover:text-primary"
        aria-label="Cambiar idioma"
      >
        <Globe className="size-4 text-primary" />
        <span className="tabular-nums">{current?.flag}</span>
        {translating && (
          <span className="size-1.5 animate-pulse rounded-full bg-primary" aria-hidden />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code)}
            className="flex items-center justify-between gap-4"
          >
            <span className="flex items-center gap-2">
              <span className="w-7 text-xs font-semibold text-muted-foreground">{l.flag}</span>
              {l.label}
            </span>
            {l.code === lang && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
