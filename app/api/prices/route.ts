import { type NextRequest, NextResponse } from "next/server"

// Данные о ценах
const serviceCategories = [
  {
    id: "basic",
    name: "Основные услуги",
    services: [
      { id: 1, name: "Лечение", price: 60000 },
      { id: 2, name: "Лечение личных охранников (( /healactor ))", price: 300000 },
      { id: 4, name: "Вывод наркозависимости", price: 150000 },
      { id: 9, name: "Медицинский осмотр (( /medcheck ))", price: 300000 },
    ],
  },
  {
    id: "cards",
    name: "Медицинские карты",
    services: [
      { id: 5, name: "Медицинская карта (7 дней)", price: 50000 },
      { id: 6, name: "Медицинская карта (14 дней)", price: 80000 },
      { id: 7, name: "Медицинская карта (30 дней)", price: 130000 },
      { id: 8, name: "Медицинская карта (60 дней)", price: 175000 },
    ],
  },
  {
    id: "additional",
    name: "Дополнительные услуги",
    services: [
      { id: 3, name: "Рецепт (1 шт.)", price: 30000 },
      { id: 10, name: "Медицинская страховка (1 неделя)", price: 400000 },
      { id: 11, name: "Антибиотик (1 шт.)", price: 25000 },
    ],
  },
]

// Массив запросов на изменение цен
const priceChangeRequests = []

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const category = url.searchParams.get("category")
  const requestsOnly = url.searchParams.get("requests") === "true"

  if (requestsOnly) {
    return NextResponse.json(priceChangeRequests)
  }

  if (category) {
    const categoryData = serviceCategories.find((cat) => cat.id === category)
    return NextResponse.json(categoryData || { services: [] })
  }

  return NextResponse.json(serviceCategories)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.type === "request") {
      const { changes, requestedBy, requestedById, requestedByName } = body

      // Создание запросов на изменение цен
      const newRequests = Object.entries(changes).map(([serviceId, newPrice], index) => {
        // Поиск услуги
        let service = null
        let oldPrice = 0

        for (const category of serviceCategories) {
          const found = category.services.find((s) => s.id === Number.parseInt(serviceId))
          if (found) {
            service = found
            oldPrice = found.price
            break
          }
        }

        if (!service) {
          throw new Error(`Service with ID ${serviceId} not found`)
        }

        const requestId =
          priceChangeRequests.length > 0 ? Math.max(...priceChangeRequests.map((r) => r.id)) + index + 1 : index + 1

        const newRequest = {
          id: requestId,
          serviceId: Number.parseInt(serviceId),
          serviceName: service.name,
          oldPrice,
          newPrice: Number.parseInt(newPrice as string),
          requestedBy,
          requestedById,
          requestedByName,
          status: "pending",
          createdAt: new Date().toISOString().split("T")[0],
        }

        priceChangeRequests.push(newRequest)
        return newRequest
      })

      return NextResponse.json(newRequests)
    } else if (body.type === "approve" || body.type === "reject") {
      const { requestId, adminId, adminName, reason } = body

      const requestIndex = priceChangeRequests.findIndex((r) => r.id === Number.parseInt(requestId))
      if (requestIndex === -1) {
        return NextResponse.json({ error: "Запрос не найден" }, { status: 404 })
      }

      const request = priceChangeRequests[requestIndex]

      if (body.type === "approve") {
        // Обновление цены в категориях услуг
        for (const category of serviceCategories) {
          const serviceIndex = category.services.findIndex((s) => s.id === request.serviceId)
          if (serviceIndex !== -1) {
            category.services[serviceIndex].price = request.newPrice
            break
          }
        }

        const updatedRequest = {
          ...request,
          status: "approved",
          approvedAt: new Date().toISOString().split("T")[0],
          approvedBy: "admin",
          approvedById: adminId,
          approvedByName: adminName,
        }

        priceChangeRequests[requestIndex] = updatedRequest

        return NextResponse.json(updatedRequest)
      } else {
        const updatedRequest = {
          ...request,
          status: "rejected",
          rejectedAt: new Date().toISOString().split("T")[0],
          rejectedBy: "admin",
          rejectedById: adminId,
          rejectedByName: adminName,
          rejectionReason: reason || "Отклонено администрацией",
        }

        priceChangeRequests[requestIndex] = updatedRequest

        return NextResponse.json(updatedRequest)
      }
    } else if (body.type === "update") {
      // Прямое обновление цен (для администраторов)
      const { changes, updatedBy, updatedById, updatedByName } = body

      for (const [serviceId, newPrice] of Object.entries(changes)) {
        for (const category of serviceCategories) {
          const serviceIndex = category.services.findIndex((s) => s.id === Number.parseInt(serviceId))
          if (serviceIndex !== -1) {
            category.services[serviceIndex].price = Number.parseInt(newPrice as string)
            break
          }
        }
      }

      return NextResponse.json({ success: true, message: "Цены успешно обновлены" })
    }

    return NextResponse.json({ error: "Неверный тип запроса" }, { status: 400 })
  } catch (error) {
    console.error("Price update error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

