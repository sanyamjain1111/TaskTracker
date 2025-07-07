"use client"

import { useState } from "react"
import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/Sidebar"
import TaskList from "@/components/tasks/TaskList"
import TaskForm from "@/components/tasks/TaskForm"
import TaskStats from "@/components/tasks/TaskStats"
import { useTasks } from "@/contexts/TaskContext"

export default function Dashboard() {
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { tasks } = useTasks()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} onNewTask={() => setShowTaskForm(true)} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onNewTask={() => setShowTaskForm(true)} />

        <main className="flex-1 p-4 lg:p-6">
          <div className="w-full space-y-6">
            <TaskStats />
            <TaskList />
          </div>
        </main>
      </div>

      {showTaskForm && <TaskForm onClose={() => setShowTaskForm(false)} />}
    </div>
  )
}