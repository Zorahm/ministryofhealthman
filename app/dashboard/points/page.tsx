"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, ArrowLeft, XCircle, Upload } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Mock data for testing
const pointsHistory = [
  { id: 1, amount: 10, reason: "Набор персонала", date: "05.01.2023", status: "completed" },
  { id: 2, amount: 10, reason: "Проведение мероприятия", date: "10.02.2023", status: "completed" },
  { id: 3, amount: 5, reason: "Активная работа", date: "15.03.2023", status: "completed" },
  { id: 4, amount: 15, reason: "Задание: Обучение новичков", date: "20.03.2023", status: "pending" },
  { id: 5, amount: -5, reason: "Выговор: Нарушение субординации", date: "20.02.2023", status: "completed" },
]

const availableTasks = [
  {
    id: 1,
    title: "Обучение новичков",
    description: "Проведите обучение для 5 новых сотрудников и предоставьте доказательства.",
    points: 15,
    difficulty: "medium",
  },
  {
    id: 2,
    title: "Организация мероприятия",
    description: "Организуйте мероприятие для сотрудников и предоставьте отчет.",
    points: 20,
    difficulty: "hard",
  },
  {
    id: 3,
    title: "Набор персонала",
    description: "Наберите 3 новых сотрудника и проведите их обучение.",
    points: 15,
    difficulty: "medium",
  },
  {
    id: 4,
    title: "Проверка работы отделений",
    description: "Проведите проверку работы всех отделений и составьте отчет.",
    points: 10,
    difficulty: "easy",
  },
]

const submittedTasks = [
  {
    id: 1,
    taskId: 1,
    title: "Обучение новичков",
    submittedAt: "20.03.2023",
    status: "pending",
    proof: "https://imgur.com/gallery/example1",
  },
  {
    id: 2,
    taskId: 3,
    title: "Набор персонала",
    submittedAt: "15.02.2023",
    status: "approved",
    proof: "https://imgur.com/gallery/example2",
  },
  {
    id: 3,
    taskId: 2,
    title: "Организация мероприятия",
    submittedAt: "10.01.2023",
    status: "rejected",
    proof: "https://imgur.com/gallery/example3",
    rejectionReason: "Недостаточно доказательств проведения мероприятия.",
  },
]

export default function PointsPage() {
  const [selectedTab, setSelectedTab] = useState("history")

  // Calculate total points
  const totalPoints = pointsHistory
    .filter((item) => item.status === "completed")
    .reduce((sum, item) => sum + item.amount, 0)

  // Calculate pending points
  const pendingPoints = pointsHistory
    .filter((item) => item.status === "pending")
    .reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Вернуться в личный кабинет
        </Link>

        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="rounded-full bg-yellow-100 p-4">
            <Trophy className="h-6 w-6 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Система баллов</h1>
          <p className="text-gray-500 max-w-[700px]">
            Управляйте своими баллами, выполняйте задания и отслеживайте историю
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                <span className="text-3xl font-bold text-yellow-500">{totalPoints}</span>
                <span className="text-sm text-gray-500">Всего баллов</span>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                <span className="text-3xl font-bold text-blue-500">{pendingPoints}</span>
                <span className="text-sm text-gray-500">Ожидают подтверждения</span>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                <div className="w-full mb-2">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Прогресс до следующего уровня</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <span className="text-sm text-gray-500">Нужно еще 25 баллов</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history">История</TabsTrigger>
            <TabsTrigger value="tasks">Доступные задания</TabsTrigger>
            <TabsTrigger value="submitted">Отправленные задания</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>История баллов</CardTitle>
                <CardDescription>Полная история начисления и списания баллов</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pointsHistory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`rounded-full p-2 ${item.amount > 0 ? "bg-green-100" : "bg-red-100"}`}>
                          {item.amount > 0 ? (
                            <Trophy className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{item.reason}</p>
                          <p className="text-sm text-gray-500">{item.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${item.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                          {item.amount > 0 ? "+" : ""}
                          {item.amount}
                        </span>
                        {item.status === "pending" && (
                          <Badge variant="outline" className="ml-2">
                            Ожидает
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Доступные задания</CardTitle>
                <CardDescription>Выполняйте задания для получения баллов</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {availableTasks.map((task) => (
                    <Card key={task.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{task.title}</CardTitle>
                          <Badge
                            className={
                              task.difficulty === "easy"
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : task.difficulty === "medium"
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                  : "bg-red-100 text-red-800 hover:bg-red-200"
                            }
                          >
                            {task.difficulty === "easy"
                              ? "Легкое"
                              : task.difficulty === "medium"
                                ? "Среднее"
                                : "Сложное"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-500 mb-4">{task.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-medium">{task.points} баллов</span>
                          </div>
                          <Link href={`/dashboard/points/submit/${task.id}`}>
                            <Button size="sm">Выполнить</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submitted" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Отправленные задания</CardTitle>
                <CardDescription>Статус ваших отправленных заданий</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submittedTasks.map((task) => (
                    <Card key={task.id} className="overflow-hidden">
                      <CardHeader
                        className={`pb-2 ${
                          task.status === "approved"
                            ? "bg-green-50"
                            : task.status === "rejected"
                              ? "bg-red-50"
                              : "bg-blue-50"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{task.title}</CardTitle>
                          <Badge
                            className={
                              task.status === "approved"
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : task.status === "rejected"
                                  ? "bg-red-100 text-red-800 hover:bg-red-200"
                                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            }
                          >
                            {task.status === "approved"
                              ? "Одобрено"
                              : task.status === "rejected"
                                ? "Отклонено"
                                : "На рассмотрении"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500">Отправлено: {task.submittedAt}</span>
                          <a
                            href={task.proof}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline flex items-center"
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            Доказательство
                          </a>
                        </div>

                        {task.status === "rejected" && task.rejectionReason && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-md text-sm text-red-800">
                            <p className="font-medium">Причина отклонения:</p>
                            <p>{task.rejectionReason}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

