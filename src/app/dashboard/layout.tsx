'use client';

import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  MessageSquare,
  LogOut,
  Bell,
  Search,
  MessageCircle,
  X
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import ChatWidget from '../../components/ChatWidget';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: Users, label: 'Leads', href: '/dashboard/leads' },
  { icon: Calendar, label: 'Appointments', href: '/dashboard/appointments' },
  { icon: MessageSquare, label: 'AI Training', href: '/dashboard/training' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 flex items-center space-x-2">
          <div className="bg-primary-600 p-1.5 rounded-lg">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">LeadFlow AI</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                pathname === item.href
                  ? "bg-primary-50 text-primary-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button className="flex items-center space-x-3 px-3 py-2 w-full text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all text-sm font-medium">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads, appointments..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xs border border-primary-200">
              JD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          {children}
          
          {/* Chat Widget Toggle Button */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="fixed bottom-8 right-8 bg-primary-600 text-white p-4 rounded-full shadow-2xl hover:bg-primary-700 transition-all z-[100] flex items-center justify-center"
          >
            {isChatOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          </button>

          {/* Chat Widget Overlay */}
          {isChatOpen && (
            <div className="fixed bottom-24 right-8 z-[100] w-full max-w-[400px] animate-in slide-in-from-bottom-4 duration-300">
              <ChatWidget businessId="owner-test-id" />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
