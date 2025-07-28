"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

// Demo mode for testing without Supabase setup
const DEMO_MODE = true

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  // Demo mode - bypass Supabase authentication
  if (DEMO_MODE) {
    // Accept any email/password combination for demo
    if (email.includes("@") && password.length >= 6) {
      const cookieStore = await cookies()

      // Set a demo session cookie
      cookieStore.set(
        "demo_user",
        JSON.stringify({
          id: "demo-user-id",
          email: email.trim(),
          user_metadata: {
            full_name: "Demo User",
            professional_title: "Aesthetic Injector",
          },
        }),
        {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        },
      )

      revalidatePath("/dashboard")
      redirect("/dashboard")
    } else {
      return { error: "Please enter a valid email and password (minimum 6 characters)" }
    }
  }

  // Production mode - use Supabase
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      console.error("Sign in error:", error)
      return { error: "Invalid email or password. Please check your credentials and try again." }
    }

    if (data.user) {
      revalidatePath("/dashboard")
      redirect("/dashboard")
    }
  } catch (error) {
    console.error("Unexpected error during sign in:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }

  return { error: "Sign in failed. Please try again." }
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const professionalTitle = formData.get("professional_title") as string

  if (!email || !password || !name || !professionalTitle) {
    return { error: "All fields are required" }
  }

  // Demo mode - bypass Supabase authentication
  if (DEMO_MODE) {
    if (email.includes("@") && password.length >= 6) {
      const cookieStore = await cookies()

      // Set a demo session cookie
      cookieStore.set(
        "demo_user",
        JSON.stringify({
          id: "demo-user-id",
          email: email.trim(),
          user_metadata: {
            full_name: name.trim(),
            professional_title: professionalTitle.trim(),
          },
        }),
        {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        },
      )

      revalidatePath("/dashboard")
      redirect("/dashboard")
    } else {
      return { error: "Please enter a valid email and password (minimum 6 characters)" }
    }
  }

  // Production mode - use Supabase
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: name.trim(),
          professional_title: professionalTitle.trim(),
        },
      },
    })

    if (error) {
      console.error("Sign up error:", error)
      if (error.message.includes("already registered")) {
        return { error: "An account with this email already exists. Please sign in instead." }
      }
      return { error: error.message }
    }

    if (data.user) {
      if (!data.session) {
        return {
          error: "Please check your email and click the confirmation link to complete your registration.",
        }
      }

      revalidatePath("/dashboard")
      redirect("/dashboard")
    }
  } catch (error) {
    console.error("Unexpected error during sign up:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }

  return { error: "Sign up failed. Please try again." }
}

export async function signOut() {
  const cookieStore = await cookies()

  // Demo mode - clear demo session
  if (DEMO_MODE) {
    cookieStore.delete("demo_user")
    revalidatePath("/")
    redirect("/login")
    return
  }

  // Production mode - use Supabase
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Sign out error:", error)
    }
  } catch (error) {
    console.error("Unexpected error during sign out:", error)
  }

  revalidatePath("/")
  redirect("/login")
}

// Helper function to get demo user
export async function getDemoUser() {
  if (!DEMO_MODE) return null

  const cookieStore = await cookies()
  const demoUser = cookieStore.get("demo_user")

  if (demoUser) {
    try {
      return JSON.parse(demoUser.value)
    } catch {
      return null
    }
  }

  return null
}
