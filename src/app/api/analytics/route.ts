import { createClient } from '../../../lib/supabase-server';
import { NextResponse } from 'next/server';
import { queryTeamDb } from '../../../lib/team-db-client';

export async function GET() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy')) {
    const leads = queryTeamDb(`SELECT id, status, created_at FROM leads`) || [];
    const appointments = queryTeamDb(`SELECT id, status, created_at FROM appointments`) || [];
    
    const totalLeads = leads.length;
    const qualifiedLeads = leads.filter((l: any) => l.status === 'qualified' || l.status === 'booked').length;
    const totalAppointments = appointments.length;
    const conversionRate = totalLeads > 0
      ? parseFloat(((totalAppointments / totalLeads) * 100).toFixed(2))
      : 0;
    const leadsRecovered = totalLeads;
    const leadsByStatus = leads.reduce((acc: Record<string, number>, lead: any) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();
    const leadsOverTime = last7Days.map(date => ({
      date,
      count: leads.filter((l: any) => l.created_at.startsWith(date)).length
    }));

    return NextResponse.json({
      totalLeads,
      qualifiedLeads,
      totalAppointments,
      conversionRate,
      leadsRecovered,
      leadsByStatus,
      leadsOverTime
    });
  }

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. Fetch all leads for this user's businesses
  const { data: leads, error: leadsError } = await supabase
    .from('leads')
    .select('id, status, created_at, businesses!inner(owner_id)')
    .eq('businesses.owner_id', session.user.id);

  if (leadsError) {
    console.error('Error fetching leads for analytics:', leadsError);
    return NextResponse.json({ error: leadsError.message }, { status: 500 });
  }

  // 2. Fetch all appointments for this user's businesses
  const { data: appointments, error: appointmentsError } = await supabase
    .from('appointments')
    .select('id, status, created_at, businesses!inner(owner_id)')
    .eq('businesses.owner_id', session.user.id);

  if (appointmentsError) {
    console.error('Error fetching appointments for analytics:', appointmentsError);
    return NextResponse.json({ error: appointmentsError.message }, { status: 500 });
  }

  // 3. Calculate KPIs
  const totalLeads = leads.length;
  const qualifiedLeads = (leads as any[]).filter(l => l.status === 'qualified' || l.status === 'booked').length;
  const totalAppointments = appointments.length;
  const conversionRate = totalLeads > 0
    ? parseFloat(((totalAppointments / totalLeads) * 100).toFixed(2))
    : 0;

  // Leads Recovered: For now, we count all leads captured by the AI receptionist
  const leadsRecovered = totalLeads;

  // Breakdown by status
  const leadsByStatus = (leads as any[]).reduce((acc: Record<string, number>, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  // Simple time-series data (leads per day for the last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const leadsOverTime = last7Days.map(date => ({
    date,
    count: (leads as any[]).filter(l => l.created_at.startsWith(date)).length
  }));

  return NextResponse.json({
    totalLeads,
    qualifiedLeads,
    totalAppointments,
    conversionRate,
    leadsRecovered,
    leadsByStatus,
    leadsOverTime
  });
}
