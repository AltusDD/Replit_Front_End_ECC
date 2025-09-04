# replit.md

## Overview

This is a full-stack real estate management application built with React, Express, and PostgreSQL. The application provides a comprehensive platform for managing properties, clients, activities, and generating analytics reports. It features a modern web interface with server-side rendering capabilities and a RESTful API backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI components with shadcn/ui design system for consistent, accessible interface
- **Styling**: Tailwind CSS with CSS custom properties for theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript for type safety across the entire stack
- **Database ORM**: Drizzle ORM for type-safe database operations and schema management
- **Data Storage**: PostgreSQL database with Drizzle Kit for migrations
- **Authentication**: Session-based authentication with connect-pg-simple for PostgreSQL session storage
- **File Uploads**: Google Cloud Storage integration with object ACL policies for secure file management

### Database Design
- **Users Table**: Stores agent/user information with role-based access
- **Properties Table**: Core property listings with comprehensive details (price, location, features, status)
- **Clients Table**: Client management with preferences and contact information
- **Activities Table**: Activity logging for tracking system events and user actions
- **Schema Management**: Drizzle ORM with PostgreSQL-specific features and UUID primary keys

### API Structure
- **RESTful Design**: Standard HTTP methods (GET, POST, PUT, DELETE) for resource management
- **Route Organization**: Modular route handlers for different entities (properties, clients, activities)
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes
- **Request Validation**: Schema validation using Zod for type-safe API contracts
- **Response Format**: Consistent JSON responses with proper error messaging

### Development Environment
- **Monorepo Structure**: Shared schema definitions between client and server
- **Hot Reload**: Vite development server with HMR for rapid development
- **Type Safety**: Full TypeScript coverage with strict compiler settings
- **Code Organization**: Clear separation between client, server, and shared code

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database hosting with connection pooling
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect support

### UI and Component Libraries
- **Radix UI**: Unstyled, accessible UI primitives for building design systems
- **shadcn/ui**: Pre-built component library built on Radix UI with Tailwind CSS
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Lucide React**: Icon library providing consistent iconography

### Development and Build Tools
- **Vite**: Fast build tool with React plugin for development and production builds
- **TypeScript**: Static type checking for JavaScript with strict configuration
- **ESBuild**: Fast JavaScript bundler for server-side code compilation
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer plugins

### File and Asset Management
- **Google Cloud Storage**: Object storage service for file uploads and management
- **Uppy**: File uploader with dashboard UI and cloud storage integration
- **Object ACL System**: Custom access control for file permissions and sharing

### Data Visualization
- **Recharts**: React charting library for analytics dashboards and data visualization
- **Chart Components**: Bar charts, pie charts, and line charts for business metrics

### Form and Validation
- **React Hook Form**: Performant forms library with minimal re-renders
- **Zod**: TypeScript-first schema validation for forms and API contracts
- **Hookform Resolvers**: Integration between React Hook Form and Zod validation

### Hosting and Infrastructure
- **Replit**: Development environment and hosting platform with integrated tooling
- **Environment Variables**: Configuration management for database URLs and API keys
- **Session Management**: PostgreSQL-backed session storage for user authentication

## Recent Changes

### Genesis Portfolio Management System Implementation (September 4, 2025)
- **DataTable Overhaul**: Completely rebuilt DataTable component with Genesis-grade features
  - Implemented comprehensive filtering (text, enum, number range) with sticky filter row
  - Added multi-column sorting with shift-click support and visual indicators
  - Built responsive pagination with configurable page sizes
  - Created asset drawer for detailed row inspection with structured data display
  - Added row actions menu with export, copy link, and view details functionality
- **Portfolio Pages**: Updated all 5 portfolio entity pages (properties, units, leases, tenants, owners)
  - Migrated from legacy table API to new Genesis DataTable specification
  - Added comprehensive KPI displays with real-time calculations
  - Implemented client-side data enrichment with cross-referencing between entities
  - Applied Genesis dark theme styling with professional polish
- **Column Configuration**: Built typed column mappers and configurations
  - Created mappers for all 5 portfolio entity types with data normalization
  - Implemented status badges and conditional formatting for occupancy, balance, active status
  - Added proper type definitions matching Genesis Column interface
- **Data Layer**: Enhanced useCollection hook with robust error handling
  - Added AbortController support for request cancellation during HMR
  - Implemented automatic data normalization for array and object response shapes
  - Fixed export/import issues causing Hot Module Reload failures
- **Visual Polish**: Applied Genesis design specification
  - Professional dark theme with gold accent colors
  - Sticky headers and filter rows for large datasets
  - Zebra striping, hover effects, and selection highlighting
  - Loading skeletons and error states with retry functionality

## Portfolio Management Features

### Core Functionality
- **Properties Management**: Track property details, occupancy rates, unit counts, and status
- **Units Management**: Monitor unit specifications, market rent, and occupancy status
- **Lease Management**: Oversee lease agreements, rental amounts, and lease lifecycles
- **Tenant Management**: Manage tenant information, contact details, and account balances
- **Owner Management**: Maintain owner records and property ownership relationships

### DataTable Capabilities
- **Advanced Filtering**: Text search, dropdown selections, and number range filters
- **Flexible Sorting**: Single and multi-column sorting with visual indicators
- **Data Export**: CSV export functionality for all portfolio data
- **Asset Details**: Comprehensive drawer view for detailed record inspection
- **KPI Analytics**: Real-time key performance indicators with cross-entity calculations