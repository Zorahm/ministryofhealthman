"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trophy, ArrowLeft, Upload, Info } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Mock task data
const taskData = {
  id: 1,
  title: "Обучение новичков",
  description: "Проведите обучение для 5 новых сотрудников и предоставьте доказательства.",
  detailedDescription: `
    <p>Для выполнения этого задания вам необходимо:</p>
    <ol>
      <li>Собрать группу из 5 новых сотрудников (ранг 1-3)</li>
      <li>Провести обучение по основным аспектам работы в Министерстве Здравоохранения</li>
      <li>Сделать скриншоты процесса обучения</li>
      <li>Составить краткий отчет о проведенном обучении</li>
    </ol>
    <p>Обучение должно включать следующие темы:</p>
    <ul>
      <li>Основные команды и их использование</li>
      <li>Правила поведения и субординация</li>
      <li>Процедуры лечения и оказания медицинской помощи</li>
      <li>Работа с медицинскими картами и страховками</li>
    </ul>
  `,
  points: 15,
  difficulty: "medium",
  requirements: [
    "Минимум 5 новых сотрудников",
    "Минимум 3 скриншота процесса обучения",
    "Отчет о проведенном обучении",
    "Список обученных сотрудников с их никами",
  ],
}

export default function SubmitTaskPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const taskId = params.id

  const [proofType, setProofType] = useState<"link" | "file">("link")
  const [proofLink, setProofLink] = useState("")
  const [comment, setComment] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate file upload if file type is selected
    if (proofType === "file") {
      setIsUploading(true)
      setTimeout(() => {
        setIsUploading(false)
        // This would be replaced with actual API call
        console.log("Submitting task:", {
          taskId,
          proofType,
          proof: "https://imgur.com/generated-link",
          comment,
        })

        // Redirect back to the points page
        router.push("/dashboard/points?tab=submitted")
      }, 2000)
    } else {
      // This would be replaced with actual API call
      console.log("Submitting task:", {
        taskId,
        proofType,
        proof: proofLink,
        comment,
      })

      // Redirect back to the points page
      router.push("/dashboard/points?tab=submitted")
    }
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard/points" className="flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Вернуться к списку заданий
        </Link>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{taskData.title}</CardTitle>
                    <CardDescription>Задание #{taskData.id}</CardDescription>
                  </div>
                  <Badge
                    className={
                      taskData.difficulty === "easy"
                        ? "bg-green-100 text-green-800"
                        : taskData.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {taskData.difficulty === "easy"
                      ? "Легкое"
                      : taskData.difficulty === "medium"
                        ? "Среднее"
                        : "Сложное"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Описание задания</h3>
                  <p className="text-gray-600">{taskData.description}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Подробная информация</h3>
                  <div
                    className="text-gray-600 text-sm space-y-2"
                    dangerouslySetInnerHTML={{ __html: taskData.detailedDescription }}
                  />
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Требования</h3>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    {taskData.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-sm flex items-start">
                  <Info className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-800">Важно!</p>
                    <p className="text-yellow-700">
                      Убедитесь, что ваши доказательства соответствуют всем требованиям задания. Неполные или
                      некачественные доказательства могут привести к отклонению задания.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Отправка задания</CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="font-medium">{taskData.points} баллов</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Тип доказательства</Label>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={proofType === "link" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setProofType("link")}
                      >
                        Ссылка
                      </Button>
                      <Button
                        type="button"
                        variant={proofType === "file" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setProofType("file")}
                      >
                        Файл
                      </Button>
                    </div>
                  </div>

                  {proofType === "link" ? (
                    <div className="space-y-2">
                      <Label htmlFor="proof-link">Ссылка на доказательство</Label>
                      <Input
                        id="proof-link"
                        value={proofLink}
                        onChange={(e) => setProofLink(e.target.value)}
                        placeholder="https://imgur.com/..."
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Вставьте ссылку на imgur, Google Drive или другой сервис с вашими скриншотами
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="proof-file">Загрузить файл</Label>
                      <div className="border-2 border-dashed rounded-md p-4 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">Перетащите файлы сюда или нажмите для выбора</p>
                        <Input id="proof-file" type="file" className="hidden" required={proofType === "file"} />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            document.getElementById("proof-file")?.click()
                          }}
                        >
                          Выбрать файл
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">Поддерживаемые форматы: JPG, PNG, PDF (до 10 МБ)</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="comment">Комментарий (необязательно)</Label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Дополнительная информация о выполненном задании..."
                      rows={3}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isUploading}>
                    {isUploading ? "Загрузка..." : "Отправить задание"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

