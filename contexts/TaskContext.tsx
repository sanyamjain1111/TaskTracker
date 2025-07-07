"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: "high" | "medium" | "low"
  category: "work" | "personal" | "shopping" | "health" | "other"
  dueDate: string
  createdAt: string
  updatedAt: string
  tags: string[]
  estimatedTime?: number
  actualTime?: number
}

interface TaskContextType {
  tasks: Task[]
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  bulkDelete: (ids: string[]) => void
  bulkToggle: (ids: string[]) => void
  getTaskStats: () => TaskStats
}

interface TaskStats {
  total: number
  completed: number
  pending: number
  overdue: number
  byPriority: Record<string, number>
  byCategory: Record<string, number>
  completionRate: number
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const savedTasks = localStorage.getItem("taskTracker_tasks")
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (error) {
        console.error("Error parsing saved tasks:", error)
        localStorage.removeItem("taskTracker_tasks")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("taskTracker_tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTasks((prev) => [newTask, ...prev])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task)),
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() } : task,
      ),
    )
  }

  const bulkDelete = (ids: string[]) => {
    setTasks((prev) => prev.filter((task) => !ids.includes(task.id)))
  }

  const bulkToggle = (ids: string[]) => {
    setTasks((prev) =>
      prev.map((task) =>
        ids.includes(task.id) ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() } : task,
      ),
    )
  }

  const getTaskStats = (): TaskStats => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.completed).length
    const pending = total - completed
    const overdue = tasks.filter(
      (task) => !task.completed && task.dueDate && new Date(task.dueDate) < new Date(),
    ).length

    const byPriority = tasks.reduce(
      (acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const byCategory = tasks.reduce(
      (acc, task) => {
        acc[task.category] = (acc[task.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      total,
      completed,
      pending,
      overdue,
      byPriority,
      byCategory,
      completionRate,
    }
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        bulkDelete,
        bulkToggle,
        getTaskStats,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}
