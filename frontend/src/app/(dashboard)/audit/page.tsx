'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { AuditLogEntry } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiOutlineDocumentText } from 'react-icons/hi';

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, [page]);

  const loadLogs = async () => {
    try {
      const res = await api.get(`/audit?page=${page}&limit=20`);
      setLogs(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const actionColors: Record<string, string> = {
    'auth.login': 'text-blue-600 bg-blue-50',
    'auth.logout': 'text-gray-600 bg-gray-50',
    'user.created': 'text-emerald-600 bg-emerald-50',
    'user.updated': 'text-amber-600 bg-amber-50',
    'user.deleted': 'text-red-600 bg-red-50',
    'user.suspended': 'text-amber-600 bg-amber-50',
    'user.banned': 'text-red-600 bg-red-50',
    'user.active': 'text-emerald-600 bg-emerald-50',
    'permissions.updated': 'text-purple-600 bg-purple-50',
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <HiOutlineDocumentText className="w-7 h-7 text-indigo-600" />
          Audit Log
        </h1>
        <p className="text-gray-500 mt-1">Complete trail of all system actions</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {logs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-gray-50/50 transition">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span
                  className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                    actionColors[log.action] || 'text-gray-600 bg-gray-50'
                  }`}
                >
                  {log.action}
                </span>
                <p className="text-sm text-gray-700 flex-1">{log.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  {log.performedBy && (
                    <span>
                      by {log.performedBy.firstName} {log.performedBy.lastName}
                    </span>
                  )}
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {logs.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No audit logs found
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}