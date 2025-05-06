"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Login() {
  const router = useRouter()
  const [username, setUsername] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      alert("Please enter a username")
      return
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // Find user by username
    const user = users.find((u: any) => u.username === username)

    if (!user) {
      alert("User not found. Please register first.")
      return
    }

    // Set current user
    localStorage.setItem("currentUser", JSON.stringify(user))

    // Redirect to dashboard
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen grid-pattern flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Button variant="ghost" className="mb-4" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="glass-card border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-6 w-6 text-primary-600" />
              <span className="font-bold text-xl">VeriDose</span>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Enter your username to access the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-4">
                <Button type="submit" className="w-full h-11">
                  Login
                </Button>
                <div className="text-center">
                  <Button type="button" variant="link" onClick={() => router.push("/register")}>
                    Don&apos;t have an account? Register
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
