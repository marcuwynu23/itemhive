// Categories management page - dynamic category CRUD
'use client'

import { useEffect, useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { CardSkeleton } from '@/components/LoadingSkeleton'
import Modal from '@/components/Modal'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useAlert } from '@/hooks/useAlert'

interface Category {
  id: string
  name: string
  _count?: {
    items: number
  }
}

export default function CategoriesPage() {
  const { success, error, info, AlertContainer } = useAlert()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryName, setCategoryName] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const result = await response.json()
      if (result.success) {
        setCategories(result.data)
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryName.trim()) return

    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories'
      const method = editingCategory ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName.trim() }),
      })

      const result = await response.json()
      if (result.success) {
        fetchCategories()
        setShowModal(false)
        setCategoryName('')
        setEditingCategory(null)
        success(editingCategory ? 'Category updated successfully' : 'Category created successfully')
      } else {
        error(result.error || 'Failed to save category')
      }
    } catch (err) {
      console.error('Error saving category:', err)
      error('Failed to save category')
    }
  }

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return

    try {
      const response = await fetch(`/api/categories/${categoryToDelete}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (result.success) {
        info(result.message)
        fetchCategories()
      } else {
        error(result.error || 'Failed to delete category')
      }
    } catch (err) {
      console.error('Error deleting category:', err)
      error('Failed to delete category')
    } finally {
      setShowDeleteDialog(false)
      setCategoryToDelete(null)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setCategoryName(category.name)
    setShowModal(true)
  }

  const openAddModal = () => {
    setCategoryName('')
    setEditingCategory(null)
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-9 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <AlertContainer />
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Categories Management</h1>
          <button
            onClick={openAddModal}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Category
          </button>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Deleting a category will also delete all items
            in that category. Make sure to move or delete items first if needed.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12 card">
              No categories found. Create your first category!
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {category._count?.items || 0} items
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 btn btn-secondary text-sm flex items-center justify-center"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category.id)}
                    className="flex-1 btn text-sm flex items-center justify-center"
                    style={{ backgroundColor: '#ef4444', color: 'white', borderColor: '#ef4444' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setCategoryName('')
            setEditingCategory(null)
          }}
          title={editingCategory ? 'Edit Category' : 'Add New Category'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Category name"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 btn btn-primary"
              >
                {editingCategory ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false)
                  setCategoryName('')
                  setEditingCategory(null)
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
            setCategoryToDelete(null)
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Category"
          message="Are you sure? This will delete the category and all items in it. This action cannot be undone."
          confirmText="Delete"
          variant="danger"
        />
      </div>
    </>
  )
}
