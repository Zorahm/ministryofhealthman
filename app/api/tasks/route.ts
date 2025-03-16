import { type NextRequest, NextResponse } from "next/server"

// This would be replaced with actual database queries
const tasks = [
  {
    id: 1,
    title: "Обучение новичков",
    description: "Проведите обучение для 5 новых сотрудников и предоставьте доказательства.",
    detailedDescription: `
      <p>Для выполнения этого задания вам необходимо:</p>
      <ol>
        <li>Собрать группу из 5 новых сотрудников (ранг 1-3)</li>
        <li>Провести обучение по основным аспектам работы в Министерстве Здравоохранения</li>
        <li>Сделать скриншоты процесса обучения</li>
        <li>Составить краткий отчет о проведенном обучении</li>
      </ol>
      <p>Обучение должно включать следующие темы:</p>
      <ul>
        <li>Основные команды и их использование</li>
        <li>Правила поведения и субординация</li>
        <li>Процедуры лечения и оказания медицинской помощи</li>
        <li>Работа с медицинскими картами и страховками</li>
      </ul>
    `,
    points: 15,
    difficulty: "medium",
    requirements: [
      "Минимум 5 новых сотрудников",
      "Минимум 3 скриншота процесса обучения",
      "Отчет о проведенном обучении",
      "Список обученных сотрудников с их никами",
    ],
    active: true,
  },
  {
    id: 2,
    title: "Организация мероприятия",
    description: "Организуйте мероприятие для сотрудников и предоставьте отчет.",
    detailedDescription: `
      <p>Для выполнения этого задания вам необходимо:</p>
      <ol>
        <li>Разработать концепцию мероприятия для сотрудников Министерства Здравоохранения</li>
        <li>Организовать и провести мероприятие с участием минимум 10 сотрудников</li>
        <li>Сделать скриншоты процесса проведения мероприятия</li>
        <li>Составить отчет о проведенном мероприятии</li>
      </ol>
      <p>Мероприятие может быть одного из следующих типов:</p>
      <ul>
        <li>Обучающий семинар</li>
        <li>Командное соревнование</li>
        <li>Тематическая встреча</li>
        <li>Любое другое мероприятие, направленное на развитие коллектива</li>
      </ul>
    `,
    points: 20,
    difficulty: "hard",
    requirements: [
      "Минимум 10 участников",
      "Минимум 5 скриншотов процесса проведения",
      "Подробный отчет о мероприятии",
      "Список участников с их никами",
    ],
    active: true,
  },
  {
    id: 3,
    title: "Набор персонала",
    description: "Наберите 3 новых сотрудника и проведите их обучение.",
    detailedDescription: `
      <p>Для выполнения этого задания вам необходимо:</p>
      <ol>
        <li>Найти и принять на работу 3 новых сотрудника</li>
        <li>Провести их обучение основным аспектам работы</li>
        <li>Сделать скриншоты процесса обучения</li>
        <li>Составить краткий отчет о проведенном наборе и обучении</li>
      </ol>
      <p>Обучение должно включать следующие темы:</p>
      <ul>
        <li>Основные команды и их использование</li>
        <li>Правила поведения и субординация</li>
        <li>Процедуры лечения и оказания медицинской помощи</li>
        <li>Работа с медицинскими картами и страховками</li>
      </ul>
    `,
    points: 15,
    difficulty: "medium",
    requirements: [
      "3 новых сотрудника",
      "Минимум 3 скриншота процесса обучения",
      "Отчет о проведенном обучении",
      "Информация о новых сотрудниках (ник, уровень, ВК)",
    ],
    active: true,
  },
  {
    id: 4,
    title: "Проверка работы отделений",
    description: "Проведите проверку работы всех отделений и составьте отчет.",
    detailedDescription: `
      <p>Для выполнения этого задания вам необходимо:</p>
      <ol>
        <li>Посетить все отделения Министерства Здравоохранения</li>
        <li>Проверить работу каждого отделения</li>
        <li>Сделать скриншоты процесса проверки</li>
        <li>Составить подробный отчет о состоянии каждого отделения</li>
      </ol>
      <p>В отчете должны быть отражены следующие аспекты:</p>
      <ul>
        <li>Количество сотрудников в отделении</li>
        <li>Качество обслуживания пациентов</li>
        <li>Соблюдение правил и процедур</li>
        <li>Рекомендации по улучшению работы</li>
      </ul>
    `,
    points: 10,
    difficulty: "easy",
    requirements: [
      "Проверка всех отделений",
      "Минимум 5 скриншотов процесса проверки",
      "Подробный отчет о состоянии каждого отделения",
      "Рекомендации по улучшению работы",
    ],
    active: false,
  },
]

const submittedTasks = [
  {
    id: 1,
    taskId: 1,
    userId: 1,
    userRole: "leader",
    userName: "Иван Петров",
    title: "Обучение новичков",
    submittedAt: "2023-03-20",
    status: "pending",
    proof: "https://imgur.com/gallery/example1",
    comment: "Провел обучение для 5 новичков, все материалы в приложенных скриншотах.",
  },
  {
    id: 2,
    taskId: 3,
    userId: 2,
    userRole: "deputy",
    userName: "Елена Смирнова",
    title: "Набор персонала",
    submittedAt: "2023-02-15",
    status: "approved",
    proof: "https://imgur.com/gallery/example2",
    comment: "Набрал 3 новых сотрудника и провел их обучение.",
    approvedAt: "2023-02-16",
    approvedBy: "admin",
    approvedById: 1,
    approvedByName: "Admin",
  },
  {
    id: 3,
    taskId: 2,
    userId: 4,
    userRole: "minister",
    userName: "Дмитрий Соколов",
    title: "Организация мероприятия",
    submittedAt: "2023-01-10",
    status: "rejected",
    proof: "https://imgur.com/gallery/example3",
    comment: "Организовал мероприятие для всех сотрудников.",
    rejectedAt: "2023-01-11",
    rejectedBy: "admin",
    rejectedById: 1,
    rejectedByName: "Admin",
    rejectionReason: "Недостаточно доказательств проведения мероприятия.",
  },
]

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const id = url.searchParams.get("id")
  const status = url.searchParams.get("status")
  const userId = url.searchParams.get("userId")

  if (id) {
    const task = tasks.find((t) => t.id === Number.parseInt(id))
    if (!task) {
      return NextResponse.json({ error: "Задание не найдено" }, { status: 404 })
    }
    return NextResponse.json(task)
  }

  if (status === "submitted") {
    let filteredTasks = submittedTasks

    if (userId) {
      filteredTasks = filteredTasks.filter((t) => t.userId === Number.parseInt(userId))
    }

    return NextResponse.json(filteredTasks)
  }

  // Filter active tasks by default
  const activeTasks = tasks.filter((t) => t.active)

  return NextResponse.json(activeTasks)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Handle task creation
    if (body.type === "create") {
      const { title, description, detailedDescription, points, difficulty, requirements } = body

      const newTask = {
        id: tasks.length + 1,
        title,
        description,
        detailedDescription,
        points: Number.parseInt(points),
        difficulty,
        requirements: requirements.split("\n").filter((r: string) => r.trim()),
        active: true,
      }

      return NextResponse.json(newTask)
    }

    // Handle task submission
    if (body.type === "submit") {
      const { taskId, userId, userRole, userName, proof, comment } = body

      const task = tasks.find((t) => t.id === Number.parseInt(taskId))
      if (!task) {
        return NextResponse.json({ error: "Задание не найдено" }, { status: 404 })
      }

      const newSubmission = {
        id: submittedTasks.length + 1,
        taskId: Number.parseInt(taskId),
        userId: Number.parseInt(userId),
        userRole,
        userName,
        title: task.title,
        submittedAt: new Date().toISOString().split("T")[0],
        status: "pending",
        proof,
        comment,
      }

      return NextResponse.json(newSubmission)
    }

    // Handle task approval/rejection
    if (body.type === "approve" || body.type === "reject") {
      const { submissionId, adminId, adminName, reason } = body

      const submission = submittedTasks.find((s) => s.id === Number.parseInt(submissionId))
      if (!submission) {
        return NextResponse.json({ error: "Отправленное задание не найдено" }, { status: 404 })
      }

      if (body.type === "approve") {
        const updatedSubmission = {
          ...submission,
          status: "approved",
          approvedAt: new Date().toISOString().split("T")[0],
          approvedBy: "admin",
          approvedById: adminId,
          approvedByName: adminName,
        }

        return NextResponse.json(updatedSubmission)
      } else {
        const updatedSubmission = {
          ...submission,
          status: "rejected",
          rejectedAt: new Date().toISOString().split("T")[0],
          rejectedBy: "admin",
          rejectedById: adminId,
          rejectedByName: adminName,
          rejectionReason: reason,
        }

        return NextResponse.json(updatedSubmission)
      }
    }

    return NextResponse.json({ error: "Неверный тип запроса" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

