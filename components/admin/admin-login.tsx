"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { loginAdmin } from "@/app/actions/auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(false)
    startTransition(async () => {
      const res = await loginAdmin(password)
      if (res.ok) {
        router.refresh()
      } else {
        setError(true)
      }
    })
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Lock className="size-5" />
          </div>
          <h1 className="font-serif text-2xl">PREGO · Gestión</h1>
          <p className="mt-1 text-sm text-muted-foreground">Acceso restringido</p>
        </div>

        <label htmlFor="password" className="mb-2 block text-sm font-medium">
          Contraseña
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoFocus
          aria-invalid={error}
        />
        {error && <p className="mt-2 text-sm text-destructive">Contraseña incorrecta</p>}

        <Button type="submit" className="mt-6 w-full" disabled={pending}>
          {pending ? "Comprobando..." : "Entrar"}
        </Button>
      </form>
    </main>
  )
}
