"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, PencilIcon, Banknote } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export default function PricesPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editedPrices, setEditedPrices] = useState<Record<number, number>>({})
  const [pendingChanges, setPendingChanges] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("basic")
  const [priceRequests, setPriceRequests] = useState<any[]>([])

  // Загрузка данных пользователя и цен
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || user.role !== "minister") {
          router.push("/login")
          return
        }

        // Загружаем цены
        const response = await fetch("/api/prices")
        if (!response.ok) {
          throw new Error("Ошибка загрузки цен")
        }

        const data = await response.json()
        setCategories(data)

        // Загружаем запросы на изменение цен
        const requestsResponse = await fetch("/api/prices?requests=true")
        if (requestsResponse.ok) {
          const requestsData = await requestsResponse.json()
          setPriceRequests(requestsData.filter((req: any) => req.requestedBy === "minister"))
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

  // Отслеживание изменений цен
  useEffect(() => {
    const hasChanges = Object.keys(editedPrices).length > 0
    setPendingChanges(hasChanges)
  }, [editedPrices])

  const handlePriceChange = (serviceId: number, newPrice: string) => {
    const price = Number.parseInt(newPrice)
    if (isNaN(price) || price < 0) return

    setEditedPrices((prev) => ({
      ...prev,
      [serviceId]: price,
    }))
  }

  const handleSaveChanges = async () => {
    try {
      setLoading(true)

      // Отправляем запрос на изменение цен
      const response = await fetch("/api/prices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "request",
          changes: editedPrices,
          requestedBy: user.role,
          requestedById: user.id,
          requestedByName: user.username,
        }),
      })

      if (!response.ok) {
        throw new Error("Ошибка при отправке запроса на изменение цен")
      }

      // Сбрасываем состояние
      setEditedPrices({})
      setEditMode(false)

      toast({
        title: "Запрос отправлен",
        description: "Запрос на изменение цен отправлен на рассмотрение администрации",
      })

      // Обновляем данные
      const pricesResponse = await fetch("/api/prices")
      if (pricesResponse.ok) {
        const data = await pricesResponse.json()
        setCategories(data)
      }

      // Обновляем список запросов
      const requestsResponse = await fetch("/api/prices?requests=true")
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json()
        setPriceRequests(requestsData.filter((req: any) => req.requestedBy === "minister"))
      }
    } catch (error) {
      console.error("Error saving price changes:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelChanges = () => {
    setEditedPrices({})
    setEditMode(false)
  }

  // Форматирование цены для отображения
  function formatPrice(price: number) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  if (loading) {
    return <div className="container flex items-center justify-center min-h-screen">Загрузка...</div>
  }

  if (!user || user.role !== "minister") {
    return <div className="container flex items-center justify-center min-h-screen">Доступ запрещен</div>
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24 mx-auto">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Вернуться в личный кабинет
        </Link>

        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="rounded-full bg-red-100 p-4">
            <Banknote className="h-6 w-6 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Управление ценами</h1>
          <p className="text-gray-500 max-w-[700px]">Редактирование цен на услуги Министерства Здравоохранения</p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ценовая политика</CardTitle>
              <CardDescription>Управление ценами на медицинские услуги</CardDescription>
            </div>
            {!editMode ? (
              <Button onClick={() => setEditMode(true)}>
                <PencilIcon className="h-4 w-4 mr-2" />
                Редактировать цены
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancelChanges}>
                  Отмена
                </Button>
                <Button onClick={handleSaveChanges} disabled={!pendingChanges || loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Сохранение..." : "Сохранить изменения"}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Основные услуги</TabsTrigger>
                <TabsTrigger value="cards">Медицинские карты</TabsTrigger>
                <TabsTrigger value="additional">Дополнительные</TabsTrigger>
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60%]">Название услуги</TableHead>
                        <TableHead className="w-[40%]">Цена ($)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {category.services.map((service: any) => {
                        const currentPrice =
                          editedPrices[service.id] !== undefined ? editedPrices[service.id] : service.price

                        const priceChanged = editedPrices[service.id] !== undefined

                        return (
                          <TableRow key={service.id}>
                            <TableCell className="font-medium">{service.name}</TableCell>
                            <TableCell>
                              {editMode ? (
                                <Input
                                  type="number"
                                  value={currentPrice}
                                  onChange={(e) => handlePriceChange(service.id, e.target.value)}
                                  className={priceChanged ? "border-yellow-500" : ""}
                                />
                              ) : (
                                <span className="text-lg font-bold text-red-600">${formatPrice(currentPrice)}</span>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
          {editMode && (
            <CardFooter className="flex justify-end border-t pt-6">
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancelChanges}>
                  Отмена
                </Button>
                <Button onClick={handleSaveChanges} disabled={!pendingChanges || loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Сохранение..." : "Сохранить изменения"}
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>

        {priceRequests.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>История запросов на изменение цен</CardTitle>
              <CardDescription>Ваши предыдущие запросы на изменение цен</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Услуга</TableHead>
                    <TableHead>Старая цена</TableHead>\<TableHead>Новая цена</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priceRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.serviceName}</TableCell>
                      <TableCell>${formatPrice(request.oldPrice)}</TableCell>
                      <TableCell>${formatPrice(request.newPrice)}</TableCell>
                      <TableCell>{request.createdAt}</TableCell>
                      <TableCell>
                        {request.status === "pending" ? (
                          <span className="text-yellow-500">На рассмотрении</span>
                        ) : request.status === "approved" ? (
                          <span className="text-green-500">Одобрено</span>
                        ) : (
                          <span className="text-red-500">Отклонено</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Важная информация</h3>
          <p className="text-yellow-700">
            Все изменения цен проходят проверку администрацией. Значительные изменения цен должны быть обоснованы. После
            сохранения изменений они будут отправлены на рассмотрение и вступят в силу после одобрения.
          </p>
        </div>
      </div>
    </div>
  )
}

