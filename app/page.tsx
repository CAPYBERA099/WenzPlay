import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { StatsBar } from "@/components/stats-bar"
import { CategoryRow } from "@/components/category-row"
import { CommunitySidebar } from "@/components/community-sidebar"
import { HeroCta } from "@/components/hero-cta"
import { sections } from "@/lib/forum-data"
import { Flame } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.78_0.16_165/0.12),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary">
            <Flame className="h-4 w-4" />
            Игровое комьюнити #1
          </div>
          <h1 className="mt-4 max-w-2xl text-balance font-mono text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            Добро пожаловать в <span className="text-primary">WenzPlay</span>
          </h1>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Гайды, софт, маркетплейс и живое общение для геймеров. Присоединяйся к
            тысячам участников и прокачивай свою игру.
          </p>
          <HeroCta />
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <StatsBar />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div id="categories" className="flex flex-col gap-6">
            {sections.map((section) => (
              <section
                key={section.id}
                className="overflow-hidden rounded-md border border-border bg-card"
              >
                <div className="border-b border-border bg-secondary/40 px-4 py-3 sm:px-5">
                  <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
                    {section.name}
                  </h2>
                </div>
                <div>
                  {section.categories.map((category) => (
                    <CategoryRow key={category.id} category={category} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside>
            <CommunitySidebar />
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
