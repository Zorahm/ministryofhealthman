"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Типы ролей пользователей
type UserRole = "main_supervisor" | "deputy_main_supervisor" | "supervisor" | "leader" | "minister" | "deputy" | "user"

// Типы пользователя
type User = {
  id: number
  username: string
  role: UserRole
  token: string
  hospital?: string
  assignedHospital?: string
}

// Контекст авторизации
type AuthContextType = {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthorized: (requiredRoles: UserRole[]) => boolean
}

// Создаем контекст
const AuthContext = createContext<AuthContextType | null>(null)

// Хук для использования контекста авторизации
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Провайдер авторизации
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Получаем данные пользователя из localStorage
        const userData = localStorage.getItem("user")

        if (userData) {
          console.log("Found user data in localStorage")
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        } else {
          console.log("No user data in localStorage")
          setUser(null)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Проверка доступа к защищенным страницам
  useEffect(() => {
    // Пропускаем проверку во время загрузки
    if (loading) return

    // Защищенные пути и требуемые роли
    const protectedRoutes: Record<string, UserRole[]> = {
      "/dashboard": ["main_supervisor", "deputy_main_supervisor", "supervisor", "leader", "minister", "deputy", "user"],
      "/dashboard/admin": ["main_supervisor", "deputy_main_supervisor", "supervisor"],
      "/dashboard/minister": ["minister"],
      "/dashboard/points": ["leader", "minister", "deputy"],
    }

    // Проверяем, является ли текущий путь защищенным
    const isProtectedRoute = Object.keys(protectedRoutes).some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )

    // Если путь защищен, но пользователь не авторизован, перенаправляем на страницу входа
    if (isProtectedRoute && !user) {
      console.log("Protected route detected, user not authenticated")
      router.push(`/login?from=${pathname}`)
      return
    }

    // Если путь защищен и пользователь авторизован, проверяем права доступа
    if (isProtectedRoute && user) {
      // Находим требуемые роли для текущего пути
      let requiredRoles: UserRole[] = []

      for (const route in protectedRoutes) {
        if (pathname === route || pathname.startsWith(`${route}/`)) {
          requiredRoles = protectedRoutes[route]
          break
        }
      }

      // Проверяем, имеет ли пользователь необходимую роль
      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        console.log(`Access denied: user role ${user.role} not in required roles`, requiredRoles)
        toast({
          title: "Доступ запрещен",
          description: "У вас нет прав для доступа к этой странице",
          variant: "destructive",
        })
        router.push("/dashboard")
      }
    }
  }, [pathname, user, loading, router, toast])

  // Функция входа
  const login = async (username: string, password: string) => {
    try {
      setLoading(true)

      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ошибка авторизации")
      }

      // Создаем объект пользователя
      const userData: User = {
        id: data.id,
        username: data.username,
        role: data.role,
        token: data.token,
        hospital: data.hospital || undefined,
        assignedHospital: data.assignedHospital || undefined,
      }

      // Сохраняем данные пользователя в localStorage
      localStorage.setItem("user", JSON.stringify(userData))
      console.log("User data saved to localStorage:", userData)

      // Обновляем состояние
      setUser(userData)

      // Показываем уведомление об успешном входе
      toast({
        title: "Успешный вход",
        description: "Вы успешно вошли в систему",
      })
    } catch (err: any) {
      console.error("Login error:", err)
      toast({
        title: "Ошибка входа",
        description: err.message,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Функция выхода
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      localStorage.removeItem("user")
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Функция проверки авторизации
  const isAuthorized = (requiredRoles: UserRole[]) => {
    if (!user) return false
    return requiredRoles.includes(user.role)
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, isAuthorized }}>{children}</AuthContext.Provider>
}

