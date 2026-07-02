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

// 28 idiomas ordenados por relevancia para un restaurante en la costa
// turística española (principales nacionalidades de turistas + lenguas
// cooficiales de España). El contenido de los platos y las etiquetas de la
// interfaz se traducen automáticamente en tiempo de ejecución.
export const LANGUAGES = [
  { code: "es", label: "Español", flag: "ES" },
  { code: "en", label: "English", flag: "EN" },
  { code: "fr", label: "Français", flag: "FR" },
  { code: "de", label: "Deutsch", flag: "DE" },
  { code: "it", label: "Italiano", flag: "IT" },
  { code: "pt", label: "Português", flag: "PT" },
  { code: "nl", label: "Nederlands", flag: "NL" },
  { code: "pl", label: "Polski", flag: "PL" },
  { code: "ru", label: "Русский", flag: "RU" },
  { code: "ca", label: "Català", flag: "CA" },
  { code: "gl", label: "Galego", flag: "GL" },
  { code: "eu", label: "Euskara", flag: "EU" },
  { code: "sv", label: "Svenska", flag: "SV" },
  { code: "no", label: "Norsk", flag: "NO" },
  { code: "da", label: "Dansk", flag: "DA" },
  { code: "fi", label: "Suomi", flag: "FI" },
  { code: "el", label: "Ελληνικά", flag: "EL" },
  { code: "tr", label: "Türkçe", flag: "TR" },
  { code: "ro", label: "Română", flag: "RO" },
  { code: "cs", label: "Čeština", flag: "CS" },
  { code: "hu", label: "Magyar", flag: "HU" },
  { code: "uk", label: "Українська", flag: "UK" },
  { code: "ar", label: "العربية", flag: "AR" },
  { code: "he", label: "עברית", flag: "HE" },
  { code: "hi", label: "हिन्दी", flag: "HI" },
  { code: "zh", label: "中文", flag: "ZH" },
  { code: "ja", label: "日本語", flag: "JA" },
  { code: "ko", label: "한국어", flag: "KO" },
] as const

export type LanguageCode = (typeof LANGUAGES)[number]["code"]

export const DEFAULT_LANGUAGE: LanguageCode = "es"

// UI strings keyed by language. The menu CONTENT (dish names/ingredients) is
// translated at runtime by AI; these are the fixed interface labels.
export const UI_STRINGS: Record<string, Record<string, string>> = {
  es: {
    tagline: "Cocina mediterranea de autor",
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
