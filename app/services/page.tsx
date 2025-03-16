import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CrossIcon as MedicalCross,
  Pill,
  FileText,
  ShieldCheck,
  Clock,
  Stethoscope,
  Syringe,
  HeartPulse,
} from "lucide-react"
import Image from "next/image"

// Organize services into categories
const serviceCategories = [
  {
    id: "basic",
    name: "Основные услуги",
    icon: <HeartPulse className="h-5 w-5" />,
    services: [
      { id: 1, name: "Лечение", price: 60000, icon: <MedicalCross className="h-5 w-5 text-red-500" /> },
      {
        id: 2,
        name: "Лечение личных охранников (( /healactor ))",
        price: 300000,
        icon: <Stethoscope className="h-5 w-5 text-red-500" />,
      },
      { id: 4, name: "Вывод наркозависимости", price: 150000, icon: <Pill className="h-5 w-5 text-red-500" /> },
      {
        id: 9,
        name: "Медицинский осмотр (( /medcheck ))",
        price: 300000,
        icon: <Stethoscope className="h-5 w-5 text-red-500" />,
      },
    ],
  },
  {
    id: "cards",
    name: "Медицинские карты",
    icon: <FileText className="h-5 w-5" />,
    services: [
      { id: 5, name: "Медицинская карта (7 дней)", price: 50000, icon: <Clock className="h-5 w-5 text-red-500" /> },
      { id: 6, name: "Медицинская карта (14 дней)", price: 80000, icon: <Clock className="h-5 w-5 text-red-500" /> },
      { id: 7, name: "Медицинская карта (30 дней)", price: 130000, icon: <Clock className="h-5 w-5 text-red-500" /> },
      { id: 8, name: "Медицинская карта (60 дней)", price: 175000, icon: <Clock className="h-5 w-5 text-red-500" /> },
    ],
  },
  {
    id: "additional",
    name: "Дополнительные услуги",
    icon: <Syringe className="h-5 w-5" />,
    services: [
      { id: 3, name: "Рецепт (1 шт.)", price: 30000, icon: <FileText className="h-5 w-5 text-red-500" /> },
      {
        id: 10,
        name: "Медицинская страховка (1 неделя)",
        price: 400000,
        icon: <ShieldCheck className="h-5 w-5 text-red-500" />,
      },
      { id: 11, name: "Антибиотик (1 шт.)", price: 25000, icon: <Pill className="h-5 w-5 text-red-500" /> },
    ],
  },
]

// Format price with commas for better readability
function formatPrice(price: number) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export default function ServicesPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <div className="rounded-full bg-red-100 p-4">
          <MedicalCross className="h-6 w-6 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">ЦЕНОВАЯ ПОЛИТИКА</h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
          Ознакомьтесь с актуальными ценами на медицинские услуги
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Все услуги</TabsTrigger>
            <TabsTrigger value="basic">Основные услуги</TabsTrigger>
            <TabsTrigger value="cards">Медицинские карты</TabsTrigger>
            <TabsTrigger value="additional">Дополнительные</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-8">
              {serviceCategories.map((category) => (
                <Card key={category.id} className="overflow-hidden border-t-4 border-t-red-500">
                  <CardHeader className="bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-red-100 p-2">{category.icon}</div>
                      <CardTitle>{category.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                      {category.services.map((service) => (
                        <div key={service.id} className="flex items-start gap-4 p-4 rounded-lg border">
                          <div className="rounded-full bg-red-50 p-2 mt-1">{service.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-medium">{service.name}</h3>
                            <p className="text-2xl font-bold text-red-600">${formatPrice(service.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {serviceCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <Card className="overflow-hidden border-t-4 border-t-red-500">
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-red-100 p-2">{category.icon}</div>
                    <CardTitle>{category.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                    {category.services.map((service) => (
                      <div key={service.id} className="flex items-start gap-4 p-4 rounded-lg border">
                        <div className="rounded-full bg-red-50 p-2 mt-1">{service.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-medium">{service.name}</h3>
                          <p className="text-2xl font-bold text-red-600">${formatPrice(service.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card className="bg-gradient-to-br from-red-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-red-500" />
                Медицинская страховка
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Медицинская страховка обеспечивает вам бесплатное лечение в течение срока действия.
              </p>
              <p className="font-medium">Стоимость: $400,000 за неделю</p>
              <Badge className="mt-2 bg-red-100 text-red-800 hover:bg-red-200">Максимум на 3 недели</Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-500" />
                Медицинские карты
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Медицинская карта необходима для работы в государственных организациях.</p>
              <ul className="space-y-1">
                <li className="flex justify-between">
                  <span>7 дней:</span>
                  <span className="font-bold">$50,000</span>
                </li>
                <li className="flex justify-between">
                  <span>14 дней:</span>
                  <span className="font-bold">$80,000</span>
                </li>
                <li className="flex justify-between">
                  <span>30 дней:</span>
                  <span className="font-bold">$130,000</span>
                </li>
                <li className="flex justify-between">
                  <span>60 дней:</span>
                  <span className="font-bold">$175,000</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-red-500" />
                Лекарства
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Мы предлагаем различные лекарственные препараты для лечения заболеваний.</p>
              <ul className="space-y-1">
                <li className="flex justify-between">
                  <span>Рецепт (1 шт.):</span>
                  <span className="font-bold">$30,000</span>
                </li>
                <li className="flex justify-between">
                  <span>Антибиотик (1 шт.):</span>
                  <span className="font-bold">$25,000</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-6 flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-4">Почему стоит выбрать нас?</h2>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="rounded-full bg-green-100 p-1">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Профессиональные врачи</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="rounded-full bg-green-100 p-1">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Современное оборудование</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="rounded-full bg-green-100 p-1">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Быстрое обслуживание</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="rounded-full bg-green-100 p-1">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Доступные цены</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 bg-red-500 flex items-center justify-center p-6">
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Медицинский персонал"
                width={400}
                height={300}
                className="rounded-lg"
              />
            </div>
          </div>
        </Card>

        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Важная информация</h2>
          <p className="text-gray-600 mb-4">
            Цены могут быть изменены без предварительного уведомления. Актуальные цены уточняйте у сотрудников
            Министерства Здравоохранения.
          </p>
          <p className="text-red-600 font-medium">Медицинскую страховку можно приобрести максимум на 3 недели.</p>
        </div>
      </div>
    </div>
  )
}

