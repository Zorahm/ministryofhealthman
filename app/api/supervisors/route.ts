import { type NextRequest, NextResponse } from "next/server"

// Данные о следящих (общие для обеих больниц)
const supervisors = [
  {
    id: 1,
    nickname: "SuperAdmin_Main",
    type: "main_supervisor",
    login: "main_supervisor",
    password: "password123",
    vk: "vk.com/main_supervisor",
    createdAt: "2023-01-05",
    assignedHospital: "both", // both, ls, lv
  },
  {
    id: 2,
    nickname: "SuperAdmin_Deputy1",
    type: "deputy_main_supervisor",
    login: "deputy_supervisor1",
    password: "password123",
    vk: "vk.com/deputy_supervisor1",
    createdAt: "2023-01-10",
    assignedHospital: "ls",
  },
  {
    id: 3,
    nickname: "SuperAdmin_Deputy2",
    type: "deputy_main_supervisor",
    login: "deputy_supervisor2",
    password: "password123",
    vk: "vk.com/deputy_supervisor2",
    createdAt: "2023-01-15",
    assignedHospital: "lv",
  },
  {
    id: 4,
    nickname: "Supervisor_LS",
    type: "supervisor",
    login: "supervisor_ls",
    password: "password123",
    vk: "vk.com/supervisor_ls",
    createdAt: "2023-02-15",
    assignedHospital: "ls",
  },
  {
    id: 5,
    nickname: "Supervisor_LV",
    type: "supervisor",
    login: "supervisor_lv",
    password: "password123",
    vk: "vk.com/supervisor_lv",
    createdAt: "2023-02-20",
    assignedHospital: "lv",
  },
]

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const id = url.searchParams.get("id")
  const type = url.searchParams.get("type")
  const assignedHospital = url.searchParams.get("assignedHospital")

  if (id) {
    const supervisor = supervisors.find((s) => s.id === Number.parseInt(id))
    if (!supervisor) {
      return NextResponse.json({ error: "Следящий не найден" }, { status: 404 })
    }
    return NextResponse.json(supervisor)
  }

  let filteredSupervisors = [...supervisors]

  if (type) {
    filteredSupervisors = filteredSupervisors.filter((s) => s.type === type)
  }

  if (assignedHospital) {
    filteredSupervisors = filteredSupervisors.filter(
      (s) => s.assignedHospital === assignedHospital || s.assignedHospital === "both",
    )
  }

  return NextResponse.json(filteredSupervisors)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nickname, type, login, password, vk, assignedHospital } = body

    if (!assignedHospital || !["ls", "lv", "both"].includes(assignedHospital)) {
      return NextResponse.json({ error: "Неверное назначение больницы" }, { status: 400 })
    }

    // Проверка на существующего следящего с таким логином
    const existingUser = supervisors.find((s) => s.login === login)
    if (existingUser) {
      return NextResponse.json({ error: "Пользователь с таким логином уже существует" }, { status: 400 })
    }

    // Создание нового следящего
    const newSupervisor = {
      id: supervisors.length > 0 ? Math.max(...supervisors.map((s) => s.id)) + 1 : 1,
      nickname,
      type,
      login,
      password: password, // В реальном приложении пароль должен быть захеширован
      vk,
      createdAt: new Date().toISOString().split("T")[0],
      assignedHospital,
    }

    supervisors.push(newSupervisor)

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
          role: type,
        }),
      })
    } catch (error) {
      console.error("Error adding user to auth system:", error)
    }

    return NextResponse.json(newSupervisor)
  } catch (error) {
    console.error("Supervisor creation error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, nickname, type, login, password, vk, assignedHospital } = body

    const supervisorIndex = supervisors.findIndex((s) => s.id === Number.parseInt(id))
    if (supervisorIndex === -1) {
      return NextResponse.json({ error: "Следящий не найден" }, { status: 404 })
    }

    // Обновление данных следящего
    const updatedSupervisor = {
      ...supervisors[supervisorIndex],
      nickname,
      type,
      login,
      vk,
      assignedHospital,
      ...(password ? { password } : {}),
    }

    supervisors[supervisorIndex] = updatedSupervisor

    return NextResponse.json(updatedSupervisor)
  } catch (error) {
    console.error("Supervisor update error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Не указан ID следящего" }, { status: 400 })
    }

    const supervisorIndex = supervisors.findIndex((s) => s.id === Number.parseInt(id))
    if (supervisorIndex === -1) {
      return NextResponse.json({ error: "Следящий не найден" }, { status: 404 })
    }

    // Удаление следящего
    supervisors.splice(supervisorIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Supervisor deletion error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

