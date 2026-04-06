# Smart Supply Chain Management System

A modern, professional, dark-themed UI for managing supply chain operations with multiple user roles and order-based tracking.

## Features

### 🎨 Design Style
- Dark navy blue & black gradient theme
- Premium SaaS aesthetic (inspired by Stripe/Linear)
- Glassmorphism cards with soft shadows
- Smooth animations and transitions
- Fully responsive (desktop-first)

### 👥 User Roles

The system supports 6 different user roles, each with a customized dashboard:

1. **Warehouse Holder**
   - Inventory management
   - Stock level tracking
   - Demand insights with charts
   - Low stock alerts
   - Restock suggestions
   - Contact suppliers/receivers

2. **Supplier**
   - Shipment status tracking
   - Delivery timeline view
   - Delay tracking and analysis
   - On-time delivery metrics
   - Active shipment monitoring

3. **Receiver**
   - Incoming shipments overview
   - Delivery schedule
   - Priority item tracking
   - Receiving capacity monitoring
   - Supplier coordination

4. **Driver**
   - Live navigation map
   - AI-optimized route suggestions
   - Traffic conditions
   - Weather information
   - Distance and time tracking
   - Multiple route options

5. **Delivery Boy**
   - Customer location map
   - Delivery status management (Picked → Out for Delivery → Delivered)
   - Performance metrics
   - Daily target tracking
   - Customer rating display

6. **Customer**
   - Order tracking timeline
   - Progress visualization
   - Estimated delivery time
   - Order details
   - Delivery information
   - Support contact

## 🚀 User Flow

1. **Landing Page**: Select your role from 6 interactive cards
2. **Login**: Enter credentials for the selected role
3. **Order Entry**: Enter an Order ID to access the dashboard
4. **Dashboard**: View role-specific information and controls

## 🎯 Quick Start (Demo)

Use these demo Order IDs for testing:
- `ORD-2026-001`
- `ORD-2026-002`
- `ORD-2026-003`

## 🛠️ Technology Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Motion (Framer Motion)** for animations
- **Recharts** for data visualization
- **Lucide React** for icons
- **Tailwind CSS v4** for styling
- **Radix UI** for accessible components

## 📁 Project Structure

```
src/app/
├── App.tsx                 # Main app component
├── routes.ts               # Route configuration
├── components/
│   ├── DashboardLayout.tsx # Shared dashboard layout
│   ├── StatsCard.tsx       # Reusable stats card
│   └── ui/                 # UI component library
├── pages/
│   ├── Landing.tsx         # Role selection page
│   ├── Login.tsx           # Login page
│   ├── OrderEntry.tsx      # Order ID entry
│   ├── NotFound.tsx        # 404 page
│   └── dashboards/         # Role-specific dashboards
│       ├── WarehouseHolderDashboard.tsx
│       ├── SupplierDashboard.tsx
│       ├── ReceiverDashboard.tsx
│       ├── DriverDashboard.tsx
│       ├── DeliveryBoyDashboard.tsx
│       └── CustomerDashboard.tsx
└── styles/
    ├── index.css           # Custom styles
    ├── theme.css           # Theme variables
    └── tailwind.css        # Tailwind imports
```

## 🎨 Key UI Features

- **Glassmorphism Effects**: Frosted glass appearance with backdrop blur
- **Gradient Accents**: Dynamic color gradients for each role
- **Hover Animations**: Scale, glow, and lift effects
- **Progress Bars**: Animated progress tracking
- **Timeline Views**: Step-by-step order tracking
- **Interactive Maps**: Visual route and location display
- **Real-time Updates**: Live status indicators
- **Responsive Tables**: Adaptive data displays
- **Custom Scrollbars**: Themed scroll styling

## 📊 Dashboard Highlights

### Warehouse Holder
- Product inventory table with stock status
- Demand insights line chart
- Low stock alerts
- Direct supplier/receiver communication

### Supplier
- Multi-status shipment cards (Dispatched, In Transit, Delivered)
- Timeline with completed/active/pending states
- Delay analysis with metrics

### Receiver
- Priority-based shipment sorting
- Today's schedule view
- Capacity utilization tracker
- ETA displays

### Driver
- Interactive map with route visualization
- Real-time traffic and weather conditions
- 3 AI-optimized route comparisons
- Next stop information

### Delivery Boy
- Status workflow buttons
- Customer location tracking
- Performance metrics (on-time %, rating)
- Daily target progress

### Customer
- 5-stage tracking timeline with icons
- Animated progress bar
- Order item details with pricing
- Delivery address and instructions

## 🎭 Color Scheme

- **Background**: Navy blue to black gradient
- **Cards**: White/5% opacity with backdrop blur
- **Borders**: White/10% opacity
- **Text**: White with varying opacities
- **Accents**: Blue, cyan, emerald, violet, amber gradients per role

## 🔧 Customization

The system uses CSS variables for easy theming. Modify `/src/styles/theme.css` to adjust:
- Color schemes
- Border radius
- Spacing
- Font weights

## 📱 Responsive Design

- **Desktop**: Full sidebar with expanded content
- **Tablet**: Collapsible sidebar
- **Mobile**: Hidden sidebar with menu button

## ⚡ Performance Features

- Lazy loading with React Router
- Optimized animations with Motion
- Efficient state management
- Minimal re-renders

## 🔐 Session Management

User role and order ID are stored in `sessionStorage` for persistence during the session.

---

Built with ❤️ using modern web technologies
