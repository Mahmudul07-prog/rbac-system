'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  HiOutlineArrowLeft,
  HiOutlineClipboardList,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineCurrencyDollar,
  HiOutlineOfficeBuilding,
  HiOutlineGlobe,
  HiOutlineTag,
  HiOutlineAnnotation,
} from 'react-icons/hi';

interface LeadForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  value: string;
  source: string;
  status: string;
  priority: string;
  notes: string;
}

export default function NewLeadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<LeadForm>({
    name: '',
    email: '',
    phone: '',
    company: '',
    value: '',
    source: '',
    status: 'new',
    priority: 'medium',
    notes: '',
  });

  const updateField = (field: keyof LeadForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call (replace with real API when backend supports leads)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Lead created successfully!');
      router.push('/leads');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      value: '',
      source: '',
      status: 'new',
      priority: 'medium',
      notes: '',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => router.push('/leads')}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition mb-2"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back to Leads
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HiOutlineClipboardList className="w-7 h-7 text-indigo-600" />
            Create New Lead
          </h1>
          <p className="text-gray-500 mt-1">
            Fill in the details below to add a new lead to the system
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HiOutlineUser className="w-5 h-5 text-indigo-500" />
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="john@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm transition"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm transition"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Company Name
              </label>
              <div className="relative">
                <HiOutlineOfficeBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => updateField('company', e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lead Details */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HiOutlineTag className="w-5 h-5 text-indigo-500" />
            Lead Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Estimated Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Estimated Value <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiOutlineCurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  value={form.value}
                  onChange={(e) => updateField('value', e.target.value)}
                  placeholder="10000"
                  required
                  min="0"
                  step="100"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm transition"
                />
              </div>
            </div>

            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Lead Source <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiOutlineGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={form.source}
                  onChange={(e) => updateField('source', e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm transition appearance-none bg-white"
                >
                  <option value="">Select source</option>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="social_media">Social Media</option>
                  <option value="email_campaign">Email Campaign</option>
                  <option value="cold_call">Cold Call</option>
                  <option value="trade_show">Trade Show</option>
                  <option value="advertisement">Advertisement</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 'new', label: 'New', color: 'border-blue-400 bg-blue-50 text-blue-700' },
                  { value: 'contacted', label: 'Contacted', color: 'border-amber-400 bg-amber-50 text-amber-700' },
                  { value: 'qualified', label: 'Qualified', color: 'border-emerald-400 bg-emerald-50 text-emerald-700' },
                  { value: 'lost', label: 'Lost', color: 'border-red-400 bg-red-50 text-red-700' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField('status', opt.value)}
                    className={`px-3 py-2 rounded-xl border-2 text-xs font-semibold transition
                      ${
                        form.status === opt.value
                          ? opt.color
                          : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                      }
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'low', label: 'Low', color: 'border-gray-400 bg-gray-50 text-gray-700' },
                  { value: 'medium', label: 'Medium', color: 'border-amber-400 bg-amber-50 text-amber-700' },
                  { value: 'high', label: 'High', color: 'border-red-400 bg-red-50 text-red-700' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField('priority', opt.value)}
                    className={`px-3 py-2 rounded-xl border-2 text-xs font-semibold transition
                      ${
                        form.priority === opt.value
                          ? opt.color
                          : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                      }
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HiOutlineAnnotation className="w-5 h-5 text-indigo-500" />
            Additional Notes
          </h2>

          <textarea
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Add any additional notes about this lead..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm transition resize-none"
          />
        </div>

        {/* Preview Card */}
        {form.name && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6">
            <h3 className="text-sm font-semibold text-indigo-900 mb-3">Lead Preview</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                {form.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-gray-900">{form.name}</p>
                <p className="text-sm text-gray-500">{form.company || 'No company'}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {form.email && (
                    <span className="text-xs text-gray-500">{form.email}</span>
                  )}
                  {form.value && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                      ${Number(form.value).toLocaleString()}
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
                    ${form.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      form.status === 'contacted' ? 'bg-amber-100 text-amber-700' :
                      form.status === 'qualified' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-red-100 text-red-700'}`
                  }>
                    {form.status}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
                    ${form.priority === 'low' ? 'bg-gray-100 text-gray-600' :
                      form.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'}`
                  }>
                    {form.priority} priority
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
          <button
            type="button"
            onClick={() => router.push('/leads')}
            className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium order-3 sm:order-1"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium order-2"
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating...
              </>
            ) : (
              <>
                <HiOutlineClipboardList className="w-4 h-4" />
                Create Lead
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}