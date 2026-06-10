import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { roleStyles } from "@/lib/forum-utils"
import {
  getPermissions,
  permissionLabels,
  roleLabels,
  type Permission,
} from "@/lib/roles"
import type { User } from "@/lib/forum-data"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Check, X } from "lucide-react"

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/login")

  const user = session.user as { name: string; email: string; role?: User["role"] }
  const role = (user.role ?? "Member") as User["role"]
  const granted = getPermissions(role)
  const allPermissions = Object.keys(permissionLabels) as Permission[]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="rounded-md border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-secondary">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-mono text-xl font-bold tracking-tight text-foreground">
                {user.name}
              </h1>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className={`rounded-sm ${roleStyles[role]}`}>
                  {roleLabels[role]}
                </Badge>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-6 rounded-md border border-border bg-card p-5">
          <h2 className="font-mono text-base font-bold text-foreground">Права на форуме</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {granted.length > 0
              ? `Роль «${roleLabels[role]}» даёт следующие права.`
              : "У вашей роли нет специальных прав модерации."}
          </p>

          <ul className="mt-4 divide-y divide-border">
            {allPermissions.map((perm) => {
              const has = granted.includes(perm)
              return (
                <li key={perm} className="flex items-center justify-between py-2.5">
                  <span
                    className={has ? "text-sm text-foreground" : "text-sm text-muted-foreground"}
                  >
                    {permissionLabels[perm]}
                  </span>
                  {has ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-success">
                      <Check className="h-4 w-4" />
                      Разрешено
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <X className="h-4 w-4" />
                      Нет
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
