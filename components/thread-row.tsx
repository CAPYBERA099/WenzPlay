import Link from "next/link"
import type { Thread } from "@/lib/forum-data"
import { users } from "@/lib/forum-data"
import { formatCount, roleStyles } from "@/lib/forum-utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Eye, MessageSquare, Pin, Flame } from "lucide-react"

export function ThreadRow({ thread }: { thread: Thread }) {
  const author = users[thread.authorId]

  return (
    <Link
      href={`/thread/${thread.id}`}
      className="group flex items-start gap-3 border-b border-border px-4 py-4 transition-colors last:border-b-0 hover:bg-secondary/50 sm:px-5"
    >
      <Avatar className="h-10 w-10 shrink-0 rounded-sm">
        <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.username} />
        <AvatarFallback className="rounded-sm">{author.username[0]}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {thread.pinned && (
            <Pin className="h-3.5 w-3.5 shrink-0 text-primary" aria-label="Закреплено" />
          )}
          {thread.hot && (
            <Flame className="h-3.5 w-3.5 shrink-0 text-warning" aria-label="Популярно" />
          )}
          <h3 className="truncate font-medium text-foreground transition-colors group-hover:text-primary">
            {thread.title}
          </h3>
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{thread.excerpt}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="text-foreground">{author.username}</span>
          <Badge
            variant="outline"
            className={`h-4 rounded-sm px-1.5 text-[10px] font-medium ${roleStyles[author.role]}`}
          >
            {author.role}
          </Badge>
          <span>·</span>
          <span>{thread.lastActivity}</span>
        </div>
      </div>

      <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
        <span className="flex items-center gap-1 font-mono text-sm text-foreground">
          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
          {formatCount(thread.replies)}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Eye className="h-3.5 w-3.5" />
          {formatCount(thread.views)}
        </span>
      </div>
    </Link>
  )
}
