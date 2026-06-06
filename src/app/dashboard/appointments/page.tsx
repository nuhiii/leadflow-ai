'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Plus,
  Video,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface Appointment {
  id: string;
  lead_id: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  meeting_link?: string;
  notes: string;
  leads: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch('/api/appointments');
        const data = await res.json();
        setAppointments(data);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-primary-50 text-primary-700 border-primary-100';
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
          <p className="text-slate-500">View and manage your scheduled meetings.</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all shadow-sm flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <span>Calendar View</span>
          </button>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-all shadow-sm flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Sidebar (Simplified) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-slate-900">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex space-x-2">
                <button className="p-1 hover:bg-slate-50 rounded-md text-slate-400">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="p-1 hover:bg-slate-50 rounded-md text-slate-400">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Miniature Calendar Grid (Static Placeholder) */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="text-[10px] font-bold text-slate-400 py-1">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: 31 }).map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "text-sm py-1.5 rounded-lg cursor-pointer transition-all",
                    i + 1 === new Date().getDate() 
                      ? "bg-primary-600 text-white font-bold" 
                      : "text-slate-600 hover:bg-primary-50 hover:text-primary-600"
                  )}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">Upcoming Reminders</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <Clock className="h-4 w-4 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-amber-800">Pre-call Reminder</p>
                  <p className="text-[10px] text-amber-600">Sarah Jenkins (10:30 AM)</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-primary-50 rounded-lg border border-primary-100">
                <Video className="h-4 w-4 text-primary-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-primary-800">Send Zoom Link</p>
                  <p className="text-[10px] text-primary-600">Michael Chen (2:00 PM)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Agenda</h2>
              <div className="flex space-x-2">
                <button className="text-xs font-medium text-primary-600 hover:text-primary-700">View All</button>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-6 animate-pulse flex items-center space-x-6">
                    <div className="h-12 w-12 bg-slate-100 rounded-lg"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <div key={appointment.id} className="p-6 hover:bg-slate-50 transition-colors flex items-start space-x-6">
                    <div className="flex flex-col items-center justify-center h-16 w-16 bg-slate-50 rounded-xl border border-slate-200 flex-shrink-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(appointment.start_time).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-xl font-bold text-slate-900">{new Date(appointment.start_time).getDate()}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-slate-900">
                          {appointment.leads.first_name} {appointment.leads.last_name}
                        </h3>
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                          getStatusColor(appointment.status)
                        )}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-2 mt-3">
                        <div className="flex items-center text-sm text-slate-600">
                          <Clock className="h-4 w-4 mr-2 text-slate-400" />
                          {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <span className="p-1 bg-slate-100 rounded mr-2">
                            <Video className="h-4 w-4" />
                          </span>
                          {appointment.meeting_link ? 'Video Meeting' : 'Scheduled Call'}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Mail className="h-4 w-4 mr-2 text-slate-400" />
                          {appointment.leads.email}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Phone className="h-4 w-4 mr-2 text-slate-400" />
                          {appointment.leads.phone}
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-500 italic">
                          "{appointment.notes}"
                        </div>
                      )}
                    </div>

                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <CalendarIcon className="h-6 w-6 text-slate-400" />
                  </div>
                  <h3 className="text-slate-900 font-medium">No appointments scheduled</h3>
                  <p className="text-slate-500 text-sm mt-1">When leads book meetings, they will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
