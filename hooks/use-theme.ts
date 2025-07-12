"use client"

import { useState, useEffect } from "react"

export type Theme = "dark" | "light"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark") // Dark como padrão

  useEffect(() => {
    const saved = localStorage.getItem("grilo-theme") as Theme
    if (saved) {
      setTheme(saved)
    }

    // Apply theme to document
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("grilo-theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return { theme, toggleTheme }
}
