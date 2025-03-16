"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, SettingsIcon, Bell } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export default function UserSettingsPage() {
  const { toast } = useToast()

  // Account settings
  const [username, setUsername] = useState("user123")
  const [email, setEmail] = useState("user@example.com")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pointsAlerts, setPointsAlerts] = useState(true)
  const [warningAlerts, setWarningAlerts] = useState(true)
  const [taskAlerts, setTaskAlerts] = useState(true)

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords
    if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive",
      })
      return
    }

    // This would be replaced with actual API call
    console.log("Updating account:", { username, email, currentPassword, newPassword })

    toast({
      title: "Аккаунт обновлен",
      description: "Данные аккаунта успешно обновлены",
    })

    // Reset password fields
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleUpdateNotifications = () => {
    // This would be replaced with actual API call
    console.log("Updating notifications:", {
      emailNotifications,
      pointsAlerts,
      warningAlerts,
      taskAlerts,
    })

    toast({
      title: "Настройки уведомлений обновлены",
      description: "Ваши настройки уведомлений были успешно сохранены",
    })
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Вернуться в личный кабинет
        </Link>

        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="rounded-full bg-red-100 p-4">
            <SettingsIcon className="h-6 w-6 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Настройки</h1>
          <p className="text-gray-500 max-w-[700px]">Управление настройками аккаунта</p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Аккаунт</TabsTrigger>
            <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Настройки аккаунта</CardTitle>
                <CardDescription>Управление данными вашего аккаунта</CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdateAccount}>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="username">Имя пользователя</Label>
                      <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Электронная почта</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Изменение пароля</h3>

                    <div className="grid gap-2">
                      <Label htmlFor="current-password">Текущий пароль</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="new-password">Новый пароль</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Сохранить изменения
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-red-500" />
                  <CardTitle>Настройки уведомлений</CardTitle>
                </div>
                <CardDescription>Управление уведомлениями системы</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Уведомления по электронной почте</Label>
                      <p className="text-sm text-gray-500">Получать уведомления на электронную почту</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="points-alerts">Уведомления о баллах</Label>
                      <p className="text-sm text-gray-500">Получать уведомления при начислении баллов</p>
                    </div>
                    <Switch id="points-alerts" checked={pointsAlerts} onCheckedChange={setPointsAlerts} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="warning-alerts">Уведомления о выговорах</Label>
                      <p className="text-sm text-gray-500">Получать уведомления при получении выговоров</p>
                    </div>
                    <Switch id="warning-alerts" checked={warningAlerts} onCheckedChange={setWarningAlerts} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="task-alerts">Уведомления о заданиях</Label>
                      <p className="text-sm text-gray-500">Получать уведомления о статусе выполненных заданий</p>
                    </div>
                    <Switch id="task-alerts" checked={taskAlerts} onCheckedChange={setTaskAlerts} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleUpdateNotifications}>
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить настройки
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

