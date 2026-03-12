'use client';

import { HiOutlineGlobe, HiOutlineTicket, HiOutlineChat } from 'react-icons/hi';

export default function PortalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <HiOutlineGlobe className="w-7 h-7 text-indigo-600" />
          Customer Portal
        </h1>
        <p className="text-gray-500 mt-1">Self-service portal for customers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition cursor-pointer">
          <HiOutlineTicket className="w-10 h-10 text-indigo-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">My Tickets</h3>
          <p className="text-sm text-gray-500 mt-1">View and manage your support tickets</p>
          <p className="text-2xl font-bold text-indigo-600 mt-4">3</p>
          <p className="text-xs text-gray-400">Open tickets</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition cursor-pointer">
          <HiOutlineChat className="w-10 h-10 text-emerald-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
          <p className="text-sm text-gray-500 mt-1">Communication with your team</p>
          <p className="text-2xl font-bold text-emerald-600 mt-4">5</p>
          <p className="text-xs text-gray-400">Unread messages</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition cursor-pointer">
          <HiOutlineGlobe className="w-10 h-10 text-amber-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
          <p className="text-sm text-gray-500 mt-1">Track your recent orders</p>
          <p className="text-2xl font-bold text-amber-600 mt-4">12</p>
          <p className="text-xs text-gray-400">Total orders</p>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tickets</h3>
        <div className="space-y-3">
          {[
            { id: 'TKT-001', subject: 'Cannot access dashboard', status: 'open', date: '2024-01-15' },
            { id: 'TKT-002', subject: 'Billing inquiry', status: 'resolved', date: '2024-01-12' },
            { id: 'TKT-003', subject: 'Feature request', status: 'pending', date: '2024-01-10' },
          ].map((ticket) => (
            <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">{ticket.subject}</p>
                <p className="text-xs text-gray-400">{ticket.id} · {ticket.date}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                ${ticket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                  ticket.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-amber-100 text-amber-700'}`
              }>
                {ticket.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}