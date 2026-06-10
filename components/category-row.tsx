import Link from "next/link"
import type { Category } from "@/lib/forum-data"
import { formatCount } from "@/lib/forum-utils"
import {
  Megaphone,
  MessagesSquare,
  UserPlus,
  Crosshair,
  Target,
  Swords,
  ShoppingCart,
  LifeBuoy,
  Lightbulb,
  Boxes,
  ChevronRight,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Megaphone,
  MessagesSquare,
  UserPlus,
  Crosshair,
  Target,
  Swords,
  ShoppingCart,
  LifeBuoy,
  Lightbulb,
  Boxes,
}

const accentClasses: Record<string, string> = {
  primary: "bg-primary/15 text-primary",
  warning: "bg-warning/15 text-warning",
  muted: "bg-secondary text-muted-foreground",
}

export function CategoryRow({ category }: { category: Category }) {
  const Icon = iconMap[category.icon] ?? MessagesSquare
  const accent = accentClasses[category.accent] ?? accentClasses.muted

  return (
    <Link
      href={`/category/${category.id}`}
      className="group flex items-center gap-4 border-b border-border px-4 py-4 transition-colors last:border-b-0 hover:bg-secondary/50 sm:px-5"
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-sm ${accent}`}>
        <Icon className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-foreground transition-colors group-hover:text-primary">
          {category.name}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{category.description}</p>
      </div>

      <div className="hidden shrink-0 gap-6 text-right sm:flex">
        <div>
          <div className="font-mono text-sm font-semibold text-foreground">
            {formatCount(category.threads)}
          </div>
          <div className="text-xs text-muted-foreground">тем</div>
        </div>
        <div>
          <div className="font-mono text-sm font-semibold text-foreground">
            {formatCount(category.posts)}
          </div>
          <div className="text-xs text-muted-foreground">сообщений</div>
        </div>
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  )
}
