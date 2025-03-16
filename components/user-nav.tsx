"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogIn, LogOut, UserRound } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"

export function UserNav() {
  const { user, logout } = useAuth()

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "main_supervisor":
        return "Главный следящий МЗ"
      case "deputy_main_supervisor":
        return "Заместитель главного следящего"
      case "supervisor":
        return "Следящий"
      case "leader":
        return "Лидер"
      case "minister":
        return "Министр"
      case "deputy":
        return "Заместитель"
      default:
        return "Сотрудник"
    }
  }

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="outline" className="flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          Войти
        </Button>
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <UserRound className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-xs leading-none text-muted-foreground">{getRoleDisplay(user.role)}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Личный кабинет</Link>
        </DropdownMenuItem>
        {(user.role === "main_supervisor" || user.role === "deputy_main_supervisor" || user.role === "supervisor") && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/admin">Панель администратора</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">Настройки</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

