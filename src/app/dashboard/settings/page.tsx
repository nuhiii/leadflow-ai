'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Globe, 
  Code, 
  Copy, 
  Check, 
  Shield, 
  CreditCard,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function SettingsPage() {
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchBusiness() {
      try {
        const res = await fetch('/api/business');
        const data = await res.json();
        setBusiness(data);
      } catch (err) {
        console.error('Failed to fetch business:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBusiness();
  }, []);

  const copyToClipboard = () => {
    if (!business) return;
    const script = `<script 
  src="${window.location.origin}/widget.js" 
  data-business-id="${business.id}" 
  async
></script>`;
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your account settings and widget integration.</p>
      </div>

      {/* Account Section */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center space-x-3">
          <User className="h-5 w-5 text-primary-600" />
          <h2 className="font-bold text-slate-900">Profile</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-2xl border border-primary-200">
              {business?.name?.substring(0, 2).toUpperCase() || 'LF'}
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{business?.name}</h3>
              <p className="text-sm text-slate-500">{business?.industry} Provider</p>
              <button className="mt-2 text-sm font-semibold text-primary-600 hover:text-primary-700">Change Avatar</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Owner Name</label>
              <input
                type="text"
                disabled
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
                value="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                disabled
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
                value="john@example.com"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Widget Integration Section */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center space-x-3">
          <Code className="h-5 w-5 text-primary-600" />
          <h2 className="font-bold text-slate-900">Widget Integration</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-slate-600">Copy and paste this script tag into the <code className="bg-slate-100 px-1 rounded">&lt;head&gt;</code> of your website to enable the AI Chatbot.</p>
            <div className="relative mt-4">
              <pre className="bg-slate-900 text-slate-100 p-6 rounded-xl text-sm overflow-x-auto">
                {`<script 
  src="${window.location.origin}/widget.js" 
  data-business-id="${business?.id}" 
  async
></script>`}
              </pre>
              <button
                onClick={copyToClipboard}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 bg-primary-50 rounded-lg border border-primary-100 mt-4">
            <Globe className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-primary-900">Need help with installation?</h4>
              <p className="text-sm text-primary-700 mt-1">Check out our installation guides for WordPress, Shopify, and Wix.</p>
              <a href="#" className="inline-flex items-center space-x-1 mt-2 text-sm font-semibold text-primary-700 hover:text-primary-800 underline decoration-2 underline-offset-4">
                <span>View Documentation</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Billing Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center space-x-3">
            <Shield className="h-5 w-5 text-primary-600" />
            <h2 className="font-bold text-slate-900">Security</h2>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full text-left px-4 py-2 hover:bg-slate-50 rounded-lg transition-all text-sm font-medium text-slate-700">Change Password</button>
            <button className="w-full text-left px-4 py-2 hover:bg-slate-50 rounded-lg transition-all text-sm font-medium text-slate-700">Two-Factor Authentication</button>
            <button className="w-full text-left px-4 py-2 hover:bg-red-50 rounded-lg transition-all text-sm font-medium text-red-600">Delete Account</button>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center space-x-3">
            <CreditCard className="h-5 w-5 text-primary-600" />
            <h2 className="font-bold text-slate-900">Billing</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Current Plan</span>
              <span className="text-sm font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">Pro Plan</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Next Billing Date</span>
              <span className="text-sm font-medium text-slate-900">July 1, 2024</span>
            </div>
            <button className="w-full mt-2 bg-slate-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all">Manage Subscription</button>
          </div>
        </section>
      </div>
    </div>
  );
}
