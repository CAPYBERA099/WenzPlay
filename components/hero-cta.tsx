"use client"

import Link from "next/link"
import { Flame, PenSquare } from "lucide-react"
import { useCurrentUser } from "@/lib/auth"

export function HeroCta() {
  const { user, loading } = useCurrentUser()

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {!loading && user ? (
        <Link
          href="/new-thread"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <PenSquare className="h-4 w-4" />
          Создать тему
        </Link>
      ) : (
        <Link
          href="/register"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Flame className="h-4 w-4" />
          Создать аккаунт
        </Link>
      )}
      <Link
        href="#categories"
        className="inline-flex h-10 items-center justify-center rounded-sm border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
      >
        Смотреть разделы
      </Link>
    </div>
  )
}
