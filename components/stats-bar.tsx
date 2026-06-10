import { stats } from "@/lib/forum-data"
import { MessageSquare, Users, FileText, Activity } from "lucide-react"

const items = [
  { label: "Участников", value: stats.members, icon: Users },
  { label: "Тем", value: stats.threads, icon: FileText },
  { label: "Сообщений", value: stats.posts, icon: MessageSquare },
  { label: "Сейчас онлайн", value: stats.online, icon: Activity, accent: true },
]

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3"
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm ${
              item.accent ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="truncate font-mono text-base font-bold leading-none text-foreground">
              {item.value}
            </div>
            <div className="mt-1 truncate text-xs text-muted-foreground">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
