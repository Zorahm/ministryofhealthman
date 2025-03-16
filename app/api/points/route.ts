import { type NextRequest, NextResponse } from "next/server"

// Хранилище баллов
const points = [
  {
    id: 1,
    userId: 2,
    userRole: "leader",
    userHospital: "ls",
    userName: "Иван Петров",
    amount: 10,
    reason: "Набор персонала",
    date: "2023-01-05",
  },
  {
    id: 2,
    userId: 2,
    userRole: "leader",
    userHospital: "ls",
    userName: "Иван Петров",
    amount: 10,
    reason: "Проведение мероприятия",
    date: "2023-02-10",
  },
  {
    id: 3,
    userId: 2,
    userRole: "leader",
    userHospital: "ls",
    userName: "Иван Петров",
    amount: 5,
    reason: "Активная работа",
    date: "2023-03-15",
  },
  {
    id: 4,
    userId: 4,
    userRole: "leader",
    userHospital: "lv",
    userName: "Мария Козлова",
    amount: 8,
    reason: "Помощь новичкам",
    date: "2023-01-20",
  },
  {
    id: 5,
    userId: 4,
    userRole: "leader",
    userHospital: "lv",
    userName: "Мария Козлова",
    amount: 10,
    reason: "Организация работы",
    date: "2023-02-25",
  },
]

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const userId = url.searchParams.get("userId")
  const userRole = url.searchParams.get("userRole")
  const hospital = url.searchParams.get("hospital")

  let filteredPoints = [...points]

  if (userId) {
    filteredPoints = filteredPoints.filter((p) => p.userId === Number.parseInt(userId))
  }

  if (userRole) {
    filteredPoints = filteredPoints.filter((p) => p.userRole === userRole)
  }

  if (hospital) {
    filteredPoints = filteredPoints.filter((p) => p.userHospital === hospital)
  }

  return NextResponse.json({
    points: filteredPoints,
    totalPoints: filteredPoints.reduce((sum, p) => sum + p.amount, 0),
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, userRole, userHospital, userName, amount, reason, addedBy, addedByName } = body

    // Создание новой записи о баллах
    const newPoint = {
      id: points.length > 0 ? Math.max(...points.map((p) => p.id)) + 1 : 1,
      userId: Number.parseInt(userId),
      userRole,
      userHospital,
      userName,
      amount: Number.parseInt(amount),
      reason,
      addedBy,
      addedByName,
      date: new Date().toISOString().split("T")[0],
    }

    points.push(newPoint)

    return NextResponse.json(newPoint)
  } catch (error) {
    console.error("Points creation error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

// Удаление баллов (только для администраторов)
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Не указан ID записи" }, { status: 400 })
    }

    const pointIndex = points.findIndex((p) => p.id === Number.parseInt(id))
    if (pointIndex === -1) {
      return NextResponse.json({ error: "Запись не найдена" }, { status: 404 })
    }

    // Удаление записи
    points.splice(pointIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Points deletion error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

