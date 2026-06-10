import Link from "next/link"
import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/wenz-logo.png"
                alt="WenzPlay"
                width={32}
                height={32}
                className="h-8 w-8 rounded-sm"
              />
              <span className="font-mono text-base font-bold tracking-tight">
                Wenz<span className="text-primary">Play</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Крупнейшее игровое комьюнити. Гайды, софт и общение для геймеров.
            </p>
          </div>

          {[
            { title: "Форум", links: ["Категории", "Популярное", "Новые темы", "Маркет"] },
            { title: "Сообщество", links: ["Топ участников", "Команда", "Правила", "Статистика"] },
            { title: "Поддержка", links: ["Помощь", "Связаться", "Условия", "Конфиденциальность"] },
          ].map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link
                      href="/"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© 2026 WenzPlay. Все права защищены.</p>
          <p className="text-xs">Игровое комьюнити для геймеров</p>
        </div>
      </div>
    </footer>
  )
}
