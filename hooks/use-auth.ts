"use client"

import { useState, useEffect } from "react"
import type { User } from "@/types"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("grilo-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem("grilo-user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("grilo-user")
  }

  return { user, login, logout }
}
