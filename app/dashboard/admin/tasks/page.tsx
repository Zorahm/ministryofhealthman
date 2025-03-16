"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock data for testing
const tasks = [
  {
    id: 1,
    title: "Обучение новичков",
    description: "Проведите обучение для 5 новых сотрудников и предоставьте доказательства.",
    points: 15,
    difficulty: "medium",
    active: true,
  },
  {
    id: 2,
    title: "Организация мероприятия",
    description: "Организуйте мероприятие для сотрудников и предоставьте отчет.",
    points: 20,
    difficulty: "hard",
    active: true,
  },
  {
    id: 3,
    title: "Набор персонала",
    description: "Наберите 3 новых сотрудника и проведите их обучение.",
    points: 15,
    difficulty: "medium",
    active: true,
  },
  {
    id: 4,
    title: "Проверка работы отделений",
    description: "Проведите проверку работы всех отделений и составьте отчет.",
    points: 10,
    difficulty: "easy",
    active: false,
  },
]

const submittedTasks = [
  {
    id: 1,
    taskId: 1,
    title: "Обучение новичков",
    submittedBy: "Иван Петров (Лидер)",
    submittedAt: "20.03.2023",
    status: "pending",
    proof: "https://imgur.com/gallery/example1",
    comment: "Провел обучение для 5 новичков, все материалы в приложенных скриншотах.",
  },
  {
    id: 2,
    taskId: 3,
    title: "Набор персонала",
    submittedBy: "Елена Смирнова (Заместитель #1)",
    submittedAt: "15.02.2023",
    status: "approved",
    proof: "https://imgur.com/gallery/example2",
    comment: "Набрал 3 новых сотрудника и провел их обучение.",
  },
  {
    id: 3,
    taskId: 2,
    title: "Организация мероприятия",
    submittedBy: "Дмитрий Соколов (Министр)",
    submittedAt: "10.01.2023",
    status: "rejected",
    proof: "https://imgur.com/gallery/example3",
    comment: "Организовал мероприятие для всех сотрудников.",
    rejectionReason: "Недостаточно доказательств проведения мероприятия.",
  },
]

export default function AdminTasksPage() {
  const [selectedTab, setSelectedTab] = useState("tasks")
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  // New task form state
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskDetailedDescription, setTaskDetailedDescription] = useState("")
  const [taskPoints, setTaskPoints] = useState("")
  const [taskDifficulty, setTaskDifficulty] = useState("")
  const [taskRequirements, setTaskRequirements] = useState("")

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    // This would be replaced with actual API call
    console.log("Adding task:", {
      title: taskTitle,
      description: taskDescription,
      detailedDescription: taskDetailedDescription,
      points: Number.parseInt(taskPoints),
      difficulty: taskDifficulty,
      requirements: taskRequirements.split("\n"),
    })

    // Reset form and close dialog
    setTaskTitle("")
    setTaskDescription("")
    setTaskDetailedDescription("")
    setTaskPoints("")
    setTaskDifficulty("")
    setTaskRequirements("")
    setIsAddTaskOpen(false)
  }

  const handleApproveTask = (taskId: number) => {
    // This would be replaced with actual API call
    console.log("Approving task:", taskId)
  }

  const openRejectDialog = (taskId: number) => {
    setSelectedTaskId(taskId)
    setIsRejectDialogOpen(true)
  }

  const handleRejectTask = () => {
    if (!selectedTaskId) return

    // This would be replaced with actual API call
    console.log("Rejecting task:", { taskId: selectedTaskId, reason: rejectionReason })

    // Reset state and close dialog
    setSelectedTaskId(null)
    setRejectionReason("")
    setIsRejectDialogOpen(false)
  }

  return (
    <div className="container px-4 py-12 md:px-6">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard/admin" className="flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Вернуться в панель администратора
        </Link>

        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Управление заданиями</h1>
          <p className="text-gray-500 max-w-[700px]">Создавайте новые задания и управляйте отправленными заданиями</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks">Задания</TabsTrigger>
            <TabsTrigger value="submitted">Отправленные задания</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Список заданий</h2>
              <Button onClick={() => setIsAddTaskOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить задание
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Название</th>
                        <th className="text-left py-3 px-2">Сложность</th>
                        <th className="text-center py-3 px-2">Баллы</th>
                        <th className="text-center py-3 px-2">Статус</th>
                        <th className="text-right py-3 px-2">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task.id} className="border-b">
                          <td className="py-3 px-2">
                            <div>
                              <p className="font-medium">{task.title}</p>
                              <p className="text-sm text-gray-500 truncate max-w-xs">{task.description}</p>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <Badge
                              className={
                                task.difficulty === "easy"
                                  ? "bg-green-100 text-green-800"
                                  : task.difficulty === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {task.difficulty === "easy"
                                ? "Легкое"
                                : task.difficulty === "medium"
                                  ? "Среднее"
                                  : "Сложное"}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className="font-medium">{task.points}</span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <Badge variant={task.active ? "default" : "outline"}>
                              {task.active ? "Активно" : "Неактивно"}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <Button variant="outline" size="sm" className="mr-2">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submitted" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Отправленные задания</CardTitle>
                <CardDescription>Проверьте и оцените отправленные задания</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {submittedTasks.map((task) => (
                    <Card
                      key={task.id}
                      className={`overflow-hidden ${
                        task.status === "pending"
                          ? "border-blue-200"
                          : task.status === "approved"
                            ? "border-green-200"
                            : "border-red-200"
                      }`}
                    >
                      <CardHeader
                        className={`pb-2 ${
                          task.status === "pending"
                            ? "bg-blue-50"
                            : task.status === "approved"
                              ? "bg-green-50"
                              : "bg-red-50"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-lg">{task.title}</CardTitle>
                            <CardDescription>
                              Отправлено: {task.submittedBy} • {task.submittedAt}
                            </CardDescription>
                          </div>
                          <Badge
                            className={
                              task.status === "pending"
                                ? "bg-blue-100 text-blue-800"
                                : task.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {task.status === "pending"
                              ? "На рассмотрении"
                              : task.status === "approved"
                                ? "Одобрено"
                                : "Отклонено"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Комментарий:</p>
                            <p className="text-sm">{task.comment}</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500 mb-1">Доказательство:</p>
                            <a
                              href={task.proof}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-500 hover:underline"
                            >
                              {task.proof}
                            </a>
                          </div>

                          {task.status === "rejected" && task.rejectionReason && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                              <p className="text-sm text-gray-500 mb-1">Причина отклонения:</p>
                              <p className="text-sm">{task.rejectionReason}</p>
                            </div>
                          )}

                          {task.status === "pending" && (
                            <div className="flex justify-end space-x-2 mt-2">
                              <Button variant="outline" size="sm" onClick={() => openRejectDialog(task.id)}>
                                <XCircle className="h-4 w-4 mr-1" />
                                Отклонить
                              </Button>
                              <Button variant="default" size="sm" onClick={() => handleApproveTask(task.id)}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Одобрить
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Task Dialog */}
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Добавить новое задание</DialogTitle>
              <DialogDescription>Создайте новое задание для лидеров и заместителей</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddTask}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Название задания</Label>
                  <Input
                    id="title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Введите название задания"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Краткое описание</Label>
                  <Textarea
                    id="description"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Введите краткое описание задания"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="detailed-description">Подробное описание</Label>
                  <Textarea
                    id="detailed-description"
                    value={taskDetailedDescription}
                    onChange={(e) => setTaskDetailedDescription(e.target.value)}
                    placeholder="Введите подробное описание задания (можно использовать HTML)"
                    rows={5}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="points">Количество баллов</Label>
                    <Input
                      id="points"
                      type="number"
                      value={taskPoints}
                      onChange={(e) => setTaskPoints(e.target.value)}
                      placeholder="Введите количество баллов"
                      min="1"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="difficulty">Сложность</Label>
                    <Select value={taskDifficulty} onValueChange={setTaskDifficulty} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите сложность" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Легкое</SelectItem>
                        <SelectItem value="medium">Среднее</SelectItem>
                        <SelectItem value="hard">Сложное</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="requirements">Требования (каждое с новой строки)</Label>
                  <Textarea
                    id="requirements"
                    value={taskRequirements}
                    onChange={(e) => setTaskRequirements(e.target.value)}
                    placeholder="Введите требования, каждое с новой строки"
                    rows={3}
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">Добавить задание</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Reject Task Dialog */}
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Отклонить задание</DialogTitle>
              <DialogDescription>Укажите причину отклонения задания</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="rejection-reason">Причина отклонения</Label>
                <Textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Введите причину отклонения задания"
                  rows={3}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                Отмена
              </Button>
              <Button type="button" variant="destructive" onClick={handleRejectTask} disabled={!rejectionReason.trim()}>
                Отклонить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

