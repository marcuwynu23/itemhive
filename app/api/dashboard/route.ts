// API route for dashboard statistics
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Item from '@/models/Item'
import Category from '@/models/Category'
import Transaction from '@/models/Transaction'
import Settings from '@/models/Settings'

// GET /api/dashboard - Get dashboard statistics
export async function GET() {
  try {
    await connectDB()

    // Get total items count
    const totalItems = await Item.countDocuments()

    // Get total categories count
    const totalCategories = await Category.countDocuments()

    // Get low stock items (quantity < 10 by default, or from settings)
    const thresholdSettings = await Settings.findOne({
      key: 'low_stock_threshold',
    })
    const threshold = thresholdSettings
      ? JSON.parse(thresholdSettings.value).threshold
      : 10

    const lowStockItems = await Item.find({
      quantity: { $lt: threshold },
    })
      .populate('categoryId', 'name')
      .lean()

    const transformedLowStockItems = lowStockItems.map((item: any) => ({
      id: item._id.toString(),
      name: item.name,
      categoryId: item.categoryId._id.toString(),
      category: {
        id: item.categoryId._id.toString(),
        name: item.categoryId.name,
      },
      quantity: item.quantity,
      price: item.price,
    }))

    // Get financial statistics (if enabled)
    const financialSettings = await Settings.findOne({
      key: 'financial_tracking',
    })
    const financialEnabled = financialSettings?.financialTrackingEnabled ?? true

    let totalIncome = 0
    let totalExpenses = 0
    let netProfit = 0

    if (financialEnabled) {
      const incomeTransactions = await Transaction.find({ type: 'income' }).lean()
      const expenseTransactions = await Transaction.find({ type: 'expense' }).lean()

      totalIncome = incomeTransactions.reduce(
        (sum: number, t: any) => sum + t.amount,
        0
      )
      totalExpenses = expenseTransactions.reduce(
        (sum: number, t: any) => sum + t.amount,
        0
      )
      netProfit = totalIncome - totalExpenses
    }

    // Get category distribution
    const categories = await Category.find().lean()
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat: any) => {
        const itemCount = await Item.countDocuments({ categoryId: cat._id })
        return {
          id: cat._id.toString(),
          name: cat.name,
          _count: {
            items: itemCount,
          },
        }
      })
    )

    // Get recent transactions for chart data
    const recentTransactions = financialEnabled
      ? await Transaction.find()
          .sort({ createdAt: -1 })
          .limit(30)
          .lean()
      : []

    const transformedTransactions = recentTransactions.map((tx: any) => ({
      id: tx._id.toString(),
      type: tx.type,
      amount: tx.amount,
      description: tx.description || null,
      createdAt: tx.createdAt,
    }))

    return NextResponse.json({
      success: true,
      data: {
        totalItems,
        totalCategories,
        lowStockItems: transformedLowStockItems,
        financial: {
          enabled: financialEnabled,
          totalIncome,
          totalExpenses,
          netProfit,
        },
        categories: categoriesWithCounts,
        recentTransactions: transformedTransactions,
      },
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
