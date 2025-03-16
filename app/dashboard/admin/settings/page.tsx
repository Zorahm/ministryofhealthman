"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, SettingsIcon, Shield, Lock, Bell } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const { toast } = useToast()

  // Account settings
  const [username, setUsername] = useState("admin")
  const [email, setEmail] = useState("admin@example.com")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [priceChangeAlerts, setPriceChangeAlerts] = useState(true)
  const [taskSubmissionAlerts, setTaskSubmissionAlerts] = useState(true)
  const [leadershipChangeAlerts, setLeadershipChangeAlerts] = useState(true)

  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState("30")

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
      priceChangeAlerts,
      taskSubmissionAlerts,
      leadershipChangeAlerts,
    })

    toast({
      title: "Настройки уведомлений обновлены",
      description: "Ваши настройки уведомлений были успешно сохранены",
    })
  }

  const handleUpdateSecurity = (e: React.FormEvent) => {
    e.preventDefault()

    // This would be replaced with actual API call
    console.log("Updating security settings:", {
      twoFactorAuth,
      sessionTimeout: Number.parseInt(sessionTimeout),
    })

    toast({
      title: "Настройки безопасности обновлены",
      description: "Ваши настройки безопасности были успешно сохранены",
    })
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard/admin" className="flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Вернуться в панель администратора
        </Link>

        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="rounded-full bg-blue-100 p-4">
            <SettingsIcon className="h-6 w-6 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Настройки</h1>
          <p className="text-gray-500 max-w-[700px]">Управление настройками аккаунта и системы</p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">Аккаунт</TabsTrigger>
            <TabsTrigger value="notifications">Уведомления</TabsTrigger>
            <TabsTrigger value="security">Безопасность</TabsTrigger>
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
                  <Bell className="h-5 w-5 text-blue-500" />
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
                      <Label htmlFor="price-alerts">Уведомления об изменении цен</Label>
                      <p className="text-sm text-gray-500">Получать уведомления при изменении цен</p>
                    </div>
                    <Switch id="price-alerts" checked={priceChangeAlerts} onCheckedChange={setPriceChangeAlerts} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="task-alerts">Уведомления о заданиях</Label>
                      <p className="text-sm text-gray-500">Получать уведомления при отправке заданий на проверку</p>
                    </div>
                    <Switch id="task-alerts" checked={taskSubmissionAlerts} onCheckedChange={setTaskSubmissionAlerts} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="leadership-alerts">Уведомления о смене руководства</Label>
                      <p className="text-sm text-gray-500">Получать уведомления при изменении состава руководства</p>
                    </div>
                    <Switch
                      id="leadership-alerts"
                      checked={leadershipChangeAlerts}
                      onCheckedChange={setLeadershipChangeAlerts}
                    />
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

          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <CardTitle>Настройки безопасности</CardTitle>
                </div>
                <CardDescription>Управление параметрами безопасности аккаунта</CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdateSecurity}>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="two-factor">Двухфакторная аутентификация</Label>
                        <p className="text-sm text-gray-500">
                          Повысьте безопасность аккаунта с помощью двухфакторной аутентификации
                        </p>
                      </div>
                      <Switch id="two-factor" checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                    </div>

                    <Separator />

                    <div className="grid gap-2">
                      <Label htmlFor="session-timeout">Тайм-аут сессии (минуты)</Label>
                      <p className="text-sm text-gray-500 mb-2">
                        Время бездействия, после которого произойдет автоматический выход из системы
                      </p>
                      <Input
                        id="session-timeout"
                        type="number"
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(e.target.value)}
                        min="5"
                        max="120"
                        required
                      />
                    </div>

                    <div className="pt-4">
                      <Button variant="outline" className="w-full" type="button">
                        <Lock className="h-4 w-4 mr-2" />
                        Журнал активности
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Сохранить настройки
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

