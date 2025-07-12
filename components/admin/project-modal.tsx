"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useClients } from "@/hooks/use-clients"

interface ProjectModalProps {
  onClose: () => void
  onSave: (project: any) => void
}

export function ProjectModal({ onClose, onSave }: ProjectModalProps) {
  const { clients } = useClients()
  const [name, setName] = useState("")
  const [selectedClientId, setSelectedClientId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !selectedClientId) return

    const selectedClient = clients.find((c) => c.id === selectedClientId)
    if (!selectedClient) return

    const project = {
      id: Date.now().toString(),
      name,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSave(project)
    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Projeto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Projeto</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Campanha Verão 2024"
              required
            />
          </div>

          <div>
            <Label htmlFor="client">Cliente</Label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
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

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={!name || !selectedClientId}>
              Criar Projeto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
