"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, Database, FileCheck, Lock, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary-600" />
            <span className="font-bold text-xl">VeriDose</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">
              How It Works
            </Link>
            <Link href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">
              Features
            </Link>
            <Link href="#team" className="text-gray-600 hover:text-primary-600 transition-colors">
              Team
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push("/login")}>
              Login
            </Button>
            <Button onClick={() => router.push("/register")}>Register</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-pattern flex-grow flex items-center py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight gradient-text">
                Reimagining Clinical Trial Integrity with Blockchain
              </h1>
              <p className="text-xl text-gray-600">AI-verified Reports. Transparent Trials. Powered by Ethereum.</p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" onClick={() => router.push("/register?role=regulator")}>
                  Start as Regulator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push("/login")}>
                  Login as Hospital
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <svg viewBox="0 0 200 200" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill="#3b82f6"
                    d="M45.7,-78.3C58.9,-71.9,69.2,-59.2,76.4,-45.1C83.7,-31,87.9,-15.5,87.8,-0.1C87.7,15.4,83.3,30.7,75.5,44.3C67.7,57.9,56.4,69.8,42.7,77.5C28.9,85.3,14.5,89,0.2,88.7C-14.1,88.4,-28.2,84.1,-41.7,77C-55.2,69.8,-68.1,59.8,-76.1,46.4C-84.1,33,-87.2,16.5,-86.6,0.3C-86,-15.8,-81.7,-31.6,-73.4,-45.1C-65.1,-58.6,-52.8,-69.8,-39.1,-75.9C-25.4,-82,-12.7,-83,1.8,-86.1C16.3,-89.2,32.6,-84.6,45.7,-78.3Z"
                    transform="translate(100 100)"
                    opacity="0.1"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="glass-card rounded-2xl p-6 w-4/5 mx-auto">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-20 bg-primary-100 rounded-md flex items-center justify-center">
                          <Database className="h-8 w-8 text-primary-500" />
                        </div>
                        <div className="h-20 bg-secondary-100 rounded-md flex items-center justify-center">
                          <Lock className="h-8 w-8 text-secondary-500" />
                        </div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded-md w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                      <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
                      <div className="h-10 gradient-bg rounded-md w-1/3"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary-500/20 rounded-full filter blur-3xl -z-10"></div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-secondary-500/20 rounded-full filter blur-3xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform leverages blockchain technology to ensure the integrity and transparency of clinical trials.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Pharma Companies</h3>
              <p className="text-gray-600">
                Create and manage clinical trials, assign them to hospitals, and track progress in real-time.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Hospitals</h3>
              <p className="text-gray-600">
                Collect patient data, generate AI-verified reports, and securely store hashes on the blockchain.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Regulators</h3>
              <p className="text-gray-600">
                Review trial data, verify blockchain hashes, and approve or reject trials based on evidence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 grid-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform offers a comprehensive suite of features designed to enhance clinical trial integrity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Blockchain Verification</h3>
                <p className="text-gray-600">
                  All trial reports are hashed and stored on the Ethereum blockchain, ensuring immutability and
                  transparency.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <FileCheck className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">AI-Powered Reports</h3>
                <p className="text-gray-600">
                  Advanced AI algorithms analyze patient data to generate comprehensive reports and flag anomalies.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Role-Based Access</h3>
                <p className="text-gray-600">
                  Secure, role-based access control ensures that users can only access the data they need.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Regulatory Compliance</h3>
                <p className="text-gray-600">
                  Built with regulatory requirements in mind, our platform helps ensure compliance with industry
                  standards.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the experts behind VeriDose, combining expertise in healthcare, blockchain, and AI.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { name: "Dev Arora", role: "Full Stack Developer", image: "/placeholder.svg?height=300&width=300" },
              { name: "Vansh Puri", role: "Web 3 Developer", image: "/placeholder.svg?height=300&width=300" },
              { name: "Vansh Puri", role: "AI Research Lead", image: "/placeholder.svg?height=300&width=300" },
              {
                name: "Nitesh",role: "Full Stack Developer",  image: "placeholder.svg?height=300&width=300"
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl overflow-hidden"
              >
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-primary-400" />
                <span className="font-bold text-xl">VeriDose</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing clinical trials with blockchain technology and AI-powered analytics.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#team" className="text-gray-400 hover:text-white transition-colors">
                    Team
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">info@VeriDose.example</li>
                <li className="text-gray-400">+91 9963740000</li>
                <li className="text-gray-400">3 Terminal Risers,Delhi,India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 VeriDose. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
