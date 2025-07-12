"use client"
import { LoginForm } from "@/components/auth/login-form"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { ClientView } from "@/components/client/client-view"
import { useAuth } from "@/hooks/use-auth"

export default function Home() {
  const { user, login, logout } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <LoginForm onLogin={login} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user.role === "admin" ? (
        <AdminDashboard user={user} onLogout={logout} />
      ) : (
        <ClientView user={user} onLogout={logout} />
      )}
    </div>
  )
}
