"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, Play } from "lucide-react"
import type { Piece, Project, PieceFile } from "@/types"

interface PieceEditModalProps {
  piece: Piece
  projects: Project[]
  onClose: () => void
  onSave: (updatedPiece: Piece, changes: string[]) => void
}

export function PieceEditModal({ piece, projects, onClose, onSave }: PieceEditModalProps) {
  const [name, setName] = useState(piece.name)
  const [projectId, setProjectId] = useState(piece.projectId)
  const [caption, setCaption] = useState(piece.caption || "")
  const [status, setStatus] = useState(piece.status)
  const [files, setFiles] = useState<PieceFile[]>(piece.files)
  const [newFiles, setNewFiles] = useState<File[]>([])

  // Simple drag state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const draggedElementRef = useRef<HTMLDivElement | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (fileId: string) => {
    setFiles(files.filter((f) => f.id !== fileId))
  }

  const removeNewFile = (index: number) => {
    setNewFiles(newFiles.filter((_, i) => i !== index))
  }

  // Simple drag handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"

    // Store reference to dragged element
    draggedElementRef.current = e.currentTarget as HTMLDivElement
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      return
    }

    // Simple reorder logic
    const newFiles = [...files]
    const draggedItem = newFiles[draggedIndex]

    // Remove from original position
    newFiles.splice(draggedIndex, 1)

    // Insert at new position
    newFiles.splice(dropIndex, 0, draggedItem)

    setFiles(newFiles)
    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    draggedElementRef.current = null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !projectId) return

    const project = projects.find((p) => p.id === projectId)
    if (!project) return

    // Track changes for history
    const changes: string[] = []
    if (name !== piece.name) changes.push(`Nome alterado de "${piece.name}" para "${name}"`)
    if (projectId !== piece.projectId) changes.push(`Projeto alterado para "${project.name}"`)
    if (caption !== piece.caption) changes.push("Legenda alterada")
    if (status !== piece.status) changes.push(`Status alterado para "${status}"`)

    // Process new files
    const newPieceFiles: PieceFile[] = newFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      size: file.size,
    }))

    if (newFiles.length > 0) changes.push(`${newFiles.length} arquivo(s) adicionado(s)`)
    if (files.length !== piece.files.length) changes.push("Arquivos removidos ou reordenados")

    const updatedPiece: Piece = {
      ...piece,
      name,
      projectId,
      projectName: project.name,
      clientId: project.clientId,
      clientName: project.clientName,
      caption,
      status,
      files: [...files, ...newPieceFiles],
      updatedAt: new Date().toISOString(),
    }

    onSave(updatedPiece, changes)
    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Peça</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome da Peça</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="project">Projeto</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name} - {project.clientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value: "pending" | "approved" | "needs_changes") => setStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="approved">Aprovada</SelectItem>
                  <SelectItem value="needs_changes">Solicitar Alterações</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="caption">Legenda</Label>
              <Textarea id="caption" value={caption} onChange={(e) => setCaption(e.target.value)} rows={2} />
            </div>
          </div>

          {/* Current Files - Simple V16 Style with Basic Drag */}
          <div>
            <Label>Arquivos Atuais (arraste para reordenar)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
              {files.map((file, index) => (
                <div
                  key={file.id}
                  className={`relative border-2 rounded-lg p-2 transition-all duration-200 ${
                    draggedIndex === index
                      ? "opacity-50 cursor-grabbing"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 cursor-grab"
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  {/* File Preview */}
                  <div className="aspect-video bg-gray-100 dark:bg-gray-600 rounded overflow-hidden mb-2">
                    {file.type.startsWith("video/") ? (
                      <div className="relative w-full h-full">
                        <video src={file.url} className="w-full h-full object-cover" muted />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    )}
                  </div>

                  {/* File Info */}
                  <p className="text-xs text-gray-600 dark:text-gray-300 truncate mb-2">{file.name}</p>

                  {/* Order Number and Remove Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded font-medium">
                      #{index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(file.id)
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Files */}
          <div>
            <Label>Adicionar Novos Arquivos</Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center mt-2">
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
                id="new-files"
              />
              <label htmlFor="new-files" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Clique para adicionar arquivos</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Imagens, vídeos, GIFs e PDFs</p>
              </label>
            </div>

            {newFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Novos arquivos a serem adicionados:</h4>
                <div className="space-y-2">
                  {newFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <span className="text-sm">{file.name}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeNewFile(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
