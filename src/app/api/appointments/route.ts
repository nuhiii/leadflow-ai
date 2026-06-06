import { createClient } from '../../../lib/supabase-server';
import { NextResponse } from 'next/server';
import { queryTeamDb } from '../../../lib/team-db-client';

export async function GET() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy')) {
    const appointments = queryTeamDb(`
      SELECT a.*, l.first_name, l.last_name, l.email, l.phone 
      FROM appointments a 
      JOIN leads l ON a.lead_id = l.id 
      ORDER BY a.start_time ASC
    `);
    // Map to expected structure
    const formatted = (appointments || []).map((a: any) => ({
      ...a,
      leads: {
        first_name: a.first_name,
        last_name: a.last_name,
        email: a.email,
        phone: a.phone
      }
    }));
    return NextResponse.json(formatted);
  }

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('*, businesses!inner(owner_id), leads(first_name, last_name, email, phone)')
    .eq('businesses.owner_id', session.user.id)
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Remove the joined business data from the response to keep it clean
  const cleanedAppointments = appointments.map(({ businesses, ...appointment }: any) => appointment);

  return NextResponse.json(cleanedAppointments);
}
