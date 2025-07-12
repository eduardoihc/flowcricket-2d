"use client"

import { useState, useEffect } from "react"
import type { Piece, Project, Comment, Marker, User, LogEntry } from "@/types"

const STORAGE_KEYS = {
  pieces: "grilo-pieces",
  projects: "grilo-projects",
  logs: "grilo-logs",
}

// Default projects for the fixed clients
const defaultProjects: Project[] = [
  {
    id: "corteva-1",
    name: "Campanha Institucional 2024",
    clientId: "corteva",
    clientName: "Corteva",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cummins-1",
    name: "Lançamento Produto",
    clientId: "cummins",
    clientName: "Cummins",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "dsm-1",
    name: "Campanha Digital",
    clientId: "dsm-firmenich",
    clientName: "dsm-firmenich",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "frimesa-1",
    name: "Campanha Verão",
    clientId: "frimesa",
    clientName: "Frimesa",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "mueller-1",
    name: "Black Friday 2024",
    clientId: "shopping-mueller",
    clientName: "Shopping Mueller",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function useData() {
  const [pieces, setPieces] = useState<Piece[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    const savedPieces = localStorage.getItem(STORAGE_KEYS.pieces)
    const savedProjects = localStorage.getItem(STORAGE_KEYS.projects)
    const savedLogs = localStorage.getItem(STORAGE_KEYS.logs)

    setPieces(savedPieces ? JSON.parse(savedPieces) : [])

    // Initialize with default projects if none exist
    if (savedProjects) {
      const existingProjects = JSON.parse(savedProjects)
      // Merge default projects with existing ones, avoiding duplicates
      const mergedProjects = [...defaultProjects]

      existingProjects.forEach((existingProject: Project) => {
        if (!defaultProjects.find((def) => def.id === existingProject.id)) {
          mergedProjects.push(existingProject)
        }
      })

      setProjects(mergedProjects)
      localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(mergedProjects))
    } else {
      setProjects(defaultProjects)
      localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(defaultProjects))
    }

    setLogs(savedLogs ? JSON.parse(savedLogs) : [])
  }, [])

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data))
  }

  const addLog = (action: string, entityType: string, entityId: string, user: User, details?: any) => {
    const logEntry: LogEntry = {
      id: Date.now().toString(),
      action,
      entityType,
      entityId,
      userId: user.id,
      userName: user.name,
      timestamp: new Date().toISOString(),
      details,
    }

    const newLogs = [...logs, logEntry]
    setLogs(newLogs)
    saveToStorage(STORAGE_KEYS.logs, newLogs)
  }

  const addProject = (project: Project) => {
    const newProjects = [...projects, project]
    setProjects(newProjects)
    saveToStorage(STORAGE_KEYS.projects, newProjects)
  }

  const addPiece = (piece: Piece) => {
    const newPieces = [...pieces, piece]
    setPieces(newPieces)
    saveToStorage(STORAGE_KEYS.pieces, newPieces)
  }

  const updatePiece = (updatedPiece: Piece, changes?: string[]) => {
    const newPieces = pieces.map((piece) => (piece.id === updatedPiece.id ? updatedPiece : piece))
    setPieces(newPieces)
    saveToStorage(STORAGE_KEYS.pieces, newPieces)

    // Add to history log
    if (changes && changes.length > 0) {
      addLog("piece_updated", "piece", updatedPiece.id, { id: "admin", name: "Admin", role: "admin" }, { changes })
    }
  }

  const updatePieceStatus = (pieceId: string, status: "approved" | "needs_changes", user: User) => {
    const newPieces = pieces.map((piece) =>
      piece.id === pieceId ? { ...piece, status, updatedAt: new Date().toISOString() } : piece,
    )
    setPieces(newPieces)
    saveToStorage(STORAGE_KEYS.pieces, newPieces)
    addLog("status_change", "piece", pieceId, user, { newStatus: status })
  }

  const addMarker = (pieceId: string, marker: Marker) => {
    const newPieces = pieces.map((piece) =>
      piece.id === pieceId
        ? { ...piece, markers: [...piece.markers, marker], updatedAt: new Date().toISOString() }
        : piece,
    )

    setPieces(newPieces)
    saveToStorage(STORAGE_KEYS.pieces, newPieces)
  }

  const addComment = (pieceId: string, markerId: string, comment: Comment, user: User) => {
    const newPieces = pieces.map((piece) =>
      piece.id === pieceId
        ? {
            ...piece,
            markers: piece.markers.map((marker) =>
              marker.id === markerId ? { ...marker, comments: [...marker.comments, comment] } : marker,
            ),
            updatedAt: new Date().toISOString(),
          }
        : piece,
    )
    setPieces(newPieces)
    saveToStorage(STORAGE_KEYS.pieces, newPieces)
    addLog("add_comment", "piece", pieceId, user, { markerId, comment: comment.text })
  }

  const updateComment = (pieceId: string, markerId: string, commentId: string, newText: string, user: User) => {
    const newPieces = pieces.map((piece) =>
      piece.id === pieceId
        ? {
            ...piece,
            markers: piece.markers.map((marker) =>
              marker.id === markerId
                ? {
                    ...marker,
                    comments: marker.comments.map((comment) =>
                      comment.id === commentId ? { ...comment, text: newText } : comment,
                    ),
                  }
                : marker,
            ),
            updatedAt: new Date().toISOString(),
          }
        : piece,
    )
    setPieces(newPieces)
    saveToStorage(STORAGE_KEYS.pieces, newPieces)
    addLog("update_comment", "piece", pieceId, user, { markerId, commentId, newText })
  }

  const deleteComment = (pieceId: string, markerId: string, commentId: string, user: User) => {
    const newPieces = pieces.map((piece) =>
      piece.id === pieceId
        ? {
            ...piece,
            markers: piece.markers.map((marker) =>
              marker.id === markerId
                ? {
                    ...marker,
                    comments: marker.comments.filter((comment) => comment.id !== commentId),
                  }
                : marker,
            ),
            updatedAt: new Date().toISOString(),
          }
        : piece,
    )
    setPieces(newPieces)
    saveToStorage(STORAGE_KEYS.pieces, newPieces)
    addLog("delete_comment", "piece", pieceId, user, { markerId, commentId })
  }

  const closeMarker = (pieceId: string, markerId: string, user: User) => {
    const newPieces = pieces.map((piece) =>
      piece.id === pieceId
        ? {
            ...piece,
            markers: piece.markers.map((marker) => (marker.id === markerId ? { ...marker, isActive: false } : marker)),
            updatedAt: new Date().toISOString(),
          }
        : piece,
    )
    setPieces(newPieces)
    saveToStorage(STORAGE_KEYS.pieces, newPieces)
    addLog("close_marker", "piece", pieceId, user, { markerId })
  }

  return {
    pieces,
    projects,
    logs,
    addProject,
    addPiece,
    updatePiece,
    updatePieceStatus,
    addMarker,
    addComment,
    updateComment,
    deleteComment,
    closeMarker,
  }
}
