"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, MessageSquare, CheckCircle, AlertCircle, LogOut, Plus, Play, Edit } from "lucide-react"
import type { User } from "@/types"
import { useData } from "@/hooks/use-data"
import { UploadModal } from "./upload-modal"
import { PieceView } from "@/components/shared/piece-view"
import { ClientManager } from "./client-manager"
import { PieceEditModal } from "./piece-edit-modal"
import { ThemeToggle } from "@/components/shared/theme-toggle"

interface AdminDashboardProps {
  user: User
  onLogout: () => void
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const { pieces, projects, addProject, addPiece, updatePiece } = useData()
  const [showUpload, setShowUpload] = useState(false)
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null)
  const [showClientManager, setShowClientManager] = useState(false)
  const [editingPiece, setEditingPiece] = useState<string | null>(null)

  const stats = {
    pending: pieces.filter((p) => p.status === "pending").length,
    approved: pieces.filter((p) => p.status === "approved").length,
    needsChanges: pieces.filter((p) => p.status === "needs_changes").length,
    totalComments: pieces.reduce(
      (acc, p) => acc + p.markers.reduce((markerAcc, m) => markerAcc + m.comments.length, 0),
      0,
    ),
  }

  if (selectedPiece) {
    const piece = pieces.find((p) => p.id === selectedPiece)
    if (piece) {
      return <PieceView piece={piece} user={user} onBack={() => setSelectedPiece(null)} />
    }
  }

  const editingPieceData = editingPiece ? pieces.find((p) => p.id === editingPiece) : null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-green-600">grilo</h1>
              <Badge variant="secondary">Admin</Badge>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aprovações Pendentes</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Comentários Novos</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalComments}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Peças Aprovadas</p>
                  <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Solicitar Alterações</p>
                  <p className="text-3xl font-bold text-red-600">{stats.needsChanges}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 mb-6">
          <Button onClick={() => setShowUpload(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload de Peça
          </Button>
          <Button onClick={() => setShowClientManager(true)} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Gerenciar Clientes
          </Button>
        </div>

        <Tabs defaultValue="pieces" className="space-y-6">
          <TabsList className="dark:bg-gray-800">
            <TabsTrigger value="pieces">Peças</TabsTrigger>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
          </TabsList>

          <TabsContent value="pieces">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pieces.map((piece) => (
                <Card
                  key={piece.id}
                  className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700"
                >
                  <CardContent className="p-4">
                    <div
                      className="relative bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden mb-4 flex items-center justify-center cursor-pointer transition-colors"
                      style={{ minHeight: "200px" }}
                      onClick={() => setSelectedPiece(piece.id)}
                    >
                      {piece.files[0] && (
                        <>
                          {piece.files[0].type.startsWith("video/") ? (
                            <div className="relative">
                              <video src={piece.files[0].url} className="max-w-full max-h-48 object-contain" muted />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <Play className="w-8 h-8 text-white" />
                              </div>
                            </div>
                          ) : (
                            <img
                              src={piece.files[0].url || "/placeholder.svg"}
                              alt={piece.name}
                              className="max-w-full max-h-48 object-contain"
                            />
                          )}
                        </>
                      )}
                    </div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">{piece.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {piece.projectName} • {piece.clientName}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingPiece(piece.id)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
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
                      {piece.markers.some((m) => m.comments.length > 0) && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {piece.markers.reduce((acc, m) => acc + m.comments.length, 0)}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">{project.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{project.clientName}</p>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      Criado em {new Date(project.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {showUpload && (
        <UploadModal
          projects={projects}
          onClose={() => setShowUpload(false)}
          onUpload={addPiece}
          onCreateProject={addProject}
        />
      )}
      {showClientManager && <ClientManager onClose={() => setShowClientManager(false)} />}
      {editingPieceData && (
        <PieceEditModal
          piece={editingPieceData}
          projects={projects}
          onClose={() => setEditingPiece(null)}
          onSave={updatePiece}
        />
      )}
    </div>
  )
}
