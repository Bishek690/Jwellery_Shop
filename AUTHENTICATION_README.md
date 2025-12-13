# Authentication System - Jewelry Shop

## Overview
A complete authentication system with beautiful, responsive pages for the jewelry shop application.

## Features

### 🔐 Authentication Pages
- **Login Page** (`/auth/login`) - Secure user login with role-based redirection
- **Signup Page** (`/auth/signup`) - Customer registration with email verification
- **Change Password** (`/auth/change-password`) - Password update with validation

### 🎨 Design Features
- Beautiful gradient backgrounds with jewelry theme colors (amber/gold)
- Responsive design that works on all devices
- Modern UI components using Tailwind CSS
- Loading states and error handling
- Password visibility toggles
- Form validation with helpful error messages

### 🚀 Functionality

#### Login System
- Email and password authentication
- Role-based redirection:
  - **Admin** → `/admin`
  - **Staff** → `/admin/dashboard`
  - **Accountant** → `/analytics`
  - **Customer** → `/shop`
- JWT token management (cookies + Bearer tokens)
- Automatic password change prompt for new accounts

#### Registration System
- Customer signup with name, email, phone, and password
- International phone number support (Nepal and 50+ countries)
- Welcome email sent automatically after registration
- Input validation and confirmation
- Automatic redirect to login after successful registration

#### Password Management
- Secure password change functionality
- Current password verification
- Password strength requirements (minimum 6 characters)
- Mandatory password change for admin-created accounts
- Skip option for optional password changes

### 🔧 Technical Implementation

#### Frontend Structure
```
frontend/
├── app/
│   └── auth/
│       ├── layout.tsx          # Shared auth layout
│       ├── login/
│       │   └── page.tsx        # Login page
│       ├── signup/
│       │   └── page.tsx        # Signup page
│       └── change-password/
│           └── page.tsx        # Password change page
├── components/
│   └── auth-nav.tsx            # Navigation with auth status
├── hooks/
│   └── use-auth.ts             # Authentication hook
└── lib/
    └── api.ts                  # API client with CORS support
```

#### Authentication Hook (`useAuth`)
```typescript
// Key features:
- Automatic authentication status management
- Login/logout functionality
- User profile management
- Role-based redirections
- Password change handling
- Error handling and loading states
```

#### API Integration
- Full CORS support for frontend-backend communication
- HTTP-only cookies for secure session management
- Bearer token support for API clients
- Automatic credential inclusion in requests

### 🌐 Pages and Routes

#### Authentication Routes
- `/auth/login` - User login
- `/auth/signup` - Customer registration
- `/auth/change-password` - Password management

#### Protected Routes (Role-based)
- `/admin` - Admin dashboard
- `/admin/dashboard` - Staff dashboard
- `/analytics` - Accountant dashboard
- `/shop` - Customer shop

### 📱 Responsive Features
- Mobile-first design approach
- Touch-friendly form controls
- Optimized for all screen sizes
- Accessible form labels and inputs

### 🔒 Security Features
- Password visibility toggles
- Secure password requirements
- JWT token management
- HTTP-only cookies
- CORS protection
- Input validation and sanitization

### 📧 Email Integration
- Welcome emails for new customers
- Account creation emails for staff/accountants
- Beautiful HTML email templates
- Error handling for email failures

## Usage

### For Customers
1. Visit `/auth/signup` to create an account
2. Fill in name, email, phone (with country code), and password
3. Receive welcome email confirmation
4. Login at `/auth/login` to access the shop

### For Admin
1. Login at `/auth/login` with admin credentials
2. Create staff/accountant accounts from admin panel
3. New accounts receive email with temporary passwords
4. Users must change password on first login

### For Staff/Accountants
1. Check email for account credentials
2. Login at `/auth/login`
3. Change password when prompted
4. Access role-specific dashboard

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Backend (.env)
```
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
JWT_COOKIE_MAX_AGE=604800000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Your Business Name
```

## Development

### Start Servers
```bash
# Backend
cd backend && npm run dev

# Frontend  
cd frontend && npm run dev
```

### Test Authentication
1. Open `http://localhost:3000/auth/signup`
2. Create a test account
3. Check email for welcome message
4. Login at `http://localhost:3000/auth/login`
5. Verify role-based redirection

## Features Summary
✅ Complete authentication system
✅ Beautiful, responsive UI
✅ Role-based access control  
✅ Email notifications
✅ International phone support
✅ Secure password management
✅ CORS-enabled API integration
✅ Mobile-friendly design
✅ Error handling and validation
✅ Loading states and feedback

The authentication system is now ready for production use with a professional, jewelry-themed design!
