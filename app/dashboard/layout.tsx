"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Activity, ChevronDown, Home, Hospital, LogOut, Menu, Shield, User, VolumeIcon as Vial, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserType {
  id: string
  username: string
  role: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(currentUser))
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary-200"></div>
          <div className="h-4 w-24 rounded bg-gray-200"></div>
        </div>
      </div>
    )
  }

  const roleIcon = {
    pharma: <Vial className="h-5 w-5" />,
    hospital: <Hospital className="h-5 w-5" />,
    regulator: <Shield className="h-5 w-5" />,
  }[user?.role || "pharma"]

  const roleName = {
    pharma: "Pharma Company",
    hospital: "Hospital",
    regulator: "Regulator",
  }[user?.role || "pharma"]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary-600" />
            <span className="font-bold text-lg">MedChain</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {user?.role === "regulator" && (
              <Link
                href="/regulator/analysis"
                className={`text-sm font-medium ${
                  pathname === "/regulator/analysis" ? "text-primary-600" : "text-gray-600 hover:text-primary-600"
                } transition-colors`}
              >
                Analytics
              </Link>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-600" />
                  </div>
                  <span>{user?.username}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.username}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      {roleIcon}
                      {roleName}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                {user?.role === "regulator" && (
                  <DropdownMenuItem onClick={() => router.push("/regulator/analysis")}>
                    <Activity className="mr-2 h-4 w-4" />
                    Analytics
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary-600" />
                <span className="font-bold text-lg">MedChain</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium">{user?.username}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    {roleIcon}
                    {roleName}
                  </p>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                  pathname === "/dashboard" ? "bg-primary-50 text-primary-600" : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>

              {user?.role === "regulator" && (
                <Link
                  href="/regulator/analysis"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                    pathname === "/regulator/analysis"
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Activity className="h-5 w-5" />
                  Analytics
                </Link>
              )}
            </nav>

            <div className="absolute bottom-8 left-0 w-full px-4">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {user?.role === "pharma" && "Pharma Company Dashboard"}
              {user?.role === "hospital" && "Hospital Dashboard"}
              {user?.role === "regulator" && pathname === "/regulator/analysis"
                ? "Trial Analytics"
                : "Regulator Dashboard"}
            </h1>

            {user?.role === "regulator" && pathname !== "/regulator/analysis" && (
              <Button
                variant="outline"
                className="hidden md:flex items-center gap-2"
                onClick={() => router.push("/regulator/analysis")}
              >
                <Activity className="h-4 w-4" />
                View Analytics
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <Home className="h-4 w-4" />
            <span>/</span>
            {pathname === "/dashboard" ? (
              <span>Dashboard</span>
            ) : pathname === "/regulator/analysis" ? (
              <>
                <Link href="/dashboard" className="hover:text-primary-600">
                  Dashboard
                </Link>
                <span>/</span>
                <span>Analytics</span>
              </>
            ) : (
              <span>Other Page</span>
            )}
          </div>
        </div>

        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary-600" />
              <span className="font-medium">MedChain</span>
            </div>
            <div className="text-sm text-gray-500">&copy; 2023 MedChain. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-sm text-gray-500 hover:text-primary-600">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-primary-600">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
