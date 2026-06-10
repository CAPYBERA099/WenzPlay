"use client"

import { useEffect, useState } from "react"
import type { User } from "@/lib/forum-data"
import { resolveRoleByUsername } from "@/lib/forum-utils"

const AUTH_EVENT = "wenzplay-auth"

const STORAGE_KEY = "wenzplay-current-user"
const USERS_KEY = "wenzplay-users"

export type AccountInput = {
  username: string
  email: string
  password: string
}

export type Account = User & { email: string }
// Внутреннее хранилище включает пароль (только в localStorage, не в текущей сессии).
type StoredAccount = Account & { password: string }

function readUsers(): Record<string, StoredAccount> {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}")
  } catch {
    return {}
  }
}

function writeUsers(map: Record<string, StoredAccount>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(map))
}

function persistSession(account: Account) {
  // В сессию кладём аккаунт без пароля.
  const { ...safe } = account
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safe))
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function getCurrentUser(): Account | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Account) : null
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function registerAccount(
  input: AccountInput,
): { ok: true; user: Account } | { ok: false; error: string } {
  const username = input.username.trim()
  if (username.length < 3) {
    return { ok: false, error: "Имя пользователя должно быть не короче 3 символов." }
  }
  if (!/^\S+@\S+\.\S+$/.test(input.email.trim())) {
    return { ok: false, error: "Введите корректный email." }
  }
  if (input.password.length < 6) {
    return { ok: false, error: "Пароль должен быть не короче 6 символов." }
  }

  const users = readUsers()
  const key = username.toLowerCase()
  if (users[key]) {
    return { ok: false, error: "Пользователь с таким именем уже существует." }
  }

  const account: Account = {
    id: key,
    username,
    email: input.email.trim(),
    avatar: "/placeholder.svg",
    role: resolveRoleByUsername(username),
    posts: 0,
    reputation: 0,
    joined: new Date().toLocaleDateString("ru-RU", { month: "long", year: "numeric" }),
    status: "online",
  }

  users[key] = { ...account, password: input.password }
  writeUsers(users)
  persistSession(account)
  return { ok: true, user: account }
}

export function loginAccount(
  input: { email: string; password: string },
): { ok: true; user: Account } | { ok: false; error: string } {
  const users = readUsers()
  const stored = Object.values(users).find(
    (u) => u.email.toLowerCase() === input.email.trim().toLowerCase(),
  )
  if (!stored) {
    return { ok: false, error: "Аккаунт с таким email не найден." }
  }
  if (stored.password !== input.password) {
    return { ok: false, error: "Неверный пароль." }
  }
  const { password: _pw, ...account } = stored
  persistSession(account)
  return { ok: true, user: account }
}

/**
 * Обновляет аватар текущего пользователя и синхронизирует его
 * в общем списке аккаунтов и в активной сессии.
 */
export function updateAvatar(dataUrl: string): Account | null {
  const current = getCurrentUser()
  if (!current) return null
  const users = readUsers()
  const key = current.id
  if (users[key]) {
    users[key] = { ...users[key], avatar: dataUrl }
    writeUsers(users)
  }
  const updated: Account = { ...current, avatar: dataUrl }
  persistSession(updated)
  return updated
}

/** Реактивный хук: возвращает текущего пользователя и обновляется при входе/выходе. */
export function useCurrentUser(): { user: Account | null; loading: boolean } {
  const [user, setUser] = useState<Account | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sync = () => {
      setUser(getCurrentUser())
      setLoading(false)
    }
    sync()
    window.addEventListener(AUTH_EVENT, sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener(AUTH_EVENT, sync)
      window.removeEventListener("storage", sync)
    }
  }, [])

  return { user, loading }
}
