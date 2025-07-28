import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { getDemoUser } from "@/app/actions/auth-actions"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user = null

  // Try demo user first
  const demoUser = await getDemoUser()
  if (demoUser) {
    user = demoUser
  } else {
    // Try Supabase user
    try {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      user = data.user
    } catch (error) {
      console.error("Error getting user:", error)
    }
  }

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={user} />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  )
}
