"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { ethers } from "ethers"
import CryptoJS from "crypto-js"
import { motion } from "framer-motion"
import { AlertCircle, FileText, Loader2, Plus, Search, Shield, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Trial {
  id: string
  pharmaId: string
  hospitalId: string
  title: string
  description: string
  status: string
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

interface Report {
  trialId: string
  reportText: string
  hash: string
}

// Contract ABI
const contractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "id",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "hash",
        type: "string",
      },
    ],
    name: "HashStored",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "id",
        type: "string",
      },
      {
        internalType: "string",
        name: "dataHash",
        type: "string",
      },
    ],
    name: "storeHash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "id",
        type: "string",
      },
    ],
    name: "getHash",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]

export default function HospitalDashboard({ userId }: { userId: string }) {
  const [trials, setTrials] = useState<Trial[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [selectedTrial, setSelectedTrial] = useState<Trial | null>(null)
  const [patientForm, setPatientForm] = useState({
    name: "",
    age: "",
    diagnosis: "",
    dosage: "",
    result: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddingPatient, setIsAddingPatient] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [isSubmittingToBlockchain, setIsSubmittingToBlockchain] = useState(false)
  const [activeTrialId, setActiveTrialId] = useState<string | null>(null)

  useEffect(() => {
    // Load trials assigned to this hospital
    const existingTrials = JSON.parse(localStorage.getItem("trials") || "[]")
    const hospitalTrials = existingTrials.filter((trial: Trial) => trial.hospitalId === userId)
    setTrials(hospitalTrials)

    // Load patients
    const existingPatients = JSON.parse(localStorage.getItem("patients") || "[]")
    setPatients(existingPatients)

    // Load reports
    const existingReports = JSON.parse(localStorage.getItem("reports") || "[]")
    setReports(existingReports)
  }, [userId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPatientForm({
      ...patientForm,
      [name]: value,
    })
  }

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedTrial) return

    // Create new patient
    const newPatient: Patient = {
      id: uuidv4(),
      trialId: selectedTrial.id,
      name: patientForm.name,
      age: patientForm.age,
      diagnosis: patientForm.diagnosis,
      dosage: patientForm.dosage,
      result: patientForm.result,
    }

    // Get existing patients or initialize empty array
    const existingPatients = JSON.parse(localStorage.getItem("patients") || "[]")

    // Add new patient
    existingPatients.push(newPatient)
    localStorage.setItem("patients", JSON.stringify(existingPatients))

    // Update local state
    setPatients([...patients, newPatient])

    // Reset form
    setPatientForm({
      name: "",
      age: "",
      diagnosis: "",
      dosage: "",
      result: "",
    })
    setIsAddingPatient(false)
  }

  const generateReport = async (trialId: string) => {
    setIsGeneratingReport(true)

    try {
      // Get patients for this trial
      const trialPatients = patients.filter((patient) => patient.trialId === trialId)

      // Generate mock AI report
      const reportText = `Clinical Trial Report - ${new Date().toLocaleDateString()}
      
Trial ID: ${trialId}
Number of Patients: ${trialPatients.length}
Analysis Results: 93% anomaly-free, flagged 1 inconsistency
      
Summary: The trial shows promising results with minimal side effects. 
The majority of patients responded positively to the treatment.
      
Recommendation: Continue to phase 2 with minor protocol adjustments.`

      // Hash the report
      const hash = CryptoJS.SHA256(reportText).toString()

      // Create report object
      const newReport: Report = {
        trialId,
        reportText,
        hash,
      }

      // Get existing reports or initialize empty array
      const existingReports = JSON.parse(localStorage.getItem("reports") || "[]")

      // Check if report already exists for this trial
      const reportIndex = existingReports.findIndex((r: Report) => r.trialId === trialId)

      if (reportIndex >= 0) {
        // Update existing report
        existingReports[reportIndex] = newReport
      } else {
        // Add new report
        existingReports.push(newReport)
      }

      localStorage.setItem("reports", JSON.stringify(existingReports))

      // Update local state
      setReports(existingReports)

      return newReport
    } catch (error) {
      console.error("Error generating report:", error)
      throw error
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const submitToBlockchain = async (trialId: string) => {
    setIsSubmittingToBlockchain(true)

    try {
      // First generate the report if it doesn't exist
      let report = reports.find((r) => r.trialId === trialId)

      if (!report) {
        report = await generateReport(trialId)
      }

      // Connect to Ethereum provider
      if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()

        // Connect to contract
        const contractAddress = "0xCf3cC873C988eb635712C8AB7c9a4F6A2376EFc7"
        const contract = new ethers.Contract(contractAddress, contractABI, signer)

        // Store hash on blockchain
        const tx = await contract.storeHash(trialId, report.hash)
        await tx.wait()

        alert("Report hash successfully stored on blockchain!")
      } else {
        alert("Ethereum provider not found. Please install MetaMask or another wallet.")
      }
    } catch (error) {
      console.error("Error submitting to blockchain:", error)
      alert("Error submitting to blockchain. See console for details.")
    } finally {
      setIsSubmittingToBlockchain(false)
    }
  }

  const getTrialPatients = (trialId: string) => {
    return patients.filter((patient) => patient.trialId === trialId)
  }

  const getTrialReport = (trialId: string) => {
    return reports.find((report) => report.trialId === trialId)
  }

  const filteredTrials = trials.filter(
    (trial) =>
      trial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trial.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header with search */}
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
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="glass-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Assigned Trials</p>
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
                  <p className="text-sm font-medium text-gray-500">Total Patients</p>
                  <p className="text-3xl font-bold">
                    {patients.filter((p) => trials.some((t) => t.id === p.trialId)).length}
                  </p>
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
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="glass-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Reports Generated</p>
                  <p className="text-3xl font-bold">
                    {reports.filter((r) => trials.some((t) => t.id === r.trialId)).length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
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
              <h3 className="text-xl font-semibold mb-2">No Assigned Trials</h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                You don't have any clinical trials assigned to you yet. Wait for a pharma company to assign you a trial.
              </p>
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
          <Accordion
            type="single"
            collapsible
            className="space-y-4"
            value={activeTrialId || undefined}
            onValueChange={(value) => setActiveTrialId(value)}
          >
            {filteredTrials.map((trial, index) => {
              const trialPatients = getTrialPatients(trial.id)
              const trialReport = getTrialReport(trial.id)

              return (
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
                          <FileText className="h-5 w-5 text-primary-600" />
                          <span className="font-semibold">{trial.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={trialReport ? "success" : "outline"}
                            className={
                              trialReport
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }
                          >
                            {trialReport ? "Report Generated" : "No Report"}
                          </Badge>
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
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <Tabs defaultValue="details">
                        <TabsList className="mb-4">
                          <TabsTrigger value="details">Details</TabsTrigger>
                          <TabsTrigger value="patients">Patients ({trialPatients.length})</TabsTrigger>
                          <TabsTrigger value="report">Report</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-500">Description</h4>
                            <p className="text-gray-700">{trial.description}</p>
                          </div>

                          <div className="flex justify-end">
                            <Button
                              onClick={() => {
                                setSelectedTrial(trial)
                                setIsAddingPatient(true)
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Patient
                            </Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="patients" className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">Patient Data</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedTrial(trial)
                                setIsAddingPatient(true)
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Patient
                            </Button>
                          </div>

                          {trialPatients.length > 0 ? (
                            <div className="space-y-4">
                              {trialPatients.map((patient) => (
                                <Card key={patient.id} className="overflow-hidden">
                                  <CardContent className="p-0">
                                    <div className="flex items-center gap-4 p-4 border-b">
                                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <User className="h-5 w-5 text-blue-600" />
                                      </div>
                                      <div>
                                        <p className="font-medium">{patient.name}</p>
                                        <p className="text-sm text-gray-500">Age: {patient.age}</p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 p-4">
                                      <div>
                                        <Label className="text-xs text-gray-500">Diagnosis</Label>
                                        <p className="text-sm font-medium">{patient.diagnosis}</p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-gray-500">Dosage</Label>
                                        <p className="text-sm font-medium">{patient.dosage}</p>
                                      </div>
                                      <div className="col-span-2">
                                        <Label className="text-xs text-gray-500">Result</Label>
                                        <p className="text-sm font-medium">{patient.result}</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                              <p className="text-gray-500 mb-4">
                                No patients added yet. Add patients to generate a report.
                              </p>
                              <Button
                                onClick={() => {
                                  setSelectedTrial(trial)
                                  setIsAddingPatient(true)
                                }}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Patient
                              </Button>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="report" className="space-y-4">
                          {trialReport ? (
                            <div className="space-y-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle>Clinical Trial Report</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <pre className="whitespace-pre-wrap text-sm p-4 bg-gray-50 rounded-md">
                                    {trialReport.reportText}
                                  </pre>
                                  <div className="mt-4">
                                    <Label className="text-xs text-gray-500">Report Hash (Stored on Blockchain)</Label>
                                    <p className="text-xs font-mono bg-gray-50 p-2 rounded-md mt-1 break-all">
                                      {trialReport.hash}
                                    </p>
                                  </div>
                                </CardContent>
                                <CardFooter>
                                  <Button
                                    onClick={() => submitToBlockchain(trial.id)}
                                    disabled={isSubmittingToBlockchain}
                                    className="w-full"
                                  >
                                    {isSubmittingToBlockchain && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Submit to Blockchain
                                  </Button>
                                </CardFooter>
                              </Card>
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                              <p className="text-gray-500 mb-4">
                                No report generated yet. Generate a report to submit to the blockchain.
                              </p>
                              <Button
                                onClick={() => generateReport(trial.id)}
                                disabled={isGeneratingReport || trialPatients.length === 0}
                              >
                                {isGeneratingReport && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Generate Report
                              </Button>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              )
            })}
          </Accordion>
        </div>
      )}

      {/* Add Patient Dialog */}
      <Dialog open={isAddingPatient} onOpenChange={setIsAddingPatient}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Patient to {selectedTrial?.title}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddPatient} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Patient Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={patientForm.name}
                  onChange={handleInputChange}
                  placeholder="Enter patient name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  value={patientForm.age}
                  onChange={handleInputChange}
                  placeholder="Enter patient age"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Input
                id="diagnosis"
                name="diagnosis"
                value={patientForm.diagnosis}
                onChange={handleInputChange}
                placeholder="Enter diagnosis"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                name="dosage"
                value={patientForm.dosage}
                onChange={handleInputChange}
                placeholder="Enter dosage"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="result">Result</Label>
              <Textarea
                id="result"
                name="result"
                value={patientForm.result}
                onChange={handleInputChange}
                placeholder="Enter treatment result"
                rows={3}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddingPatient(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Patient</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
