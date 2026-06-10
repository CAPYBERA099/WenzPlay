import type { User } from "@/lib/forum-data"

// --- Права на форуме --------------------------------------------------------

export type Permission =
  | "deleteAnyPost"
  | "editAnyPost"
  | "pinThreads"
  | "lockThreads"
  | "moveThreads"
  | "banUsers"
  | "warnUsers"
  | "manageRoles"
  | "manageCategories"
  | "manageForumSettings"

export const permissionLabels: Record<Permission, string> = {
  deleteAnyPost: "Удалять любые сообщения",
  editAnyPost: "Редактировать любые сообщения",
  pinThreads: "Закреплять темы",
  lockThreads: "Закрывать темы",
  moveThreads: "Переносить темы между разделами",
  banUsers: "Банить пользователей",
  warnUsers: "Выдавать предупреждения",
  manageRoles: "Управлять ролями участников",
  manageCategories: "Управлять разделами и категориями",
  manageForumSettings: "Управлять настройками форума",
}

// Какие права даёт каждая роль
export const rolePermissions: Record<User["role"], Permission[]> = {
  Owner: [
    "deleteAnyPost",
    "editAnyPost",
    "pinThreads",
    "lockThreads",
    "moveThreads",
    "banUsers",
    "warnUsers",
    "manageRoles",
    "manageCategories",
    "manageForumSettings",
  ],
  Admin: [
    "deleteAnyPost",
    "editAnyPost",
    "pinThreads",
    "lockThreads",
    "moveThreads",
    "banUsers",
    "warnUsers",
    "manageCategories",
  ],
  Moderator: ["deleteAnyPost", "editAnyPost", "pinThreads", "lockThreads", "moveThreads", "warnUsers"],
  Premium: [],
  Member: [],
}

// Человекочитаемое название роли (рус.)
export const roleLabels: Record<User["role"], string> = {
  Owner: "Создатель",
  Admin: "Администратор",
  Moderator: "Модератор",
  Premium: "Премиум",
  Member: "Участник",
}

// --- Спец-аккаунты ----------------------------------------------------------
// Ники, которым роль назначается автоматически при регистрации/входе.
// Сравнение регистронезависимое.
const SPECIAL_ROLES: Record<string, User["role"]> = {
  nullbyte: "Owner",
  vinilog: "Moderator",
  alexsei: "Moderator",
}

export function resolveRoleForUsername(username: string): User["role"] {
  return SPECIAL_ROLES[username.trim().toLowerCase()] ?? "Member"
}

export function getPermissions(role: User["role"]): Permission[] {
  return rolePermissions[role] ?? []
}

export function hasPermission(role: User["role"], permission: Permission): boolean {
  return getPermissions(role).includes(permission)
}
