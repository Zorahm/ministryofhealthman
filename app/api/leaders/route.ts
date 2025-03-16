import { type NextRequest, NextResponse } from "next/server"

// Данные о лидерах для двух больниц
const leaders = {
  ls: {
    id: 1,
    nickname: "Иван Петров",
    vk: "vk.com/ivanpetrov",
    email: "ivan@example.com",
    discord: "ivanpetrov#1234",
    forumLink: "forum.example.com/ivanpetrov",
    goal: "Развитие больницы Los-Santos и повышение качества медицинских услуг",
    login: "leader_ls",
    password: "password123",
    createdAt: "2023-01-15",
    hospital: "ls",
  },
  lv: {
    id: 2,
    nickname: "Мария Козлова",
    vk: "vk.com/mariakozlova",
    email: "maria@example.com",
    discord: "mariakozlova#5678",
    forumLink: "forum.example.com/mariakozlova",
    goal: "Развитие больницы Las-Venturas и внедрение новых медицинских технологий",
    login: "leader_lv",
    password: "password123",
    createdAt: "2023-01-20",
    hospital: "lv",
  },
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const id = url.searchParams.get("id")
  const hospital = url.searchParams.get("hospital")

  if (id) {
    // Поиск по ID в обеих больницах
    for (const hospitalKey in leaders) {
      if (leaders[hospitalKey] && leaders[hospitalKey].id === Number.parseInt(id)) {
        return NextResponse.json(leaders[hospitalKey])
      }
    }
    return NextResponse.json({ error: "Лидер не найден" }, { status: 404 })
  }

  if (hospital) {
    if (!["ls", "lv"].includes(hospital)) {
      return NextResponse.json({ error: "Неверная больница" }, { status: 400 })
    }

    // Возвращаем текущего лидера больницы
    return NextResponse.json(leaders[hospital] || null)
  }

  // Если больница не указана, возвращаем данные обеих больниц
  return NextResponse.json({
    ls: leaders.ls || null,
    lv: leaders.lv || null,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nickname, vk, email, discord, forumLink, goal, login, password, hospital } = body

    if (!hospital || !["ls", "lv"].includes(hospital)) {
      return NextResponse.json({ error: "Неверная больница" }, { status: 400 })
    }

    // Проверка на существующего лидера с таким логином
    for (const hospitalKey in leaders) {
      if (leaders[hospitalKey] && leaders[hospitalKey].login === login) {
        return NextResponse.json({ error: "Пользователь с таким логином уже существует" }, { status: 400 })
      }
    }

    // Создание нового лидера
    const newLeader = {
      id: Date.now(),
      nickname,
      vk,
      email,
      discord,
      forumLink,
      goal,
      login,
      password, // В реальном приложении пароль должен быть захеширован
      createdAt: new Date().toISOString().split("T")[0],
      hospital,
    }

    // Заменяем существующего лидера для данной больницы
    leaders[hospital] = newLeader

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
          role: "leader",
          hospital: hospital,
        }),
      })
    } catch (error) {
      console.error("Error adding user to auth system:", error)
    }

    return NextResponse.json(newLeader)
  } catch (error) {
    console.error("Leader creation error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, nickname, vk, email, discord, forumLink, goal, login, password, hospital } = body

    if (!hospital || !["ls", "lv"].includes(hospital)) {
      return NextResponse.json({ error: "Неверная больница" }, { status: 400 })
    }

    if (!leaders[hospital] || leaders[hospital].id !== Number.parseInt(id)) {
      return NextResponse.json({ error: "Лидер не найден" }, { status: 404 })
    }

    // Обновление данных лидера
    const updatedLeader = {
      ...leaders[hospital],
      nickname,
      vk,
      email,
      discord,
      forumLink,
      goal,
      login,
      ...(password ? { password } : {}),
    }

    leaders[hospital] = updatedLeader

    return NextResponse.json(updatedLeader)
  } catch (error) {
    console.error("Leader update error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const hospital = url.searchParams.get("hospital")

    if (!hospital || !["ls", "lv"].includes(hospital)) {
      return NextResponse.json({ error: "Неверная больница" }, { status: 400 })
    }

    // Удаление лидера
    leaders[hospital] = null

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Leader deletion error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

