// API route for individual item operations (GET, PUT, DELETE)
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Item from '@/models/Item'
import Category from '@/models/Category'
import { z } from 'zod'

const itemSchema = z.object({
  name: z.string().min(1).optional(),
  categoryId: z.string().min(1).optional(),
  quantity: z.number().int().min(0).optional(),
  price: z.number().min(0).optional(),
})

// GET /api/items/[id] - Get a single item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const item = await Item.findById(params.id).populate('categoryId', 'name').lean()

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      )
    }

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

    return NextResponse.json({ success: true, data: transformedItem })
  } catch (error) {
    console.error('Error fetching item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch item' },
      { status: 500 }
    )
  }
}

// PUT /api/items/[id] - Update an item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const body = await request.json()
    const validatedData = itemSchema.parse(body)

    // If categoryId is being updated, verify it exists
    if (validatedData.categoryId) {
      const category = await Category.findById(validatedData.categoryId)

      if (!category) {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 404 }
        )
      }
    }

    const updateData: any = {}
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.categoryId !== undefined)
      updateData.categoryId = validatedData.categoryId
    if (validatedData.quantity !== undefined)
      updateData.quantity = validatedData.quantity
    if (validatedData.price !== undefined) updateData.price = validatedData.price

    const item = await Item.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    ).populate('categoryId', 'name')

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      )
    }

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

    return NextResponse.json({ success: true, data: transformedItem })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Error updating item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update item' },
      { status: 500 }
    )
  }
}

// DELETE /api/items/[id] - Delete an item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const item = await Item.findByIdAndDelete(params.id)

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Item deleted' })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}
