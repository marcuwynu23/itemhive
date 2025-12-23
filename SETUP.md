# Quick Setup Guide

Follow these steps to get ItemHive up and running:

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up MongoDB

You have two options:

### Option A: Local MongoDB
1. Install MongoDB locally from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service on your machine
3. Use connection string: `mongodb://localhost:27017/inventory`

### Option B: MongoDB Atlas (Cloud - Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user and get your connection string
4. Whitelist your IP address (or use 0.0.0.0/0 for development)

## Step 3: Create Environment File

Create a `.env` file in the root directory with the following content:

```env
# For local MongoDB:
DATABASE_URL="mongodb://localhost:27017/inventory"

# Or for MongoDB Atlas:
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/inventory"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
```

**Note**: For production, generate a secure random string for `NEXTAUTH_SECRET`.

## Step 4: Seed Database

```bash
# Seed database with example data
npm run db:seed
```

## Step 5: Start Development Server

```bash
npm run dev
```

## Step 6: Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## What's Included in the Seed Data?

The seed script creates:
- **5 Categories**: Electronics, Clothing, Food & Beverages, Books, Tools
- **10 Sample Items**: Various items across different categories
- **5 Sample Transactions**: Income and expense examples
- **Default Settings**: Financial tracking enabled, low stock threshold set to 10
- **Default Admin User**: admin@inventory.com / admin123 (change in production!)

## Troubleshooting

### Database connection errors
- Make sure MongoDB is running (for local setup)
- Check that `.env` file exists with correct `DATABASE_URL`
- Verify MongoDB connection string format
- For MongoDB Atlas: Check network access and credentials
- Ensure MongoDB service is accessible

### Port already in use
- Change the port: `npm run dev -- -p 3001`

## Next Steps

1. Explore the dashboard to see statistics and charts
2. Add your own items in the Inventory page
3. Create custom categories
4. Add financial transactions
5. Configure settings to your preferences
6. Export your data when needed

Enjoy using ItemHive! 🎉

