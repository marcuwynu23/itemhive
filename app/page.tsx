// Dashboard page - main landing page with statistics and charts
'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { DashboardSkeleton } from '@/components/LoadingSkeleton'

interface DashboardData {
  totalItems: number
  totalCategories: number
  lowStockItems: any[]
  financial: {
    enabled: boolean
    totalIncome: number
    totalExpenses: number
    netProfit: number
  }
  categories: any[]
  recentTransactions: any[]
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      const result = await response.json()
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!data) {
    return (
      <div className="card p-6">
        <div className="text-center text-red-600">
          Failed to load dashboard data
        </div>
      </div>
    )
  }

  // Prepare chart data
  const categoryData = data.categories.map((cat) => ({
    name: cat.name,
    value: cat._count.items,
  }))

  // Prepare revenue chart data (last 7 days)
  const revenueData = data.recentTransactions
    .slice(0, 7)
    .reverse()
    .map((tx) => ({
      date: new Date(tx.createdAt).toLocaleDateString(),
      income: tx.type === 'income' ? tx.amount : 0,
      expense: tx.type === 'expense' ? tx.amount : 0,
    }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Items</h3>
          <p className="text-3xl font-semibold text-gray-900">{data.totalItems}</p>
        </div>
        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Categories</h3>
          <p className="text-3xl font-semibold text-gray-900">
            {data.totalCategories}
          </p>
        </div>
        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Low Stock Items</h3>
          <p className="text-3xl font-semibold text-red-600">
            {data.lowStockItems.length}
          </p>
        </div>
        {data.financial.enabled && (
          <div className="card p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Net Profit</h3>
            <p
              className={`text-3xl font-semibold ${
                data.financial.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              ${data.financial.netProfit.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {/* Financial Summary */}
      {data.financial.enabled && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Income</p>
              <p className="text-2xl font-semibold text-green-600">
                ${data.financial.totalIncome.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
              <p className="text-2xl font-semibold text-red-600">
                ${data.financial.totalExpenses.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Net Profit</p>
              <p
                className={`text-2xl font-semibold ${
                  data.financial.netProfit >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                ${data.financial.netProfit.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Low Stock Alerts */}
      {data.lowStockItems.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Low Stock Alerts</h3>
          <ul className="list-disc list-inside space-y-1">
            {data.lowStockItems.map((item) => (
              <li key={item.id} className="text-sm text-yellow-800">
                {item.name} ({item.category.name}) - Only {item.quantity} left
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Distribution Pie Chart */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Items by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Line Chart */}
        {data.financial.enabled && revenueData.length > 0 && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="date" stroke="#737373" />
                <YAxis stroke="#737373" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px'
                  }} 
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Sales Bar Chart */}
        {data.financial.enabled && revenueData.length > 0 && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sales Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="date" stroke="#737373" />
                <YAxis stroke="#737373" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px'
                  }} 
                />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
