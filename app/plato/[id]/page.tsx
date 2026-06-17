import { notFound } from "next/navigation"
import { getDish, getDishes } from "@/app/actions/dishes"
import { DishDetail } from "@/components/menu/dish-detail"

export const dynamic = "force-dynamic"

export default async function DishPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dishId = Number(id)
  if (!Number.isFinite(dishId)) notFound()

  const [dish, allDishes] = await Promise.all([getDish(dishId), getDishes()])
  if (!dish) notFound()

  return <DishDetail dish={dish} allDishes={allDishes.filter((d) => d.available)} />
}
