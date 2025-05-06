"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import PharmaCompanyDashboard from "@/components/pharma-company-dashboard"
import HospitalDashboard from "@/components/hospital-dashboard"
import RegulatorDashboard from "@/components/regulator-dashboard"

interface User {
  id: string
  username: string
  role: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {user?.role === "pharma" && <PharmaCompanyDashboard userId={user.id} />}
      {user?.role === "hospital" && <HospitalDashboard userId={user.id} />}
      {user?.role === "regulator" && <RegulatorDashboard />}
    </motion.div>
  )
}
