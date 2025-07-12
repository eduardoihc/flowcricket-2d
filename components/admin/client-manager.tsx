"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Plus, Edit, Lock } from "lucide-react"
import { useClients, type Client } from "@/hooks/use-clients"

interface ClientManagerProps {
  onClose: () => void
}

export function ClientManager({ onClose }: ClientManagerProps) {
  const { clients, addClient, updateClient, deleteClient, fixedClients } = useClients()
  const [newClientName, setNewClientName] = useState("")
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const isFixedClient = (clientId: string) => {
    return fixedClients.find((client) => client.id === clientId) !== undefined
  }

  const handleAddClient = () => {
    if (!newClientName.trim()) return
    addClient(newClientName.trim())
    setNewClientName("")
  }

  const handleUpdateClient = () => {
    if (!editingClient || !editingClient.name.trim()) return
    updateClient(editingClient.id, editingClient.name.trim())
    setEditingClient(null)
  }

  const handleDeleteClient = (clientId: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente? Todas as peças associadas serão perdidas.")) {
      deleteClient(clientId)
    }
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Clientes</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Client */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Adicionar Novo Cliente</h3>
            <div className="flex gap-2">
              <Input
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="Nome do cliente"
                onKeyPress={(e) => e.key === "Enter" && handleAddClient()}
              />
              <Button onClick={handleAddClient} disabled={!newClientName.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>

          {/* Clients List */}
          <div className="space-y-4">
            <h3 className="font-semibold">Clientes Cadastrados ({clients.length})</h3>
            {clients.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhum cliente cadastrado</p>
            ) : (
              <div className="grid gap-3">
                {clients.map((client) => (
                  <Card
                    key={client.id}
                    className={
                      isFixedClient(client.id)
                        ? "border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800"
                        : ""
                    }
                  >
                    <CardContent className="p-4">
                      {editingClient?.id === client.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingClient.name}
                            onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                            onKeyPress={(e) => e.key === "Enter" && handleUpdateClient()}
                          />
                          <Button size="sm" onClick={handleUpdateClient}>
                            Salvar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingClient(null)}>
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{client.name}</h4>
                                {isFixedClient(client.id) && (
                                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                    <Lock className="w-3 h-3" />
                                    <span className="text-xs">Pré-cadastrado</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">
                                ID: {client.id} • Criado em {new Date(client.createdAt).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditClient(client)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteClient(client.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
