"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserRoundCog, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AppointSupervisorPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [nickname, setNickname] = useState("")
  const [type, setType] = useState("")
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [vk, setVk] = useState("")
  const [assignedHospital, setAssignedHospital] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      // Подготавливаем данные для отправки
      const supervisorData = {
        nickname,
        type,
        login,
        password,
        vk,
        assignedHospital,
      }

      // Отправляем запрос на сервер
      const response = await fetch("/api/supervisors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supervisorData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Ошибка при назначении следящего")
      }

      toast({
        title: "Успешно",
        description: "Следящий успешно назначен",
      })

      // Перенаправляем на страницу администратора
      router.push("/dashboard/admin?tab=leaders")
    } catch (error: any) {
      console.error("Error appointing supervisor:", error)
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось назначить следящего",
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
              <UserRoundCog className="h-5 w-5 text-blue-500" />
              <CardTitle>Назначить следящего</CardTitle>
            </div>
            <CardDescription>Назначение нового следящего для Министерства Здравоохранения</CardDescription>
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
                <Label htmlFor="type">Тип следящего</Label>
                <Select value={type} onValueChange={setType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deputy_main_supervisor">Заместитель главного следящего</SelectItem>
                    <SelectItem value="supervisor">Следящий</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="assignedHospital">Закрепить за больницей</Label>
                <Select value={assignedHospital} onValueChange={setAssignedHospital} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите больницу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Обе больницы</SelectItem>
                    <SelectItem value="ls">Los-Santos</SelectItem>
                    <SelectItem value="lv">Las-Venturas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="vk">ВКонтакте</Label>
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
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Назначение..." : "Назначить следящего"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

