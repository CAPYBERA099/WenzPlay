"use client"

import { use, useEffect, useRef, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { users, threads, type User } from "@/lib/forum-data"
import { formatCount, roleStyles, roleLabels, rolePermissions } from "@/lib/forum-utils"
import { getCurrentUser, updateAvatar, useCurrentUser, type Account } from "@/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  MessageSquare,
  Award,
  UserPlus,
  Mail,
  Circle,
  ShieldCheck,
  Loader2,
  Camera,
} from "lucide-react"

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = use(params)
  const target = decodeURIComponent(username).toLowerCase()
  const [user, setUser] = useState<User | Account | null | undefined>(undefined)
  const { user: currentUser } = useCurrentUser()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarError, setAvatarError] = useState<string | null>(null)

  const isOwner = !!currentUser && currentUser.username.toLowerCase() === target

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarError(null)
    if (!file.type.startsWith("image/")) {
      setAvatarError("Можно загрузить только изображение.")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("Размер файла не должен превышать 2 МБ.")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const updated = updateAvatar(dataUrl)
      if (updated) setUser(updated)
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    // Сначала ищем среди статических участников.
    const staticUser = Object.values(users).find(
      (u) => u.username.toLowerCase() === target,
    )
    if (staticUser) {
      setUser(staticUser)
      return
    }
    // Затем смотрим зарегистрированные аккаунты в localStorage.
    try {
      const stored: Record<string, Account> = JSON.parse(
        localStorage.getItem("wenzplay-users") || "{}",
      )
      const found = Object.values(stored).find(
        (u) => u.username.toLowerCase() === target,
      )
      if (found) {
        setUser(found)
        return
      }
    } catch {
      // ignore
    }
    // Запасной вариант — текущий вошедший пользователь.
    const current = getCurrentUser()
    if (current && current.username.toLowerCase() === target) {
      setUser(current)
      return
    }
    setUser(null)
  }, [target])

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (user === null) notFound()

  const userThreads = threads.filter((t) => t.authorId === user.id)
  const permissions = rolePermissions[user.role]

  const statItems = [
    { label: "Сообщений", value: formatCount(user.posts), icon: MessageSquare },
    { label: "Репутация", value: formatCount(user.reputation), icon: Award },
    { label: "На форуме с", value: user.joined, icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Profile header */}
        <div className="overflow-hidden rounded-md border border-border bg-card">
          <div className="h-28 bg-[radial-gradient(ellipse_at_top_left,oklch(0.78_0.16_165/0.25),transparent_60%)] sm:h-36" />
          <div className="px-5 pb-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="-mt-12 flex flex-col gap-3 sm:-mt-14 sm:flex-row sm:items-end">
                <div className="relative h-24 w-24">
                  <Avatar className="h-24 w-24 rounded-md border-4 border-card">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                    <AvatarFallback className="rounded-md text-2xl">{user.username[0]}</AvatarFallback>
                  </Avatar>
                  {isOwner && (
                    <>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                        aria-label="Изменить аватар"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="sr-only"
                      />
                    </>
                  )}
                </div>
                <div className="sm:pb-1">
                  <div className="flex items-center gap-2">
                    <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground">
                      {user.username}
                    </h1>
                    <span
                      className={`flex items-center gap-1 text-xs ${
                        user.status === "online" ? "text-success" : "text-muted-foreground"
                      }`}
                    >
                      <Circle className="h-2 w-2 fill-current" />
                      {user.status === "online" ? "В сети" : "Не в сети"}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`mt-1.5 rounded-sm ${roleStyles[user.role]}`}
                  >
                    {roleLabels[user.role]}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                {isOwner ? (
                  <Button variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                    <Camera className="h-4 w-4" />
                    Сменить аватар
                  </Button>
                ) : (
                  <>
                    <Button className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Подписаться
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Mail className="h-4 w-4" />
                      Написать
                    </Button>
                  </>
                )}
              </div>
            </div>

            {avatarError && (
              <p className="mt-4 rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {avatarError}
              </p>
            )}

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {statItems.map((s) => (
                <div
                  key={s.label}
                  className="rounded-sm border border-border bg-secondary/40 p-3 text-center"
                >
                  <s.icon className="mx-auto h-4 w-4 text-primary" />
                  <div className="mt-1.5 font-mono text-base font-bold text-foreground">
                    {s.value}
                  </div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="threads" className="mt-6">
          <TabsList className="bg-card">
            <TabsTrigger value="threads">Темы</TabsTrigger>
            <TabsTrigger value="about">О себе</TabsTrigger>
            <TabsTrigger value="permissions">Права</TabsTrigger>
          </TabsList>

          <TabsContent value="threads" className="mt-4">
            <div className="overflow-hidden rounded-md border border-border bg-card">
              {userThreads.length > 0 ? (
                userThreads.map((thread) => (
                  <Link
                    key={thread.id}
                    href={`/thread/${thread.id}`}
                    className="block border-b border-border px-5 py-4 transition-colors last:border-b-0 hover:bg-secondary/50"
                  >
                    <h3 className="font-medium text-foreground hover:text-primary">
                      {thread.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatCount(thread.replies)} ответов · {formatCount(thread.views)} просмотров ·{" "}
                      {thread.lastActivity}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="px-5 py-10 text-center text-muted-foreground">
                  Пользователь ещё не создавал тем.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-4">
            <div className="rounded-md border border-border bg-card p-5">
              <p className="leading-relaxed text-muted-foreground">
                Активный участник комьюнити WenzPlay. Играет в CS2 и Valorant, делится гайдами и
                помогает новичкам. Состоит в команде с ролью{" "}
                <span className="font-medium text-foreground">{roleLabels[user.role]}</span>.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="mt-4">
            <div className="rounded-md border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2 className="font-mono text-sm font-semibold text-foreground">
                  Права роли «{roleLabels[user.role]}»
                </h2>
              </div>
              <ul className="mt-4 flex flex-col gap-2">
                {permissions.map((perm) => (
                  <li
                    key={perm}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Circle className="mt-1.5 h-1.5 w-1.5 shrink-0 fill-primary text-primary" />
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <SiteFooter />
    </div>
  )
}
