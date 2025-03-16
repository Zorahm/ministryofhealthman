"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Users, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function AppointLeaderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [nickname, setNickname] = useState("")
  const [vk, setVk] = useState("")
  const [email, setEmail] = useState("")
  const [discord, setDiscord] = useState("")
  const [forumLink, setForumLink] = useState("")
  const [goal, setGoal] = useState("")
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [hospital, setHospital] = useState(searchParams.get("hospital") || "ls")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Обновляем больницу при изменении параметров URL
    const hospitalParam = searchParams.get("hospital")
    if (hospitalParam && ["ls", "lv"].includes(hospitalParam)) {
      setHospital(hospitalParam)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      // Подготавливаем данные для отправки
      const leaderData = {
        nickname,
        vk,
        email,
        discord,
        forumLink,
        goal,
        login,
        password,
        hospital,
      }

      // Отправляем запрос на сервер
      const response = await fetch("/api/leaders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leaderData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Ошибка при назначении лидера")
      }

      toast({
        title: "Успешно",
        description: "Лидер успешно назначен",
      })

      // Перенаправляем на страницу администратора
      router.push(`/dashboard/admin?tab=leaders&hospital=${hospital}`)
    } catch (error: any) {
      console.error("Error appointing leader:", error)
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось назначить лидера",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-24">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard/admin" className="flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Вернуться в панель администратора
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <CardTitle>Назначить лидера</CardTitle>
            </div>
            <CardDescription>Назначение нового лидера Министерства Здравоохранения</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertTitle className="text-yellow-800">Внимание!</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  Назначение нового лидера приведет к сбросу всей статистики предыдущего лидера. Это действие нельзя
                  отменить.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="font-medium">Выберите больницу</h3>
                <Select value={hospital} onValueChange={setHospital} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите больницу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ls">Los-Santos</SelectItem>
                    <SelectItem value="lv">Las-Venturas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Информация о лидере</h3>

                <div className="grid gap-4">
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
                    <Label htmlFor="email">Электронная почта</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@mail.com"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="discord">Discord</Label>
                    <Input
                      id="discord"
                      value={discord}
                      onChange={(e) => setDiscord(e.target.value)}
                      placeholder="username#0000"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="forum">Ссылка на форумный аккаунт</Label>
                    <Input
                      id="forum"
                      value={forumLink}
                      onChange={(e) => setForumLink(e.target.value)}
                      placeholder="forum.arizona-rp.com/user/username"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="goal">Цель лидерства</Label>
                    <Textarea
                      id="goal"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="Опишите цели лидерства"
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Данные для входа в личный кабинет</h3>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="login">Логин</Label>
                    <Input
                      id="login"
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      placeholder="Введите логин"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Введите пароль"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/admin")}>
                Отмена
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Назначение..." : "Назначить лидера"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

