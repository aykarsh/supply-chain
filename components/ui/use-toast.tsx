// This is a simplified toast component
// You may want to use a full-featured toast library like react-hot-toast or sonner
"use client"

import { createContext, useContext, useState } from "react"
import * as React from "react"

type ToastProps = {
  title: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastContextType = {
  toast: (props: ToastProps) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([])

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((current) => [...current, { ...props, id }])
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 3000)
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg p-4 shadow-md ${
              toast.variant === "destructive" ? "bg-red-500 text-white" : "bg-white text-black"
            }`}
          >
            <h3 className="font-medium">{toast.title}</h3>
            {toast.description && <p className="text-sm">{toast.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  
  return context
}

// Export the toast function directly for easier imports
export const toast = (props: ToastProps) => {
  if (typeof window !== "undefined") {
    const event = new CustomEvent("toast", { detail: props })
    window.dispatchEvent(event)
  }
}