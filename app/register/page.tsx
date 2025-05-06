"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { motion } from "framer-motion"
import { ArrowLeft, Hospital, Shield, VolumeIcon as Vial } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function Register() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [role, setRole] = useState("pharma")

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      alert("Please enter a username")
      return
    }

    // Get existing users or initialize empty array
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")

    // Check if username already exists
    if (existingUsers.some((user: any) => user.username === username)) {
      alert("Username already exists. Please choose another one.")
      return
    }

    // Create new user
    const newUser = {
      id: uuidv4(),
      username,
      role,
    }

    // Add to users array
    existingUsers.push(newUser)
    localStorage.setItem("users", JSON.stringify(existingUsers))

    // Set current user
    localStorage.setItem("currentUser", JSON.stringify(newUser))

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
            <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
            <CardDescription>Enter your details to register for the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
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

              <div className="space-y-3">
                <Label>Select Role</Label>
                <RadioGroup value={role} onValueChange={setRole} className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="pharma" id="pharma" />
                    <Label htmlFor="pharma" className="flex items-center gap-3 cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <Vial className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium">Pharma Company</p>
                        <p className="text-sm text-gray-500">Create and manage clinical trials</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="hospital" id="hospital" />
                    <Label htmlFor="hospital" className="flex items-center gap-3 cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                        <Hospital className="h-5 w-5 text-secondary-600" />
                      </div>
                      <div>
                        <p className="font-medium">Hospital</p>
                        <p className="text-sm text-gray-500">Manage patients and trial data</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="regulator" id="regulator" />
                    <Label htmlFor="regulator" className="flex items-center gap-3 cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">Regulator</p>
                        <p className="text-sm text-gray-500">Review and approve clinical trials</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Button type="submit" className="w-full h-11">
                  Register
                </Button>
                <div className="text-center">
                  <Button type="button" variant="link" onClick={() => router.push("/login")}>
                    Already have an account? Login
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
