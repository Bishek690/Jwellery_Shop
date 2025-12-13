# Jewelry Store - Backend & Frontend Integration Guide

## 🔗 Backend & Frontend Integration

This guide explains how to integrate the Node.js/TypeScript backend with the Next.js frontend.

## 📋 Prerequisites

1. **Backend Dependencies**: CORS, Express, TypeORM, JWT, Nodemailer
2. **Frontend Dependencies**: Next.js, React
3. **Database**: MySQL running on port 3306
4. **Node.js**: Version 16 or higher

## ⚙️ Backend Configuration

### 1. Environment Setup
Create `.env` file in the backend directory:

```bash
# Copy from .env.example and fill in your values
cp .env.example .env
```

Required environment variables:
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=jewelry_db

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Jewelry Store <your-email@gmail.com>

# Server
PORT=4000
HOST=localhost
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 2. Database Setup
```sql
CREATE DATABASE jewelry_db;
```

### 3. Start Backend Server
```bash
cd backend
npm install
npm run dev
```

Backend will run on: `http://localhost:4000`

## 🌐 Frontend Configuration

### 1. Environment Setup
Create `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. API Client Setup
The API client is already configured in `lib/api.ts` with:
- Automatic cookie handling for authentication
- CORS support
- Error handling
- TypeScript types

### 3. Start Frontend Server
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: `http://localhost:3000`

## 🔌 API Endpoints

### Authentication Endpoints
```
POST /api/users/login          - User login
POST /api/users/logout         - User logout  
POST /api/users                - Customer registration
GET  /api/users/me            - Get current user profile
POST /api/users/change-password - Change password
```

### User Management (Admin only)
```
GET    /api/users              - Get all users
GET    /api/users/:id          - Get user by ID
POST   /api/users/create-by-admin - Create staff/accountant
PATCH  /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user
```

### System Endpoints
```
GET /                          - API health check
GET /api/health               - Detailed health status
```

## 💡 Usage Examples

### Frontend API Usage

#### 1. User Registration
```typescript
import { userAPI } from '@/lib/api';

const handleRegister = async (formData) => {
  try {
    const result = await userAPI.register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone, // Include country code: +977XXXXXXXXX
      password: formData.password
    });
    console.log('Registration successful:', result);
    // Redirect to login or dashboard
  } catch (error) {
    console.error('Registration failed:', error.message);
    // Show error message to user
  }
};
```

#### 2. User Login
```typescript
import { userAPI } from '@/lib/api';

const handleLogin = async (email, password) => {
  try {
    const result = await userAPI.login({ email, password });
    console.log('Login successful:', result);
    
    // Check if password change is required
    if (result.mustChangePassword) {
      // Redirect to change password page
    } else {
      // Redirect to dashboard
    }
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};
```

#### 3. Get User Profile
```typescript
import { userAPI } from '@/lib/api';

const getUserProfile = async () => {
  try {
    const user = await userAPI.getProfile();
    return user;
  } catch (error) {
    console.error('Failed to get profile:', error.message);
    // Redirect to login if unauthorized
  }
};
```

## 🔒 Authentication Flow

1. **Login**: User submits credentials → Backend validates → JWT stored in HTTP-only cookie
2. **Authenticated Requests**: Frontend makes requests → Browser automatically includes cookie → Backend validates JWT
3. **Logout**: Frontend calls logout → Backend clears cookie

## 📧 Email Integration

### Customer Registration
- Automatic welcome email sent after successful registration
- Beautiful HTML template with jewelry store branding

### Admin User Creation  
- Account creation email with temporary credentials
- Security warnings and password change requirements

### Email Requirements
- Gmail SMTP configuration
- App-specific password (not regular Gmail password)
- Environment variables properly configured

## 🌍 Phone Number Validation

Supports international phone numbers including:
- 🇳🇵 Nepal: `+977 98XXXXXXXX`
- 🇺🇸 USA: `+1 555 123 4567`
- 🇬🇧 UK: `+44 20 1234 5678`
- 🇮🇳 India: `+91 98765 43210`
- And 50+ other countries

## 🚀 Running Both Services

### Development Mode
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Production Build
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

## 🛠️ Troubleshooting

### CORS Issues
- Ensure `FRONTEND_URL` is set correctly in backend `.env`
- Check that frontend is running on the expected port

### Authentication Issues
- Verify JWT secret is set in backend
- Check that cookies are being sent (credentials: 'include')

### Database Issues
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify database exists

### Email Issues
- Use Gmail app-specific password
- Check firewall/network restrictions
- Verify environment variables

## 📁 Project Structure
```
jewelry-shop/
├── backend/
│   ├── src/
│   │   ├── controller/
│   │   ├── entity/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── validators/
│   ├── .env
│   └── package.json
└── frontend/
    ├── app/
    ├── components/
    ├── lib/
    │   └── api.ts
    ├── .env.local
    └── package.json
```

## 🎯 Next Steps

1. Implement frontend authentication UI
2. Create user dashboard components
3. Add product management features
4. Implement order system
5. Add payment integration

Your backend and frontend are now fully integrated and ready for development! 🚀
