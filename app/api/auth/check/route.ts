import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

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

