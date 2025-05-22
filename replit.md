# replit.md

## Overview

InvestIQ is a comprehensive portfolio management platform specifically designed for Indian investors. It's a full-stack web application built with a modern tech stack that allows users to track investments, analyze portfolio performance, view market data, and read financial news. The application supports multiple investment types including stocks, SIPs (Systematic Investment Plans), and cryptocurrencies.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API endpoints
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database)
- **Development Server**: TSX for TypeScript execution in development

### Project Structure
- `client/` - Frontend React application
- `server/` - Backend Express.js API
- `shared/` - Shared TypeScript schemas and types
- `migrations/` - Database migration files

## Key Components

### Database Schema
The application uses four main tables:
- **users**: User authentication and management
- **portfolio_items**: Individual investment holdings with purchase details
- **market_data**: Real-time market data for stocks and indices
- **news_articles**: Financial news articles categorized by region

### API Endpoints
- **Market Data**: `/api/market-data` - Fetches current market prices and indices
- **Portfolio**: `/api/portfolio` - CRUD operations for portfolio management
- **News**: `/api/news` - Financial news with category filtering
- **Analysis**: `/api/portfolio/analysis` - Portfolio performance analytics

### Frontend Pages
- **Home**: Dashboard with market overview and quick actions
- **Analyze**: Portfolio input method selection (manual vs CSV upload)
- **Add Data**: Manual portfolio entry with form validation
- **Upload CSV**: Bulk portfolio import with data validation
- **Portfolio Report**: Comprehensive analytics and optimization suggestions
- **News**: Categorized financial news feed

### Storage Layer
The application implements a storage abstraction layer with both in-memory (development) and database (production) implementations, allowing for easy testing and deployment flexibility.

## Data Flow

1. **Portfolio Input**: Users can add investments manually or via CSV upload
2. **Data Validation**: All inputs are validated using Zod schemas before storage
3. **Market Data Integration**: Real-time price fetching for performance calculations
4. **Analytics Generation**: Portfolio analysis including P&L, asset allocation, and risk metrics
5. **Reporting**: Visual charts and optimization recommendations

## External Dependencies

### UI Components
- Radix UI primitives for accessible, unstyled components
- Chart.js for data visualization
- Lucide React for consistent iconography

### Data Processing
- Date-fns for date manipulation
- Zod for runtime type validation and schema definition
- React Hook Form with resolvers for form management

### Development Tools
- ESBuild for production bundling
- PostCSS with Autoprefixer for CSS processing
- TypeScript for static type checking

## Deployment Strategy

### Development
- Uses Vite dev server with HMR for fast development
- TSX for running TypeScript files directly
- In-memory storage for rapid prototyping

### Production
- Vite builds optimized frontend bundle to `dist/public`
- ESBuild bundles server code to `dist/index.js`
- PostgreSQL database with connection pooling
- Autoscale deployment target on Replit

### Environment Configuration
- Database URL configuration for PostgreSQL
- Separate development and production modes
- Port configuration for Replit deployment (port 5000 → 80)

The application follows a modern full-stack architecture with clear separation of concerns, type safety throughout, and scalable deployment patterns suitable for both development and production environments.