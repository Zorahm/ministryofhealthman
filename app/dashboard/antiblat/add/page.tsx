"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

export default function AddAntiBlat() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const [nickname, setNickname] = useState("")
  const [rank, setRank] = useState("")
  const [vk, setVk] = useState("")
  const [reason, setReason] = useState("")
  const [reportLink, setReportLink] = useState("")
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

    if (!user) {
      toast({
        title: "Ошибка",
        description: "Вы не авторизованы",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      // Подготавливаем данные для отправки
      const antiblat = {
        hospital,
        nickname,
        rank,
        vk,
        reason,
        reportLink: reason === "report" ? reportLink : null,
        addedBy: user.role,
        addedById: user.id,
        addedByName: user.username,
      }

      // Отправляем запрос на сервер
      const response = await fetch("/api/antiblat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(antiblat),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Ошибка при добавлении в систему 'Антиблат'")
      }

      toast({
        title: "Успешно",
        description: "Сотрудник успешно добавлен в систему 'Антиблат'",
      })

      // Перенаправляем на страницу администратора или дашборда
      if (user.role === "main_supervisor" || user.role === "deputy_main_supervisor" || user.role === "supervisor") {
        router.push(`/dashboard/admin?tab=antiblat&hospital=${hospital}`)
      } else {
        router.push(`/dashboard?hospital=${hospital}`)
      }
    } catch (error: any) {
      console.error("Error adding to antiblat:", error)
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось добавить сотрудника в систему 'Антиблат'",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-24">
      <div className="max-w-md mx-auto">
        <Link href="/dashboard" className="flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Вернуться в личный кабинет
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              <CardTitle>Добавить в систему "Антиблат"</CardTitle>
            </div>
            <CardDescription>Добавление сотрудника 5+ ранга в систему</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hospital">Больница</Label>
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

              <div className="space-y-2">
                <Label htmlFor="nickname">Ник игрока</Label>
                <Input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Введите ник игрока"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rank">Ранг</Label>
                <Select value={rank} onValueChange={setRank} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите ранг" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="7">7</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vk">Ссылка ВКонтакте</Label>
                <Input
                  id="vk"
                  value={vk}
                  onChange={(e) => setVk(e.target.value)}
                  placeholder="vk.com/username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Причина назначения</Label>
                <Select value={reason} onValueChange={setReason} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите причину" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Обзвон</SelectItem>
                    <SelectItem value="trusted">Доверенное лицо</SelectItem>
                    <SelectItem value="report">Отчет</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {reason === "report" && (
                <div className="space-y-2">
                  <Label htmlFor="report-link">Ссылка на отчет</Label>
                  <Input
                    id="report-link"
                    value={reportLink}
                    onChange={(e) => setReportLink(e.target.value)}
                    placeholder="https://docs.google.com/..."
                    required
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Добавление..." : "Добавить сотрудника"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

