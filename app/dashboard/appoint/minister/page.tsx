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

export default function AppointMinister() {
  const router = useRouter()
  const [nickname, setNickname] = useState("")
  const [vk, setVk] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // This would be replaced with actual API call
    console.log("Appointing minister:", { nickname, vk })

    // Redirect back to the dashboard
    router.push("/dashboard")
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="max-w-md mx-auto">
        <Link href="/dashboard" className="flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Вернуться в личный кабинет
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              <CardTitle>Назначить министра здравоохранения</CardTitle>
            </div>
            <CardDescription>Назначение министра здравоохранения (9 ранг)</CardDescription>
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
                <Label htmlFor="vk">Ссылка ВКонтакте</Label>
                <Input
                  id="vk"
                  value={vk}
                  onChange={(e) => setVk(e.target.value)}
                  placeholder="vk.com/username"
                  required
                />
              </div>

              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-sm text-yellow-800">
                <p className="font-medium">Важно!</p>
                <p>
                  Назначая министра здравоохранения, вы даете ему доступ к управлению организацией. Убедитесь, что вы
                  доверяете этому человеку.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Назначить министра
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

