"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User } from "@/types"
import { useClients } from "@/hooks/use-clients"

interface LoginFormProps {
  onLogin: (user: User) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const { clients } = useClients()
  const [name, setName] = useState("")
  const [selectedClientId, setSelectedClientId] = useState("")
  const [role, setRole] = useState<"admin" | "client">("client")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return

    const selectedClient = clients.find((c) => c.id === selectedClientId)

    const user: User = {
      id: Date.now().toString(),
      name,
      role,
      clientId: role === "client" ? selectedClientId : undefined,
      clientName: role === "client" ? selectedClient?.name : undefined,
    }

    onLogin(user)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-green-600">grilo</CardTitle>
        <p className="text-gray-600">Sistema de Aprovação de Peças</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              required
            />
          </div>

          <div>
            <Label htmlFor="role">Tipo de Acesso</Label>
            <Select value={role} onValueChange={(value: "admin" | "client") => setRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin (grilo)</SelectItem>
                <SelectItem value="client">Cliente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role === "client" && (
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
          )}

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            Entrar
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
