import { ALLERGENS } from "@/lib/allergens"

type AllergenStickersProps = {
  allergens: string[]
  compact?: boolean
}

export function AllergenStickers({ allergens, compact = false }: AllergenStickersProps) {
  const selected = allergens
    .map((id) => ALLERGENS.find((allergen) => allergen.id === id))
    .filter((allergen): allergen is (typeof ALLERGENS)[number] => Boolean(allergen))

  if (!selected.length) return null

  return (
    <div
      className={`flex flex-wrap gap-1.5 ${compact ? "mt-2" : "mt-4"}`}
      aria-label="Alérgenos del plato"
    >
      {selected.map((allergen) => (
        <span
          key={allergen.id}
          title={allergen.label}
          className={`inline-flex items-center gap-1 rounded-full border border-border bg-secondary/70 font-mono text-[10px] font-medium text-muted-foreground ${
            compact ? "px-2 py-1" : "px-2.5 py-1.5"
          }`}
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-primary/15 text-[9px] font-bold text-primary">
            {allergen.icon}
          </span>
          <span className={compact ? "sr-only" : undefined}>{allergen.label}</span>
        </span>
      ))}
    </div>
  )
}
