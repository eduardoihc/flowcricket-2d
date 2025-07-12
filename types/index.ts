export interface User {
  id: string
  name: string
  role: "admin" | "client"
  clientId?: string
  clientName?: string
}

export interface Project {
  id: string
  name: string
  clientId: string
  clientName: string
  createdAt: string
  updatedAt: string
}

export interface PieceFile {
  id: string
  name: string
  type: string
  url: string
  size: number
}

export interface Comment {
  id: string
  text: string
  author: string
  authorRole: "admin" | "client"
  createdAt: string
}

export interface Marker {
  id: string
  x: number
  y: number
  fileIndex: number
  comments: Comment[]
  isActive: boolean
  createdBy: string
  createdByRole: "admin" | "client"
  createdAt: string
}

export interface Piece {
  id: string
  name: string
  projectId: string
  projectName: string
  clientId: string
  clientName: string
  files: PieceFile[]
  caption?: string
  status: "pending" | "approved" | "needs_changes"
  comments: Comment[]
  markers: Marker[]
  createdAt: string
  updatedAt: string
}

export interface LogEntry {
  id: string
  action: string
  entityType: string
  entityId: string
  userId: string
  userName: string
  timestamp: string
  details?: any
}
