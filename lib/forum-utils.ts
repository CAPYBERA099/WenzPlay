import type { User } from "@/lib/forum-data"

export const roleStyles: Record<User["role"], string> = {
  Owner: "border-destructive/40 bg-destructive/10 text-destructive",
  Admin: "border-primary/40 bg-primary/10 text-primary",
  Moderator: "border-chart-2/40 bg-chart-2/10 text-chart-2",
  Premium: "border-warning/40 bg-warning/10 text-warning",
  Member: "border-border bg-muted text-muted-foreground",
}

export function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k"
  return String(n)
}
