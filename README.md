# Fortified - Advanced Personal Finance Management Platform

![Fortified Banner](./public/banner.jpeg)

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat&logo=react)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=flat&logo=postgresql)](https://postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.8.2-2D3748?style=flat&logo=prisma)](https://prisma.io/)
[![TypeScript](https://img.shields.io/badge/AI_Powered-Gemini_1.5-orange?style=flat&logo=google)](https://ai.google.dev/)
[![Deployed](https://img.shields.io/badge/Deployed-Vercel-black?style=flat&logo=vercel)](https://fortified-six.vercel.app/)

> **Fortified** is a cutting-edge personal finance management platform designed specifically for the Indian market, featuring AI-powered insights, automated transaction processing, and comprehensive financial analytics. Built with modern web technologies and enterprise-grade architecture.

## 🌟 Live Application

**🚀 [Experience Fortified Live](https://fortified-six.vercel.app/)**

## 📋 Table of Contents

- [Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-system-architecture)
- [Installation](#-installation--setup)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [AI Integration](#-ai-powered-features)
- [Security](#-security-features)
- [Performance](#-performance-optimization)
- [Contributing](#-contributing)
- [Deployment](#-deployment)
- [License](#-license)

## 🎯 Key Features

### 💰 **Comprehensive Financial Management**
- **Multi-Account Support**: Manage Current and Savings accounts with real-time balance tracking
- **Transaction Management**: Create, categorize, and track income/expense transactions
- **Recurring Transactions**: Automated processing of daily, weekly, monthly, and yearly recurring payments
- **Budget Planning**: Intelligent budget creation with automated alerts and threshold monitoring

### 🤖 **AI-Powered Intelligence**
- **Smart Receipt Scanner**: Extract transaction data from receipts using Google Gemini AI
- **Financial Insights**: Monthly AI-generated recommendations tailored for Indian financial ecosystem
- **Automated Categorization**: Intelligent transaction categorization with 15+ predefined categories
- **Spending Pattern Analysis**: AI-driven analysis of spending habits and optimization suggestions

### 📊 **Advanced Analytics & Visualization**
- **Interactive Dashboards**: Real-time financial overview with customizable date ranges
- **Dynamic Charts**: Responsive bar charts and pie charts for expense breakdown
- **Monthly Reports**: Comprehensive financial summaries with AI insights
- **Category-wise Analysis**: Detailed spending analysis across multiple categories

### 🔄 **Automation & Notifications**
- **Background Job Processing**: Automated recurring transaction processing using Inngest
- **Email Notifications**: Monthly reports and budget alerts via React Email templates
- **Real-time Updates**: Live transaction updates and balance synchronization
- **Intelligent Alerts**: Proactive budget threshold notifications with customizable settings

### 🇮🇳 **India-Specific Features**
- **Indian Rupee (₹) Support**: Native INR formatting and calculations
- **Localized Categories**: Categories tailored for Indian spending patterns
- **Regional Insights**: AI recommendations considering Indian investment landscape (SIP, PPF, ELSS)
- **Festival Planning**: Seasonal expense tracking and planning features

### 🎨 **Modern User Experience**
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode Support**: System-aware theme switching with next-themes
- **Intuitive Interface**: Clean, modern UI built with Radix UI and Tailwind CSS
- **Progressive Web App**: Fast loading with optimized performance metrics

## 🛠 Technology Stack

### **Frontend Architecture**
```
Next.js 15.3.2 (App Router) + React 19.1.0
├── UI Framework: Radix UI Components
├── Styling: Tailwind CSS + CVA (Class Variance Authority)
├── State Management: React Hooks + Context API
├── Form Handling: React Hook Form + Zod Validation
├── Charts: Recharts for data visualization
├── Theming: next-themes for dark mode
└── Icons: Lucide React
```

### **Backend Infrastructure**
```
Next.js API Routes + Server Actions
├── Database: PostgreSQL (Supabase)
├── ORM: Prisma 6.8.2
├── Authentication: Clerk
├── Background Jobs: Inngest
├── Email Service: Resend + React Email
├── AI Integration: Google Gemini 1.5 Flash
└── File Processing: Native browser APIs
```

### **Development Tools**
```
ESLint + Prettier (Code quality)
├── Database Migrations: Prisma Migrate
├── TypeScript Support: JSDoc + Zod schemas
├── Build System: Turbopack (Development)
└── Deployment: Vercel Platform
```

## 🏗 System Architecture

```mermaid
graph TB
    A[Client Browser] --> B[Next.js App Router]
    B --> C[Server Actions]
    B --> D[API Routes]
    
    C --> E[Prisma ORM]
    D --> E
    E --> F[PostgreSQL Database]
    
    G[Clerk Auth] --> B
    H[Inngest Jobs] --> C
    I[Google Gemini AI] --> C
    J[Resend Email] --> H
    
    K[Vercel Edge] --> B
    L[Supabase] --> F
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18.0 or higher
- PostgreSQL database
- Supabase account (or local PostgreSQL)
- Clerk account for authentication
- Google Cloud API key for Gemini AI
- Resend account for email services

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/fortified.git
cd fortified
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database"
DIRECT_URL="postgresql://username:password@host:port/database"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# Google Gemini AI
GEMINI_API_KEY="your_gemini_api_key"

# Email Service (Resend)
RESEND_API_KEY="re_..."

# Inngest
INNGEST_EVENT_KEY="your_inngest_event_key"
INNGEST_SIGNING_KEY="your_inngest_signing_key"

# Application URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Optional: Seed database with sample data
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 📖 Usage Guide

### Getting Started

1. **Account Creation**: Sign up using Clerk authentication
2. **Account Setup**: Create your first financial account (Current/Savings)
3. **Transaction Entry**: Add income and expense transactions
4. **Budget Configuration**: Set up monthly budgets with custom thresholds
5. **AI Features**: Upload receipts for automatic data extraction

### Core Workflows

#### **Transaction Management**
```javascript
// Manual transaction creation
const transaction = {
  type: "EXPENSE", // or "INCOME"
  amount: 1500.00,
  description: "Grocery shopping",
  category: "groceries",
  date: new Date(),
  accountId: "account_id"
};
```

#### **Receipt Scanning**
```javascript
// AI-powered receipt processing
const scannedData = await scanReceipt(file);
// Returns: { amount, date, description, merchantName, category }
```

#### **Budget Monitoring**
```javascript
// Automated budget alerts at 80% threshold
// Email notifications with spending breakdown
// AI-generated optimization suggestions
```

### Advanced Features

#### **Recurring Transactions**
- Set up automated recurring payments
- Support for multiple intervals (daily, weekly, monthly, yearly)
- Background processing with Inngest jobs

#### **Financial Analytics**
- Monthly spending breakdown by category
- Income vs expense trends
- Net balance calculations with visual indicators
- Customizable date range analysis

## 🔌 API Documentation

### Server Actions

#### Transaction Management
```typescript
// Create transaction
async function createTransaction(data: TransactionData)

// Update transaction
async function updateTransaction(id: string, data: Partial<TransactionData>)

// Delete transaction
async function deleteTransaction(id: string)

// Get transactions with filters
async function getTransactions(filters: TransactionFilters)
```

#### Account Operations
```typescript
// Create account
async function createAccount(data: AccountData)

// Get user accounts
async function getUserAccounts()

// Update account
async function updateAccount(id: string, data: Partial<AccountData>)
```

#### Budget Management
```typescript
// Create/update budget
async function createOrUpdateBudget(data: BudgetData)

// Get current budget
async function getCurrentBudget(accountId: string)
```

#### AI Features
```typescript
// Scan receipt with AI
async function scanReceipt(file: File): Promise<ScannedData>

// Generate financial insights
async function generateFinancialInsights(stats: MonthlyStats, month: string)
```

### REST Endpoints

#### Webhook Integration
```
POST /api/inngest - Inngest webhook endpoint
POST /api/seed - Database seeding endpoint (development)
```

## 🗄 Database Schema

### Core Models

#### User Model
```prisma
model User {
  id            String    @id @default(uuid())
  clerkUserId   String    @unique
  email         String    @unique
  name          String?
  imageUrl      String?
  transactions  Transaction[]
  accounts      Account[]
  budgets       Budget[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

#### Account Model
```prisma
model Account {
  id           String        @id @default(uuid())
  name         String
  type         AccountType   // CURRENT, SAVINGS
  balance      Decimal       @default(0)
  isDefault    Boolean       @default(false)
  userId       String
  user         User          @relation(fields: [userId], references: [id])
  transactions Transaction[]
}
```

#### Transaction Model
```prisma
model Transaction {
  id                String            @id @default(uuid())
  type             TransactionType   // INCOME, EXPENSE
  amount           Decimal
  description      String?
  date             DateTime
  category         String
  receiptUrl       String?
  isRecurring      Boolean           @default(false)
  recurringInterval RecurringInterval?
  status           TransactionStatus @default(COMPLETED)
  userId           String
  accountId        String
}
```

#### Budget Model
```prisma
model Budget {
  id            String    @id @default(uuid())
  amount        Decimal
  lastAlertSent DateTime?
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id])
}
```

## 🤖 AI-Powered Features

### Receipt Scanning Technology

**Google Gemini 1.5 Flash Integration**
- Advanced OCR capabilities for receipt text extraction
- Intelligent data parsing for amount, date, merchant, and category
- Support for multiple receipt formats and languages
- Error handling and validation for extracted data

```javascript
// Receipt scanning prompt engineering
const prompt = `
  Analyze this receipt image and extract:
  - Total amount (number only)
  - Date (ISO format)
  - Description/items (brief summary)
  - Merchant/store name
  - Suggested category (from predefined list)
`;
```

### Financial Insights Engine

**Monthly Report Generation**
- Comprehensive spending analysis with category breakdown
- Savings rate calculation and benchmarking
- Indian market-specific investment recommendations
- Cultural and seasonal spending pattern recognition

**AI Insight Categories**
- Budget optimization suggestions
- Investment recommendations (SIP, PPF, ELSS, NSC)
- Tax-saving opportunities under Section 80C
- Emergency fund planning
- Inflation impact analysis

## 🔐 Security Features

### Authentication & Authorization
- **Clerk Integration**: Enterprise-grade authentication with multi-factor support
- **Session Management**: Secure token handling with automatic refresh
- **Route Protection**: Server-side authentication checks for all protected routes

### Data Security
- **Database Security**: Parameterized queries with Prisma ORM preventing SQL injection
- **Input Validation**: Comprehensive validation using Zod schemas
- **API Security**: Rate limiting and request validation on all endpoints
- **File Upload Security**: Secure file handling with size and type restrictions

### Privacy Protection
- **Data Encryption**: All sensitive data encrypted at rest and in transit
- **User Isolation**: Complete data separation between users with database-level constraints
- **Audit Trails**: Transaction history with immutable timestamps

## ⚡ Performance Optimization

### Frontend Performance
- **Next.js App Router**: Optimized routing with automatic code splitting
- **Server Components**: Reduced client-side JavaScript bundle
- **Image Optimization**: Automatic image optimization with Next.js Image component
- **Lazy Loading**: Component-level lazy loading for improved initial load times

### Backend Optimization
- **Database Indexing**: Strategic database indexes for query optimization
- **Connection Pooling**: Efficient database connection management
- **Caching Strategy**: Server-side caching for frequently accessed data
- **Background Processing**: Asynchronous job processing with Inngest

### Monitoring & Analytics
- **Performance Metrics**: Core Web Vitals monitoring
- **Error Tracking**: Comprehensive error logging and monitoring
- **Database Performance**: Query optimization and monitoring

## 🤝 Contributing

We welcome contributions to Fortified! Please follow these guidelines:

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow ESLint configuration for code style
- Write comprehensive tests for new features
- Update documentation for API changes
- Ensure database migrations are included for schema changes

### Testing Guidelines
```bash
# Run development server with hot reload
npm run dev

# Lint code
npm run lint

# Build for production
npm run build
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Configure all required environment variables
3. **Database Setup**: Ensure PostgreSQL database is accessible
4. **Deploy**: Automatic deployment on push to main branch

```bash
# Production build
npm run build

# Start production server
npm start
```

### Environment Configuration
Ensure all production environment variables are properly configured:
- Database URLs with connection pooling
- Clerk authentication keys for production
- Google Gemini API key with appropriate quotas
- Resend API key for email services
- Inngest keys for background job processing

### Database Migration
```bash
# Production database migration
npx prisma migrate deploy

# Generate Prisma client for production
npx prisma generate
```


### Additional Resources
- [API Reference](./docs/api-reference.md)
- [Database Schema Guide](./docs/database-schema.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for the Indian fintech ecosystem**

[🚀 **Try Fortified Today**](https://fortified-six.vercel.app/) | [📖 **Documentation**](https://docs.fortified.app) | [💬 **Community**](https://github.com/yourusername/fortified/discussions)

</div>
