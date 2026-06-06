# LeadFlow AI Deployment Guide

## 1. Prerequisites
- Node.js 18+
- Supabase project
- Stripe account
- Twilio account
- OpenAI API Key

## 2. Environment Setup
1. Copy `.env.example` to `.env`.
2. Fill in all the keys.

## 3. Database Setup
1. In your Supabase Dashboard, open the SQL Editor.
2. Run the contents of `database_schema.sql`.
3. (Optional) Run `seed_demo_data.sql` for initial data.

## 4. Launch
```bash
npm install
npm run build
npm start
```

## 5. Production
Connect your GitHub repo to Vercel. Add all environment variables from your `.env` file to the Vercel project settings.
