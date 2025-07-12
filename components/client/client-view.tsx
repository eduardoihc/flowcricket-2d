"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, Play } from "lucide-react"
import type { User } from "@/types"
import { useData } from "@/hooks/use-data"
import { PieceView } from "@/components/shared/piece-view"
import { ThemeToggle } from "@/components/shared/theme-toggle"

interface ClientViewProps {
  user: User
  onLogout: () => void
}

export function ClientView({ user, onLogout }: ClientViewProps) {
  const { pieces } = useData()
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null)

  const clientPieces = pieces.filter((p) => p.clientId === user.clientId)

  if (selectedPiece) {
    const piece = clientPieces.find((p) => p.id === selectedPiece)
    if (piece) {
      return <PieceView piece={piece} user={user} onBack={() => setSelectedPiece(null)} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-green-600">grilo</h1>
              <Badge variant="outline">{user.clientName}</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <span className="text-sm text-gray-600 dark:text-gray-300">Olá, {user.name}</span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {clientPieces.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Nenhuma peça disponível para aprovação.</p>
            </div>
          ) : (
            clientPieces.map((piece) => {
              const firstFile = piece.files[0]
              const isVideo = firstFile?.type.startsWith("video/")

              return (
                <div
                  key={piece.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => setSelectedPiece(piece.id)}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{piece.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{piece.projectName}</p>
                      </div>
                      <Badge
                        variant={
                          piece.status === "approved"
                            ? "default"
                            : piece.status === "needs_changes"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {piece.status === "approved"
                          ? "Aprovada"
                          : piece.status === "needs_changes"
                            ? "Ajustar"
                            : "Pendente"}
                      </Badge>
                    </div>

                    <div
                      className="relative bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden mb-4 flex items-center justify-center transition-colors"
                      style={{ minHeight: "300px" }}
                    >
                      {firstFile && (
                        <>
                          {isVideo ? (
                            <div className="relative">
                              <video src={firstFile.url} className="max-w-full max-h-80 object-contain" muted />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <Play className="w-12 h-12 text-white" />
                              </div>
                            </div>
                          ) : (
                            <img
                              src={firstFile.url || "/placeholder.svg"}
                              alt={piece.name}
                              className="max-w-full max-h-80 object-contain"
                            />
                          )}
                        </>
                      )}
                    </div>

                    {piece.caption && <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{piece.caption}</p>}

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Criado em {new Date(piece.createdAt).toLocaleDateString("pt-BR")}</span>
                      <span>Atualizado em {new Date(piece.updatedAt).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}
