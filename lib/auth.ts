"use client"

import type { User } from "@/lib/forum-data"
import { resolveRoleByUsername } from "@/lib/forum-utils"

const STORAGE_KEY = "wenzplay-current-user"
const USERS_KEY = "wenzplay-users"

export type AccountInput = {
  username: string
  email: string
  password: string
}

export type Account = User & { email: string }

function readUsers(): Record<string, Account> {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}")
  } catch {
    return {}
  }
}

function writeUsers(map: Record<string, Account>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(map))
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
  window.dispatchEvent(new Event("wenzplay-auth"))
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

  users[key] = account
  writeUsers(users)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(account))
  window.dispatchEvent(new Event("wenzplay-auth"))
  return { ok: true, user: account }
}

export function loginAccount(
  input: { email: string; password: string },
): { ok: true; user: Account } | { ok: false; error: string } {
  const users = readUsers()
  const account = Object.values(users).find(
    (u) => u.email.toLowerCase() === input.email.trim().toLowerCase(),
  )
  if (!account) {
    return { ok: false, error: "Аккаунт с таким email не найден." }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(account))
  window.dispatchEvent(new Event("wenzplay-auth"))
  return { ok: true, user: account }
}
