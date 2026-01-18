'use client'

import { useState } from 'react'
import { 
  ClientHeader, 
  ClientHero, 
  ClientStatsCard, 
  ClientContactForm, 
  ClientEngineerTable, 
  ClientStatusBadges, 
  ClientFooter 
} from '@/components/design-patterns/client'

export default function ClientDesignPattern() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Sample data
  const stats = [
    { value: "150+", label: "Active Engineers" },
    { value: "50+", label: "Completed Projects" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "24/7", label: "Support Available" }
  ]

  const engineers = [
    {
      id: "1",
      name: "Nguyen Van A",
      title: "Senior Full Stack Developer",
      skills: ["React", "Node.js", "TypeScript"],
      experience: "5 years",
      location: "Ho Chi Minh City"
    },
    {
      id: "2", 
      name: "Tran Thi B",
      title: "Frontend Developer",
      skills: ["Vue.js", "JavaScript", "CSS"],
      experience: "3 years",
      location: "Hanoi"
    },
    {
      id: "3",
      name: "Le Van C", 
      title: "Backend Developer",
      skills: ["Java", "Spring Boot", "MySQL"],
      experience: "4 years",
      location: "Da Nang"
    }
  ]

  const statusBadges = [
    { label: "Available", variant: "available" as const },
    { label: "Busy", variant: "busy" as const },
    { label: "Unavailable", variant: "unavailable" as const },
    { label: "New", variant: "new" as const }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ClientHero />
        
        {/* Statistics Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <ClientStatsCard
                key={index}
                value={stat.value}
                label={stat.label}
              />
            ))}
          </div>
        </section>

        {/* Engineer Table */}
        <ClientEngineerTable engineers={engineers} />

        {/* Status Badges */}
        <ClientStatusBadges badges={statusBadges} />

        {/* Contact Form */}
        <ClientContactForm />
      </main>

      <ClientFooter />
    </div>
  )
}