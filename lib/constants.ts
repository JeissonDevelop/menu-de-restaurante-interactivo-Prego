export const CATEGORIES = [
  { id: "entrantes", label: "Entrantes" },
  { id: "pastas", label: "Pastas" },
  { id: "pizzas", label: "Pizzas" },
  { id: "carnes", label: "Carnes" },
  { id: "pescados", label: "Pescados" },
  { id: "postres", label: "Postres" },
  { id: "bebidas", label: "Bebidas" },
] as const

export type CategoryId = (typeof CATEGORIES)[number]["id"]

export const LANGUAGES = [
  { code: "es", label: "Español", flag: "ES" },
  { code: "en", label: "English", flag: "EN" },
  { code: "it", label: "Italiano", flag: "IT" },
  { code: "fr", label: "Français", flag: "FR" },
  { code: "de", label: "Deutsch", flag: "DE" },
  { code: "pt", label: "Português", flag: "PT" },
  { code: "ca", label: "Català", flag: "CA" },
  { code: "zh", label: "中文", flag: "ZH" },
  { code: "ja", label: "日本語", flag: "JA" },
  { code: "ar", label: "العربية", flag: "AR" },
  { code: "ru", label: "Русский", flag: "RU" },
  { code: "nl", label: "Nederlands", flag: "NL" },
] as const

export type LanguageCode = (typeof LANGUAGES)[number]["code"]

export const DEFAULT_LANGUAGE: LanguageCode = "es"

// UI strings keyed by language. The menu CONTENT (dish names/ingredients) is
// translated at runtime by AI; these are the fixed interface labels.
export const UI_STRINGS: Record<string, Record<string, string>> = {
  es: {
    tagline: "Cocina italiana de autor",
    featured: "Destacados",
    all: "Todo",
    menu: "Carta",
    ingredients: "Ingredientes",
    viewDish: "Ver plato",
    back: "Volver a la carta",
    noDishes: "No hay platos en esta categoría todavía.",
    loading: "Cargando...",
    view3d: "Ver en 3D",
    photos: "Fotos",
    translating: "Traduciendo...",
  },
  en: {
    tagline: "Signature Italian cuisine",
    featured: "Featured",
    all: "All",
    menu: "Menu",
    ingredients: "Ingredients",
    viewDish: "View dish",
    back: "Back to menu",
    noDishes: "No dishes in this category yet.",
    loading: "Loading...",
    view3d: "View in 3D",
    photos: "Photos",
    translating: "Translating...",
  },
}

export const CATEGORY_LABELS_BY_LANG: Record<string, Record<string, string>> = {
  es: {
    entrantes: "Entrantes",
    pastas: "Pastas",
    pizzas: "Pizzas",
    carnes: "Carnes",
    pescados: "Pescados",
    postres: "Postres",
    bebidas: "Bebidas",
  },
  en: {
    entrantes: "Starters",
    pastas: "Pasta",
    pizzas: "Pizza",
    carnes: "Meat",
    pescados: "Fish",
    postres: "Desserts",
    bebidas: "Drinks",
  },
}
