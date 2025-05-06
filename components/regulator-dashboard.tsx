"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle, Clock, FileCheck, FileText, Loader2, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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

export default function RegulatorDashboard() {
  const [trials, setTrials] = useState<Trial[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedTrial, setSelectedTrial] = useState<Trial | null>(null)
  const [blockchainHash, setBlockchainHash] = useState<string>("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTrialId, setActiveTrialId] = useState<string | null>(null)

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
  }, [])

  const getTrialReport = (trialId: string) => {
    return reports.find((report) => report.trialId === trialId)
  }

  const getTrialPatients = (trialId: string) => {
    return patients.filter((patient) => patient.trialId === trialId)
  }

  const verifyBlockchainHash = async (trialId: string) => {
    setIsVerifying(true)
    setBlockchainHash("")

    try {
      // Connect to Ethereum provider
      if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        const provider = new ethers.BrowserProvider(window.ethereum)

        // Connect to contract
        const contractAddress = "0xabF669AB56DE36eCb6112113C52d74936BBde580"
        const contract = new ethers.Contract(contractAddress, contractABI, provider)

        // Get hash from blockchain
        const hash = await contract.getHash(trialId)
        setBlockchainHash(hash)
      } else {
        alert("Ethereum provider not found. Please install MetaMask or another wallet.")
      }
    } catch (error) {
      console.error("Error verifying blockchain hash:", error)
      alert("Error verifying blockchain hash. See console for details.")
    } finally {
      setIsVerifying(false)
    }
  }

  const updateTrialStatus = (trialId: string, status: string) => {
    // Update trial status in localStorage
    const existingTrials = JSON.parse(localStorage.getItem("trials") || "[]")
    const trialIndex = existingTrials.findIndex((t: Trial) => t.id === trialId)

    if (trialIndex >= 0) {
      existingTrials[trialIndex].status = status
      localStorage.setItem("trials", JSON.stringify(existingTrials))

      // Update local state
      setTrials(existingTrials)

      // Update selected trial if it's the one being updated
      if (selectedTrial && selectedTrial.id === trialId) {
        setSelectedTrial({
          ...selectedTrial,
          status,
        })
      }
    }
  }

  const handleApproveTrial = (trialId: string) => {
    setIsApproving(true)

    try {
      updateTrialStatus(trialId, "approved")
      alert("Trial approved successfully!")
    } catch (error) {
      console.error("Error approving trial:", error)
    } finally {
      setIsApproving(false)
    }
  }

  const handleRejectTrial = (trialId: string) => {
    setIsRejecting(true)

    try {
      updateTrialStatus(trialId, "rejected")
      alert("Trial rejected successfully!")
    } catch (error) {
      console.error("Error rejecting trial:", error)
    } finally {
      setIsRejecting(false)
    }
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
                  <p className="text-sm font-medium text-gray-500">Verified Reports</p>
                  <p className="text-3xl font-bold">{reports.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <FileCheck className="h-6 w-6 text-green-600" />
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
                  <p className="text-sm font-medium text-gray-500">Pending Approval</p>
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
                There are no clinical trials available for review yet.
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
                          {getStatusIcon(trial.status)}
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
                            {trialReport ? "Report Available" : "No Report"}
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
                          <TabsTrigger value="report" disabled={!trialReport}>
                            Report
                          </TabsTrigger>
                          <TabsTrigger value="verification" disabled={!trialReport}>
                            Verification
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-4">
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
                                      ? "This trial has been approved"
                                      : trial.status === "rejected"
                                        ? "This trial has been rejected"
                                        : "This trial is pending approval"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Hospital</h4>
                                <p className="text-gray-700">{trial.hospitalName}</p>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Created</h4>
                                <p className="text-gray-700">{new Date(trial.createdAt).toLocaleDateString()}</p>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Patients</h4>
                                <p className="text-gray-700">{getTrialPatients(trial.id).length} patients enrolled</p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="report" className="space-y-4">
                          {trialReport && (
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
                            </Card>
                          )}
                        </TabsContent>

                        <TabsContent value="verification" className="space-y-4">
                          {trialReport && (
                            <>
                              <div className="space-y-2">
                                <Label className="text-xs">Local Report Hash</Label>
                                <p className="text-xs font-mono bg-gray-50 p-2 rounded-md break-all">
                                  {trialReport.hash}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <Label className="text-xs">Blockchain Hash</Label>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => verifyBlockchainHash(trial.id)}
                                    disabled={isVerifying}
                                  >
                                    {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Verify
                                  </Button>
                                </div>
                                {blockchainHash ? (
                                  <p className="text-xs font-mono bg-gray-50 p-2 rounded-md break-all">
                                    {blockchainHash}
                                  </p>
                                ) : (
                                  <p className="text-xs text-gray-500">Click "Verify" to fetch hash from blockchain</p>
                                )}
                              </div>

                              {blockchainHash && (
                                <div className="space-y-2">
                                  <Label className="text-xs">Verification Result</Label>
                                  {blockchainHash === trialReport.hash ? (
                                    <p className="text-green-600 font-medium">✓ Verified - Hashes match</p>
                                  ) : (
                                    <p className="text-red-600 font-medium">✗ Failed - Hashes do not match</p>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </TabsContent>
                      </Tabs>

                      <div className="flex justify-end gap-2 mt-6">
                        <Button
                          variant="destructive"
                          onClick={() => handleRejectTrial(trial.id)}
                          disabled={isRejecting || trial.status === "rejected"}
                        >
                          {isRejecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Reject Trial
                        </Button>
                        <Button
                          variant="default"
                          onClick={() => handleApproveTrial(trial.id)}
                          disabled={isApproving || trial.status === "approved" || !trialReport}
                        >
                          {isApproving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Approve Trial
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              )
            })}
          </Accordion>
        </div>
      )}

      {/* Trial Details Dialog */}
      <Dialog open={!!selectedTrial} onOpenChange={(open) => !open && setSelectedTrial(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedTrial?.title}</DialogTitle>
          </DialogHeader>
          {selectedTrial && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Description</Label>
                <p className="text-sm">{selectedTrial.description}</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (selectedTrial) {
                      handleRejectTrial(selectedTrial.id)
                      setSelectedTrial(null)
                    }
                  }}
                  disabled={isRejecting || selectedTrial.status === "rejected"}
                >
                  Reject
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    if (selectedTrial) {
                      handleApproveTrial(selectedTrial.id)
                      setSelectedTrial(null)
                    }
                  }}
                  disabled={isApproving || selectedTrial.status === "approved" || !getTrialReport(selectedTrial.id)}
                >
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
