// API route for individual category operations
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/models/Category'
import Item from '@/models/Item'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(1),
})

// GET /api/categories/[id] - Get a single category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const category = await Category.findById(params.id).lean()

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    const itemCount = await Item.countDocuments({ categoryId: params.id })

    const transformedCategory = {
      id: category._id.toString(),
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      _count: {
        items: itemCount,
      },
    }

    return NextResponse.json({ success: true, data: transformedCategory })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const body = await request.json()
    const validatedData = categorySchema.parse(body)

    // Check if another category with the same name exists
    const existing = await Category.findOne({
      name: validatedData.name,
      _id: { $ne: params.id },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Category name already exists' },
        { status: 400 }
      )
    }

    const category = await Category.findByIdAndUpdate(
      params.id,
      { name: validatedData.name },
      { new: true }
    )

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    const itemCount = await Item.countDocuments({ categoryId: category._id })

    const transformedCategory = {
      id: category._id.toString(),
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      _count: {
        items: itemCount,
      },
    }

    return NextResponse.json({ success: true, data: transformedCategory })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Error updating category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE /api/categories/[id] - Delete a category
// Note: Items with this category will be deleted due to cascade delete
// In production, you might want to move items to a default category instead
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    // Check if category exists and count items
    const category = await Category.findById(params.id)
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    const itemCount = await Item.countDocuments({ categoryId: params.id })

    // Delete all items in this category
    await Item.deleteMany({ categoryId: params.id })

    // Delete category
    await Category.findByIdAndDelete(params.id)

    return NextResponse.json({
      success: true,
      message: `Category deleted. ${itemCount} items were also deleted.`,
    })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
