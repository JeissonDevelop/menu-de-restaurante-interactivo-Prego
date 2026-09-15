export type AllergenId =
  | "gluten"
  | "crustaceans"
  | "eggs"
  | "fish"
  | "peanuts"
  | "soy"
  | "milk"
  | "nuts"
  | "celery"
  | "mustard"
  | "sesame"
  | "sulphites"
  | "lupin"
  | "molluscs"

export const ALLERGENS: Array<{
  id: AllergenId
  icon: string
  label: string
  shortLabel: string
}> = [
  { id: "gluten", icon: "GL", label: "Gluten", shortLabel: "Gluten" },
  { id: "crustaceans", icon: "CR", label: "Crustáceos", shortLabel: "Crustáceos" },
  { id: "eggs", icon: "H", label: "Huevos", shortLabel: "Huevos" },
  { id: "fish", icon: "P", label: "Pescado", shortLabel: "Pescado" },
  { id: "peanuts", icon: "CA", label: "Cacahuetes", shortLabel: "Cacahuetes" },
  { id: "soy", icon: "SO", label: "Soja", shortLabel: "Soja" },
  { id: "milk", icon: "L", label: "Leche", shortLabel: "Leche" },
  { id: "nuts", icon: "FR", label: "Frutos secos", shortLabel: "Frutos secos" },
  { id: "celery", icon: "AP", label: "Apio", shortLabel: "Apio" },
  { id: "mustard", icon: "MO", label: "Mostaza", shortLabel: "Mostaza" },
  { id: "sesame", icon: "SE", label: "Sésamo", shortLabel: "Sésamo" },
  { id: "sulphites", icon: "SU", label: "Sulfitos", shortLabel: "Sulfitos" },
  { id: "lupin", icon: "AL", label: "Altramuces", shortLabel: "Altramuces" },
  { id: "molluscs", icon: "MO", label: "Moluscos", shortLabel: "Moluscos" },
]

export function getAllergen(id: string) {
  return ALLERGENS.find((allergen) => allergen.id === id)
}
