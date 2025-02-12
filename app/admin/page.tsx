"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminPanel from "../components/AdminPanel"
import LoginModal from "../components/LoginModal"
import { useAuth } from "../context/AuthContext"
import { ThemeToggle } from "../components/ThemeToggle"

export default function AdminPage() {
  const [showLogin, setShowLogin] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      setShowLogin(true)
    }
  }, [user, loading])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <main className="container mx-auto p-4">
        {user ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">Sunday School Calendar Admin</h1>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <button
                  onClick={() => router.push("/")}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Back to Calendar
                </button>
              </div>
            </div>
            <AdminPanel />
          </>
        ) : null}
      </main>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  )
}

