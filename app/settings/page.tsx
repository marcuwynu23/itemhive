// Settings page - configuration and data export
'use client'

import { useEffect, useState } from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import { useAlert } from '@/hooks/useAlert'

interface Settings {
  id: string
  key: string
  value: any
  financialTrackingEnabled: boolean
}

export default function SettingsPage() {
  const { success, error, AlertContainer } = useAlert()
  const [settings, setSettings] = useState<Settings[]>([])
  const [loading, setLoading] = useState(true)
  const [financialEnabled, setFinancialEnabled] = useState(true)
  const [lowStockThreshold, setLowStockThreshold] = useState(10)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const result = await response.json()
      if (result.success) {
        setSettings(result.data)
        // Extract current values
        const financial = result.data.find(
          (s: Settings) => s.key === 'financial_tracking'
        )
        const threshold = result.data.find(
          (s: Settings) => s.key === 'low_stock_threshold'
        )
        if (financial) {
          setFinancialEnabled(financial.financialTrackingEnabled)
        }
        if (threshold) {
          setLowStockThreshold(threshold.value.threshold || 10)
        }
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFinancialToggle = async (enabled: boolean) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'financial_tracking',
          value: JSON.stringify({ enabled }),
          financialTrackingEnabled: enabled,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setFinancialEnabled(enabled)
        success('Financial tracking setting updated!')
      } else {
        error('Failed to update setting')
      }
    } catch (err) {
      console.error('Error updating setting:', err)
      error('Failed to update setting')
    }
  }

  const handleThresholdUpdate = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'low_stock_threshold',
          value: JSON.stringify({ threshold: lowStockThreshold }),
          financialTrackingEnabled: true,
        }),
      })

      const result = await response.json()
      if (result.success) {
        success('Low stock threshold updated!')
      } else {
        error('Failed to update threshold')
      }
    } catch (err) {
      console.error('Error updating threshold:', err)
      error('Failed to update threshold')
    }
  }

  const handleExport = async (format: 'csv' | 'json', type: string) => {
    try {
      const response = await fetch(
        `/api/export?format=${format}&type=${type}`
      )
      
      if (format === 'json') {
        const data = await response.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json',
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `inventory-export-${Date.now()}.json`
        a.click()
        success('Data exported successfully!')
      } else {
        const text = await response.text()
        const blob = new Blob([text], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `inventory-export-${Date.now()}.csv`
        a.click()
        success('Data exported successfully!')
      }
    } catch (err) {
      console.error('Error exporting data:', err)
      error('Failed to export data')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-9 bg-gray-200 rounded w-32 animate-pulse mb-6"></div>
        {[...Array(3)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <>
      <AlertContainer />
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">Settings</h1>

        {/* Financial Tracking Toggle */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Tracking</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Enable or disable financial tracking features
              </p>
              <p className="text-xs text-gray-500 mt-1">
                When disabled, income/expense tracking will be unavailable
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={financialEnabled}
                onChange={(e) => handleFinancialToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Low Stock Threshold */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Low Stock Threshold</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert when quantity is below:
              </label>
              <input
                type="number"
                min="0"
                value={lowStockThreshold}
                onChange={(e) =>
                  setLowStockThreshold(parseInt(e.target.value) || 0)
                }
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleThresholdUpdate}
              className="btn btn-primary self-end"
            >
              Update
            </button>
          </div>
        </div>

        {/* Data Export */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Export</h2>
          <p className="text-sm text-gray-700 mb-4">
            Export your inventory and financial data in various formats
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Export Inventory</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('json', 'inventory')}
                  className="btn btn-secondary flex items-center"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export as JSON
                </button>
                <button
                  onClick={() => handleExport('csv', 'inventory')}
                  className="btn btn-secondary flex items-center"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export as CSV
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Export Financial Data</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('json', 'financial')}
                  className="btn btn-secondary flex items-center"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export as JSON
                </button>
                <button
                  onClick={() => handleExport('csv', 'financial')}
                  className="btn btn-secondary flex items-center"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export as CSV
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Export All Data</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('json', 'all')}
                  className="btn btn-secondary flex items-center"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export as JSON
                </button>
                <button
                  onClick={() => handleExport('csv', 'all')}
                  className="btn btn-secondary flex items-center"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export as CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
