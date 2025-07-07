"use client"

import { AuthProvider } from "@/contexts/AuthContext"
import { TaskProvider } from "@/contexts/TaskContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import TaskTracker from "@/components/TaskTracker"

export default function Home() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <TaskTracker />
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
