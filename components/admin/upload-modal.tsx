"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, Plus } from "lucide-react"
import type { Project, PieceFile } from "@/types"
import { useClients } from "@/hooks/use-clients"

interface UploadModalProps {
  projects: Project[]
  onClose: () => void
  onUpload: (piece: any) => void
  onCreateProject: (project: any) => void
}

export function UploadModal({ projects, onClose, onUpload, onCreateProject }: UploadModalProps) {
  const { clients } = useClients()
  const [name, setName] = useState("")
  const [selectedClientId, setSelectedClientId] = useState("")
  const [projectId, setProjectId] = useState("")
  const [newProjectName, setNewProjectName] = useState("")
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [caption, setCaption] = useState("")
  const [files, setFiles] = useState<File[]>([])

  const clientProjects = projects.filter((p) => p.clientId === selectedClientId)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId)
    setProjectId("")
    setNewProjectName("")
    setIsCreatingProject(false)
  }

  const handleProjectSelection = (value: string) => {
    if (value === "new") {
      setIsCreatingProject(true)
      setProjectId("")
    } else {
      setIsCreatingProject(false)
      setProjectId(value)
      setNewProjectName("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !selectedClientId || files.length === 0) return

    const selectedClient = clients.find((c) => c.id === selectedClientId)
    if (!selectedClient) return

    let finalProject: Project

    if (isCreatingProject && newProjectName.trim()) {
      // Create new project
      finalProject = {
        id: Date.now().toString(),
        name: newProjectName.trim(),
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      onCreateProject(finalProject)
    } else {
      // Use existing project
      const existingProject = projects.find((p) => p.id === projectId)
      if (!existingProject) return
      finalProject = existingProject
    }

    const pieceFiles: PieceFile[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      size: file.size,
    }))

    const piece = {
      id: Date.now().toString(),
      name,
      projectId: finalProject.id,
      projectName: finalProject.name,
      clientId: finalProject.clientId,
      clientName: finalProject.clientName,
      files: pieceFiles,
      caption,
      status: "pending" as const,
      comments: [],
      markers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onUpload(piece)
    onClose()
  }

  const canSubmit =
    name &&
    selectedClientId &&
    files.length > 0 &&
    ((!isCreatingProject && projectId) || (isCreatingProject && newProjectName.trim()))

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload de Peça</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome da Peça</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Post Instagram - Campanha Verão"
              required
            />
          </div>

          <div>
            <Label htmlFor="client">Cliente</Label>
            <Select value={selectedClientId} onValueChange={handleClientChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedClientId && (
            <div>
              <Label htmlFor="project">Projeto</Label>
              <Select value={isCreatingProject ? "new" : projectId} onValueChange={handleProjectSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione ou crie um projeto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">
                    <div className="flex items-center">
                      <Plus className="w-4 h-4 mr-2" />
                      Criar novo projeto
                    </div>
                  </SelectItem>
                  {clientProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {isCreatingProject && (
            <div>
              <Label htmlFor="newProject">Nome do Novo Projeto</Label>
              <Input
                id="newProject"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Ex: Campanha Verão 2024"
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="caption">Legenda (opcional)</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Texto que acompanha a peça..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="files">Arquivos</Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <input
                id="files"
                type="file"
                multiple
                accept="image/*,video/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="files" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Clique para selecionar arquivos</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Imagens, vídeos, GIFs e PDFs</p>
              </label>
            </div>
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <span className="text-gray-900 dark:text-white">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFiles(files.filter((_, i) => i !== index))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={!canSubmit}>
              Upload
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
