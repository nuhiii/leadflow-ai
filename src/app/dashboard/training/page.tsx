'use client';

import { useState, useEffect } from 'react';
import { 
  Save, 
  Plus, 
  Trash2, 
  MessageSquare, 
  Info, 
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface FAQ {
  question: string;
  answer: string;
}

interface Business {
  id: string;
  name: string;
  industry: string;
  description: string;
  faqs: FAQ[];
}

export default function TrainingPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBusiness() {
      try {
        const res = await fetch('/api/business');
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setBusiness(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBusiness();
  }, []);

  const handleSave = async () => {
    if (!business) return;
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch('/api/business', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(business),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setBusiness(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addFAQ = () => {
    if (!business) return;
    setBusiness({
      ...business,
      faqs: [...business.faqs, { question: '', answer: '' }]
    });
  };

  const updateFAQ = (index: number, field: keyof FAQ, value: string) => {
    if (!business) return;
    const newFAQs = [...business.faqs];
    newFAQs[index] = { ...newFAQs[index], [field]: value };
    setBusiness({ ...business, faqs: newFAQs });
  };

  const removeFAQ = (index: number) => {
    if (!business) return;
    const newFAQs = business.faqs.filter((_, i) => i !== index);
    setBusiness({ ...business, faqs: newFAQs });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900">Failed to load business data</h3>
        <p className="text-slate-500 mt-2">{error || 'Unknown error occurred.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Training</h1>
          <p className="text-slate-500">Train your AI by providing business-specific information and FAQs.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm",
            success 
              ? "bg-emerald-500 text-white" 
              : "bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
          )}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : success ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          <span>{saving ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* General Information */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center space-x-3">
          <Info className="h-5 w-5 text-primary-600" />
          <h2 className="font-bold text-slate-900">Business Profile</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Business Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                value={business.name}
                onChange={(e) => setBusiness({ ...business, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Industry</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                value={business.industry}
                onChange={(e) => setBusiness({ ...business, industry: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Business Description</label>
            <textarea
              rows={4}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
              placeholder="Tell the AI about your services, pricing, and business hours..."
              value={business.description}
              onChange={(e) => setBusiness({ ...business, description: e.target.value })}
            />
            <p className="text-xs text-slate-400">The more detailed you are, the better the AI will represent your business.</p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-5 w-5 text-primary-600" />
            <h2 className="font-bold text-slate-900">Custom FAQs</h2>
          </div>
          <button
            onClick={addFAQ}
            className="flex items-center space-x-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add FAQ</span>
          </button>
        </div>
        <div className="p-6 space-y-6">
          {business.faqs.length > 0 ? (
            <div className="space-y-6">
              {business.faqs.map((faq, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative group">
                  <button
                    onClick={() => removeFAQ(index)}
                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Question</label>
                      <input
                        type="text"
                        placeholder="e.g. Do you offer weekend appointments?"
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        value={faq.question}
                        onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Answer</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Yes, we are open on Saturdays from 9 AM to 2 PM."
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                        value={faq.answer}
                        onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 text-sm">No custom FAQs yet. Add common customer questions to improve the AI's accuracy.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
