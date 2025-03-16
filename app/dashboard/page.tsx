"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserRound, Settings, LogOut, Shield, Users, Banknote, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeHospital, setActiveHospital] = useState("ls")
  const [teams, setTeams] = useState({
    ls: { leader: null, deputies: [] },
    lv: { leader: null, deputies: [] },
    minister: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          router.push("/login")
          return
        }

        // Загружаем данные о командах
        const teamsResponse = await fetch("/api/team")
        if (teamsResponse.ok) {
          const teamsData = await teamsResponse.json()
          setTeams(teamsData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, router])

  if (loading) {
    return <div className="container flex items-center justify-center min-h-screen">Загрузка...</div>
  }

  if (!user) {
    return null // Будет перенаправлено в AuthProvider
  }

  const getRoleDisplay = (role) => {
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

  const getHospitalName = (code) => {
    return code === "ls" ? "Los-Santos" : "Las-Venturas"
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <div className="rounded-full bg-red-100 p-4">
          <UserRound className="h-6 w-6 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Личный кабинет</h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
          Добро пожаловать в систему управления Министерства Здравоохранения
        </p>
        <div className="bg-gray-100 px-4 py-1 rounded-full">
          <span className="text-gray-800">{getRoleDisplay(user.role)}</span>
        </div>
        {user.hospital && user.hospital !== "both" && (
          <div className="bg-gray-100 px-4 py-1 rounded-full">
            <span className="text-gray-800">Больница {getHospitalName(user.hospital)}</span>
          </div>
        )}
      </div>

      {(user.role === "leader" || user.role === "deputy") && (
        <div className="flex justify-center mb-6">
          <Tabs value={activeHospital} onValueChange={setActiveHospital} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ls">Больница Los-Santos</TabsTrigger>
              <TabsTrigger value="lv">Больница Las-Venturas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="md:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Профиль</TabsTrigger>
              <TabsTrigger value="points">Баллы и выговоры</TabsTrigger>
              <TabsTrigger value="management">Управление</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Информация о пользователе</CardTitle>
                  <CardDescription>Ваши личные данные и статус в системе</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Имя пользователя</h3>
                      <p>{user.username}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Роль</h3>
                      <p>{getRoleDisplay(user.role)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">ID пользователя</h3>
                      <p>{user.id}</p>
                    </div>
                    {user.hospital && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Больница</h3>
                        <p>{user.hospital === "both" ? "Обе больницы" : getHospitalName(user.hospital)}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Link href="/dashboard/settings">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Настройки аккаунта
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={logout}>
                      <LogOut className="h-4 w-4" />
                      Выйти
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="points" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Баллы и выговоры</CardTitle>
                  <CardDescription>Ваши баллы и выговоры в системе</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Баллы</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-center text-gray-500">У вас пока нет баллов</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Выговоры</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-center text-gray-500">У вас пока нет выговоров</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="management" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Управление</CardTitle>
                  <CardDescription>Доступные функции управления</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Для администраторов */}
                    {(user.role === "main_supervisor" ||
                      user.role === "deputy_main_supervisor" ||
                      user.role === "supervisor") && (
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Панель администратора</h3>
                        <Link href="/dashboard/admin">
                          <Button>Перейти в панель администратора</Button>
                        </Link>
                      </div>
                    )}

                    {/* Для министра */}
                    {user.role === "minister" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Управление ценами</h3>
                          <Link href="/dashboard/minister/prices">
                            <Button variant="outline" className="flex items-center gap-2">
                              <Banknote className="h-4 w-4" />
                              Управление ценами
                            </Button>
                          </Link>
                        </div>

                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Управление выговорами</h3>
                          <Link href="/dashboard/minister/warnings">
                            <Button variant="outline" className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Управление выговорами
                            </Button>
                          </Link>
                        </div>

                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Система "Антиблат"</h3>
                          <Link href="/dashboard/antiblat/add">
                            <Button>Добавить в антиблат</Button>
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Для лидеров и заместителей */}
                    {(user.role === "leader" || user.role === "deputy") && (
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Управление</h3>
                        <div className="flex gap-2">
                          <Link href={`/dashboard/points?hospital=${activeHospital}`}>
                            <Button variant="outline">Управление баллами</Button>
                          </Link>
                          <Link href={`/dashboard/antiblat/add?hospital=${activeHospital}`}>
                            <Button>Добавить в антиблат</Button>
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Общая информация для всех */}
                    <div className="mt-4">
                      <Link href="/antiblat">
                        <Button variant="outline" className="w-full">
                          Просмотреть систему "Антиблат"
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-gray-500">Ваша роль</h3>
                <p className="font-medium">{getRoleDisplay(user.role)}</p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-gray-500">Руководство организации</h3>
                <div className="space-y-2 mt-2">
                  {teams.minister && (
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-red-100 p-1.5">
                        <Shield className="h-3 w-3 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{teams.minister.name}</p>
                        <p className="text-xs text-gray-500">Министр (9 ранг)</p>
                        {teams.minister.vk && (
                          <a
                            href={`https://${teams.minister.vk}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            {teams.minister.vk}
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {teams.ls.leader && (
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-red-100 p-1.5">
                        <Users className="h-3 w-3 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{teams.ls.leader.name}</p>
                        <p className="text-xs text-gray-500">Лидер Los-Santos (10 ранг)</p>
                        {teams.ls.leader.vk && (
                          <a
                            href={`https://${teams.ls.leader.vk}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            {teams.ls.leader.vk}
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {teams.lv.leader && (
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-red-100 p-1.5">
                        <Users className="h-3 w-3 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{teams.lv.leader.name}</p>
                        <p className="text-xs text-gray-500">Лидер Las-Venturas (10 ранг)</p>
                        {teams.lv.leader.vk && (
                          <a
                            href={`https://${teams.lv.leader.vk}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            {teams.lv.leader.vk}
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {!teams.minister && !teams.ls.leader && !teams.lv.leader && (
                    <p className="text-sm text-gray-500">Нет назначенного руководства</p>
                  )}
                </div>
              </div>

              {(user.role === "main_supervisor" ||
                user.role === "deputy_main_supervisor" ||
                user.role === "supervisor") && (
                <div className="pt-4 border-t">
                  <Link href="/dashboard/admin">
                    <Button className="w-full">Панель администратора</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

