"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Trophy, UserRoundCog, Shield, Users, UserPlus, Settings, ListChecks } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"

export default function AdminDashboardPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [selectedUser, setSelectedUser] = useState("")
  const [pointAmount, setPointAmount] = useState("")
  const [pointReason, setPointReason] = useState("")
  const [warningReason, setWarningReason] = useState("")
  const [warningTarget, setWarningTarget] = useState("")
  const [priceRequests, setPriceRequests] = useState([])
  const [teams, setTeams] = useState({
    ls: { leader: null, deputies: [] },
    lv: { leader: null, deputies: [] },
    minister: null,
  })
  const [supervisors, setSupervisors] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeHospital, setActiveHospital] = useState("ls")
  const [antiblat, setAntiblat] = useState({ ls: [], lv: [] })

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Проверяем права доступа
        if (!user || !["main_supervisor", "deputy_main_supervisor", "supervisor"].includes(user.role)) {
          console.log("User not authorized for admin panel")
          return
        }

        console.log("Loading admin data")
        setLoading(true)

        // Загружаем запросы на изменение цен
        const priceResponse = await fetch("/api/prices?requests=true")
        if (priceResponse.ok) {
          const priceData = await priceResponse.json()
          setPriceRequests(priceData)
        }

        // Загружаем данные о командах
        const teamResponse = await fetch("/api/team")
        if (teamResponse.ok) {
          const teamData = await teamResponse.json()
          setTeams(teamData)
        }

        // Загружаем данные о следящих
        const supervisorsResponse = await fetch("/api/supervisors")
        if (supervisorsResponse.ok) {
          const supervisorsData = await supervisorsResponse.json()
          setSupervisors(supervisorsData)
        }

        // Загружаем данные антиблат
        const antiblаtResponse = await fetch("/api/antiblat")
        if (antiblаtResponse.ok) {
          const antiblаtData = await antiblаtResponse.json()
          setAntiblat(antiblаtData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, toast])

  const handleAddPoints = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      // Отправляем запрос на добавление баллов
      const response = await fetch("/api/points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.split("-")[1],
          type: "point",
          amount: Number.parseInt(pointAmount),
          reason: pointReason,
          addedBy: user.id,
          addedByName: user.username,
        }),
      })

      if (!response.ok) {
        throw new Error("Не удалось добавить баллы")
      }

      toast({
        title: "Баллы добавлены",
        description: "Баллы успешно добавлены пользователю",
      })

      // Сбрасываем форму
      setPointAmount("")
      setPointReason("")
      setSelectedUser("")
    } catch (error) {
      console.error("Error adding points:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось добавить баллы",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddWarning = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      // Отправляем запрос на добавление выговора
      const response = await fetch("/api/warnings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.split("-")[1],
          userRole: warningTarget,
          reason: warningReason,
          issuedBy: user.role,
          issuedById: user.id,
          issuedByName: user.username,
        }),
      })

      if (!response.ok) {
        throw new Error("Не удалось добавить выговор")
      }

      toast({
        title: "Выговор добавлен",
        description: "Выговор успешно добавлен пользователю",
      })

      // Сбрасываем форму
      setWarningReason("")
      setWarningTarget("")
      setSelectedUser("")
    } catch (error) {
      console.error("Error adding warning:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось добавить выговор",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAntiblat = async (id: number, hospital: string) => {
    try {
      setLoading(true)

      const response = await fetch(`/api/antiblat?id=${id}&hospital=${hospital}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Ошибка при удалении записи")
      }

      // Обновляем список после удаления
      const updatedAntiblat = { ...antiblat }
      updatedAntiblat[hospital] = updatedAntiblat[hospital].filter((entry) => entry.id !== id)
      setAntiblat(updatedAntiblat)

      toast({
        title: "Успешно",
        description: "Запись успешно удалена из системы 'Антиблат'",
      })
    } catch (error) {
      console.error("Error deleting antiblat entry:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить запись",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container flex items-center justify-center min-h-screen">Загрузка...</div>
  }

  if (!user || !["main_supervisor", "deputy_main_supervisor", "supervisor"].includes(user.role)) {
    return <div className="container flex items-center justify-center min-h-screen">Доступ запрещен</div>
  }

  const adminRole = user.role
  const currentTeam = {
    ...teams[activeHospital],
    minister: teams.minister,
  }

  // Фильтруем следящих по назначенной больнице
  const currentSupervisors = supervisors.filter(
    (s) => s.assignedHospital === activeHospital || s.assignedHospital === "both",
  )

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <div className="rounded-full bg-blue-100 p-4">
          <UserRoundCog className="h-6 w-6 text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Панель администратора</h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">Управление Министерством Здравоохранения</p>
        <Badge variant="outline" className="px-4 py-1 text-base">
          {adminRole === "main_supervisor"
            ? "Главный следящий МЗ"
            : adminRole === "deputy_main_supervisor"
              ? "Заместитель главного следящего"
              : adminRole === "supervisor"
                ? "Следящий"
                : "Администратор"}
        </Badge>
        {user.assignedHospital && user.assignedHospital !== "both" && (
          <Badge variant="outline" className="px-4 py-1 text-base">
            Больница {user.assignedHospital === "ls" ? "Los-Santos" : "Las-Venturas"}
          </Badge>
        )}
      </div>

      <div className="flex justify-center mb-6">
        <Tabs value={activeHospital} onValueChange={setActiveHospital} className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ls">Больница Los-Santos</TabsTrigger>
            <TabsTrigger value="lv">Больница Las-Venturas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="md:col-span-2">
          <Tabs defaultValue="points" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="points">Баллы</TabsTrigger>
              <TabsTrigger value="warnings">Выговоры</TabsTrigger>
              <TabsTrigger value="antiblat">Антиблат</TabsTrigger>
              {(adminRole === "main_supervisor" || adminRole === "deputy_main_supervisor") && (
                <TabsTrigger value="leaders">Лидеры</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="points" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center">
                  <div className="mr-4 rounded-full bg-yellow-100 p-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <CardTitle>Выдача баллов</CardTitle>
                    <CardDescription>Выдача баллов лидерам и заместителям</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddPoints} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="user-select">Выберите пользователя</Label>
                      <Select value={selectedUser} onValueChange={setSelectedUser}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите пользователя" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentTeam.leader && (
                            <SelectItem value={`leader-${currentTeam.leader.id}`}>
                              {currentTeam.leader.name} (Лидер)
                            </SelectItem>
                          )}
                          {currentTeam.minister && (
                            <SelectItem value={`minister-${currentTeam.minister.id}`}>
                              {currentTeam.minister.name} (Министр)
                            </SelectItem>
                          )}
                          {currentTeam.deputies.map((deputy: any) => (
                            <SelectItem key={deputy.id} value={`deputy-${deputy.id}`}>
                              {deputy.name} (Заместитель #{deputy.position})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="point-amount">Количество баллов</Label>
                      <Input
                        id="point-amount"
                        type="number"
                        value={pointAmount}
                        onChange={(e) => setPointAmount(e.target.value)}
                        min="1"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="point-reason">Причина</Label>
                      <Textarea
                        id="point-reason"
                        value={pointReason}
                        onChange={(e) => setPointReason(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading || !selectedUser}>
                      {loading ? "Выдача..." : "Выдать баллы"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="warnings" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center">
                  <div className="mr-4 rounded-full bg-red-100 p-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <CardTitle>Выдача выговоров</CardTitle>
                    <CardDescription>Выдача выговоров сотрудникам</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddWarning} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="warning-target">Выберите цель</Label>
                      <Select value={warningTarget} onValueChange={setWarningTarget}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите цель" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="leader">Лидер</SelectItem>
                          <SelectItem value="minister">Министр</SelectItem>
                          <SelectItem value="deputy">Заместители</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {warningTarget && (
                      <div className="grid gap-2">
                        <Label htmlFor="user-select-warning">Выберите пользователя</Label>
                        <Select value={selectedUser} onValueChange={setSelectedUser}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите пользователя" />
                          </SelectTrigger>
                          <SelectContent>
                            {warningTarget === "leader" && currentTeam.leader && (
                              <SelectItem value={`leader-${currentTeam.leader.id}`}>
                                {currentTeam.leader.name}
                              </SelectItem>
                            )}
                            {warningTarget === "minister" && currentTeam.minister && (
                              <SelectItem value={`minister-${currentTeam.minister.id}`}>
                                {currentTeam.minister.name}
                              </SelectItem>
                            )}
                            {warningTarget === "deputy" &&
                              currentTeam.deputies.map((deputy: any) => (
                                <SelectItem key={deputy.id} value={`deputy-${deputy.id}`}>
                                  {deputy.name} (Заместитель #{deputy.position})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="grid gap-2">
                      <Label htmlFor="warning-reason">Причина выговора</Label>
                      <Textarea
                        id="warning-reason"
                        value={warningReason}
                        onChange={(e) => setWarningReason(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading || !warningTarget || !selectedUser}>
                      {loading ? "Выдача..." : "Выдать выговор"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="antiblat" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center">
                  <div className="mr-4 rounded-full bg-blue-100 p-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle>Система "Антиблат"</CardTitle>
                    <CardDescription>Просмотр и редактирование системы "Антиблат"</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Список сотрудников в системе</h3>
                      <Link href={`/dashboard/admin/antiblat/add?hospital=${activeHospital}`}>
                        <Button>Добавить сотрудника</Button>
                      </Link>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2">Ник</th>
                            <th className="text-left py-3 px-2">Ранг</th>
                            <th className="text-left py-3 px-2">ВК</th>
                            <th className="text-left py-3 px-2">Причина назначения</th>
                            <th className="text-left py-3 px-2">Добавил</th>
                            <th className="text-right py-3 px-2">Действия</th>
                          </tr>
                        </thead>
                        <tbody>
                          {antiblat[activeHospital]?.map((entry: any) => (
                            <tr key={entry.id} className="border-b">
                              <td className="py-3 px-2">{entry.nickname}</td>
                              <td className="py-3 px-2">{entry.rank}</td>
                              <td className="py-3 px-2">
                                <a
                                  href={`https://${entry.vk}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  {entry.vk}
                                </a>
                              </td>
                              <td className="py-3 px-2">
                                {entry.reason === "call"
                                  ? "Обзвон"
                                  : entry.reason === "trusted"
                                    ? "Доверенное лицо"
                                    : "Отчет"}
                              </td>
                              <td className="py-3 px-2">{entry.addedByName}</td>
                              <td className="py-3 px-2 text-right">
                                <Link href={`/dashboard/admin/antiblat/edit/${entry.id}?hospital=${activeHospital}`}>
                                  <Button variant="outline" size="sm" className="mr-2">
                                    Изменить
                                  </Button>
                                </Link>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteAntiblat(entry.id, activeHospital)}
                                  disabled={loading}
                                >
                                  Удалить
                                </Button>
                              </td>
                            </tr>
                          ))}
                          {(!antiblat[activeHospital] || antiblat[activeHospital].length === 0) && (
                            <tr>
                              <td colSpan={6} className="py-4 text-center text-gray-500">
                                Нет записей в системе "Антиблат"
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {(adminRole === "main_supervisor" || adminRole === "deputy_main_supervisor") && (
              <TabsContent value="leaders" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center">
                    <div className="mr-4 rounded-full bg-green-100 p-2">
                      <Users className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <CardTitle>Управление лидерами</CardTitle>
                      <CardDescription>Назначение и управление лидерами</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Текущий лидер</h3>
                        <Link href={`/dashboard/admin/leaders/appoint?hospital=${activeHospital}`}>
                          <Button>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Назначить нового лидера
                          </Button>
                        </Link>
                      </div>

                      {currentTeam.leader ? (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{currentTeam.leader.name}</CardTitle>
                            <CardDescription>Назначен: {currentTeam.leader.appointedAt}</CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium text-gray-500">ВКонтакте:</p>
                                <a
                                  href={`https://${currentTeam.leader.vk}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  {currentTeam.leader.vk}
                                </a>
                              </div>
                              {currentTeam.leader.email && (
                                <div>
                                  <p className="font-medium text-gray-500">Почта:</p>
                                  <p>{currentTeam.leader.email}</p>
                                </div>
                              )}
                              {currentTeam.leader.discord && (
                                <div>
                                  <p className="font-medium text-gray-500">Discord:</p>
                                  <p>{currentTeam.leader.discord}</p>
                                </div>
                              )}
                              {currentTeam.leader.forumLink && (
                                <div>
                                  <p className="font-medium text-gray-500">Форум:</p>
                                  <a
                                    href={currentTeam.leader.forumLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                  >
                                    {currentTeam.leader.forumLink}
                                  </a>
                                </div>
                              )}
                            </div>
                            <div className="mt-4 pt-4 border-t">
                              <p className="font-medium text-gray-500">Цель лидерства:</p>
                              <p className="text-sm">{currentTeam.leader.goal || "Не указана"}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="text-center p-6 border rounded-lg bg-gray-50">
                          <p className="text-gray-500">Лидер не назначен</p>
                        </div>
                      )}

                      <div className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">Министр здравоохранения</h3>
                          <Link href="/dashboard/admin/minister/appoint">
                            <Button>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Назначить министра
                            </Button>
                          </Link>
                        </div>

                        {currentTeam.minister ? (
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">{currentTeam.minister.name}</CardTitle>
                              <CardDescription>Назначен: {currentTeam.minister.appointedAt}</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="font-medium text-gray-500">ВКонтакте:</p>
                                  <a
                                    href={`https://${currentTeam.minister.vk}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                  >
                                    {currentTeam.minister.vk}
                                  </a>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-500">Больницы:</p>
                                  <p className="text-sm">Обе больницы (Los-Santos и Las-Venturas)</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <div className="text-center p-6 border rounded-lg bg-gray-50">
                            <p className="text-gray-500">Министр не назначен</p>
                          </div>
                        )}
                      </div>

                      {adminRole === "main_supervisor" && (
                        <div className="mt-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Следящие</h3>
                            <Link href="/dashboard/admin/supervisors/appoint">
                              <Button>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Назначить следящего
                              </Button>
                            </Link>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            {currentSupervisors.length > 0 ? (
                              currentSupervisors.map((supervisor: any) => (
                                <Card key={supervisor.id}>
                                  <CardHeader className="pb-2">
                                    <div className="flex justify-between">
                                      <CardTitle className="text-base">{supervisor.nickname}</CardTitle>
                                      <Badge>
                                        {supervisor.type === "deputy_main_supervisor" ? "Заместитель ГС" : "Следящий"}
                                      </Badge>
                                    </div>
                                    <CardDescription>Назначен: {supervisor.createdAt}</CardDescription>
                                  </CardHeader>
                                  <CardContent className="pb-2">
                                    <div className="flex justify-between">
                                      <div>
                                        <p className="text-sm text-gray-500">Логин: {supervisor.login}</p>
                                        {supervisor.vk && (
                                          <a
                                            href={`https://${supervisor.vk}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-500 hover:underline"
                                          >
                                            {supervisor.vk}
                                          </a>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1">
                                          Закреплен за:{" "}
                                          {supervisor.assignedHospital === "both"
                                            ? "Обеими больницами"
                                            : supervisor.assignedHospital === "ls"
                                              ? "Los-Santos"
                                              : "Las-Venturas"}
                                        </p>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                          Изменить
                                        </Button>
                                        <Button variant="destructive" size="sm">
                                          Удалить
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))
                            ) : (
                              <div className="col-span-2 text-center p-6 border rounded-lg bg-gray-50">
                                <p className="text-gray-500">Следящие не назначены</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>

          <div className="flex justify-center mt-8">
            <Link href={`/dashboard/admin/tasks?hospital=${activeHospital}`}>
              <Button variant="outline" className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                Управление заданиями
              </Button>
            </Link>
          </div>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-gray-500">Ваша роль</h3>
                <p className="font-medium">
                  {adminRole === "main_supervisor"
                    ? "Главный следящий МЗ"
                    : adminRole === "deputy_main_supervisor"
                      ? "Заместитель главного следящего"
                      : adminRole === "supervisor"
                        ? "Следящий"
                        : "Администратор"}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-gray-500">Команда администрации</h3>
                <div className="space-y-2 mt-2">
                  {currentSupervisors.length > 0 ? (
                    currentSupervisors.map((supervisor: any) => (
                      <div key={supervisor.id} className="flex items-center gap-2">
                        <div className="rounded-full bg-blue-100 p-1.5">
                          <Shield className="h-3 w-3 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{supervisor.nickname}</p>
                          <p className="text-xs text-gray-500">
                            {supervisor.type === "main_supervisor"
                              ? "Главный следящий"
                              : supervisor.type === "deputy_main_supervisor"
                                ? "Заместитель главного следящего"
                                : "Следящий"}
                          </p>
                          {supervisor.vk && (
                            <a
                              href={`https://${supervisor.vk}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-500 hover:underline"
                            >
                              {supervisor.vk}
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Нет назначенных администраторов</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm text-gray-500">Руководство организации</h3>
                <div className="space-y-2 mt-2">
                  {currentTeam.leader && (
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-red-100 p-1.5">
                        <Users className="h-3 w-3 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{currentTeam.leader.name}</p>
                        <p className="text-xs text-gray-500">Лидер (10 ранг)</p>
                        {currentTeam.leader.vk && (
                          <a
                            href={`https://${currentTeam.leader.vk}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            {currentTeam.leader.vk}
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {currentTeam.minister && (
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-red-100 p-1.5">
                        <Shield className="h-3 w-3 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{currentTeam.minister.name}</p>
                        <p className="text-xs text-gray-500">Министр (9 ранг)</p>
                        {currentTeam.minister.vk && (
                          <a
                            href={`https://${currentTeam.minister.vk}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            {currentTeam.minister.vk}
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {currentTeam.deputies.map((deputy: any) => (
                    <div key={deputy.id} className="flex items-center gap-2">
                      <div className="rounded-full bg-red-100 p-1.5">
                        <UserPlus className="h-3 w-3 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{deputy.name}</p>
                        <p className="text-xs text-gray-500">Заместитель #{deputy.position} (9 ранг)</p>
                        {deputy.vk && (
                          <a
                            href={`https://${deputy.vk}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            {deputy.vk}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}

                  {!currentTeam.leader && !currentTeam.minister && currentTeam.deputies.length === 0 && (
                    <p className="text-sm text-gray-500">Нет назначенного руководства</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Link href="/dashboard/admin/settings">
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Настройки
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

