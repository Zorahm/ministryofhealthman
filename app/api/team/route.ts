import { type NextRequest, NextResponse } from "next/server"

// Данные о командах для двух больниц
const teams = {
  ls: {
    leader: {
      id: 1,
      name: "Иван Петров",
      vk: "vk.com/ivanpetrov",
      email: "ivan@example.com",
      discord: "ivanpetrov#1234",
      forumLink: "forum.example.com/ivanpetrov",
      goal: "Развитие больницы Los-Santos и повышение качества медицинских услуг",
      login: "leader_ls",
      password: "password123",
      appointedAt: "2023-01-15",
      hospital: "ls",
    },
    deputies: [
      {
        id: 3,
        position: 1,
        name: "Алексей Иванов",
        vk: "vk.com/alexeyivanov",
        login: "deputy1_ls",
        password: "password123",
        appointedAt: "2023-03-05",
        hospital: "ls",
      },
    ],
  },
  lv: {
    leader: {
      id: 4,
      name: "Мария Козлова",
      vk: "vk.com/mariakozlova",
      email: "maria@example.com",
      discord: "mariakozlova#5678",
      forumLink: "forum.example.com/mariakozlova",
      goal: "Развитие больницы Las-Venturas и внедрение новых медицинских технологий",
      login: "leader_lv",
      password: "password123",
      appointedAt: "2023-01-20",
      hospital: "lv",
    },
    deputies: [
      {
        id: 6,
        position: 1,
        name: "Ольга Новикова",
        vk: "vk.com/olganovikova",
        login: "deputy1_lv",
        password: "password123",
        appointedAt: "2023-03-10",
        hospital: "lv",
      },
    ],
  },
  // Общий министр для обеих больниц
  minister: {
    id: 2,
    name: "Елена Смирнова",
    vk: "vk.com/elenasmirnova",
    login: "minister",
    password: "password123",
    appointedAt: "2023-02-10",
    hospital: "both", // Министр работает на обе больницы
  },
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const hospital = url.searchParams.get("hospital")

  if (hospital === "ls") {
    return NextResponse.json({
      ...teams.ls,
      minister: teams.minister,
    })
  } else if (hospital === "lv") {
    return NextResponse.json({
      ...teams.lv,
      minister: teams.minister,
    })
  }

  // Если больница не указана, возвращаем данные обеих больниц и министра
  return NextResponse.json({
    ls: teams.ls,
    lv: teams.lv,
    minister: teams.minister,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { hospital, role, position, name, vk, login, password, email, discord, forumLink, goal } = body

    if (!hospital || !["ls", "lv", "both"].includes(hospital)) {
      return NextResponse.json({ error: "Неверная больница" }, { status: 400 })
    }

    // Добавление пользователя в систему аутентификации
    try {
      await fetch("/api/auth", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: login,
          password: password,
          role: role,
          hospital: hospital,
        }),
      })
    } catch (error) {
      console.error("Error adding user to auth system:", error)
    }

    // Обновление команды
    if (role === "leader") {
      const newLeader = {
        id: Date.now(),
        name,
        vk,
        email,
        discord,
        forumLink,
        goal,
        login,
        password,
        appointedAt: new Date().toISOString().split("T")[0],
        hospital,
      }

      // Заменяем существующего лидера
      if (hospital === "ls") {
        teams.ls.leader = newLeader
      } else if (hospital === "lv") {
        teams.lv.leader = newLeader
      }

      return NextResponse.json(newLeader)
    } else if (role === "minister") {
      const newMinister = {
        id: Date.now(),
        name,
        vk,
        login,
        password,
        appointedAt: new Date().toISOString().split("T")[0],
        hospital: "both", // Министр всегда работает на обе больницы
      }

      // Заменяем существующего министра
      teams.minister = newMinister

      return NextResponse.json(newMinister)
    } else if (role === "deputy") {
      const newDeputy = {
        id: Date.now(),
        position: Number.parseInt(position),
        name,
        vk,
        login,
        password,
        appointedAt: new Date().toISOString().split("T")[0],
        hospital,
      }

      if (hospital === "ls" || hospital === "lv") {
        // Проверяем, есть ли уже заместитель на этой позиции
        const existingIndex = teams[hospital].deputies.findIndex((d) => d.position === Number.parseInt(position))
        if (existingIndex !== -1) {
          teams[hospital].deputies[existingIndex] = newDeputy
        } else {
          teams[hospital].deputies.push(newDeputy)
        }
      }

      return NextResponse.json(newDeputy)
    }

    return NextResponse.json({ error: "Неверная роль" }, { status: 400 })
  } catch (error) {
    console.error("Team update error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const hospital = url.searchParams.get("hospital")
    const role = url.searchParams.get("role")
    const position = url.searchParams.get("position")

    if (!hospital || !["ls", "lv", "both"].includes(hospital)) {
      return NextResponse.json({ error: "Неверная больница" }, { status: 400 })
    }

    if (!role) {
      return NextResponse.json({ error: "Не указана роль" }, { status: 400 })
    }

    if (role === "leader") {
      if (hospital === "ls") {
        teams.ls.leader = null
      } else if (hospital === "lv") {
        teams.lv.leader = null
      }
    } else if (role === "minister") {
      teams.minister = null
    } else if (role === "deputy") {
      if (!position) {
        return NextResponse.json({ error: "Не указана позиция заместителя" }, { status: 400 })
      }

      if (hospital === "ls" || hospital === "lv") {
        const deputyIndex = teams[hospital].deputies.findIndex((d) => d.position === Number.parseInt(position))
        if (deputyIndex !== -1) {
          teams[hospital].deputies.splice(deputyIndex, 1)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Team member deletion error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

