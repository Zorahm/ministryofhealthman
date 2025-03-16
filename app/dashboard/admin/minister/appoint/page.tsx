"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AppointMinisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [nickname, setNickname] = useState("")
  const [vk, setVk] = useState("")
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      // Подготавливаем данные для отправки
      const ministerData = {
        hospital: "both", // Министр работает на обе больницы
        role: "minister",
        name: nickname,
        vk,
        login,
        password,
      }

      // Отправляем запрос на сервер
      const response = await fetch("/api/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ministerData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Ошибка при назначении министра")
      }

      toast({
        title: "Успешно",
        description: "Министр успешно назначен",
      })

      // Перенаправляем на страницу администратора
      router.push("/dashboard/admin?tab=leaders")
    } catch (error: any) {
      console.error("Error appointing minister:", error)
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось назначить министра",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-24">
      <div className="max-w-md mx-auto">
        <Link href="/dashboard/admin" className="flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Вернуться в панель администратора
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <CardTitle>Назначить министра здравоохранения</CardTitle>
            </div>
            <CardDescription>Назначение министра здравоохранения (9 ранг)</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="nickname">Ник игрока</Label>
                <Input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Введите ник игрока"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="vk">Ссылка ВКонтакте</Label>
                <Input
                  id="vk"
                  value={vk}
                  onChange={(e) => setVk(e.target.value)}
                  placeholder="vk.com/username"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="login">Логин для входа</Label>
                <Input
                  id="login"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Введите логин"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Пароль для входа</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  required
                />
              </div>

              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-sm text-yellow-800">
                <p className="font-medium">Важно!</p>
                <p>
                  Назначая министра здравоохранения, вы даете ему доступ к управлению ценами и выдаче выговоров лидерам
                  обеих больниц. Убедитесь, что вы доверяете этому человеку.
                </p>
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Назначение..." : "Назначить министра"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

