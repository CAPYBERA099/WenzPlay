"use client"

import { useEffect, useState } from "react"
import type { Thread, User } from "@/lib/forum-data"
import { threads as seedThreads } from "@/lib/forum-data"

const THREADS_KEY = "wenzplay-threads"
const THREADS_EVENT = "wenzplay-threads-changed"

// Снимок автора сохраняется вместе с темой, чтобы не зависеть от
// статического списка пользователей (который пуст).
export type AuthorSnapshot = Pick<
  User,
  "id" | "username" | "avatar" | "role" | "posts" | "reputation"
>

export type StoredReply = {
  id: string
  content: string
  author: AuthorSnapshot
  createdAt: number
}

export type StoredThread = Thread & {
  content: string
  author: AuthorSnapshot
  createdAt: number
  replyList?: StoredReply[]
}

function readStored(): StoredThread[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(THREADS_KEY) || "[]")
  } catch {
    return []
  }
}

function writeStored(list: StoredThread[]) {
  localStorage.setItem(THREADS_KEY, JSON.stringify(list))
  window.dispatchEvent(new Event(THREADS_EVENT))
}

export function getAllThreads(): StoredThread[] {
  return readStored().sort((a, b) => b.createdAt - a.createdAt)
}

export function getThreadById(id: string): StoredThread | undefined {
  return readStored().find((t) => t.id === id)
}

export function getThreadsByCategoryStored(categoryId: string): StoredThread[] {
  return getAllThreads().filter((t) => t.categoryId === categoryId)
}

export function createThread(input: {
  title: string
  content: string
  categoryId: string
  author: AuthorSnapshot
}): StoredThread {
  const list = readStored()
  const thread: StoredThread = {
    id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: input.title.trim(),
    categoryId: input.categoryId,
    authorId: input.author.id,
    replies: 0,
    views: 0,
    lastActivity: "только что",
    excerpt: input.content.trim().slice(0, 160),
    content: input.content.trim(),
    author: input.author,
    createdAt: Date.now(),
    replyList: [],
  }
  list.push(thread)
  writeStored(list)
  return thread
}

/** Добавляет ответ к теме и возвращает обновлённую тему. */
export function addReply(threadId: string, reply: StoredReply): StoredThread | undefined {
  const list = readStored()
  const idx = list.findIndex((t) => t.id === threadId)
  if (idx === -1) return undefined
  const thread = list[idx]
  thread.replyList = [...(thread.replyList ?? []), reply]
  thread.replies = thread.replyList.length
  thread.lastActivity = "только что"
  list[idx] = thread
  writeStored(list)
  return thread
}

/** Реактивный список тем, обновляется при создании новых. */
export function useThreads(categoryId?: string): {
  threads: StoredThread[]
  loading: boolean
} {
  const [items, setItems] = useState<StoredThread[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sync = () => {
      const all = categoryId ? getThreadsByCategoryStored(categoryId) : getAllThreads()
      setItems(all)
      setLoading(false)
    }
    sync()
    window.addEventListener(THREADS_EVENT, sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener(THREADS_EVENT, sync)
      window.removeEventListener("storage", sync)
    }
  }, [categoryId])

  return { threads: items, loading }
}

// На случай, если когда-нибудь появятся стартовые темы из forum-data.
export const _seed = seedThreads
