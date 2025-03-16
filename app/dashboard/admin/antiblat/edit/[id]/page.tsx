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
import { useRouter } from "next/navigation"

// Mock data for testing
const antiblat = {
  id: 1,
  nickname: "Player_123",
  rank: "7",
  vk: "vk.com/player123",
  reason: "call",
  reportLink: null,
  addedBy: "leader",
  addedById: 1,
  addedByName: "Иван Петров",
  createdAt: "2023-03-15",
}

export default function EditAntiBlat({ params }: { params: { id: string } }) {
  const router = useRouter()
  const id = params.id

  const [nickname, setNickname] = useState("")
  const [rank, setRank] = useState("")
  const [vk, setVk] = useState("")
  const [reason, setReason] = useState("")
  const [reportLink, setReportLink] = useState("")

  // This would be replaced with actual API call to get the anti-blat entry
  useEffect(() => {
    // Simulate API call
    setNickname(antiblat.nickname)
    setRank(antiblat.rank)
    setVk(antiblat.vk)
    setReason(antiblat.reason)
    setReportLink(antiblat.reportLink || "")
  }, [id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // This would be replaced with actual API call
    console.log("Updating anti-blat:", {
      id,
      nickname,
      rank,
      vk,
      reason,
      reportLink: reason === "report" ? reportLink : null,
    })

    // Redirect back to the anti-blat page
    router.push("/dashboard/admin")
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="max-w-md mx-auto">
        <Link href="/dashboard/admin" className="flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Вернуться в панель администратора
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <CardTitle>Редактировать запись "Антиблат"</CardTitle>
            </div>
            <CardDescription>Редактирование записи в системе "Антиблат"</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
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

            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/admin")}>
                Отмена
              </Button>
              <Button type="submit">Сохранить изменения</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

