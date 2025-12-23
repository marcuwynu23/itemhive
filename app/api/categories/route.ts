// API route for categories CRUD operations
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/models/Category'
import Item from '@/models/Item'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
})

// GET /api/categories - Get all categories
export async function GET() {
  try {
    await connectDB()
    const categories = await Category.find()
      .sort({ name: 1 })
      .lean()

    // Get item counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat: any) => {
        const itemCount = await Item.countDocuments({ categoryId: cat._id })
        return {
          id: cat._id.toString(),
          name: cat.name,
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt,
          _count: {
            items: itemCount,
          },
        }
      })
    )

    return NextResponse.json({ success: true, data: categoriesWithCounts })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const validatedData = categorySchema.parse(body)

    // Check if category already exists
    const existing = await Category.findOne({ name: validatedData.name })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Category already exists' },
        { status: 400 }
      )
    }

    const category = await Category.create({ name: validatedData.name })
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

    return NextResponse.json({ success: true, data: transformedCategory }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Error creating category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
