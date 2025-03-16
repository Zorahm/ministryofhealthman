"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Данные о сотрудниках для двух больниц
const staffMembers = {
  ls: [
    {
      id: 1,
      name: "Иван Петров",
      position: "Лидер (10 уровень)",
      image: "/placeholder.svg?height=200&width=200",
      hospital: "Los-Santos",
    },
    {
      id: 2,
      name: "Елена Смирнова",
      position: "Заместитель (9 уровень)",
      image: "/placeholder.svg?height=200&width=200",
      hospital: "Los-Santos",
    },
    {
      id: 3,
      name: "Алексей Иванов",
      position: "Главный врач (8 уровень)",
      image: "/placeholder.svg?height=200&width=200",
      hospital: "Los-Santos",
    },
  ],
  lv: [
    {
      id: 4,
      name: "Мария Козлова",
      position: "Лидер (10 уровень)",
      image: "/placeholder.svg?height=200&width=200",
      hospital: "Las-Venturas",
    },
    {
      id: 5,
      name: "Дмитрий Соколов",
      position: "Заместитель (9 уровень)",
      image: "/placeholder.svg?height=200&width=200",
      hospital: "Las-Venturas",
    },
    {
      id: 6,
      name: "Ольга Новикова",
      position: "Главный врач (8 уровень)",
      image: "/placeholder.svg?height=200&width=200",
      hospital: "Las-Venturas",
    },
  ],
}

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState("all")

  // Объединяем сотрудников для вкладки "Все сотрудники"
  const allStaff = [...staffMembers.ls, ...staffMembers.lv]

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-24">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <div className="rounded-full bg-red-100 p-4">
          <Users className="h-6 w-6 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Наши сотрудники</h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
          Познакомьтесь с коллективом Министерства Здравоохранения
        </p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Все сотрудники</TabsTrigger>
          <TabsTrigger value="ls">Больница Los-Santos</TabsTrigger>
          <TabsTrigger value="lv">Больница Las-Venturas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allStaff.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <CardHeader className="p-4">
                  <CardTitle>{member.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-500">{member.position}</p>
                  <p className="text-sm text-gray-400 mt-1">Больница {member.hospital}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ls" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {staffMembers.ls.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <CardHeader className="p-4">
                  <CardTitle>{member.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-500">{member.position}</p>
                  <p className="text-sm text-gray-400 mt-1">Больница {member.hospital}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lv" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {staffMembers.lv.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <CardHeader className="p-4">
                  <CardTitle>{member.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-500">{member.position}</p>
                  <p className="text-sm text-gray-400 mt-1">Больница {member.hospital}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

