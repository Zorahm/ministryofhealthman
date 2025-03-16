"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Mock data for testing
const antiblat = {
  id: 1,
  nickname: "Player_123",
  rank: 7,
  vk: "vk.com/player123",
  reason: "call",
  reportLink: null,
  addedBy: "leader",
  addedById: 1,
  addedByName: "Иван Петров",
  createdAt: "2023-03-15",
}

export default function ViewAntiBlat({ params }: { params: { id: string } }) {
  const router = useRouter()
  const id = params.id

  // This would be replaced with actual API call to get the anti-blat entry

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard/admin" className="flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Вернуться в панель администратора
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <CardTitle>Просмотр записи "Антиблат"</CardTitle>
              </div>
              <Badge>ID: {id}</Badge>
            </div>
            <CardDescription>Подробная информация о записи в системе "Антиблат"</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Ник игрока</h3>
                <p className="font-medium">{antiblat.nickname}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Ранг</h3>
                <p className="font-medium">{antiblat.rank}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">ВКонтакте</h3>
                <a
                  href={`https://${antiblat.vk}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-500 hover:underline flex items-center"
                >
                  {antiblat.vk}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Причина назначения</h3>
                <p className="font-medium">
                  {antiblat.reason === "call" ? "Обзвон" : antiblat.reason === "trusted" ? "Доверенное лицо" : "Отчет"}
                </p>
              </div>

              {antiblat.reason === "report" && antiblat.reportLink && (
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Ссылка на отчет</h3>
                  <a
                    href={antiblat.reportLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-500 hover:underline flex items-center"
                  >
                    {antiblat.reportLink}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Информация о добавлении</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs text-gray-500">Добавил</h4>
                  <p className="font-medium">{antiblat.addedByName}</p>
                </div>

                <div>
                  <h4 className="text-xs text-gray-500">Роль</h4>
                  <p className="font-medium">
                    {antiblat.addedBy === "leader"
                      ? "Лидер"
                      : antiblat.addedBy === "minister"
                        ? "Министр"
                        : "Администратор"}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs text-gray-500">Дата добавления</h4>
                  <p className="font-medium">{antiblat.createdAt}</p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/dashboard/admin")}>
              Назад
            </Button>
            <div className="flex gap-2">
              <Link href={`/dashboard/admin/antiblat/edit/${id}`}>
                <Button variant="outline">Редактировать</Button>
              </Link>
              <Button variant="destructive">Удалить</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

