'use client';

import { useState } from 'react';
import Link from 'next/link';
import PermissionGate from '@/components/PermissionGate';
import {
  HiOutlinePlus,
  HiOutlineClipboardList,
} from 'react-icons/hi';

interface Lead {
  id: string;
  name: string;
  email: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  value: string;
  createdAt: string;
}

const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'Acme Corp', email: 'info@acme.com', status: 'new', value: '$12,000', createdAt: '2024-01-15' },
  { id: '2', name: 'TechStart Inc', email: 'hello@techstart.io', status: 'contacted', value: '$8,500', createdAt: '2024-01-14' },
  { id: '3', name: 'GlobalTrade Ltd', email: 'sales@globaltrade.com', status: 'qualified', value: '$25,000', createdAt: '2024-01-13' },
  { id: '4', name: 'Sunset Media', email: 'team@sunset.media', status: 'lost', value: '$5,000', createdAt: '2024-01-12' },
];

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  qualified: 'bg-emerald-100 text-emerald-700',
  lost: 'bg-red-100 text-red-700',
};

export default function LeadsPage() {
  const [leads] = useState<Lead[]>(MOCK_LEADS);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HiOutlineClipboardList className="w-7 h-7 text-indigo-600" />
            Leads
          </h1>
          <p className="text-gray-500 mt-1">{leads.length} total leads</p>
        </div>
        <PermissionGate permission="leads:create">
          <Link
            href="/leads/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium"
          >
            <HiOutlinePlus className="w-4 h-4" />
            New Lead
          </Link>
        </PermissionGate>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Email</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50/50 transition">
                <td className="py-3 px-4 text-sm font-medium text-gray-900">{lead.name}</td>
                <td className="py-3 px-4 text-sm text-gray-500 hidden sm:table-cell">{lead.email}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm font-medium text-gray-900">{lead.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}