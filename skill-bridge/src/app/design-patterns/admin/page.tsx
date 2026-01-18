'use client'

import { useState } from 'react'
import { 
  AdminHeader, 
  AdminSidebar, 
  AdminStatsCard, 
  AdminContactForm, 
  AdminContactsTable, 
  AdminStatusBadges 
} from '@/components/design-patterns/admin'

export default function AdminDesignPattern() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Sample data
  const stats = [
    {
      title: "Total Contacts",
      value: "1,234",
      change: "+12% from last month",
      changeType: "positive" as const,
      iconColor: "blue" as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Active Opportunities",
      value: "89",
      change: "+5% from last month",
      changeType: "positive" as const,
      iconColor: "orange" as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "Revenue This Month",
      value: "$45,678",
      change: "+18% from last month",
      changeType: "positive" as const,
      iconColor: "green" as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: "Pending Tasks",
      value: "23",
      change: "-3 from yesterday",
      changeType: "negative" as const,
      iconColor: "red" as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    }
  ]

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      ),
      isActive: true
    },
    {
      id: "contacts",
      label: "Contacts",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      badge: "12"
    },
    {
      id: "opportunities",
      label: "Opportunities",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: "proposals",
      label: "Proposals",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: "contracts",
      label: "Contracts",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ]

  const contacts = [
    {
      id: "1",
      company: "TechCorp Japan",
      industry: "Technology",
      contactPerson: "Yamada Taro",
      email: "yamada@techcorp.jp",
      status: "New",
      priority: "High",
      created: "2024-12-15"
    },
    {
      id: "2",
      company: "Global Solutions",
      industry: "Consulting",
      contactPerson: "Smith John",
      email: "smith@globalsol.com",
      status: "In Progress",
      priority: "Medium",
      created: "2024-12-14"
    },
    {
      id: "3",
      company: "StartupXYZ",
      industry: "Startup",
      contactPerson: "Lee Min",
      email: "lee@startupxyz.com",
      status: "Verified",
      priority: "Low",
      created: "2024-12-13"
    }
  ]

  const statusBadges = [
    { label: "New", variant: "new" as const },
    { label: "In Progress", variant: "in-progress" as const },
    { label: "Verified", variant: "verified" as const },
    { label: "Converted", variant: "converted" as const },
    { label: "Closed", variant: "closed" as const },
    { label: "High Priority", variant: "high" as const },
    { label: "Medium Priority", variant: "medium" as const },
    { label: "Low Priority", variant: "low" as const },
    { label: "Urgent", variant: "urgent" as const }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        notificationCount={5}
        userInitials="SM"
        userName="Sales Manager"
        userRole="Sales Manager"
      />
      
      <div className="flex">
        <AdminSidebar items={navigationItems} />
        
        <main className="flex-1 p-8">
          {/* Statistics Cards */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <AdminStatsCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  changeType={stat.changeType}
                  iconColor={stat.iconColor}
                  icon={stat.icon}
                />
              ))}
            </div>
          </section>

          {/* Contact Form */}
          <AdminContactForm />

          {/* Contacts Table */}
          <AdminContactsTable contacts={contacts} />

          {/* Status Badges */}
          <AdminStatusBadges badges={statusBadges} />
        </main>
      </div>
    </div>
  )
}