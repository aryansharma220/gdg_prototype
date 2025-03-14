"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"
import { SignOutButton } from "@/components/sign-out-button"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false)
    }
  }, [status])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-300">
              Welcome back, {session?.user?.name || "User"}!
            </p>
          </div>
          <SignOutButton />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Your Profile</h2>
          <div className="space-y-2">
            <p className="text-slate-700 dark:text-slate-300">
              <span className="font-medium">Name:</span> {session?.user?.name}
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              <span className="font-medium">Email:</span> {session?.user?.email}
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              <span className="font-medium">User ID:</span> {session?.user?.id}
            </p>
          </div>
        </div>

        {/* Placeholder for dashboard content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 flex flex-col">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Dashboard Item {item}</h3>
              <p className="text-slate-600 dark:text-slate-300 mt-2 flex-grow">
                This is a placeholder for dashboard content. In a real app, this would display relevant information.
              </p>
              <div className="h-2 bg-purple-600 rounded mt-4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
