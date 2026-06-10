export type User = {
  id: string
  username: string
  avatar: string
  role: "Owner" | "Admin" | "Moderator" | "Premium" | "Member"
  posts: number
  reputation: number
  joined: string
  status: "online" | "offline"
}

export type Thread = {
  id: string
  title: string
  categoryId: string
  authorId: string
  replies: number
  views: number
  lastActivity: string
  pinned?: boolean
  hot?: boolean
  excerpt: string
}

export type Category = {
  id: string
  name: string
  description: string
  icon: string
  threads: number
  posts: number
  accent: string
}

export type Section = {
  id: string
  name: string
  categories: Category[]
}

// Реальных пользователей пока нет — список наполнится после регистрации участников.
export const users: Record<string, User> = {}

export const sections: Section[] = [
  {
    id: "s1",
    name: "Сообщество",
    categories: [
      {
        id: "announcements",
        name: "Анонсы и новости",
        description: "Официальные объявления, обновления и новости платформы.",
        icon: "Megaphone",
        threads: 0,
        posts: 0,
        accent: "primary",
      },
      {
        id: "general",
        name: "Общалка",
        description: "Свободное общение на любые темы с комьюнити.",
        icon: "MessagesSquare",
        threads: 0,
        posts: 0,
        accent: "muted",
      },
      {
        id: "introductions",
        name: "Знакомства",
        description: "Новенький? Расскажи о себе и познакомься с участниками.",
        icon: "UserPlus",
        threads: 0,
        posts: 0,
        accent: "muted",
      },
    ],
  },
  {
    id: "s2",
    name: "Игры и софт",
    categories: [
      {
        id: "cs2",
        name: "Counter-Strike 2",
        description: "Обсуждения, конфиги, гайды и софт для CS2.",
        icon: "Crosshair",
        threads: 0,
        posts: 0,
        accent: "primary",
      },
      {
        id: "valorant",
        name: "Valorant",
        description: "Всё о Valorant: тактики, настройки, обновления.",
        icon: "Target",
        threads: 0,
        posts: 0,
        accent: "primary",
      },
      {
        id: "apex",
        name: "Apex Legends",
        description: "Меты, лоадауты и обсуждения сезонов Apex.",
        icon: "Swords",
        threads: 0,
        posts: 0,
        accent: "muted",
      },
      {
        id: "marketplace",
        name: "Маркетплейс",
        description: "Покупка, продажа и обмен аккаунтов и услуг.",
        icon: "ShoppingCart",
        threads: 0,
        posts: 0,
        accent: "warning",
      },
      {
        id: "misc",
        name: "Разное",
        description: "Темы, которые не подошли к другим разделам — софт, игры, обсуждения.",
        icon: "Boxes",
        threads: 0,
        posts: 0,
        accent: "muted",
      },
    ],
  },
  {
    id: "s3",
    name: "Поддержка",
    categories: [
      {
        id: "support",
        name: "Техподдержка",
        description: "Вопросы по работе платформы и помощь от команды.",
        icon: "LifeBuoy",
        threads: 0,
        posts: 0,
        accent: "muted",
      },
      {
        id: "feedback",
        name: "Отзывы и предложения",
        description: "Идеи по улучшению форума и обратная связь.",
        icon: "Lightbulb",
        threads: 0,
        posts: 0,
        accent: "muted",
      },
    ],
  },
]

// Тем пока нет — они появятся, как только участники начнут их создавать.
export const threads: Thread[] = []

export const stats = {
  members: "0",
  threads: "0",
  posts: "0",
  online: "0",
  newestMember: "—",
}

export function getCategory(id: string): Category | undefined {
  for (const section of sections) {
    const found = section.categories.find((c) => c.id === id)
    if (found) return found
  }
  return undefined
}

export function getThreadsByCategory(categoryId: string): Thread[] {
  return threads.filter((t) => t.categoryId === categoryId)
}
