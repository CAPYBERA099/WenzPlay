import Link from "next/link"
import { users, threads } from "@/lib/forum-data"
import { formatCount, roleStyles } from "@/lib/forum-utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Clock } from "lucide-react"

export function CommunitySidebar() {
  const topMembers = Object.values(users)
    .sort((a, b) => b.reputation - a.reputation)
    .slice(0, 5)

  const latest = threads.slice(0, 5)

  return (
    <div className="flex flex-col gap-4">
      <section
        id="top-members"
        className="overflow-hidden rounded-md border border-border bg-card"
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Trophy className="h-4 w-4 text-warning" />
          <h2 className="text-sm font-semibold text-foreground">Топ участников</h2>
        </div>
        {topMembers.length > 0 ? (
          <ul>
            {topMembers.map((member, i) => (
              <li key={member.id}>
                <Link
                  href={`/profile/${member.username}`}
                  className="flex items-center gap-3 border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-secondary/50"
                >
                  <span className="w-4 text-center font-mono text-sm font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                  <Avatar className="h-8 w-8 rounded-sm">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.username} />
                    <AvatarFallback className="rounded-sm">{member.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-medium text-foreground">
                        {member.username}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`mt-0.5 h-4 rounded-sm px-1.5 text-[10px] font-medium ${roleStyles[member.role]}`}
                    >
                      {member.role}
                    </Badge>
                  </div>
                  <span className="font-mono text-sm font-semibold text-primary">
                    {formatCount(member.reputation)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            Пока нет участников. Будь первым!
          </p>
        )}
      </section>

      <section className="overflow-hidden rounded-md border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Clock className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Свежие темы</h2>
        </div>
        {latest.length > 0 ? (
          <ul>
            {latest.map((thread) => (
              <li key={thread.id}>
                <Link
                  href={`/thread/${thread.id}`}
                  className="block border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-secondary/50"
                >
                  <p className="line-clamp-2 text-sm font-medium text-foreground hover:text-primary">
                    {thread.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {users[thread.authorId]?.username ?? "Аноним"} · {thread.lastActivity}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            Тем пока нет — создай первую.
          </p>
        )}
      </section>

      <section className="rounded-md border border-primary/30 bg-primary/5 p-4">
        <h2 className="text-sm font-semibold text-foreground">Новенький в комьюнити?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Создай аккаунт и стань одним из первых участников WenzPlay.
        </p>
        <Link
          href="/register"
          className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-sm bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Присоединиться
        </Link>
      </section>
    </div>
  )
}
