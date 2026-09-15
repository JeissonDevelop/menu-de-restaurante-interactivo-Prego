import { notFound } from "next/navigation"
import { getDish, getDishes } from "@/app/actions/dishes"
import { getCategories } from "@/app/actions/categories"
import { DishDetail } from "@/components/menu/dish-detail"

export const dynamic = "force-dynamic"

export default async function DishPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dishId = Number(id)
  if (!Number.isFinite(dishId)) notFound()

  const [dish, allDishes, categories] = await Promise.all([
    getDish(dishId),
    getDishes(),
    getCategories(),
  ])
  if (!dish) notFound()

  return (
    <DishDetail
      dish={dish}
      allDishes={allDishes.filter((d) => d.available)}
      categories={categories}
    />
  )
}
