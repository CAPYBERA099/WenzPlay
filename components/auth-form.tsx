"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Zap, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react"
import { registerAccount, loginAccount } from "@/lib/auth"

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register"
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = isRegister
      ? registerAccount({ username, email, password })
      : loginAccount({ email, password })

    if (!result.ok) {
      setError(result.error)
      setLoading(false)
      return
    }

    router.push(`/profile/${encodeURIComponent(result.user.username)}`)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.78_0.16_165/0.1),transparent_55%)]" />

      <Link href="/" className="mb-8 flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-primary-foreground">
          <Zap className="h-6 w-6" strokeWidth={2.5} />
        </span>
        <span className="font-mono text-xl font-bold tracking-tight text-foreground">
          FATAL<span className="text-primary">ITY</span>
        </span>
      </Link>

      <div className="w-full max-w-md rounded-md border border-border bg-card p-6 sm:p-8">
        <h1 className="text-balance text-center font-mono text-2xl font-bold tracking-tight text-foreground">
          {isRegister ? "Создать аккаунт" : "С возвращением"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {isRegister
            ? "Присоединяйся к крупнейшему игровому комьюнити"
            : "Войди, чтобы продолжить общение"}
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          {isRegister && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Имя пользователя
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder="nickname"
                  className="bg-secondary pl-9"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-secondary pl-9"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Пароль
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-secondary px-9"
                autoComplete={isRegister ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {!isRegister && (
            <div className="flex justify-end">
              <Link href="#" className="text-sm text-primary hover:underline">
                Забыли пароль?
              </Link>
            </div>
          )}

          {error && (
            <p className="rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="mt-2 w-full font-medium" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isRegister ? "Зарегистрироваться" : "Войти"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isRegister ? "Уже есть аккаунт? " : "Ещё нет аккаунта? "}
          <Link
            href={isRegister ? "/login" : "/register"}
            className="font-medium text-primary hover:underline"
          >
            {isRegister ? "Войти" : "Зарегистрироваться"}
          </Link>
        </p>
      </div>

      <Link
        href="/"
        className="mt-6 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Вернуться на форум
      </Link>
    </div>
  )
}
