# Contributing to ItemHive

Thank you for your interest in contributing to ItemHive! This guide will help you get started with development and understand the technical aspects of the project.

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

## Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    User {
        ObjectId _id PK
        string email UK "required, unique"
        string name "optional"
        string password "required, hashed"
        string role "default: user"
        Date createdAt
        Date updatedAt
    }

    Category {
        ObjectId _id PK
        string name UK "required, unique"
        Date createdAt
        Date updatedAt
    }

    Item {
        ObjectId _id PK
        string name "required"
        ObjectId categoryId FK "required, ref Category"
        number quantity "default: 0, min: 0"
        number price "default: 0, min: 0"
        Date createdAt
        Date updatedAt
    }

    Transaction {
        ObjectId _id PK
        string type "enum: income, expense"
        number amount "required, min: 0"
        string description "optional"
        ObjectId itemId FK "optional, ref Item"
        Date createdAt
        Date updatedAt
    }

    Settings {
        ObjectId _id PK
        string key UK "required, unique"
        string value "required, JSON string"
        boolean financialTrackingEnabled "default: true"
        Date createdAt
        Date updatedAt
    }

    %% Relationships
    Category ||--o{ Item : "contains"
    Item ||--o{ Transaction : "references"

    %% Notes
    %% - User model exists for future multi-user support
    %% - Category deletion cascades to Items (handled in API)
    %% - Transaction.itemId is optional for general income/expense
    %% - Settings stores configuration as key-value pairs
```

### Models

- **User**: User accounts (for future authentication)
- **Category**: Dynamic categories for items
- **Item**: Inventory items with name, category reference, quantity, price
- **Transaction**: Financial transactions (income/expense)
- **Settings**: System configuration

### Relationships

- Category → Items (One-to-Many via ObjectId reference)
- Category deletion cascades to items (items are deleted when category is deleted)
- Item → Transactions (One-to-Many, optional reference for item-specific transactions)

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

## Contributing Guidelines

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** following the existing code style
4. **Test your changes** thoroughly
5. **Commit your changes**: `git commit -m "Add your feature"`
6. **Push to your branch**: `git push origin feature/your-feature-name`
7. **Create a Pull Request**

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Add proper error handling
- Include JSDoc comments for functions
- Use Tailwind CSS for styling
- Ensure responsive design

### Testing

- Test all CRUD operations
- Verify API endpoints work correctly
- Check responsive design on different screen sizes
- Test with different data scenarios

## Future Enhancements

- [ ] Full authentication with NextAuth.js
- [ ] Multi-user support with role-based access
- [ ] Barcode scanning
- [ ] Inventory reports
- [ ] Email notifications for low stock
- [ ] Advanced analytics
- [ ] Bulk import/export
- [ ] Inventory history/audit log

## Support

For issues or questions, please check the code comments or create an issue in the repository.
