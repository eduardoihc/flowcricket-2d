"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button variant="outline" size="sm" onClick={toggleTheme}>
      {theme === "dark" ? (
        <>
          <Sun className="w-4 h-4 mr-2" />
          Modo Claro
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 mr-2" />
          Modo Escuro
        </>
      )}
    </Button>
  )
}
