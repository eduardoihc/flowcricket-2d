"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Check, X, ChevronLeft, ChevronRight, Plus, History, Send, Edit, Trash2, Save } from "lucide-react"
import type { User, Piece, Comment, Marker } from "@/types"
import { useData } from "@/hooks/use-data"
import { PieceHistory } from "./piece-history"
import { ThemeToggle } from "./theme-toggle"
import { PieceEditModal } from "@/components/admin/piece-edit-modal"

interface PieceViewProps {
  piece: Piece
  user: User
  onBack: () => void
}

export function PieceView({ piece: initialPiece, user, onBack }: PieceViewProps) {
  const {
    pieces,
    projects,
    updatePieceStatus,
    addComment,
    addMarker,
    closeMarker,
    updateComment,
    deleteComment,
    logs,
    updatePiece,
  } = useData()
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null)
  const [newComment, setNewComment] = useState("")
  const [showMarkers, setShowMarkers] = useState(true)
  const [addingMarker, setAddingMarker] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editCommentText, setEditCommentText] = useState("")
  const [showEditModal, setShowEditModal] = useState(false)
  const mediaRef = useRef<HTMLDivElement>(null)

  // Get current piece from pieces array to ensure real-time updates
  const piece = pieces.find((p) => p.id === initialPiece.id) || initialPiece

  const currentFile = piece.files[currentFileIndex]
  const isVideo = currentFile?.type.startsWith("video/")
  const isImage = currentFile?.type.startsWith("image/")

  const handleStatusChange = (status: "approved" | "needs_changes") => {
    updatePieceStatus(piece.id, status, user)
  }

  const handleAddMarker = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!addingMarker) return
    e.stopPropagation()

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const marker: Marker = {
      id: Date.now().toString(),
      x,
      y,
      fileIndex: currentFileIndex,
      comments: [],
      isActive: true,
      createdBy: user.name,
      createdByRole: user.role,
      createdAt: new Date().toISOString(),
    }

    await addMarker(piece.id, marker)
    setActiveCommentBox(marker.id)
    setAddingMarker(false)
  }

  const handleAddComment = async (markerId: string) => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment,
      author: user.name,
      authorRole: user.role,
      createdAt: new Date().toISOString(),
    }

    await addComment(piece.id, markerId, comment, user)
    setNewComment("")
  }

  const handleEditComment = (commentId: string, currentText: string) => {
    setEditingComment(commentId)
    setEditCommentText(currentText)
  }

  const handleSaveEdit = async (markerId: string, commentId: string) => {
    if (!editCommentText.trim()) return

    await updateComment(piece.id, markerId, commentId, editCommentText.trim(), user)
    setEditingComment(null)
    setEditCommentText("")
  }

  const handleCancelEdit = () => {
    setEditingComment(null)
    setEditCommentText("")
  }

  const handleDeleteComment = async (markerId: string, commentId: string) => {
    if (confirm("Tem certeza que deseja excluir este comentário?")) {
      await deleteComment(piece.id, markerId, commentId, user)
    }
  }

  const activeMarkers = piece.markers.filter((m) => {
    const isActiveOnCurrentFile = m.isActive && m.fileIndex === currentFileIndex
    if (user.role === "client") {
      // Cliente só vê marcadores criados por clientes
      return isActiveOnCurrentFile && m.createdByRole === "client"
    }
    // Admin vê todos os marcadores
    return isActiveOnCurrentFile
  })

  const getVisibleComments = (marker: Marker) => {
    if (user.role === "admin") {
      return marker.comments
    } else {
      return marker.comments.filter((c) => c.authorRole === "client")
    }
  }

  const getCommentBoxPosition = (marker: Marker) => {
    const isLeftHalf = marker.x <= 50

    if (isLeftHalf) {
      // Marcador na metade esquerda - janela à direita
      return {
        left: `${Math.min(marker.x + 8, 75)}%`,
        top: `${Math.max(marker.y - 10, 5)}%`,
      }
    } else {
      // Marcador na metade direita - janela à esquerda
      return {
        left: `${Math.max(marker.x - 32, 5)}%`,
        top: `${Math.max(marker.y - 10, 5)}%`,
      }
    }
  }

  const canEditComment = (comment: Comment) => {
    return comment.author === user.name && comment.authorRole === user.role
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{piece.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{piece.projectName}</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {user.role === "admin" && (
                <Button variant="outline" size="sm" onClick={() => setShowHistory(true)}>
                  <History className="w-4 h-4 mr-2" />
                  Histórico
                </Button>
              )}
              <Badge
                variant={
                  piece.status === "approved"
                    ? "default"
                    : piece.status === "needs_changes"
                      ? "destructive"
                      : "secondary"
                }
              >
                {piece.status === "approved" ? "Aprovada" : piece.status === "needs_changes" ? "Ajustar" : "Pendente"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Media Section */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden transition-colors">
              {/* Controls */}
              <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant={addingMarker ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAddingMarker(!addingMarker)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {addingMarker ? "Cancelar" : "Adicionar Marcador"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowMarkers(!showMarkers)}>
                      {showMarkers ? "Ocultar" : "Mostrar"} Marcadores
                    </Button>
                    {addingMarker && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                          Clique na imagem para adicionar marcador
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Edit Button - Aligned to the right */}
                  {user.role === "admin" && (
                    <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>
              </div>

              {/* Media Area */}
              <div className="relative">
                <div
                  ref={mediaRef}
                  className={`relative bg-gray-100 dark:bg-gray-600 flex items-center justify-center transition-colors ${
                    addingMarker ? "cursor-crosshair" : "cursor-default"
                  }`}
                  onClick={handleAddMarker}
                  style={{ minHeight: "500px" }}
                >
                  {currentFile && (
                    <>
                      {isImage && (
                        <img
                          src={currentFile.url || "/placeholder.svg"}
                          alt={piece.name}
                          className="max-w-full max-h-[70vh] object-contain"
                          onLoad={(e) => {
                            const img = e.target as HTMLImageElement
                            if (mediaRef.current) {
                              mediaRef.current.style.height = `${Math.max(500, img.offsetHeight)}px`
                            }
                          }}
                        />
                      )}
                      {isVideo && (
                        <video
                          src={currentFile.url}
                          controls
                          className="max-w-full max-h-[70vh] object-contain"
                          onLoadedMetadata={(e) => {
                            const video = e.target as HTMLVideoElement
                            if (mediaRef.current) {
                              mediaRef.current.style.height = `${Math.max(500, video.offsetHeight)}px`
                            }
                          }}
                        >
                          Seu navegador não suporta o elemento de vídeo.
                        </video>
                      )}
                    </>
                  )}

                  {/* Markers */}
                  {showMarkers &&
                    activeMarkers.map((marker) => {
                      const visibleComments = getVisibleComments(marker)
                      const position = getCommentBoxPosition(marker)

                      return (
                        <div key={marker.id}>
                          {/* Marker Point */}
                          <div
                            className="absolute w-7 h-7 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:bg-red-600 transition-all hover:scale-110 z-20"
                            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveCommentBox(activeCommentBox === marker.id ? null : marker.id)
                            }}
                          >
                            {visibleComments.length}
                          </div>

                          {/* Comment Box */}
                          {activeCommentBox === marker.id && (
                            <Card className="absolute z-30 w-80 max-h-96 overflow-hidden shadow-xl" style={position}>
                              <CardContent className="p-0">
                                <div className="bg-gray-50 dark:bg-gray-700 px-3 py-2 border-b dark:border-gray-600">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      Comentários
                                    </span>
                                    <div className="flex items-center gap-2">
                                      {user.role === "admin" && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => closeMarker(piece.id, marker.id, user)}
                                          className="h-6 px-2 text-xs"
                                        >
                                          Encerrar
                                        </Button>
                                      )}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setActiveCommentBox(null)}
                                        className="h-6 w-6 p-0"
                                      >
                                        <X className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>

                                <div className="max-h-60 overflow-y-auto">
                                  {visibleComments.map((comment) => (
                                    <div key={comment.id} className="p-3 border-b dark:border-gray-600 last:border-b-0">
                                      <div className="flex items-start gap-2">
                                        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium">
                                          {comment.author.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                              {comment.author}
                                            </span>
                                            {user.role === "admin" && (
                                              <Badge
                                                variant={comment.authorRole === "admin" ? "default" : "secondary"}
                                                className="text-xs"
                                              >
                                                {comment.authorRole === "admin" ? "Admin" : "Cliente"}
                                              </Badge>
                                            )}
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                              {new Date(comment.createdAt).toLocaleString("pt-BR")}
                                            </span>
                                          </div>

                                          {editingComment === comment.id ? (
                                            <div className="space-y-2">
                                              <Textarea
                                                value={editCommentText}
                                                onChange={(e) => setEditCommentText(e.target.value)}
                                                rows={2}
                                                className="text-sm resize-none"
                                                autoFocus
                                              />
                                              <div className="flex gap-1">
                                                <Button
                                                  size="sm"
                                                  onClick={() => handleSaveEdit(marker.id, comment.id)}
                                                  disabled={!editCommentText.trim()}
                                                  className="h-6 px-2 text-xs"
                                                >
                                                  <Save className="w-3 h-3 mr-1" />
                                                  Salvar
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  onClick={handleCancelEdit}
                                                  className="h-6 px-2 text-xs bg-transparent"
                                                >
                                                  Cancelar
                                                </Button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div>
                                              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                                                {comment.text}
                                              </p>
                                              {canEditComment(comment) && (
                                                <div className="flex gap-1 mt-2">
                                                  <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleEditComment(comment.id, comment.text)}
                                                    className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                  >
                                                    <Edit className="w-3 h-3 mr-1" />
                                                    Editar
                                                  </Button>
                                                  <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleDeleteComment(marker.id, comment.id)}
                                                    className="h-6 px-2 text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                  >
                                                    <Trash2 className="w-3 h-3 mr-1" />
                                                    Excluir
                                                  </Button>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="p-3 border-t dark:border-gray-600">
                                  <div className="flex gap-2">
                                    <Textarea
                                      value={newComment}
                                      onChange={(e) => setNewComment(e.target.value)}
                                      placeholder="Adicione um comentário..."
                                      rows={2}
                                      className="flex-1 text-sm resize-none"
                                      autoFocus={visibleComments.length === 0}
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => handleAddComment(marker.id)}
                                      disabled={!newComment.trim()}
                                      className="self-end"
                                    >
                                      <Send className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      )
                    })}
                </div>

                {/* Navigation for multiple files */}
                {piece.files.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 z-10"
                      onClick={() => setCurrentFileIndex(Math.max(0, currentFileIndex - 1))}
                      disabled={currentFileIndex === 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 z-10"
                      onClick={() => setCurrentFileIndex(Math.min(piece.files.length - 1, currentFileIndex + 1))}
                      disabled={currentFileIndex === piece.files.length - 1}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                      {piece.files.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full cursor-pointer ${index === currentFileIndex ? "bg-white" : "bg-white/50"}`}
                          onClick={() => setCurrentFileIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* File Info */}
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600 transition-colors">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>{currentFile?.name}</span>
                  <span>
                    {isVideo ? "Vídeo" : isImage ? "Imagem" : "Arquivo"} • {currentFileIndex + 1} de{" "}
                    {piece.files.length}
                  </span>
                </div>
              </div>

              {/* Caption */}
              {piece.caption && (
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Descrição</h3>
                  <p className="text-gray-700 dark:text-gray-300">{piece.caption}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Action Buttons */}
              {user.role === "client" && (
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Aprovação</h3>
                    <div className="space-y-3">
                      <Button
                        onClick={() => handleStatusChange("approved")}
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={piece.status === "approved"}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        {piece.status === "approved" ? "Aprovada" : "Aprovar"}
                      </Button>
                      <Button
                        onClick={() => handleStatusChange("needs_changes")}
                        variant="destructive"
                        className="w-full"
                        disabled={piece.status === "needs_changes"}
                      >
                        <X className="w-4 h-4 mr-2" />
                        {piece.status === "needs_changes" ? "Alterações Solicitadas" : "Solicitar Alterações"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Info Card */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Informações</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Projeto:</span>
                      <p className="text-gray-900 dark:text-white">{piece.projectName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Cliente:</span>
                      <p className="text-gray-900 dark:text-white">{piece.clientName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Criado:</span>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(piece.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Atualizado:</span>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(piece.updatedAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Marcadores:</span>
                      <p className="text-gray-900 dark:text-white">{activeMarkers.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {showHistory && (
        <PieceHistory pieceId={piece.id} pieceName={piece.name} logs={logs} onClose={() => setShowHistory(false)} />
      )}

      {showEditModal && (
        <PieceEditModal
          piece={piece}
          projects={projects}
          onClose={() => setShowEditModal(false)}
          onSave={updatePiece}
        />
      )}
    </div>
  )
}
