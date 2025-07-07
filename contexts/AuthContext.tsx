"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  username: string
  loginTime: string
}

interface AuthContextType {
  user: User | null
  login: (username: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("taskTracker_currentUser")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("taskTracker_currentUser")
      }
    }
  }, [])

  const login = (username: string) => {
    const userData = {
      username: username.trim(),
      loginTime: new Date().toISOString(),
    }
    setUser(userData)
    localStorage.setItem("taskTracker_currentUser", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("taskTracker_currentUser")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
