"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, ExternalLink } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function PublicAntiBlat() {
  const { toast } = useToast()
  const [activeHospital, setActiveHospital] = useState("ls")
  const [antiblat, setAntiblat] = useState({ ls: [], lv: [] })
  const [loading, setLoading] = useState(true)

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Загружаем данные антиблат
        const antiblаtResponse = await fetch("/api/antiblat")
        if (antiblаtResponse.ok) {
          const antiblаtData = await antiblаtResponse.json()
          setAntiblat(antiblаtData)
        } else {
          throw new Error("Не удалось загрузить данные")
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
  }, [toast])

  if (loading) {
    return <div className="container flex items-center justify-center min-h-screen">Загрузка...</div>
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24 mx-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="rounded-full bg-red-100 p-4">
            <Shield className="h-6 w-6 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Система "Антиблат"</h1>
          <p className="text-gray-500 max-w-[700px]">
            Список сотрудников 5+ ранга, имеющих право на повышение в Министерстве Здравоохранения
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <Tabs value={activeHospital} onValueChange={setActiveHospital} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ls">Больница Los-Santos</TabsTrigger>
              <TabsTrigger value="lv">Больница Las-Venturas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Список сотрудников в системе "Антиблат"</CardTitle>
            <CardDescription>
              {activeHospital === "ls" ? "Больница Los-Santos" : "Больница Las-Venturas"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {antiblat[activeHospital]?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ник</TableHead>
                    <TableHead>Ранг</TableHead>
                    <TableHead>ВКонтакте</TableHead>
                    <TableHead>Причина</TableHead>
                    <TableHead>Добавлен</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {antiblat[activeHospital].map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.nickname}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{entry.rank}</Badge>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`https://${entry.vk}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center"
                        >
                          {entry.vk}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </TableCell>
                      <TableCell>
                        {entry.reason === "call" ? "Обзвон" : entry.reason === "trusted" ? "Доверенное лицо" : "Отчет"}
                      </TableCell>
                      <TableCell>{entry.createdAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-6 border rounded-lg bg-gray-50">
                <p className="text-gray-500">Нет записей в системе "Антиблат"</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-2">Информация о системе "Антиблат"</h3>
          <p className="text-gray-600 mb-4">
            Система "Антиблат" предназначена для учета сотрудников 5+ ранга, которые имеют право на повышение в
            Министерстве Здравоохранения. Сотрудники попадают в систему по одной из следующих причин:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>
              <span className="font-medium">Обзвон</span> - сотрудник прошел проверку по телефону
            </li>
            <li>
              <span className="font-medium">Доверенное лицо</span> - сотрудник является доверенным лицом руководства
            </li>
            <li>
              <span className="font-medium">Отчет</span> - сотрудник предоставил отчет о своей работе
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

