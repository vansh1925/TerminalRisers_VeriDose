"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { CheckCircle, Clock, FileCheck, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Trial {
  id: string
  pharmaId: string
  hospitalId: string
  hospitalName: string
  title: string
  description: string
  status: string
  createdAt: number
}

interface Report {
  trialId: string
  reportText: string
  hash: string
}

interface Patient {
  id: string
  trialId: string
  name: string
  age: string
  diagnosis: string
  dosage: string
  result: string
}

interface Hospital {
  id: string
  username: string
  role: string
}

interface TrialWithVerification extends Trial {
  verified: boolean
  reportHash: string | null
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export default function AnalyticsPage() {
  const [trials, setTrials] = useState<Trial[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [trialsWithVerification, setTrialsWithVerification] = useState<TrialWithVerification[]>([])

  useEffect(() => {
    // Load all trials
    const existingTrials = JSON.parse(localStorage.getItem("trials") || "[]")
    setTrials(existingTrials)

    // Load all reports
    const existingReports = JSON.parse(localStorage.getItem("reports") || "[]")
    setReports(existingReports)

    // Load all patients
    const existingPatients = JSON.parse(localStorage.getItem("patients") || "[]")
    setPatients(existingPatients)

    // Load all users to get hospitals
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const hospitalUsers = users.filter((user: any) => user.role === "hospital")
    setHospitals(hospitalUsers)

    // Create trials with verification status
    const trialsWithVerif = existingTrials.map((trial: Trial) => {
      const report = existingReports.find((r: Report) => r.trialId === trial.id)
      return {
        ...trial,
        verified: !!report,
        reportHash: report ? report.hash : null,
      }
    })
    setTrialsWithVerification(trialsWithVerif)
  }, [])

  // Prepare data for hospital trials chart
  const hospitalTrialsData = hospitals
    .map((hospital) => {
      const hospitalTrials = trials.filter((trial) => trial.hospitalId === hospital.id)
      return {
        name: hospital.username,
        trials: hospitalTrials.length,
      }
    })
    .filter((item) => item.trials > 0)

  // Prepare data for trial status chart
  const trialStatusData = [
    { name: "Pending", value: trials.filter((t) => t.status === "pending").length },
    { name: "Approved", value: trials.filter((t) => t.status === "approved").length },
    { name: "Rejected", value: trials.filter((t) => t.status === "rejected").length },
  ].filter((item) => item.value > 0)

  // Prepare data for patient response chart (mock data)
  const patientResponseData = [
    { name: "Positive", value: 65 },
    { name: "Neutral", value: 25 },
    { name: "Negative", value: 10 },
  ]

  // Calculate statistics
  const totalTrials = trials.length
  const verifiedTrials = reports.length
  const totalPatients = patients.length
  const approvedTrials = trials.filter((t) => t.status === "approved").length

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="glass-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Trials</p>
                  <p className="text-3xl font-bold">{totalTrials}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <FileCheck className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="glass-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Verified Reports</p>
                  <p className="text-3xl font-bold">{verifiedTrials}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-secondary-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="glass-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Patients</p>
                  <p className="text-3xl font-bold">{totalPatients}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="glass-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Approved Trials</p>
                  <p className="text-3xl font-bold">{approvedTrials}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <FileCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card border-0 h-full">
            <CardHeader>
              <CardTitle>Trials per Hospital</CardTitle>
              <CardDescription>Number of clinical trials assigned to each hospital</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {hospitalTrialsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={hospitalTrialsData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 60,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="trials" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">No data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-card border-0 h-full">
            <CardHeader>
              <CardTitle>Patient Responses</CardTitle>
              <CardDescription>Distribution of patient responses to treatments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={patientResponseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {patientResponseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Trial Status Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle>Trial Status Overview</CardTitle>
            <CardDescription>Current status of all clinical trials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {trialStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trialStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#f59e0b" /> {/* Pending */}
                      <Cell fill="#10b981" /> {/* Approved */}
                      <Cell fill="#ef4444" /> {/* Rejected */}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trials Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="glass-card border-0">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Trials and Verification Status</CardTitle>
                <CardDescription>Overview of all trials and their blockchain verification status</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Export Data
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trial Name</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trialsWithVerification.length > 0 ? (
                  trialsWithVerification.map((trial) => (
                    <TableRow key={trial.id}>
                      <TableCell className="font-medium">{trial.title}</TableCell>
                      <TableCell>{trial.hospitalName}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            trial.status === "approved"
                              ? "success"
                              : trial.status === "rejected"
                                ? "destructive"
                                : "outline"
                          }
                          className={
                            trial.status === "approved"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : trial.status === "rejected"
                                ? "bg-red-100 text-red-800 hover:bg-red-100"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          }
                        >
                          {trial.status.charAt(0).toUpperCase() + trial.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {trial.verified ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span>Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>Pending</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-500">{new Date(trial.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      No trials available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
