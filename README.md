# LeadFlow AI

Autonomous AI Receptionist for Local Businesses.

## Database Schema

The database is built on Supabase (PostgreSQL).

### Tables:

- **businesses**: Profiles for client businesses.
- **leads**: Captured lead information from chat interactions.
- **appointments**: Scheduled bookings.
- **subscriptions**: Stripe subscription status.
- **admin_settings**: Configuration settings.

The schema is located in `supabase/migrations/20240606000000_initial_schema.sql`.

## Getting Started

1. Clone the repo
2. Install dependencies: `npm install`
3. Set up environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Run migrations on your Supabase project.
5. Start development: `npm run dev`
