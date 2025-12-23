// API route for financial transactions
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Transaction from '@/models/Transaction'
import Settings from '@/models/Settings'
import { z } from 'zod'

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().min(0, 'Amount must be non-negative'),
  description: z.string().optional(),
  itemId: z.string().optional(),
})

// GET /api/transactions - Get all transactions with optional filters
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // 'income' or 'expense'
    const limit = parseInt(searchParams.get('limit') || '100')

    const query: any = {}
    if (type && (type === 'income' || type === 'expense')) {
      query.type = type
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    const transformedTransactions = transactions.map((tx: any) => ({
      id: tx._id.toString(),
      type: tx.type,
      amount: tx.amount,
      description: tx.description || null,
      itemId: tx.itemId ? tx.itemId.toString() : null,
      createdAt: tx.createdAt,
      updatedAt: tx.updatedAt,
    }))

    return NextResponse.json({ success: true, data: transformedTransactions })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Check if financial tracking is enabled
    const settings = await Settings.findOne({ key: 'financial_tracking' })

    if (!settings || !settings.financialTrackingEnabled) {
      return NextResponse.json(
        { success: false, error: 'Financial tracking is disabled' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = transactionSchema.parse(body)

    const transactionData: any = {
      type: validatedData.type,
      amount: validatedData.amount,
      description: validatedData.description,
    }

    if (validatedData.itemId) {
      transactionData.itemId = validatedData.itemId
    }

    const transaction = await Transaction.create(transactionData)

    const transformedTransaction = {
      id: transaction._id.toString(),
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description || null,
      itemId: transaction.itemId ? transaction.itemId.toString() : null,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    }

    return NextResponse.json({ success: true, data: transformedTransaction }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}
