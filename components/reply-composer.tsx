"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bold, Italic, Link2, Code, Send } from "lucide-react"

export function ReplyComposer() {
  const [value, setValue] = useState("")

  return (
    <section className="mt-6 overflow-hidden rounded-md border border-border bg-card">
      <div className="border-b border-border bg-secondary/40 px-4 py-3">
        <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
          Ответить в теме
        </h2>
      </div>
      <div className="flex gap-3 p-4">
        <Avatar className="hidden h-10 w-10 rounded-sm sm:block">
          <AvatarImage src="/avatars/avatar-1.png" alt="Вы" />
          <AvatarFallback className="rounded-sm">Я</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-1 border-b border-border pb-2">
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
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={4}
            placeholder="Напишите свой ответ..."
            className="w-full resize-y rounded-sm border border-input bg-secondary px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Соблюдайте правила форума при общении.
            </p>
            <Button disabled={!value.trim()} className="gap-2">
              <Send className="h-4 w-4" />
              Отправить
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
