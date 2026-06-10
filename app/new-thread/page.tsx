"use client"

import Link from "next/link"
import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sections } from "@/lib/forum-data"
import { ChevronRight, Bold, Italic, Link2, Code, Send } from "lucide-react"

export default function NewThreadPage() {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [category, setCategory] = useState("")

  const canSubmit = title.trim() && body.trim() && category

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Форумы
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Новая тема</span>
        </nav>

        <h1 className="mt-4 font-mono text-2xl font-bold tracking-tight text-foreground">
          Создать тему
        </h1>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-6 flex flex-col gap-5 rounded-md border border-border bg-card p-5"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-sm font-medium text-foreground">
              Раздел
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 rounded-sm border border-input bg-secondary px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Выберите раздел...</option>
              {sections.map((section) => (
                <optgroup key={section.id} label={section.name}>
                  {section.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Заголовок
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="О чём ваша тема?"
              className="bg-secondary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="body" className="text-sm font-medium text-foreground">
              Сообщение
            </label>
            <div className="rounded-sm border border-input bg-secondary">
              <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
                {[Bold, Italic, Link2, Code].map((Icon, i) => (
                  <Button
                    key={i}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                placeholder="Опишите подробно..."
                className="w-full resize-y bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button asChild variant="outline">
              <Link href="/">Отмена</Link>
            </Button>
            <Button type="submit" disabled={!canSubmit} className="gap-2">
              <Send className="h-4 w-4" />
              Опубликовать тему
            </Button>
          </div>
        </form>
      </main>

      <SiteFooter />
    </div>
  )
}
