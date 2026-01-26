# Metal Price Management System

## Overview
A complete system for managing and displaying daily gold, silver, and diamond prices across the jewelry shop application.

## Features Implemented

### Backend (TypeScript/Express/TypeORM)

1. **Entity**: `MetalPrice.ts`
   - Stores gold price per gram
   - Stores silver price per gram  
   - Stores diamond price per carat
   - Tracks active/inactive prices
   - Maintains price history with timestamps

2. **Controller**: `metalPriceController.ts`
   - `getCurrentPrices()` - Get current active prices (public)
   - `updatePrices()` - Update prices (admin/staff only)
   - `getPriceHistory()` - View price history (admin/staff only)

3. **Routes**: `metalPriceRoutes.ts`
   - `GET /api/metal-prices/current` - Public endpoint
   - `POST /api/metal-prices/update` - Protected (admin/staff)
   - `GET /api/metal-prices/history` - Protected (admin/staff)

### Frontend (Next.js/React/TypeScript)

1. **Admin Page**: `/admin/metal-prices`
   - Form to update gold, silver, and diamond prices
   - Display current active prices
   - View price history with dates
   - Real-time validation
   - Success/error notifications
   - Only accessible by admin and staff

2. **Metal Price Display Component**: `metal-price-display.tsx`
   - Compact card showing current prices
   - Live badge indicator
   - Icon representations for each metal
   - Formatted pricing in NPR
   - Auto-hides if no prices set

3. **Integration Points**:
   - Home page (/) - Shows prices above featured collections
   - Shop page (/shop) - Shows prices at top of product listings
   - Admin sidebar - New "Metal Prices" menu item

## How It Works

### For Admin/Staff:
1. Navigate to "Metal Prices" in the admin sidebar
2. See current prices displayed in cards
3. Update prices using the form
4. Click "Update Prices" to save
5. View history to see past price changes

### For Customers:
1. Visit home page or shop page
2. See current metal prices displayed prominently
3. Prices update automatically when admin changes them
4. Helps customers understand jewelry pricing

## API Endpoints

```
GET  /api/metal-prices/current        - Get current prices (public)
POST /api/metal-prices/update         - Update prices (admin/staff only)
GET  /api/metal-prices/history        - Get price history (admin/staff only)
```

## Database Schema

```sql
CREATE TABLE metal_price (
  id INT PRIMARY KEY AUTO_INCREMENT,
  goldPricePerGram DECIMAL(10,2),
  silverPricePerGram DECIMAL(10,2),
  diamondPricePerCarat DECIMAL(10,2),
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

## Security

- Price updates protected by authentication middleware
- Only admin and staff can update prices
- Price viewing is public for transparency
- Input validation on both frontend and backend
- Prevents negative prices

## UI/UX Features

- Real-time form validation
- Loading states during updates
- Success/error toast notifications
- Responsive design for all screen sizes
- Price history with visual indicators
- Animated transitions
- Color-coded metal types (Gold: Yellow, Silver: Gray, Diamond: Blue)

## Future Enhancements

- Email notifications when prices change
- Price alerts for customers
- Scheduled price updates
- Price comparison charts
- Export price history to CSV
- Mobile app integration
