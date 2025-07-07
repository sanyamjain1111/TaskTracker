"use client"

import { useAuth } from "@/contexts/AuthContext"
import LoginForm from "@/components/auth/LoginForm"
import Dashboard from "@/components/Dashboard"

export default function TaskTracker() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {isAuthenticated ? <Dashboard /> : <LoginForm />}
    </div>
  )
}
