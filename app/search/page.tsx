"use client"

import { Suspense, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ThreadRow } from "@/components/thread-row"
import { CommunitySidebar } from "@/components/community-sidebar"
import { sections } from "@/lib/forum-data"
import { useThreads } from "@/lib/threads"
import { Search } from "lucide-react"

function SearchResults() {
  const searchParams = useSearchParams()
  const query = (searchParams.get("q") || "").trim()
  const { threads, loading } = useThreads()

  const allCategories = useMemo(
    () => sections.flatMap((s) => s.categories),
    [],
  )

  const q = query.toLowerCase()

  const threadMatches = useMemo(() => {
    if (!q) return []
    return threads.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.content.toLowerCase().includes(q) ||
        t.author.username.toLowerCase().includes(q),
    )
  }, [threads, q])

  const categoryMatches = useMemo(() => {
    if (!q) return []
    return allCategories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    )
  }, [allCategories, q])

  const total = threadMatches.length + categoryMatches.length

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Search className="h-4 w-4" />
        {query ? (
          <span>
            Результаты по запросу{" "}
            <span className="font-medium text-foreground">«{query}»</span>
            {!loading && ` — найдено ${total}`}
          </span>
        ) : (
          <span>Введите запрос для поиска по форуму</span>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          {/* Categories */}
          {categoryMatches.length > 0 && (
            <section className="overflow-hidden rounded-md border border-border bg-card">
              <div className="border-b border-border bg-secondary/40 px-4 py-3 sm:px-5">
                <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
                  Разделы
                </h2>
              </div>
              <div>
                {categoryMatches.map((c) => (
                  <Link
                    key={c.id}
                    href={`/category/${c.id}`}
                    className="block border-b border-border px-4 py-4 transition-colors last:border-b-0 hover:bg-secondary/50 sm:px-5"
                  >
                    <h3 className="font-medium text-foreground">{c.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Threads */}
          <section className="overflow-hidden rounded-md border border-border bg-card">
            <div className="border-b border-border bg-secondary/40 px-4 py-3 sm:px-5">
              <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
                Темы
              </h2>
            </div>
            {threadMatches.length > 0 ? (
              <div>
                {threadMatches.map((thread) => (
                  <ThreadRow key={thread.id} thread={thread} />
                ))}
              </div>
            ) : (
              <div className="px-5 py-12 text-center text-muted-foreground">
                {query ? "По вашему запросу тем не найдено." : "Здесь появятся найденные темы."}
              </div>
            )}
          </section>
        </div>

        <aside>
          <CommunitySidebar />
        </aside>
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-16 text-center text-muted-foreground sm:px-6">
            Загрузка...
          </div>
        }
      >
        <SearchResults />
      </Suspense>
      <SiteFooter />
    </div>
  )
}
