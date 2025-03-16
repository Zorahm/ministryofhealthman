import { NextResponse } from "next/server"

// Updated services with categories
const services = {
  basic: [
    { id: 1, name: "Лечение", price: 60000 },
    { id: 2, name: "Лечение личных охранников (( /healactor ))", price: 300000 },
    { id: 4, name: "Вывод наркозависимости", price: 150000 },
    { id: 9, name: "Медицинский осмотр (( /medcheck ))", price: 300000 },
  ],
  cards: [
    { id: 5, name: "Медицинская карта (7 дней)", price: 50000 },
    { id: 6, name: "Медицинская карта (14 дней)", price: 80000 },
    { id: 7, name: "Медицинская карта (30 дней)", price: 130000 },
    { id: 8, name: "Медицинская карта (60 дней)", price: 175000 },
  ],
  additional: [
    { id: 3, name: "Рецепт (1 шт.)", price: 30000 },
    { id: 10, name: "Медицинская страховка (1 неделя)", price: 400000 },
    { id: 11, name: "Антибиотик (1 шт.)", price: 25000 },
  ],
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const category = url.searchParams.get("category")

  if (category && category in services) {
    return NextResponse.json(services[category as keyof typeof services])
  }

  // Return all services if no category specified
  const allServices = [...services.basic, ...services.cards, ...services.additional]

  return NextResponse.json(allServices)
}

