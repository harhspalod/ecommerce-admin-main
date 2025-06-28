# Ecommerce Admin Dashboard - Frontend Only

A modern, responsive ecommerce admin dashboard built with Next.js, TypeScript, and Tailwind CSS. This is a pure frontend application with mock data for demonstration purposes.

![Dashboard Screenshot](https://ecommerce-admin-board.vercel.app/assets/page-screenshot.png)

## Features

- **📊 Dashboard Overview** - Analytics charts and key metrics
- **🛍️ Product Management** - Complete product catalog with categories
- **📦 Order Management** - Order tracking and status updates
- **👥 Customer Management** - Customer profiles and information
- **🏷️ Category Management** - Product category organization
- **🎫 Coupon Management** - Discount codes and promotions
- **👨‍💼 Staff Management** - Team member administration
- **🔔 Notifications** - Real-time notification system
- **🌙 Dark/Light Mode** - Theme switching support
- **📱 Responsive Design** - Mobile-first responsive layout
- **📋 Data Tables** - Advanced tables with pagination and filtering
- **📈 Interactive Charts** - Beautiful analytics visualizations

## Technologies Used

- **Frontend Framework:** Next.js 14 with TypeScript
- **Styling:** Tailwind CSS with custom design system
- **UI Components:** Radix UI primitives with shadcn/ui
- **Data Visualization:** Chart.js with react-chartjs-2
- **State Management:** TanStack Query for data fetching
- **Mock Data:** Faker.js for realistic demo data
- **Icons:** Lucide React and React Icons
- **Forms:** React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/ecommerce-admin.git
cd ecommerce-admin
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (dashboard)/       # Dashboard pages
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── shared/           # Shared components
├── data/                 # Mock data and API functions
├── types/                # TypeScript type definitions
├── constants/            # Application constants
├── helpers/              # Utility functions
├── hooks/                # Custom React hooks
└── lib/                  # Library configurations
```

## Mock Data

The application uses Faker.js to generate realistic mock data for:

- **Products** - Names, descriptions, prices, categories, stock levels
- **Orders** - Customer orders with various statuses and payment methods
- **Customers** - User profiles with contact information
- **Categories** - Product categorization
- **Coupons** - Discount codes and promotional offers
- **Staff** - Team member profiles and roles
- **Notifications** - System notifications and alerts

## Key Features

### Dashboard Analytics
- Sales overview with interactive charts
- Order status tracking
- Revenue metrics and KPIs
- Best-selling products visualization

### Data Management
- Advanced data tables with sorting and filtering
- Pagination for large datasets
- Search functionality
- Bulk actions support

### User Experience
- Responsive design for all screen sizes
- Dark and light theme support
- Smooth animations and transitions
- Intuitive navigation and layout

## Customization

### Adding New Pages
1. Create a new page in `src/app/(dashboard)/`
2. Add the route to navigation in `src/constants/navItems.tsx`
3. Create corresponding components and data functions

### Modifying Mock Data
Edit the data generation functions in `src/data/mockData.ts` to customize:
- Data structure
- Field values
- Relationships between entities
- Data volume

### Styling
- Modify `tailwind.config.ts` for design system changes
- Update CSS variables in `src/app/globals.css`
- Customize component styles in respective component files

## Build and Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deploy to Vercel
```bash
npx vercel
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please contact [your-email@example.com](mailto:your-email@example.com).