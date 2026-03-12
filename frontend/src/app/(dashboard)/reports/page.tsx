'use client';

import PermissionGate from '@/components/PermissionGate';
import { HiOutlineChartBar, HiOutlineDownload } from 'react-icons/hi';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HiOutlineChartBar className="w-7 h-7 text-indigo-600" />
            Reports
          </h1>
          <p className="text-gray-500 mt-1">Analytics and reporting dashboard</p>
        </div>
        <PermissionGate permission="reports:export">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium">
            <HiOutlineDownload className="w-4 h-4" />
            Export Report
          </button>
        </PermissionGate>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart placeholders */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <div className="h-48 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center text-gray-400">
            <div className="text-center">
              <HiOutlineChartBar className="w-12 h-12 mx-auto mb-2 text-indigo-300" />
              <p className="text-sm">Chart visualization</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Overview</h3>
          <div className="h-48 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center text-gray-400">
            <div className="text-center">
              <HiOutlineChartBar className="w-12 h-12 mx-auto mb-2 text-emerald-300" />
              <p className="text-sm">Chart visualization</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission Usage</h3>
          <div className="h-48 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl flex items-center justify-center text-gray-400">
            <div className="text-center">
              <HiOutlineChartBar className="w-12 h-12 mx-auto mb-2 text-amber-300" />
              <p className="text-sm">Chart visualization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}