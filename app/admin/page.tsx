"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminPanel from "../components/AdminPanel"
import LoginModal from "../components/LoginModal"
import { useAuth } from "../context/AuthContext"
import { ThemeToggle } from "../components/ThemeToggle"
import SiteHeader from "../components/SiteHeader"
import { Button } from "@/components/ui/button"

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
    return <div className="py-10 text-center text-muted-foreground">Loading…</div>
  }

  return (
    <>
      <SiteHeader title="Calendar Admin">
        <Button variant="outline" size="sm" onClick={() => router.push("/")}>
          <span className="hidden sm:inline">Back to calendar</span>
          <span className="sm:hidden">Calendar</span>
        </Button>
        <ThemeToggle />
      </SiteHeader>
      <main className="container mx-auto px-4 py-8">
        {user ? <AdminPanel /> : null}
      </main>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  )
}

