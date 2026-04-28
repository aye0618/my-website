'use client'

import { useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error'
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className="fixed top-20 right-4 z-[100] animate-fade-in-up">
      <div className="bg-bazi-card border border-bazi-border rounded-lg shadow-[0_0_30px_rgba(201,168,76,0.3)] p-4 min-w-[300px] max-w-md">
        <div className="flex items-start gap-3">
          {type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-bazi-gold flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="text-sm text-bazi-text">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-bazi-muted hover:text-bazi-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
