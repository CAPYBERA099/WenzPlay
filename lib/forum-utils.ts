import type { User } from "@/lib/forum-data"

export const roleStyles: Record<User["role"], string> = {
  Owner: "border-destructive/40 bg-destructive/10 text-destructive",
  Admin: "border-primary/40 bg-primary/10 text-primary",
  Moderator: "border-chart-2/40 bg-chart-2/10 text-chart-2",
  Premium: "border-warning/40 bg-warning/10 text-warning",
  Member: "border-border bg-muted text-muted-foreground",
}

// Русские названия ролей для отображения в интерфейсе.
export const roleLabels: Record<User["role"], string> = {
  Owner: "Создатель",
  Admin: "Администратор",
  Moderator: "Модератор",
  Premium: "Премиум",
  Member: "Участник",
}

// Права, которыми обладает каждая роль на форуме.
export const rolePermissions: Record<User["role"], string[]> = {
  Owner: [
    "Полный контроль над форумом",
    "Назначение и снятие любых ролей",
    "Управление разделами и категориями",
    "Удаление и редактирование любых тем и сообщений",
    "Закрепление, закрытие и перемещение тем",
    "Бан и разбан пользователей",
  ],
  Admin: [
    "Управление разделами и категориями",
    "Удаление и редактирование любых сообщений",
    "Закрепление, закрытие и перемещение тем",
    "Бан и разбан пользователей",
    "Выдача предупреждений",
  ],
  Moderator: [
    "Удаление и редактирование сообщений участников",
    "Закрепление и закрытие тем",
    "Перемещение тем между разделами",
    "Выдача предупреждений нарушителям",
    "Бан нарушителей правил",
  ],
  Premium: [
    "Создание тем и сообщений",
    "Расширенные возможности профиля",
    "Приоритет в техподдержке",
  ],
  Member: [
    "Создание тем и сообщений",
    "Редактирование своих сообщений",
    "Оценка репутации участников",
  ],
}

// Особые роли, выдаваемые автоматически при регистрации по нику.
export const specialRolesByUsername: Record<string, User["role"]> = {
  nullbyte: "Owner",
  vinilog: "Moderator",
  alexsei: "Moderator",
}

export function resolveRoleByUsername(username: string): User["role"] {
  return specialRolesByUsername[username.trim().toLowerCase()] ?? "Member"
}

export function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k"
  return String(n)
}
