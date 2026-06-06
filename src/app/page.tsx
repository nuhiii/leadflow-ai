'use client';

import { MessageSquare, Calendar, ShieldCheck, ArrowRight, Menu, X, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import ChatWidget from '../components/ChatWidget';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-600 p-2 rounded-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">LeadFlow AI</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-primary-600 font-medium">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-primary-600 font-medium">How it Works</a>
              <a href="#pricing" className="text-slate-600 hover:text-primary-600 font-medium">Pricing</a>
              <Link href="/dashboard" className="bg-primary-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-8 border border-primary-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span>AI Receptionist now available for local businesses</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Never Miss a Lead <br />
            <span className="text-primary-600">While You Focus on Work</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            The autonomous AI receptionist that lives on your website. Qualify leads, answer FAQs, and book appointments 24/7.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-primary-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 flex items-center justify-center">
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={() => setIsChatOpen(true)}
              className="bg-white text-slate-700 px-8 py-4 rounded-full text-lg font-bold border border-slate-200 hover:border-primary-600 hover:text-primary-600 transition-all"
            >
              Watch Demo
            </button>
          </div>

          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 h-full"></div>
            <img
              src="https://images.unsplash.com/photo-1600880212319-78d7e5226b70?auto=format&fit=crop&q=80&w=2000"
              alt="Dashboard Preview"
              className="rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Stats/Social Proof */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">98%</div>
            <div className="text-slate-600 font-medium">Capture Rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
            <div className="text-slate-600 font-medium">Availability</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">10k+</div>
            <div className="text-slate-600 font-medium">Appointments Booked</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">15m</div>
            <div className="text-slate-600 font-medium">Time Saved/Day</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Powerful Features for Local Pros</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Everything you need to automate your front desk and grow your revenue.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white border border-slate-100 rounded-2xl hover:shadow-xl transition-all group">
              <div className="bg-primary-50 p-4 rounded-xl w-fit mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all">
                <MessageSquare className="h-8 w-8 text-primary-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Lead Qualification</h3>
              <p className="text-slate-600 leading-relaxed">Our AI asks the right questions to ensure every lead is a perfect fit for your business before they book.</p>
            </div>

            <div className="p-8 bg-white border border-slate-100 rounded-2xl hover:shadow-xl transition-all group">
              <div className="bg-primary-50 p-4 rounded-xl w-fit mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all">
                <Calendar className="h-8 w-8 text-primary-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Scheduling</h3>
              <p className="text-slate-600 leading-relaxed">Direct integration with Google Calendar and Calendly. Sync your availability and let the AI handle the rest.</p>
            </div>

            <div className="p-8 bg-white border border-slate-100 rounded-2xl hover:shadow-xl transition-all group">
              <div className="bg-primary-50 p-4 rounded-xl w-fit mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all">
                <ShieldCheck className="h-8 w-8 text-primary-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">HIPAA Compliant</h3>
              <p className="text-slate-600 leading-relaxed">Built with security in mind. Perfect for med spas, dentists, and legal professionals who handle sensitive info.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-primary-600 p-2 rounded-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">LeadFlow AI</span>
            </div>
            <p className="text-slate-400 max-w-sm mb-8">
              Helping high-value local service businesses recover missed leads and automate their scheduling with autonomous AI receptionists.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Product</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Company</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#" className="hover:text-primary-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-slate-800 text-slate-500 text-center">
          © 2024 LeadFlow AI. All rights reserved.
        </div>
      </footer>

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
          <ChatWidget businessId="biz_med_spa_1" />
        </div>
      )}
    </div>
  );
}
