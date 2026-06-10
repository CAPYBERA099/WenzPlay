import { notFound } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ThreadRow } from "@/components/thread-row"
import { CommunitySidebar } from "@/components/community-sidebar"
import { getCategory, getThreadsByCategory } from "@/lib/forum-data"
import { formatCount } from "@/lib/forum-utils"
import { ChevronRight, Plus, FileText, MessageSquare } from "lucide-react"

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const category = getCategory(id)
  if (!category) notFound()

  const categoryThreads = getThreadsByCategory(id)

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Форумы
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{category.name}</span>
        </nav>

        {/* Category header */}
        <div className="mt-4 flex flex-col gap-4 rounded-md border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground">
              {category.name}
            </h1>
            <p className="mt-1 text-pretty text-muted-foreground">{category.description}</p>
            <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                {formatCount(category.threads)} тем
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" />
                {formatCount(category.posts)} сообщений
              </span>
            </div>
          </div>
          <Link
            href="/new-thread"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-sm bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Создать тему
          </Link>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="overflow-hidden rounded-md border border-border bg-card">
            <div className="border-b border-border bg-secondary/40 px-4 py-3 sm:px-5">
              <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
                Темы
              </h2>
            </div>
            {categoryThreads.length > 0 ? (
              <div>
                {categoryThreads.map((thread) => (
                  <ThreadRow key={thread.id} thread={thread} />
                ))}
              </div>
            ) : (
              <div className="px-5 py-12 text-center text-muted-foreground">
                <p>В этом разделе пока нет тем.</p>
                <Link href="/new-thread" className="mt-2 inline-block text-primary hover:underline">
                  Создать первую тему
                </Link>
              </div>
            )}
          </section>

          <aside>
            <CommunitySidebar />
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
