# SEVLANI AGRO — E-Commerce Platform

A modern, premium agricultural e-commerce platform built for Sevlani Agro to sell pipes, fittings, and agricultural hardware solutions.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS & Framer Motion
- **UI Components**: ShadCN UI (Customized for brand)
- **State Management**: Zustand
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Credentials & Session)
- **Payments**: Razorpay (Optional/Configurable)
- **Media**: Cloudinary (Optional/Configurable)
- **Validation**: Zod

## Screenshots

*(Placeholders for future screenshots)*
- `docs/home.png`
- `docs/product.png`
- `docs/admin.png`

## Prerequisites

- Node.js 20+
- PostgreSQL
- npm or pnpm

## Installation Steps

1. **Clone repo**
   ```bash
   git clone <repository-url>
   cd sevlani-agro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   *Make sure to configure your `DATABASE_URL` appropriately.*

4. **Run Database Migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Seed Database**
   ```bash
   npm run db:seed
   ```

6. **Start Dev Server**
   ```bash
   npm run dev
   ```

7. **Open App**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Setup

1. Go to `/admin/login`
2. **Default Credentials**:
   - Email: `admin@sevlaniagro.com`
   - Password: `Admin@123`
3. **Important**: Change your password immediately from the admin dashboard after logging in!

## Environment Variables

- `DATABASE_URL`: Connection string to your PostgreSQL database.
- `NEXTAUTH_SECRET`: Secret used to encrypt NextAuth.js session tokens. (Generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Canonical URL of your site (e.g., `http://localhost:3000`)
- `NEXT_PUBLIC_APP_URL`: Public facing URL of the application.

## Third-Party Integrations (Optional)

### Cloudinary Setup (For Image Uploads)
1. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in `.env`.
2. Enable Cloudinary in the Admin Dashboard Settings (`cloudinary_enabled: true`).

### Razorpay Setup (For Payments)
1. Set `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env`.
2. Enable Razorpay in the Admin Dashboard Settings (`razorpay_enabled: true`).

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm start`: Starts the production server.
- `npm run lint`: Runs ESLint.
- `npm run db:seed`: Seeds the database with initial demo content.

## Deployment Guide

### Vercel + Railway + Supabase
1. **Database (Supabase / Railway)**: Create a new PostgreSQL database and obtain the connection string.
2. **Web App (Vercel)**: Connect your repository to Vercel.
3. Add the required Environment Variables in the Vercel project settings.
4. Add the build command: `npx prisma generate && npx prisma migrate deploy && next build`.
5. Deploy!

## License

MIT
