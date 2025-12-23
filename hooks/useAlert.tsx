'use client'

import { useState, useCallback } from 'react'
import Alert, { AlertType } from '@/components/Alert'

interface AlertState {
  type: AlertType
  title?: string
  message: string
  id: number
}

export function useAlert() {
  const [alerts, setAlerts] = useState<AlertState[]>([])

  const showAlert = useCallback(
    (type: AlertType, message: string, title?: string) => {
      const id = Date.now()
      setAlerts((prev) => [...prev, { type, message, title, id }])
      return id
    },
    []
  )

  const removeAlert = useCallback((id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }, [])

  const AlertContainer = () => (
    <div className="fixed top-20 right-6 z-50 space-y-2 max-w-md">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => removeAlert(alert.id)}
          autoClose={true}
          duration={5000}
        />
      ))}
    </div>
  )

  return {
    showAlert,
    removeAlert,
    success: (message: string, title?: string) => showAlert('success', message, title),
    error: (message: string, title?: string) => showAlert('error', message, title),
    warning: (message: string, title?: string) => showAlert('warning', message, title),
    info: (message: string, title?: string) => showAlert('info', message, title),
    AlertContainer,
  }
}

