import { createClient } from '../../../lib/supabase-server';
import { NextResponse } from 'next/server';
import { queryTeamDb } from '../../../lib/team-db-client';

export async function GET() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy')) {
    // In dummy mode, we'll just return all leads from team-db for verification
    // normally we would filter by owner_id if we had a session
    const leads = queryTeamDb(`SELECT * FROM leads ORDER BY created_at DESC`);
    return NextResponse.json(leads || []);
  }

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: leads, error } = await supabase
    .from('leads')
    .select('*, businesses!inner(owner_id)')
    .eq('businesses.owner_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Remove the joined business data from the response to keep it clean
  const cleanedLeads = leads.map(({ businesses, ...lead }: any) => lead);

  return NextResponse.json(cleanedLeads);
}
