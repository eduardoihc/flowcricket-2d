"use client"

import { useState, useEffect } from "react"

export interface Client {
  id: string
  name: string
  createdAt: string
}

const STORAGE_KEY = "grilo-clients"

const fixedClients: Client[] = [
  { id: "corteva", name: "Corteva", createdAt: new Date().toISOString() },
  { id: "cummins", name: "Cummins", createdAt: new Date().toISOString() },
  { id: "dsm-firmenich", name: "dsm-firmenich", createdAt: new Date().toISOString() },
  { id: "frimesa", name: "Frimesa", createdAt: new Date().toISOString() },
  { id: "shopping-mueller", name: "Shopping Mueller", createdAt: new Date().toISOString() },
]

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const savedClients = JSON.parse(saved)
      // Merge fixed clients with saved ones, avoiding duplicates
      const mergedClients = [...fixedClients]

      savedClients.forEach((savedClient: Client) => {
        if (!fixedClients.find((fixed) => fixed.id === savedClient.id)) {
          mergedClients.push(savedClient)
        }
      })

      setClients(mergedClients)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedClients))
    } else {
      setClients(fixedClients)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fixedClients))
    }
  }, [])

  const saveClients = (updatedClients: Client[]) => {
    setClients(updatedClients)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClients))

    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent("clientsUpdated", { detail: updatedClients }))
  }

  const addClient = (name: string) => {
    const newClient: Client = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      createdAt: new Date().toISOString(),
    }
    const updatedClients = [...clients, newClient]
    saveClients(updatedClients)
    return newClient
  }

  const updateClient = (id: string, name: string) => {
    const updatedClients = clients.map((client) =>
      client.id === id ? { ...client, name, id: name.toLowerCase().replace(/\s+/g, "-") } : client,
    )
    saveClients(updatedClients)
  }

  const deleteClient = (id: string) => {
    const updatedClients = clients.filter((client) => client.id !== id)
    saveClients(updatedClients)
  }

  // Listen for updates from other components
  useEffect(() => {
    const handleClientsUpdate = (event: CustomEvent) => {
      setClients(event.detail)
    }

    window.addEventListener("clientsUpdated", handleClientsUpdate as EventListener)
    return () => window.removeEventListener("clientsUpdated", handleClientsUpdate as EventListener)
  }, [])

  const isFixedClient = (clientId: string) => {
    return fixedClients.find((client) => client.id === clientId) !== undefined
  }

  return {
    clients,
    addClient,
    updateClient,
    deleteClient,
    fixedClients,
    isFixedClient,
  }
}
