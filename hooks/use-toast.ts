"use client"

import { useState, useEffect } from "react"

type ToastProps = {
  title: string
  description: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([])

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prevToasts) => prevToasts.slice(1))
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [toasts])

  function toast({ title, description, variant = "default" }: ToastProps) {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prevToasts) => [...prevToasts, { id, title, description, variant }])
  }

  return { toast, toasts }
}

