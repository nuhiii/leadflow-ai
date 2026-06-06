'use client';

import {
  Users,
  Calendar,
  TrendingUp,
  MessageCircle,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

interface AnalyticsData {
  totalLeads: number;
  qualifiedLeads: number;
  appointments: number;
  conversionRate: string;
  leadsRecovered: number;
  trend: { date: string; count: number }[];
}

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  service_interest: string;
  status: string;
  created_at: string;
}

export default function DashboardHome() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [analyticsRes, leadsRes] = await Promise.all([
          fetch('/api/analytics'),
          fetch('/api/leads'),
        ]);

        if (analyticsRes.ok) {
          const data = await analyticsRes.json();
          setAnalytics(data);
        }

        if (leadsRes.ok) {
          const data = await leadsRes.json();
          setLeads(data.slice(0, 5)); // Get top 5
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const stats = [
    { 
      label: 'Total Leads', 
      value: analytics?.totalLeads.toString() || '0', 
      icon: Users, 
      trend: '+12%', 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Appointments', 
      value: analytics?.appointments.toString() || '0', 
      icon: Calendar, 
      trend: '+8%', 
      color: 'bg-purple-500' 
    },
    { 
      label: 'Leads Recovered', 
      value: analytics?.leadsRecovered.toString() || '0', 
      icon: MessageCircle, 
      trend: '+24%', 
      color: 'bg-green-500' 
    },
    { 
      label: 'Conv. Rate', 
      value: analytics?.conversionRate || '0%', 
      icon: TrendingUp, 
      trend: '+4%', 
      color: 'bg-orange-500' 
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Here's what's happening with your AI receptionist today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full flex items-center">
                {stat.trend} <ArrowUpRight className="ml-1 h-3 w-3" />
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-900">Recent Leads</h2>
            <button className="text-primary-600 text-sm font-bold hover:text-primary-700">View All</button>
          </div>
          <div className="divide-y divide-slate-100">
            {leads.length > 0 ? (
              leads.map((lead) => (
                <div key={lead.id} className="p-4 hover:bg-slate-50 transition-all flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                      {lead.first_name?.charAt(0) || 'L'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{lead.first_name} {lead.last_name}</div>
                      <div className="text-xs text-slate-500">{lead.service_interest}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full inline-block mb-1",
                      lead.status === 'converted' ? 'bg-green-100 text-green-700' :
                      lead.status === 'qualified' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                    )}>
                      {lead.status}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center justify-end">
                      <Clock className="h-3 w-3 mr-1" /> {new Date(lead.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">
                No leads captured yet.
              </div>
            )}
          </div>
        </div>

        {/* AI Performance */}
        <div className="bg-primary-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="font-bold mb-4">AI Performance</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2 text-primary-200">
                  <span>Knowledge Accuracy</span>
                  <span>96%</span>
                </div>
                <div className="h-2 bg-primary-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-400 w-[96%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2 text-primary-200">
                  <span>Lead Qualification</span>
                  <span>88%</span>
                </div>
                <div className="h-2 bg-primary-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-400 w-[88%]" />
                </div>
              </div>
              <div className="pt-4">
                <p className="text-sm text-primary-200 leading-relaxed italic">
                  "Your AI successfully handled {analytics?.totalLeads || 0} inquiries today and recovered {analytics?.leadsRecovered || 0} leads after hours."
                </p>
              </div>
              <button className="w-full bg-white text-primary-900 py-3 rounded-xl font-bold text-sm hover:bg-primary-50 transition-all shadow-lg">
                View Chat Logs
              </button>
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-primary-800 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-all"></div>
        </div>
      </div>
    </div>
  );
}
