"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Edit, MessageSquare, CheckCircle, X } from "lucide-react"
import type { LogEntry } from "@/types"

interface PieceHistoryProps {
  pieceId: string
  pieceName: string
  logs: LogEntry[]
  onClose: () => void
}

export function PieceHistory({ pieceId, pieceName, logs, onClose }: PieceHistoryProps) {
  const pieceLogs = logs
    .filter((log) => log.entityId === pieceId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const getActionIcon = (action: string) => {
    switch (action) {
      case "piece_updated":
        return <Edit className="w-4 h-4" />
      case "status_change":
        return <CheckCircle className="w-4 h-4" />
      case "add_comment":
        return <MessageSquare className="w-4 h-4" />
      case "close_marker":
        return <X className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "piece_updated":
        return "bg-blue-100 text-blue-800"
      case "status_change":
        return "bg-green-100 text-green-800"
      case "add_comment":
        return "bg-yellow-100 text-yellow-800"
      case "close_marker":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActionDescription = (log: LogEntry) => {
    switch (log.action) {
      case "piece_updated":
        return log.details?.changes?.join(", ") || "Peça atualizada"
      case "status_change":
        return `Status alterado para: ${log.details?.newStatus === "approved" ? "Aprovada" : log.details?.newStatus === "needs_changes" ? "Solicitar Alterações" : "Pendente"}`
      case "add_comment":
        return `Comentário adicionado: "${log.details?.comment}"`
      case "close_marker":
        return "Marcador encerrado"
      default:
        return "Ação realizada"
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico - {pieceName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {pieceLogs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum histórico disponível</p>
          ) : (
            <div className="space-y-3">
              {pieceLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getActionColor(log.action)}`}>{getActionIcon(log.action)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {log.action.replace("_", " ").toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString("pt-BR")}</span>
                      </div>
                      <p className="text-sm font-medium mb-1">{getActionDescription(log)}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        <span>por {log.userName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
