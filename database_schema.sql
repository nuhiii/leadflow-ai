-- Enable relevant extensions
create extension if not exists "uuid-ossp";

-- 1. Businesses Table
create table public.businesses (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  owner_id uuid references auth.users(id) on delete cascade,
  website_url text,
  industry text,
  description text,
  settings jsonb default '{}'::jsonb,
  faqs jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Leads Table
create table public.leads (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references public.businesses(id) on delete cascade,
  first_name text,
  last_name text,
  email text,
  phone text,
  status text default 'new', -- e.g., 'new', 'qualified', 'booked', 'junk'
  notes text,
  raw_interaction jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. Appointments Table
create table public.appointments (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references public.businesses(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  status text default 'scheduled', -- e.g., 'scheduled', 'cancelled', 'completed'
  meeting_link text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 4. Subscriptions Table
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references public.businesses(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan_tier text not null, -- 'starter', 'pro', 'agency'
  status text not null, -- 'active', 'past_due', 'canceled', etc.
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 5. Admin Settings Table
create table public.admin_settings (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references public.businesses(id) on delete cascade,
  key text not null,
  value jsonb,
  unique(business_id, key),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.businesses enable row level security;
alter table public.leads enable row level security;
alter table public.appointments enable row level security;
alter table public.subscriptions enable row level security;
alter table public.admin_settings enable row level security;

-- Policies
-- (Basic policies: owners can see their own data)
create policy "Owners can view their own business" on public.businesses
  for select using (auth.uid() = owner_id);

create policy "Owners can update their own business" on public.businesses
  for update using (auth.uid() = owner_id);

create policy "Owners can view their leads" on public.leads
  for select using (
    exists (
      select 1 from public.businesses
      where public.businesses.id = public.leads.business_id
      and public.businesses.owner_id = auth.uid()
    )
  );

create policy "Owners can view their appointments" on public.appointments
  for select using (
    exists (
      select 1 from public.businesses
      where public.businesses.id = public.appointments.business_id
      and public.businesses.owner_id = auth.uid()
    )
  );

-- Trigger to update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_businesses_updated_at before update on public.businesses for each row execute procedure update_updated_at_column();
create trigger update_leads_updated_at before update on public.leads for each row execute procedure update_updated_at_column();
create trigger update_appointments_updated_at before update on public.appointments for each row execute procedure update_updated_at_column();
create trigger update_subscriptions_updated_at before update on public.subscriptions for each row execute procedure update_updated_at_column();
create trigger update_admin_settings_updated_at before update on public.admin_settings for each row execute procedure update_updated_at_column();
