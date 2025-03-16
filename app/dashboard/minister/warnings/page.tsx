"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export default function MinisterWarningsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()
  const [activeHospital, setActiveHospital] = useState("ls")
  const [teams, setTeams] = useState({
    ls: { leader: null, deputies: [] },
    lv: { leader: null, deputies: [] },
  })
  const [warnings, setWarnings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState("")
  const [warningReason, setWarningReason] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || user.role !== "minister") {
          router.push("/login")
          return
        }

        setLoading(true)

        // Загружаем данные о командах
        const teamsResponse = await fetch("/api/team")
        if (teamsResponse.ok) {
          const teamsData = await teamsResponse.json()
          setTeams({
            ls: { leader: teamsData.ls.leader, deputies: teamsData.ls.deputies },
            lv: { leader: teamsData.lv.leader, deputies: teamsData.lv.deputies },
          })
        }

        // Загружаем выговоры, выданные министром
        const warningsResponse = await fetch("/api/warnings?issuedBy=minister")
        if (warningsResponse.ok) {
          const warningsData = await warningsResponse.json()
          setWarnings(warningsData)
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
  }, [router, toast, user])

  const handleSubmitWarning = async (e) => {
    e.preventDefault()

    if (!selectedUser || !warningReason) {
      toast({
        title: "Ошибка",
        description: "Выберите сотрудника и укажите причину выговора",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      const [role, id] = selectedUser.split("-")
      let userInfo = null
      const hospital = activeHospital

      if (role === "leader") {
        userInfo = teams[activeHospital].leader
      } else if (role === "deputy") {
        userInfo = teams[activeHospital].deputies.find((d) => d.id.toString() === id)
      }

      if (!userInfo) {
        throw new Error("Пользователь не найден")
      }

      // Отправляем запрос на создание выговора
      const response = await fetch("/api/warnings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
          userRole: role,
          userHospital: hospital,
          userName: userInfo.name,
          reason: warningReason,
          issuedBy: "minister",
          issuedById: user.id,
          issuedByName: user.username,
        }),
      })

      if (!response.ok) {
        throw new Error("Ошибка при создании выговора")
      }

      const newWarning = await response.json()

      // Обновляем список выговоров
      setWarnings([...warnings, newWarning])

      // Сбрасываем форму
      setSelectedUser("")
      setWarningReason("")

      toast({
        title: "Успешно",
        description: "Выговор успешно выдан",
      })
    } catch (error) {
      console.error("Error creating warning:", error)
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось выдать выговор",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="container flex items-center justify-center min-h-screen">Загрузка...</div>
  }

  if (!user || user.role !== "minister") {
    return <div className="container flex items-center justify-center min-h-screen">Доступ запрещен</div>
  }

  const currentTeam = teams[activeHospital]

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24 mx-auto">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Вернуться в личный кабинет
        </Link>

        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="rounded-full bg-red-100 p-4">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Управление выговорами</h1>
          <p className="text-gray-500 max-w-[700px]">Выдача выговоров лидерам и заместителям</p>
        </div>

        <div className="flex justify-center mb-6">
          <Tabs value={activeHospital} onValueChange={setActiveHospital} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ls">Больница Los-Santos</TabsTrigger>
              <TabsTrigger value="lv">Больница Las-Venturas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Выдача выговора</CardTitle>
                <CardDescription>Выберите сотрудника и укажите причину</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitWarning} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-select">Выберите сотрудника</Label>
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите сотрудника" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentTeam.leader && (
                          <SelectItem value={`leader-${currentTeam.leader.id}`}>
                            {currentTeam.leader.name} (Лидер)
                          </SelectItem>
                        )}
                        {currentTeam.deputies.map((deputy) => (
                          <SelectItem key={deputy.id} value={`deputy-${deputy.id}`}>
                            {deputy.name} (Заместитель #{deputy.position})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="warning-reason">Причина выговора</Label>
                    <Textarea
                      id="warning-reason"
                      value={warningReason}
                      onChange={(e) => setWarningReason(e.target.value)}
                      placeholder="Укажите причину выговора"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting || !selectedUser || !warningReason}>
                    {submitting ? "Выдача..." : "Выдать выговор"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>История выговоров</CardTitle>
                <CardDescription>Выговоры, выданные вами</CardDescription>
              </CardHeader>
              <CardContent>
                {warnings.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Сотрудник</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead>Больница</TableHead>
                        <TableHead>Причина</TableHead>
                        <TableHead>Дата</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {warnings.map((warning) => (
                        <TableRow key={warning.id}>
                          <TableCell className="font-medium">{warning.userName}</TableCell>
                          <TableCell>
                            {warning.userRole === "leader"
                              ? "Лидер"
                              : warning.userRole === "deputy"
                                ? "Заместитель"
                                : warning.userRole}
                          </TableCell>
                          <TableCell>
                            {warning.userHospital === "ls"
                              ? "Los-Santos"
                              : warning.userHospital === "lv"
                                ? "Las-Venturas"
                                : warning.userHospital}
                          </TableCell>
                          <TableCell>{warning.reason}</TableCell>
                          <TableCell>{warning.createdAt}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center p-6 border rounded-lg bg-gray-50">
                    <p className="text-gray-500">Вы еще не выдавали выговоров</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

