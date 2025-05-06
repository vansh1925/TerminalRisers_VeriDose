"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle, Clock, FileText, Plus, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Hospital {
  id: string
  username: string
}

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

export default function PharmaCompanyDashboard({ userId }: { userId: string }) {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [trials, setTrials] = useState<Trial[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    hospitalId: "",
    title: "",
    description: "",
  })
  const [formErrors, setFormErrors] = useState({
    hospitalId: false,
    title: false,
    description: false,
  })

  useEffect(() => {
    // Load hospitals
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const hospitalUsers = users.filter((user: any) => user.role === "hospital")
    setHospitals(hospitalUsers)

    // Load trials
    const existingTrials = JSON.parse(localStorage.getItem("trials") || "[]")
    const pharmaTrials = existingTrials.filter((trial: Trial) => trial.pharmaId === userId)
    setTrials(pharmaTrials)
  }, [userId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error for this field
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: false,
      })
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      hospitalId: value,
    })

    // Clear error for this field
    if (formErrors.hospitalId) {
      setFormErrors({
        ...formErrors,
        hospitalId: false,
      })
    }
  }

  const validateForm = () => {
    const errors = {
      hospitalId: !formData.hospitalId,
      title: !formData.title.trim(),
      description: !formData.description.trim(),
    }

    setFormErrors(errors)
    return !Object.values(errors).some(Boolean)
  }

  const handleCreateTrial = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Get selected hospital name
    const selectedHospital = hospitals.find((h) => h.id === formData.hospitalId)

    // Create new trial
    const newTrial: Trial = {
      id: uuidv4(),
      pharmaId: userId,
      hospitalId: formData.hospitalId,
      hospitalName: selectedHospital?.username || "Unknown Hospital",
      title: formData.title,
      description: formData.description,
      status: "pending",
      createdAt: Date.now(),
    }

    // Get existing trials or initialize empty array
    const existingTrials = JSON.parse(localStorage.getItem("trials") || "[]")

    // Add new trial
    existingTrials.push(newTrial)
    localStorage.setItem("trials", JSON.stringify(existingTrials))

    // Update local state
    setTrials([...trials, newTrial])

    // Reset form
    setFormData({
      hospitalId: "",
      title: "",
      description: "",
    })
    setShowCreateDialog(false)
  }

  const filteredTrials = trials.filter(
    (trial) =>
      trial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trial.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved"
      case "rejected":
        return "Rejected"
      default:
        return "Pending"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with search and create button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search trials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create New Trial
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="glass-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Trials</p>
                  <p className="text-3xl font-bold">{trials.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary-600" />
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
                  <p className="text-sm font-medium text-gray-500">Approved</p>
                  <p className="text-3xl font-bold">{trials.filter((t) => t.status === "approved").length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
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
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-3xl font-bold">{trials.filter((t) => t.status === "pending").length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {trials.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Card className="glass-card border-0 bg-white/50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Clinical Trials Yet</h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                You haven't created any clinical trials yet. Click the button below to create your first trial.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Trial
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {trials.length > 0 && filteredTrials.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No results found</AlertTitle>
          <AlertDescription>No trials match your search query. Try adjusting your search terms.</AlertDescription>
        </Alert>
      )}

      {/* Trials list */}
      {filteredTrials.length > 0 && (
        <div className="space-y-4">
          <Accordion type="single" collapsible className="space-y-4">
            {filteredTrials.map((trial, index) => (
              <motion.div
                key={trial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <AccordionItem value={trial.id} className="glass-card border-0 overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full text-left gap-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(trial.status)}
                        <span className="font-semibold">{trial.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
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
                          {getStatusText(trial.status)}
                        </Badge>
                        <span className="text-sm text-gray-500 hidden md:inline">
                          {new Date(trial.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                          <p className="text-gray-700">{trial.description}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(trial.status)}
                            <span>
                              {trial.status === "approved"
                                ? "This trial has been approved by regulators"
                                : trial.status === "rejected"
                                  ? "This trial has been rejected by regulators"
                                  : "This trial is pending regulatory approval"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Assigned Hospital</h4>
                          <p className="text-gray-700">{trial.hospitalName}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Created</h4>
                          <p className="text-gray-700">{new Date(trial.createdAt).toLocaleDateString()}</p>
                        </div>

                        <div className="pt-4">
                          <Button variant="outline" className="w-full">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      )}

      {/* Create Trial Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Clinical Trial</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new clinical trial and assign it to a hospital.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTrial} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="hospitalId">Select Hospital</Label>
              <Select value={formData.hospitalId} onValueChange={handleSelectChange}>
                <SelectTrigger className={formErrors.hospitalId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a hospital" />
                </SelectTrigger>
                <SelectContent>
                  {hospitals.length > 0 ? (
                    hospitals.map((hospital) => (
                      <SelectItem key={hospital.id} value={hospital.id}>
                        {hospital.username}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No hospitals available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {formErrors.hospitalId && <p className="text-sm text-red-500">Please select a hospital</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Trial Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter trial title"
                className={formErrors.title ? "border-red-500" : ""}
              />
              {formErrors.title && <p className="text-sm text-red-500">Please enter a title</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Trial Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter trial description"
                rows={4}
                className={formErrors.description ? "border-red-500" : ""}
              />
              {formErrors.description && <p className="text-sm text-red-500">Please enter a description</p>}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Trial</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
