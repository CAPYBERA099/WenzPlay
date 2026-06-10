"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Flame, LogOut, Menu, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

const navLinks = [
  { label: "Форумы", href: "/" },
  { label: "Маркет", href: "/category/marketplace" },
  { label: "Топ", href: "/#top-members" },
  { label: "Правила", href: "/#rules" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  const handleSignOut = async () => {
    await authClient.signOut()
    setOpen(false)
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/wenz-logo.png"
            alt="WenzPlay"
            width={36}
            height={36}
            className="h-9 w-9 rounded-sm"
            priority
          />
          <span className="font-mono text-lg font-bold tracking-tight text-foreground">
            Wenz<span className="text-primary">Play</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-sm px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по форуму..."
              className="h-9 w-56 border-input bg-secondary pl-8 text-sm"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          {isPending ? null : user ? (
            <>
              <span className="hidden text-sm font-medium text-foreground sm:inline-flex">
                {user.name || user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
              >
                <Link href="/login">Войти</Link>
              </Button>
              <Button asChild size="sm" className="hidden font-medium sm:inline-flex">
                <Link href="/register">
                  <Flame className="h-4 w-4" />
                  Регистрация
                </Link>
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Меню"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-sm px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {user ? (
                <Button size="sm" variant="outline" className="flex-1" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  Выйти ({user.name || user.email})
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href="/login">Войти</Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link href="/register">Регистрация</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
