import { type NextRequest, NextResponse } from "next/server"

// Данные для системы "Антиблат" для двух больниц
const antiblat = {
  ls: [
    {
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
      hospital: "ls",
    },
  ],
  lv: [
    {
      id: 2,
      nickname: "Player_456",
      rank: 6,
      vk: "vk.com/player456",
      reason: "trusted",
      reportLink: null,
      addedBy: "leader",
      addedById: 4,
      addedByName: "Мария Козлова",
      createdAt: "2023-03-20",
      hospital: "lv",
    },
  ],
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const hospital = url.searchParams.get("hospital")

  if (hospital === "ls") {
    return NextResponse.json(antiblat.ls)
  } else if (hospital === "lv") {
    return NextResponse.json(antiblat.lv)
  }

  // Если больница не указана, возвращаем данные обеих больниц
  return NextResponse.json({
    ls: antiblat.ls,
    lv: antiblat.lv,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { hospital, nickname, rank, vk, reason, reportLink, addedBy, addedById, addedByName } = body

    if (!hospital || !["ls", "lv"].includes(hospital)) {
      return NextResponse.json({ error: "Неверная больница" }, { status: 400 })
    }

    // Создание новой записи
    const newEntry = {
      id: antiblat[hospital].length > 0 ? Math.max(...antiblat[hospital].map((entry) => entry.id)) + 1 : 1,
      nickname,
      rank: Number.parseInt(rank),
      vk,
      reason,
      reportLink: reason === "report" ? reportLink : null,
      addedBy,
      addedById,
      addedByName,
      createdAt: new Date().toISOString().split("T")[0],
      hospital,
    }

    antiblat[hospital].push(newEntry)

    return NextResponse.json(newEntry)
  } catch (error) {
    console.error("Antiblat creation error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, hospital, nickname, rank, vk, reason, reportLink } = body

    if (!hospital || !["ls", "lv"].includes(hospital)) {
      return NextResponse.json({ error: "Неверная больница" }, { status: 400 })
    }

    const entryIndex = antiblat[hospital].findIndex((entry) => entry.id === Number.parseInt(id))
    if (entryIndex === -1) {
      return NextResponse.json({ error: "Запись не найдена" }, { status: 404 })
    }

    // Обновление записи
    const updatedEntry = {
      ...antiblat[hospital][entryIndex],
      nickname,
      rank: Number.parseInt(rank),
      vk,
      reason,
      reportLink: reason === "report" ? reportLink : null,
    }

    antiblat[hospital][entryIndex] = updatedEntry

    return NextResponse.json(updatedEntry)
  } catch (error) {
    console.error("Antiblat update error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")
    const hospital = url.searchParams.get("hospital")

    if (!id) {
      return NextResponse.json({ error: "Не указан ID записи" }, { status: 400 })
    }

    if (!hospital || !["ls", "lv"].includes(hospital)) {
      return NextResponse.json({ error: "Неверная больница" }, { status: 400 })
    }

    const entryIndex = antiblat[hospital].findIndex((entry) => entry.id === Number.parseInt(id))
    if (entryIndex === -1) {
      return NextResponse.json({ error: "Запись не найдена" }, { status: 404 })
    }

    // Удаление записи
    antiblat[hospital].splice(entryIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Antiblat deletion error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

