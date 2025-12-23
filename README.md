# ItemHive

A complete, full-featured inventory management system built with Next.js, TypeScript, Mongoose, and MongoDB. ItemHive provides comprehensive inventory tracking, financial management, and dynamic category management.

## Features

### 📦 Inventory Management
- **CRUD Operations**: Add, edit, remove, and view inventory items
- **Item Tracking**: Track item name, category, quantity, and price
- **Dynamic Categories**: Create and remove custom categories on the fly
- **Search & Filter**: Search items by name and filter by category
- **Low Stock Alerts**: Automatic alerts when items fall below threshold

### 💰 Financial Tracking
- **Income & Expenses**: Track money earned and spent
- **Net Profit Calculation**: Automatic calculation of net profit
- **Transaction Management**: Add, view, and delete financial transactions
- **Toggle Feature**: Enable/disable financial tracking via settings
- **Price Management**: Adjust item prices and apply discounts

### 📊 Dashboard
- **Real-time Statistics**: Total items, categories, low stock alerts
- **Financial Summary**: Income, expenses, and net profit overview
- **Interactive Charts**:
  - **Pie Chart**: Category distribution
  - **Line Chart**: Revenue trends over time
  - **Bar Chart**: Sales overview
- **Real-time Updates**: Dashboard updates automatically when data changes

### ⚙️ Configuration & Settings
- **Feature Toggles**: Enable/disable features (e.g., financial tracking)
- **Low Stock Threshold**: Configure when low stock alerts trigger
- **Data Export**: Export inventory and financial data to CSV or JSON

### 🎨 User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Clean UI**: Modern, intuitive interface built with Tailwind CSS
- **Forms**: Easy-to-use forms for adding/editing items and categories
- **Modal Dialogs**: Smooth modal interactions for data entry

### 💾 Data Storage
- **MongoDB Database**: NoSQL database for flexible data storage
- **Mongoose ODM**: Object Data Modeling for MongoDB with TypeScript
- **Persistent Storage**: All data is saved to the database

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Validation**: Zod

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ and npm
- Git (optional, for cloning)

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas (cloud)
   - For local MongoDB: Ensure MongoDB is running on your machine
   - For MongoDB Atlas: Create a free cluster and get your connection string

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="mongodb://localhost:27017/inventory"
   # Or for MongoDB Atlas:
   # DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/inventory"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
   ```

4. **Seed Database with Example Data**
   ```bash
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
inventory/
├── app/
│   ├── api/              # API routes
│   │   ├── items/        # Item CRUD operations
│   │   ├── categories/   # Category management
│   │   ├── transactions/ # Financial transactions
│   │   ├── dashboard/    # Dashboard statistics
│   │   ├── settings/     # System settings
│   │   └── export/       # Data export
│   ├── inventory/        # Inventory management page
│   ├── categories/       # Categories management page
│   ├── transactions/     # Transactions page
│   ├── settings/         # Settings page
│   ├── layout.tsx        # Root layout with navigation
│   ├── page.tsx          # Dashboard page
│   └── globals.css       # Global styles
├── lib/
│   └── mongodb.ts        # MongoDB connection utility
├── models/               # Mongoose models
│   ├── User.ts          # User model
│   ├── Category.ts      # Category model
│   ├── Item.ts          # Item model
│   ├── Transaction.ts   # Transaction model
│   └── Settings.ts      # Settings model
├── scripts/
│   └── seed.ts          # Database seeding script
├── package.json
├── tsconfig.json
└── README.md
```

## Usage Guide

### Managing Inventory

1. **Add Items**
   - Navigate to "Inventory" page
   - Click "+ Add Item"
   - Fill in name, category, quantity, and price
   - Click "Create"

2. **Edit Items**
   - Click "Edit" on any item
   - Modify the fields
   - Click "Update"

3. **Delete Items**
   - Click "Delete" on any item
   - Confirm deletion

4. **Search & Filter**
   - Use the search box to find items by name
   - Use the category dropdown to filter by category

### Managing Categories

1. **Create Category**
   - Navigate to "Categories" page
   - Click "+ Add Category"
   - Enter category name
   - Click "Create"

2. **Edit Category**
   - Click "Edit" on any category
   - Modify the name
   - Click "Update"

3. **Delete Category**
   - Click "Delete" on any category
   - **Warning**: This will delete all items in that category

### Financial Tracking

1. **Add Transaction**
   - Navigate to "Transactions" page
   - Click "+ Add Transaction"
   - Select type (Income/Expense)
   - Enter amount and optional description
   - Click "Create"

2. **View Financial Summary**
   - Check the dashboard for total income, expenses, and net profit
   - View transaction history on the Transactions page

3. **Toggle Financial Tracking**
   - Go to Settings
   - Toggle "Financial Tracking" on/off

### Dashboard

The dashboard provides:
- **Statistics Cards**: Total items, categories, low stock items, net profit
- **Financial Summary**: Income, expenses, and net profit breakdown
- **Low Stock Alerts**: List of items below threshold
- **Charts**: Visual representation of category distribution and revenue trends

### Settings

1. **Financial Tracking Toggle**
   - Enable/disable financial features
   - When disabled, transaction features are unavailable

2. **Low Stock Threshold**
   - Set the quantity threshold for low stock alerts
   - Default is 10

3. **Data Export**
   - Export inventory data as CSV or JSON
   - Export financial data as CSV or JSON
   - Export all data as CSV or JSON

## Database Schema

### Models

- **User**: User accounts (for future authentication)
- **Category**: Dynamic categories for items
- **Item**: Inventory items with name, category reference, quantity, price
- **Transaction**: Financial transactions (income/expense)
- **Settings**: System configuration

### Relationships

- Category → Items (One-to-Many via ObjectId reference)
- Category deletion cascades to items (items are deleted when category is deleted)

## API Endpoints

### Items
- `GET /api/items` - Get all items (with optional search and category filter)
- `POST /api/items` - Create new item
- `GET /api/items/[id]` - Get single item
- `PUT /api/items/[id]` - Update item
- `DELETE /api/items/[id]` - Delete item

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `GET /api/categories/[id]` - Get single category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

### Settings
- `GET /api/settings` - Get all settings
- `POST /api/settings` - Create/update setting

### Export
- `GET /api/export?format=csv|json&type=inventory|financial|all` - Export data

## Example Data

The seed script creates:
- 5 categories: Electronics, Clothing, Food & Beverages, Books, Tools
- 10 sample items across categories
- 5 sample transactions
- Default settings
- Default admin user (admin@inventory.com / admin123)

**Note**: Change the default password in production!

## MongoDB Setup Options

### Local MongoDB

1. Install MongoDB locally from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/inventory`

### MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string from the Atlas dashboard
4. Update `.env` with your Atlas connection string:
   ```env
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/inventory"
   ```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed database with example data

### Code Structure

- **API Routes**: Server-side API endpoints in `app/api/`
- **Pages**: Client-side pages in `app/`
- **Components**: Reusable components (can be added to `components/`)
- **Lib**: Utility functions and database connection
- **Models**: Mongoose models for database schemas

## Production Deployment

1. **Environment Variables**: Set production environment variables
2. **Database**: Use a production database (PostgreSQL recommended)
3. **Build**: Run `npm run build`
4. **Start**: Run `npm start`
5. **Security**: 
   - Change default passwords
   - Use environment variables for secrets
   - Enable HTTPS
   - Set up proper authentication (NextAuth.js)

## Troubleshooting

### Database Issues
- Ensure `.env` file exists with `DATABASE_URL`
- Verify MongoDB is running (for local setup)
- Check MongoDB connection string format
- Ensure network access is configured (for MongoDB Atlas)

### Build Errors
- Clear `.next` folder and rebuild
- Ensure all dependencies are installed
- Check TypeScript errors

### API Errors
- Check browser console for errors
- Verify API routes are accessible
- Check database connection

## Future Enhancements

- [ ] Full authentication with NextAuth.js
- [ ] Multi-user support with role-based access
- [ ] Barcode scanning
- [ ] Inventory reports
- [ ] Email notifications for low stock
- [ ] Advanced analytics
- [ ] Bulk import/export
- [ ] Inventory history/audit log

## License

This project is open source and available for use.

## Support

For issues or questions, please check the code comments or create an issue in the repository.

---

**ItemHive** - Built with ❤️ using Next.js and TypeScript

