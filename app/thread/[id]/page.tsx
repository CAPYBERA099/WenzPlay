"use client"

import { use, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ReplyComposer } from "@/components/reply-composer"
import { getCategory } from "@/lib/forum-data"
import { formatCount, roleStyles, roleLabels } from "@/lib/forum-utils"
import { getThreadById, addReply, type StoredThread, type StoredReply } from "@/lib/threads"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  Pin,
  Flame,
  Eye,
  MessageSquare,
  ThumbsUp,
  Quote,
  Share2,
} from "lucide-react"

export default function ThreadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [thread, setThread] = useState<StoredThread | null | undefined>(undefined)

  useEffect(() => {
    setThread(getThreadById(id) ?? null)
  }, [id])

  if (thread === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-5xl px-4 py-16 text-center text-muted-foreground sm:px-6">
          Загрузка...
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (thread === null) notFound()

  const category = getCategory(thread.categoryId)
  const replies: StoredReply[] = thread.replyList ?? []

  function handleReply(reply: StoredReply) {
    const updated = addReply(thread!.id, reply)
    if (updated) setThread(updated)
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Форумы
          </Link>
          <ChevronRight className="h-4 w-4" />
          {category && (
            <>
              <Link href={`/category/${category.id}`} className="hover:text-foreground">
                {category.name}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="line-clamp-1 text-foreground">{thread.title}</span>
        </nav>

        {/* Thread title */}
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            {thread.pinned && (
              <Badge variant="outline" className="gap-1 rounded-sm border-primary/40 bg-primary/10 text-primary">
                <Pin className="h-3 w-3" />
                Закреплено
              </Badge>
            )}
            {thread.hot && (
              <Badge variant="outline" className="gap-1 rounded-sm border-warning/40 bg-warning/10 text-warning">
                <Flame className="h-3 w-3" />
                Популярно
              </Badge>
            )}
          </div>
          <h1 className="mt-2 text-balance font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {thread.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" />
              {formatCount(replies.length)} ответов
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {formatCount(thread.views)} просмотров
            </span>
          </div>
        </div>

        {/* Original post + replies */}
        <div className="mt-6 flex flex-col gap-4">
          <PostCard
            username={thread.author.username}
            avatar={thread.author.avatar}
            role={thread.author.role}
            posts={thread.author.posts}
            reputation={thread.author.reputation}
            time={new Date(thread.createdAt).toLocaleString("ru-RU")}
            content={thread.content}
          />

          {replies.map((reply) => (
            <PostCard
              key={reply.id}
              username={reply.author.username}
              avatar={reply.author.avatar}
              role={reply.author.role}
              posts={reply.author.posts}
              reputation={reply.author.reputation}
              time={new Date(reply.createdAt).toLocaleString("ru-RU")}
              content={reply.content}
            />
          ))}
        </div>

        <ReplyComposer onReply={handleReply} />
      </main>

      <SiteFooter />
    </div>
  )
}

function PostCard({
  username,
  avatar,
  role,
  posts,
  reputation,
  time,
  content,
}: {
  username: string
  avatar: string
  role: StoredThread["author"]["role"]
  posts: number
  reputation: number
  time: string
  content: string
}) {
  return (
    <article className="grid grid-cols-1 overflow-hidden rounded-md border border-border bg-card sm:grid-cols-[180px_1fr]">
      {/* Author column */}
      <div className="flex items-center gap-3 border-b border-border bg-secondary/30 p-4 sm:flex-col sm:items-center sm:gap-2 sm:border-b-0 sm:border-r sm:text-center">
        <Avatar className="h-12 w-12 rounded-sm sm:h-16 sm:w-16">
          <AvatarImage src={avatar || "/placeholder.svg"} alt={username} />
          <AvatarFallback className="rounded-sm">{username[0]}</AvatarFallback>
        </Avatar>
        <div className="sm:mt-1">
          <Link
            href={`/profile/${encodeURIComponent(username)}`}
            className="font-semibold text-foreground hover:text-primary"
          >
            {username}
          </Link>
          <Badge
            variant="outline"
            className={`mt-1 block w-fit rounded-sm px-1.5 text-[10px] sm:mx-auto ${roleStyles[role]}`}
          >
            {roleLabels[role]}
          </Badge>
          <div className="mt-2 hidden text-xs text-muted-foreground sm:block">
            <p>Сообщений: {formatCount(posts)}</p>
            <p>Репутация: {formatCount(reputation)}</p>
          </div>
        </div>
      </div>

      {/* Content column */}
      <div className="flex flex-col p-4">
        <div className="mb-3 text-xs text-muted-foreground">{time}</div>
        <p className="flex-1 whitespace-pre-wrap leading-relaxed text-foreground">{content}</p>
        <div className="mt-4 flex items-center gap-1 border-t border-border pt-3">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-primary">
            <ThumbsUp className="h-4 w-4" />0
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
            <Quote className="h-4 w-4" />
            Цитировать
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Поделиться</span>
          </Button>
        </div>
      </div>
    </article>
  )
}
