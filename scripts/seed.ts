// Seed script to populate database with example data
import connectDB from '../lib/mongodb'
import User from '../models/User'
import Category from '../models/Category'
import Item from '../models/Item'
import Transaction from '../models/Transaction'
import Settings from '../models/Settings'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Seeding database...')

  try {
    await connectDB()

    // Clear existing data (optional - comment out if you want to keep existing data)
    await User.deleteMany({})
    await Category.deleteMany({})
    await Item.deleteMany({})
    await Transaction.deleteMany({})
    await Settings.deleteMany({})

    // Create categories
    const electronics = await Category.findOneAndUpdate(
      { name: 'Electronics' },
      { name: 'Electronics' },
      { upsert: true, new: true }
    )

    const clothing = await Category.findOneAndUpdate(
      { name: 'Clothing' },
      { name: 'Clothing' },
      { upsert: true, new: true }
    )

    const food = await Category.findOneAndUpdate(
      { name: 'Food & Beverages' },
      { name: 'Food & Beverages' },
      { upsert: true, new: true }
    )

    const books = await Category.findOneAndUpdate(
      { name: 'Books' },
      { name: 'Books' },
      { upsert: true, new: true }
    )

    const tools = await Category.findOneAndUpdate(
      { name: 'Tools' },
      { name: 'Tools' },
      { upsert: true, new: true }
    )

    console.log('✅ Categories created')

    // Create items
    const items = [
      {
        name: 'Laptop',
        categoryId: electronics._id,
        quantity: 15,
        price: 999.99,
      },
      {
        name: 'Smartphone',
        categoryId: electronics._id,
        quantity: 30,
        price: 699.99,
      },
      {
        name: 'T-Shirt',
        categoryId: clothing._id,
        quantity: 50,
        price: 19.99,
      },
      {
        name: 'Jeans',
        categoryId: clothing._id,
        quantity: 25,
        price: 49.99,
      },
      {
        name: 'Coffee Beans',
        categoryId: food._id,
        quantity: 100,
        price: 12.99,
      },
      {
        name: 'Water Bottle',
        categoryId: food._id,
        quantity: 5, // Low stock
        price: 4.99,
      },
      {
        name: 'Programming Book',
        categoryId: books._id,
        quantity: 20,
        price: 39.99,
      },
      {
        name: 'Hammer',
        categoryId: tools._id,
        quantity: 3, // Low stock
        price: 24.99,
      },
      {
        name: 'Screwdriver Set',
        categoryId: tools._id,
        quantity: 8,
        price: 29.99,
      },
      {
        name: 'Tablet',
        categoryId: electronics._id,
        quantity: 12,
        price: 399.99,
      },
    ]

    for (const itemData of items) {
      await Item.create(itemData)
    }

    console.log('✅ Items created')

    // Create sample transactions
    const transactions = [
      {
        type: 'income',
        amount: 999.99,
        description: 'Sold 1 Laptop',
      },
      {
        type: 'income',
        amount: 699.99,
        description: 'Sold 1 Smartphone',
      },
      {
        type: 'expense',
        amount: 500.0,
        description: 'Restocked Electronics',
      },
      {
        type: 'income',
        amount: 49.99,
        description: 'Sold 1 Jeans',
      },
      {
        type: 'expense',
        amount: 200.0,
        description: 'Monthly Utilities',
      },
    ]

    for (const transactionData of transactions) {
      await Transaction.create(transactionData)
    }

    console.log('✅ Transactions created')

    // Create default settings
    await Settings.findOneAndUpdate(
      { key: 'financial_tracking' },
      {
        key: 'financial_tracking',
        value: JSON.stringify({ enabled: true }),
        financialTrackingEnabled: true,
      },
      { upsert: true, new: true }
    )

    await Settings.findOneAndUpdate(
      { key: 'low_stock_threshold' },
      {
        key: 'low_stock_threshold',
        value: JSON.stringify({ threshold: 10 }),
        financialTrackingEnabled: true,
      },
      { upsert: true, new: true }
    )

    console.log('✅ Settings created')

    // Create default admin user (password: admin123 - change in production!)
    const hashedPassword = await bcrypt.hash('admin123', 10)
    await User.findOneAndUpdate(
      { email: 'admin@inventory.com' },
      {
        email: 'admin@inventory.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'admin',
      },
      { upsert: true, new: true }
    )

    console.log('✅ Default user created (admin@inventory.com / admin123)')
    console.log('🎉 Seeding completed!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

main()

