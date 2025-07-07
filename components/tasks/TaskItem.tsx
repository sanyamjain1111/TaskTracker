"use client"

import { useState } from "react"
import { useTasks } from "@/contexts/TaskContext"
import type { Task } from "@/contexts/TaskContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Calendar, Tag, Clock, AlertTriangle, CheckCircle, Circle } from "lucide-react"
import TaskForm from "./TaskForm"

interface TaskItemProps {
  task: Task
  isSelected: boolean
  onSelect: () => void
}

const priorityColors = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
}

const categoryColors = {
  work: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  personal: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  shopping: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  health: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
}

export default function TaskItem({ task, isSelected, onSelect }: TaskItemProps) {
  const { toggleTask, deleteTask } = useTasks()
  const [showEditForm, setShowEditForm] = useState(false)

  const isOverdue = !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
  const isDueToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString()

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(task.id)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <>
      <div
        className={`
        p-4 border rounded-lg transition-all duration-200 hover:shadow-md
        ${
          task.completed
            ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        }
        ${isSelected ? "ring-2 ring-blue-500 border-blue-500" : ""}
      `}
      >
        <div className="flex items-start space-x-3">
          {/* Selection Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />

          {/* Completion Toggle */}
          <button
            onClick={() => toggleTask(task.id)}
            className="mt-1 text-gray-400 hover:text-blue-600 transition-colors"
          >
            {task.completed ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Circle className="w-5 h-5" />}
          </button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3
                  className={`
                  font-medium text-gray-900 dark:text-white
                  ${task.completed ? "line-through text-gray-500 dark:text-gray-400" : ""}
                `}
                >
                  {task.title}
                </h3>

                {task.description && (
                  <p
                    className={`
                    mt-1 text-sm text-gray-600 dark:text-gray-400
                    ${task.completed ? "line-through" : ""}
                  `}
                  >
                    {task.description}
                  </p>
                )}

                {/* Tags and Metadata */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {/* Priority Badge */}
                  <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>

                  {/* Category Badge */}
                  <Badge className={categoryColors[task.category]}>{task.category}</Badge>

                  {/* Due Date */}
                  {task.dueDate && (
                    <div
                      className={`
                      flex items-center space-x-1 text-xs px-2 py-1 rounded-full
                      ${
                        isOverdue
                          ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          : isDueToday
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                      }
                    `}
                    >
                      {isOverdue ? <AlertTriangle className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  )}

                  {/* Tags */}
                  {task.tags.map((tag) => (
                    <div key={tag} className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
                      <Tag className="w-3 h-3" />
                      <span>{tag}</span>
                    </div>
                  ))}

                  {/* Estimated Time */}
                  {task.estimatedTime && (
                    <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{task.estimatedTime}min</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1 ml-4">
                <Button variant="ghost" size="icon" onClick={() => setShowEditForm(true)} className="h-8 w-8">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditForm && <TaskForm task={task} onClose={() => setShowEditForm(false)} />}
    </>
  )
}
