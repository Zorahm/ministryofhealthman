import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Пользователи системы
const users = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    role: "main_supervisor",
    assignedHospital: "both",
  },
  {
    id: 2,
    username: "leader_ls",
    password: "password123",
    role: "leader",
    hospital: "ls",
  },
  {
    id: 3,
    username: "leader_lv",
    password: "password123",
    role: "leader",
    hospital: "lv",
  },
  {
    id: 4,
    username: "minister",
    password: "password123",
    role: "minister",
    hospital: "both",
  },
  {
    id: 6,
    username: "deputy_supervisor1",
    password: "password123",
    role: "deputy_main_supervisor",
    assignedHospital: "ls",
  },
  {
    id: 7,
    username: "deputy_supervisor2",
    password: "password123",
    role: "deputy_main_supervisor",
    assignedHospital: "lv",
  },
  {
    id: 8,
    username: "supervisor_ls",
    password: "password123",
    role: "supervisor",
    assignedHospital: "ls",
  },
  {
    id: 9,
    username: "supervisor_lv",
    password: "password123",
    role: "supervisor",
    assignedHospital: "lv",
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    console.log("Login attempt:", { username, password })

    const user = users.find((u) => u.username === username && u.password === password)

    if (!user) {
      console.log("User not found or password incorrect")
      return NextResponse.json({ error: "Неверное имя пользователя или пароль" }, { status: 401 })
    }

    console.log("User found:", user)

    // Создаем JWT-подобный токен (в реальном приложении использовали бы настоящий JWT)
    const token = Buffer.from(
      JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role,
        hospital: user.hospital || null,
        assignedHospital: user.assignedHospital || null,
        exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 дней
      }),
    ).toString("base64")

    // Устанавливаем куки с более простыми настройками
    const response = NextResponse.json({
      id: user.id,
      username: user.username,
      role: user.role,
      hospital: user.hospital || null,
      assignedHospital: user.assignedHospital || null,
      token: token, // Отправляем токен клиенту
    })

    response.cookies.set({
      name: "auth_token",
      value: token,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 дней
      sameSite: "lax", // Менее строгий режим
      secure: process.env.NODE_ENV === "production",
    })

    console.log("Auth token set in cookies")
    return response
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

// Добавление нового пользователя
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, role, hospital, assignedHospital } = body

    // Проверка на существующего пользователя
    const existingUser = users.find((u) => u.username === username)
    if (existingUser) {
      // Если пользователь существует, обновляем его данные
      existingUser.password = password
      existingUser.role = role
      if (hospital) existingUser.hospital = hospital
      if (assignedHospital) existingUser.assignedHospital = assignedHospital

      return NextResponse.json({
        id: existingUser.id,
        username: existingUser.username,
        role: existingUser.role,
        hospital: existingUser.hospital || null,
        assignedHospital: existingUser.assignedHospital || null,
      })
    }

    // Добавление нового пользователя
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      username,
      password,
      role,
      ...(hospital && { hospital }),
      ...(assignedHospital && { assignedHospital }),
    }

    users.push(newUser)

    return NextResponse.json({
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
      hospital: newUser.hospital || null,
      assignedHospital: newUser.assignedHospital || null,
    })
  } catch (error) {
    console.error("User creation error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

// Получение текущего пользователя
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    try {
      const userData = JSON.parse(Buffer.from(token, "base64").toString())

      // Проверка срока действия токена
      if (userData.exp < Date.now()) {
        cookies().delete("auth_token")
        return NextResponse.json({ error: "Срок действия токена истек" }, { status: 401 })
      }

      return NextResponse.json({
        id: userData.id,
        username: userData.username,
        role: userData.role,
        hospital: userData.hospital || null,
        assignedHospital: userData.assignedHospital || null,
      })
    } catch (e) {
      cookies().delete("auth_token")
      return NextResponse.json({ error: "Недействительный токен" }, { status: 401 })
    }
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

// Выход из системы
export async function DELETE() {
  cookies().delete("auth_token")
  return NextResponse.json({ success: true })
}

