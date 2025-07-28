"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getDemoUser } from "./auth-actions"

export async function createWorkflowRecord(procedureName: string) {
  // Try demo user first
  const demoUser = await getDemoUser()
  if (demoUser) {
    // In demo mode, just simulate success
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
    return { success: true }
  }

  // Production mode - use Supabase
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    const { error } = await supabase.from("checklist_records").insert({
      user_id: user.id,
      procedure_name: procedureName,
    })

    if (error) {
      throw new Error("Failed to create workflow record")
    }

    return { success: true }
  } catch (error) {
    console.error("Error creating workflow record:", error)
    throw new Error("Failed to create workflow record")
  }
}
