"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { FirebaseError } from "firebase/app"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn(email, password)
      onClose()
    } catch (error) {
      if (error instanceof FirebaseError) {
        // Log the error code for debugging
        console.error("Firebase error code:", error.code)
        switch (error.code) {
          case "auth/invalid-email":
            setError("Invalid email format")
            break
          case "auth/user-not-found":
            setError("No user found with this email")
            break
          case "auth/wrong-password":
            setError("Incorrect password")
            break
          case "auth/invalid-credential":
            setError("Invalid email or password")
            break
          default:
            setError(`Authentication error: ${error.code}`)
        }
      } else {
        setError("An unexpected error occurred")
        console.error(error)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Admin Login</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 