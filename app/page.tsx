import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CrossIcon as MedicalCross, Users, FileText } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      <main className="w-full">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-100">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Министерство Здравоохранения
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Добро пожаловать на официальный сайт Министерства Здравоохранения сервера Casa-Grande
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/services">
                  <Button className="bg-red-500 hover:bg-red-600">Наши услуги</Button>
                </Link>
                <Link href="/staff">
                  <Button variant="outline">Наши сотрудники</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-red-100 p-4">
                  <MedicalCross className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold">Медицинские услуги</h3>
                <p className="text-gray-500">Ознакомьтесь с полным списком медицинских услуг и их стоимостью</p>
                <Link href="/services">
                  <Button variant="link" className="text-red-500">
                    Подробнее
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-red-100 p-4">
                  <Users className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold">Наши сотрудники</h3>
                <p className="text-gray-500">Информация о коллективе и сотрудниках Министерства Здравоохранения</p>
                <Link href="/staff">
                  <Button variant="link" className="text-red-500">
                    Подробнее
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-red-100 p-4">
                  <FileText className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold">Личный кабинет</h3>
                <p className="text-gray-500">Вход для сотрудников Министерства Здравоохранения</p>
                <Link href="/login">
                  <Button variant="link" className="text-red-500">
                    Войти
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

