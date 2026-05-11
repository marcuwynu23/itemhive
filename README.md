<div align="center">

# ItemHive

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A inventory management system provides comprehensive inventory tracking, financial management, and dynamic category management.

</div>

## Features

### Inventory Management

- **CRUD Operations**: Add, edit, remove, and view inventory items
- **Item Tracking**: Track item name, category, quantity, and price
- **Dynamic Categories**: Create and remove custom categories on the fly
- **Search & Filter**: Search items by name and filter by category
- **Low Stock Alerts**: Automatic alerts when items fall below threshold

### Financial Tracking

- **Income & Expenses**: Track money earned and spent
- **Net Profit Calculation**: Automatic calculation of net profit
- **Transaction Management**: Add, view, and delete financial transactions
- **Toggle Feature**: Enable/disable financial tracking via settings
- **Price Management**: Adjust item prices and apply discounts

### Dashboard

- **Real-time Statistics**: Total items, categories, low stock alerts
- **Financial Summary**: Income, expenses, and net profit overview
- **Interactive Charts**:
  - **Pie Chart**: Category distribution
  - **Line Chart**: Revenue trends over time
  - **Bar Chart**: Sales overview
- **Real-time Updates**: Dashboard updates automatically when data changes

### Configuration & Settings

- **Feature Toggles**: Enable/disable features (e.g., financial tracking)
- **Low Stock Threshold**: Configure when low stock alerts trigger
- **Data Export**: Export inventory and financial data to CSV or JSON

### User Interface

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Clean UI**: Modern, intuitive interface built with Tailwind CSS
- **Forms**: Easy-to-use forms for adding/editing items and categories
- **Modal Dialogs**: Smooth modal interactions for data entry

### Data Storage

- **MongoDB Database**: NoSQL database for flexible data storage
- **Mongoose ODM**: Object Data Modeling for MongoDB with TypeScript
- **Persistent Storage**: All data is saved to the database

## Process Flow

```mermaid
graph TD
    A[User Login] --> B[Dashboard]
    B --> C{Choose Action}

    C -->|Manage Inventory| D[Inventory Page]
    C -->|Manage Categories| E[Categories Page]
    C -->|Track Finances| F[Transactions Page]
    C -->|Configure System| G[Settings Page]
    C -->|Export Data| H[Export Data]

    D --> D1[Add Item]
    D --> D2[Edit Item]
    D --> D3[Delete Item]
    D --> D4[Search/Filter Items]
    D1 --> D5[Select Category]
    D5 --> D6[Set Price & Quantity]
    D6 --> D7[Save to Database]
    D7 --> D8[Update Dashboard Stats]

    E --> E1[Create Category]
    E --> E2[Edit Category]
    E --> E3[Delete Category]
    E3 --> E4[Cascade Delete Items]
    E1 --> E5[Save Category]
    E5 --> D8

    F --> F1[Add Transaction]
    F --> F2[View Transaction History]
    F --> F3[Delete Transaction]
    F1 --> F4{Transaction Type}
    F4 -->|Income| F5[Record Income]
    F4 -->|Expense| F6[Record Expense]
    F5 --> F7[Update Financial Stats]
    F6 --> F7
    F7 --> D8

    G --> G1[Toggle Financial Tracking]
    G --> G2[Set Low Stock Threshold]
    G --> G3[Configure Alerts]
    G1 --> G4[Update Settings]
    G2 --> G4
    G3 --> G4
    G4 --> D8

    H --> H1{Export Format}
    H1 -->|CSV| H2[Generate CSV]
    H1 -->|JSON| H3[Generate JSON]
    H2 --> H4[Download File]
    H3 --> H4

    D8 --> I[Real-time Dashboard Update]
    I --> J[Display Charts & Stats]
    J --> K[Check Low Stock Alerts]
    K --> L[Update UI Components]
```

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your MongoDB database
4. Configure environment variables
5. Seed the database: `npm run db:seed`
6. Start development: `npm run dev`

For detailed setup instructions, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Screenshots

_Coming soon - Screenshots of the dashboard, inventory management, and other key features will be added here._

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Development setup instructions
- Technical documentation
- API endpoints
- Database schema
- Project structure
- Contribution guidelines

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

For issues or questions, please check the [CONTRIBUTING.md](CONTRIBUTING.md) guide or create an issue in the repository.

---

**ItemHive** - Built with Next.js and TypeScript
