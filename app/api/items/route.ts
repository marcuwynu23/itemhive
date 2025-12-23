// API route for inventory items CRUD operations
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Item from '@/models/Item'
import Category from '@/models/Category'
import { z } from 'zod'

// Validation schema for item creation/update
const itemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  categoryId: z.string().min(1, 'Category is required'),
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
  price: z.number().min(0, 'Price must be non-negative'),
})

// GET /api/items - Get all items with optional search and filter
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('categoryId') || ''

    // Build query for filtering
    const query: any = {}

    if (search) {
      query.name = { $regex: search, $options: 'i' } // Case-insensitive search
    }

    if (categoryId) {
      query.categoryId = categoryId
    }

    const items = await Item.find(query)
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 })
      .lean()

    // Transform the data to match expected format
    const transformedItems = items.map((item: any) => ({
      id: item._id.toString(),
      name: item.name,
      categoryId: item.categoryId._id.toString(),
      category: {
        id: item.categoryId._id.toString(),
        name: item.categoryId.name,
      },
      quantity: item.quantity,
      price: item.price,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }))

    return NextResponse.json({ success: true, data: transformedItems })
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}

// POST /api/items - Create a new item
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const validatedData = itemSchema.parse(body)

    // Check if category exists
    const category = await Category.findById(validatedData.categoryId)

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    const item = await Item.create({
      name: validatedData.name,
      categoryId: validatedData.categoryId,
      quantity: validatedData.quantity,
      price: validatedData.price,
    })

    await item.populate('categoryId', 'name')

    const transformedItem = {
      id: item._id.toString(),
      name: item.name,
      categoryId: item.categoryId._id.toString(),
      category: {
        id: item.categoryId._id.toString(),
        name: item.categoryId.name,
      },
      quantity: item.quantity,
      price: item.price,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }

    return NextResponse.json({ success: true, data: transformedItem }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Error creating item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create item' },
      { status: 500 }
    )
  }
}
