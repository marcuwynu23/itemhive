// API route for exporting data to CSV/JSON
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Item from '@/models/Item'
import Category from '@/models/Category'
import Transaction from '@/models/Transaction'

// GET /api/export?format=csv|json&type=inventory|financial|all
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'json' // 'csv' or 'json'
    const type = searchParams.get('type') || 'all' // 'inventory', 'financial', or 'all'

    let data: any = {}

    // Fetch inventory data
    if (type === 'inventory' || type === 'all') {
      const items = await Item.find().populate('categoryId', 'name').lean()
      const categories = await Category.find().lean()

      data.items = items.map((item: any) => ({
        id: item._id.toString(),
        name: item.name,
        category: item.categoryId.name,
        quantity: item.quantity,
        price: item.price,
        createdAt: item.createdAt,
      }))

      data.categories = categories.map((cat: any) => ({
        id: cat._id.toString(),
        name: cat.name,
        createdAt: cat.createdAt,
      }))
    }

    // Fetch financial data
    if (type === 'financial' || type === 'all') {
      const transactions = await Transaction.find()
        .sort({ createdAt: -1 })
        .lean()

      data.transactions = transactions.map((tx: any) => ({
        id: tx._id.toString(),
        type: tx.type,
        amount: tx.amount,
        description: tx.description || '',
        createdAt: tx.createdAt,
      }))
    }

    if (format === 'csv') {
      // Convert to CSV format
      let csv = ''

      if (data.items) {
        csv += 'Items\n'
        csv += 'ID,Name,Category,Quantity,Price,Created At\n'
        data.items.forEach((item: any) => {
          csv += `${item.id},${item.name},${item.category},${item.quantity},${item.price},${item.createdAt}\n`
        })
        csv += '\n'
      }

      if (data.categories) {
        csv += 'Categories\n'
        csv += 'ID,Name,Created At\n'
        data.categories.forEach((cat: any) => {
          csv += `${cat.id},${cat.name},${cat.createdAt}\n`
        })
        csv += '\n'
      }

      if (data.transactions) {
        csv += 'Transactions\n'
        csv += 'ID,Type,Amount,Description,Created At\n'
        data.transactions.forEach((tx: any) => {
          csv += `${tx.id},${tx.type},${tx.amount},"${tx.description || ''}",${tx.createdAt}\n`
        })
      }

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="inventory-export-${Date.now()}.csv"`,
        },
      })
    } else {
      // Return as JSON
      return NextResponse.json(
        {
          success: true,
          data,
          exportedAt: new Date().toISOString(),
        },
        {
          headers: {
            'Content-Disposition': `attachment; filename="inventory-export-${Date.now()}.json"`,
          },
        }
      )
    }
  } catch (error) {
    console.error('Error exporting data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
