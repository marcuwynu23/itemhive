// Financial transactions management page
'use client'

import { useEffect, useState } from 'react'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { TableSkeleton, CardSkeleton } from '@/components/LoadingSkeleton'
import Modal from '@/components/Modal'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useAlert } from '@/hooks/useAlert'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string | null
  createdAt: string
}

export default function TransactionsPage() {
  const { success, error, AlertContainer } = useAlert()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
    amount: 0,
    description: '',
  })
  const [financialEnabled, setFinancialEnabled] = useState(true)

  useEffect(() => {
    fetchTransactions()
    checkFinancialEnabled()
  }, [])

  const checkFinancialEnabled = async () => {
    try {
      const response = await fetch('/api/settings')
      const result = await response.json()
      if (result.success) {
        const financial = result.data.find(
          (s: any) => s.key === 'financial_tracking'
        )
        setFinancialEnabled(financial?.financialTrackingEnabled ?? true)
      }
    } catch (err) {
      console.error('Error checking settings:', err)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions')
      const result = await response.json()
      if (result.success) {
        setTransactions(result.data)
      }
    } catch (err) {
      console.error('Error fetching transactions:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      if (result.success) {
        fetchTransactions()
        setShowModal(false)
        setFormData({ type: 'income', amount: 0, description: '' })
        success('Transaction created successfully')
      } else {
        error(result.error || 'Failed to create transaction')
      }
    } catch (err) {
      console.error('Error creating transaction:', err)
      error('Failed to create transaction')
    }
  }

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!transactionToDelete) return

    try {
      const response = await fetch(`/api/transactions/${transactionToDelete}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (result.success) {
        fetchTransactions()
        success('Transaction deleted successfully')
      } else {
        error(result.error || 'Failed to delete transaction')
      }
    } catch (err) {
      console.error('Error deleting transaction:', err)
      error('Failed to delete transaction')
    } finally {
      setShowDeleteDialog(false)
      setTransactionToDelete(null)
    }
  }

  if (!financialEnabled) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-gray-900">Financial Transactions</h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <p className="text-yellow-800">
            Financial tracking is currently disabled. Enable it in Settings to
            manage transactions.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-9 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <TableSkeleton />
      </div>
    )
  }

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <>
      <AlertContainer />
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Financial Transactions</h1>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Transaction
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Income</h3>
            <p className="text-3xl font-semibold text-green-600">
              ${totalIncome.toFixed(2)}
            </p>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Expenses</h3>
            <p className="text-3xl font-semibold text-red-600">
              ${totalExpenses.toFixed(2)}
            </p>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Net Profit</h3>
            <p
              className={`text-3xl font-semibold ${
                totalIncome - totalExpenses >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              ${(totalIncome - totalExpenses).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                          transaction.type === 'income'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-medium ${
                          transaction.type === 'income'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}$
                        {transaction.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {transaction.description || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeleteClick(transaction.id)}
                        className="text-red-600 hover:text-red-700 flex items-center"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add Transaction Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setFormData({ type: 'income', amount: 0, description: '' })
          }}
          title="Add Transaction"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                required
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as 'income' | 'expense',
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Optional description"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 btn btn-primary"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false)
                  setFormData({ type: 'income', amount: 0, description: '' })
                }}
                className="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false)
            setTransactionToDelete(null)
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Transaction"
          message="Are you sure you want to delete this transaction? This action cannot be undone."
          confirmText="Delete"
          variant="danger"
        />
      </div>
    </>
  )
}
