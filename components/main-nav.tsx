"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"

export function MainNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">Министерство Здравоохранения</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Главная
        </Link>
        <Link
          href="/services"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/services" || pathname.startsWith("/services/") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Услуги
        </Link>
        <Link
          href="/staff"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/staff" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Сотрудники
        </Link>
        {user && (
          <Link
            href="/dashboard"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/dashboard" || pathname.startsWith("/dashboard/")
                ? "text-foreground"
                : "text-foreground/60",
            )}
          >
            Личный кабинет
          </Link>
        )}
      </nav>
    </div>
  )
}

