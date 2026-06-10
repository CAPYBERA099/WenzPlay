import { notFound } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ReplyComposer } from "@/components/reply-composer"
import { threads, users, getCategory } from "@/lib/forum-data"
import { formatCount, roleStyles } from "@/lib/forum-utils"
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

type Post = {
  authorId: string
  time: string
  content: string
  likes: number
}

function buildPosts(thread: (typeof threads)[number]): Post[] {
  return [
    {
      authorId: thread.authorId,
      time: "Сегодня, 14:20",
      content: thread.excerpt,
      likes: 142,
    },
    {
      authorId: "u4",
      time: "Сегодня, 14:38",
      content:
        "Отличный гайд, спасибо! Добавил бы ещё пару моментов про настройку мыши и сенсы — для новичков это критично.",
      likes: 38,
    },
    {
      authorId: "u5",
      time: "Сегодня, 15:02",
      content: "Подтверждаю, после этих настроек фпс стабильно вырос. Респект автору.",
      likes: 12,
    },
    {
      authorId: "u2",
      time: "Сегодня, 15:30",
      content:
        "Закрепил тему, очень полезно для комьюнити. Если есть вопросы — пишите в этой ветке, постараемся помочь.",
      likes: 64,
    },
  ]
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const thread = threads.find((t) => t.id === id)
  if (!thread) notFound()

  const category = getCategory(thread.categoryId)
  const posts = buildPosts(thread)

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
              {formatCount(thread.replies)} ответов
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {formatCount(thread.views)} просмотров
            </span>
          </div>
        </div>

        {/* Posts */}
        <div className="mt-6 flex flex-col gap-4">
          {posts.map((post, i) => {
            const author = users[post.authorId]
            return (
              <article
                key={i}
                className="grid grid-cols-1 overflow-hidden rounded-md border border-border bg-card sm:grid-cols-[180px_1fr]"
              >
                {/* Author column */}
                <div className="flex items-center gap-3 border-b border-border bg-secondary/30 p-4 sm:flex-col sm:items-center sm:gap-2 sm:border-b-0 sm:border-r sm:text-center">
                  <Avatar className="h-12 w-12 rounded-sm sm:h-16 sm:w-16">
                    <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.username} />
                    <AvatarFallback className="rounded-sm">{author.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="sm:mt-1">
                    <Link
                      href={`/profile/${author.username}`}
                      className="font-semibold text-foreground hover:text-primary"
                    >
                      {author.username}
                    </Link>
                    <Badge
                      variant="outline"
                      className={`mt-1 block w-fit rounded-sm px-1.5 text-[10px] sm:mx-auto ${roleStyles[author.role]}`}
                    >
                      {author.role}
                    </Badge>
                    <div className="mt-2 hidden text-xs text-muted-foreground sm:block">
                      <p>Сообщений: {formatCount(author.posts)}</p>
                      <p>Репутация: {formatCount(author.reputation)}</p>
                    </div>
                  </div>
                </div>

                {/* Content column */}
                <div className="flex flex-col p-4">
                  <div className="mb-3 text-xs text-muted-foreground">{post.time}</div>
                  <p className="flex-1 leading-relaxed text-foreground">{post.content}</p>
                  <div className="mt-4 flex items-center gap-1 border-t border-border pt-3">
                    <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-primary">
                      <ThumbsUp className="h-4 w-4" />
                      {post.likes}
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
          })}
        </div>

        <ReplyComposer />
      </main>

      <SiteFooter />
    </div>
  )
}
