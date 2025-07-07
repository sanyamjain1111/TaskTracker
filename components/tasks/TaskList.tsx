"use client"

import { useState, useMemo } from "react"
import { useTasks } from "@/contexts/TaskContext"
import TaskItem from "./TaskItem"
import TaskFilter from "./TaskFilter"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Trash2, CheckSquare } from "lucide-react"

export default function TaskList() {
  const { tasks, bulkDelete, bulkToggle } = useTasks()
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    category: "all",
  })

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Status filter
      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "completed" && task.completed) ||
        (filters.status === "pending" && !task.completed) ||
        (filters.status === "overdue" && !task.completed && task.dueDate && new Date(task.dueDate) < new Date())

      // Priority filter
      const matchesPriority = filters.priority === "all" || task.priority === filters.priority

      // Category filter
      const matchesCategory = filters.category === "all" || task.category === filters.category

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory
    })
  }, [tasks, searchQuery, filters])

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(filteredTasks.map((task) => task.id))
    }
  }

  const handleBulkDelete = () => {
    if (selectedTasks.length > 0 && confirm(`Delete ${selectedTasks.length} selected tasks?`)) {
      bulkDelete(selectedTasks)
      setSelectedTasks([])
    }
  }

  const handleBulkToggle = () => {
    if (selectedTasks.length > 0) {
      bulkToggle(selectedTasks)
      setSelectedTasks([])
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle className="text-xl font-bold">Tasks</CardTitle>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters */}
        <TaskFilter filters={filters} onFiltersChange={setFilters} />

        {/* Bulk Actions */}
        {selectedTasks.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="text-sm text-blue-700 dark:text-blue-300">
              {selectedTasks.length} task{selectedTasks.length !== 1 ? "s" : ""} selected
            </span>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={handleBulkToggle}>
                <CheckSquare className="w-4 h-4 mr-1" />
                Toggle
              </Button>
              <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery || Object.values(filters).some((f) => f !== "all") ? "No tasks found" : "No tasks yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || Object.values(filters).some((f) => f !== "all")
                ? "Try adjusting your search or filters"
                : "Create your first task to get started"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Select All */}
            <div className="flex items-center space-x-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <input
                type="checkbox"
                checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Select all ({filteredTasks.length})</span>
            </div>

            {/* Task List */}
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isSelected={selectedTasks.includes(task.id)}
                onSelect={() => handleSelectTask(task.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
