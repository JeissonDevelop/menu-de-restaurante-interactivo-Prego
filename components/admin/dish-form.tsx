"use client"

import { useRef, useState, useTransition } from "react"
import Image from "next/image"
import { Upload, X, Box, Loader2 } from "lucide-react"
import { createDish, updateDish, uploadFile } from "@/app/actions/dishes"
import { CATEGORIES } from "@/lib/constants"
import type { Dish } from "@/lib/db"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export function DishForm({
  dish,
  onDone,
}: {
  dish?: Dish
  onDone: () => void
}) {
  const [images, setImages] = useState<string[]>(dish?.images ?? [])
  const [model3dUrl, setModel3dUrl] = useState<string>(dish?.model3dUrl ?? "")
  const [category, setCategory] = useState(dish?.category ?? "entrantes")
  const [featured, setFeatured] = useState(dish?.featured ?? false)
  const [available, setAvailable] = useState(dish?.available ?? true)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [uploadingModel, setUploadingModel] = useState(false)
  const [pending, startTransition] = useTransition()
  const imgInput = useRef<HTMLInputElement>(null)
  const modelInput = useRef<HTMLInputElement>(null)

  async function handleImageUpload(files: FileList | null) {
    if (!files?.length) return
    setUploadingImg(true)
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append("file", file)
        const { url } = await uploadFile(fd)
        setImages((prev) => [...prev, url])
      }
    } catch {
      toast.error("Error al subir la imagen")
    } finally {
      setUploadingImg(false)
    }
  }

  async function handleModelUpload(files: FileList | null) {
    if (!files?.length) return
    setUploadingModel(true)
    try {
      const fd = new FormData()
      fd.append("file", files[0])
      const { url } = await uploadFile(fd)
      setModel3dUrl(url)
      toast.success("Modelo 3D subido")
    } catch {
      toast.error("Error al subir el modelo 3D")
    } finally {
      setUploadingModel(false)
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    fd.set("images", JSON.stringify(images))
    fd.set("model3dUrl", model3dUrl)
    fd.set("category", category)
    fd.set("featured", String(featured))
    fd.set("available", String(available))

    startTransition(async () => {
      try {
        if (dish) {
          await updateDish(dish.id, fd)
          toast.success("Plato actualizado")
        } else {
          await createDish(fd)
          toast.success("Plato creado")
        }
        onDone()
      } catch {
        toast.error("Error al guardar el plato")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" name="name" defaultValue={dish?.name} required className="mt-1.5" />
        </div>

        <div>
          <Label htmlFor="price">Precio (€)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={dish?.price}
            required
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="category">Categoría</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="ingredients">Ingredientes</Label>
          <Textarea
            id="ingredients"
            name="ingredients"
            defaultValue={dish?.ingredients}
            required
            rows={2}
            className="mt-1.5"
            placeholder="Separados por comas"
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={dish?.description}
            rows={2}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="sortOrder">Orden</Label>
          <Input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={dish?.sortOrder ?? 0}
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Images */}
      <div>
        <Label>Imágenes</Label>
        <div className="mt-1.5 flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative size-20 overflow-hidden rounded-lg border border-border">
              <Image src={img || "/placeholder.svg"} alt="" fill sizes="80px" className="object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute right-0.5 top-0.5 flex size-5 items-center justify-center rounded-full bg-background/80 text-foreground"
                aria-label="Eliminar imagen"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => imgInput.current?.click()}
            disabled={uploadingImg}
            className="flex size-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {uploadingImg ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
            <span className="text-[10px]">Subir</span>
          </button>
          <input
            ref={imgInput}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleImageUpload(e.target.files)}
          />
        </div>
      </div>

      {/* 3D model */}
      <div>
        <Label>Modelo 3D (.glb / .gltf)</Label>
        <div className="mt-1.5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => modelInput.current?.click()}
            disabled={uploadingModel}
            className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {uploadingModel ? <Loader2 className="size-4 animate-spin" /> : <Box className="size-4" />}
            {model3dUrl ? "Reemplazar modelo" : "Subir modelo 3D"}
          </button>
          {model3dUrl && (
            <span className="flex items-center gap-2 text-sm text-primary">
              Modelo cargado
              <button type="button" onClick={() => setModel3dUrl("")} aria-label="Quitar modelo">
                <X className="size-4" />
              </button>
            </span>
          )}
          <input
            ref={modelInput}
            type="file"
            accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
            className="hidden"
            onChange={(e) => handleModelUpload(e.target.files)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2">
          <Switch checked={featured} onCheckedChange={setFeatured} />
          <span className="text-sm">Destacado</span>
        </label>
        <label className="flex items-center gap-2">
          <Switch checked={available} onCheckedChange={setAvailable} />
          <span className="text-sm">Disponible</span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending || uploadingImg || uploadingModel}>
          {pending ? "Guardando..." : dish ? "Guardar cambios" : "Crear plato"}
        </Button>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
