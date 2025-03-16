import { type NextRequest, NextResponse } from "next/server"

// Хранилище выговоров
const warnings = [
  {
    id: 1,
    userId: 1,
    userRole: "leader",
    userHospital: "ls",
    userName: "Иван Петров",
    reason: "Нарушение субординации",
    issuedBy: "admin",
    issuedById: 1,
    issuedByName: "Admin",
    createdAt: "2023-02-20",
  },
]

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const userId = url.searchParams.get("userId")
  const userRole = url.searchParams.get("userRole")
  const hospital = url.searchParams.get("hospital")

  let filteredWarnings = [...warnings]

  if (userId) {
    filteredWarnings = filteredWarnings.filter((w) => w.userId === Number.parseInt(userId))
  }

  if (userRole) {
    filteredWarnings = filteredWarnings.filter((w) => w.userRole === userRole)
  }

  if (hospital) {
    filteredWarnings = filteredWarnings.filter((w) => w.userHospital === hospital)
  }

  return NextResponse.json(filteredWarnings)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, userRole, userHospital, userName, reason, issuedBy, issuedById, issuedByName } = body

    // Создание нового выговора
    const newWarning = {
      id: warnings.length > 0 ? Math.max(...warnings.map((w) => w.id)) + 1 : 1,
      userId: Number.parseInt(userId),
      userRole,
      userHospital,
      userName,
      reason,
      issuedBy,
      issuedById,
      issuedByName,
      createdAt: new Date().toISOString().split("T")[0],
    }

    warnings.push(newWarning)

    return NextResponse.json(newWarning)
  } catch (error) {
    console.error("Warning creation error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

// Удаление выговора (только для администраторов)
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Не указан ID выговора" }, { status: 400 })
    }

    const warningIndex = warnings.findIndex((w) => w.id === Number.parseInt(id))
    if (warningIndex === -1) {
      return NextResponse.json({ error: "Выговор не найден" }, { status: 404 })
    }

    // Удаление выговора
    warnings.splice(warningIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Warning deletion error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

