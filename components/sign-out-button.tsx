"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { LogOut, Loader2 } from "lucide-react"

interface SignOutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function SignOutButton({ 
  variant = "outline", 
  size = "default", 
  className = "" 
}: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut({ callbackUrl: "/" })
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant={variant} 
      size={size}
      className={className} 
      onClick={handleSignOut}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      Sign out
    </Button>
  )
}
