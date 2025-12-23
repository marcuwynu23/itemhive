'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

export type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  type: AlertType
  title?: string
  message: string
  onClose?: () => void
  autoClose?: boolean
  duration?: number
}

export default function Alert({
  type,
  title,
  message,
  onClose,
  autoClose = false,
  duration = 5000,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose?.(), 300) // Wait for fade out animation
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose])

  if (!isVisible) return null

  const alertConfig = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircleIcon,
      iconColor: 'text-green-400',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: XCircleIcon,
      iconColor: 'text-red-400',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: ExclamationCircleIcon,
      iconColor: 'text-yellow-400',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: InformationCircleIcon,
      iconColor: 'text-blue-400',
    },
  }

  const config = alertConfig[type]
  const Icon = config.icon

  return (
    <div
      className={`${config.bg} ${config.border} border rounded-md p-4 mb-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${config.text} mb-1`}>{title}</h3>
          )}
          <p className={`text-sm ${config.text}`}>{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => onClose(), 300)
              }}
              className={`inline-flex rounded-md ${config.bg} ${config.text} hover:${config.bg} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${config.bg} focus:ring-${config.text}`}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

