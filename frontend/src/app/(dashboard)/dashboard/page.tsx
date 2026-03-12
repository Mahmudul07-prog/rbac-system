'use client';

import { useAuthStore } from '@/store/auth-store';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
} from 'react-icons/hi';
import PermissionGate from '@/components/PermissionGate';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalPermissions: number;
  recentActions: number;
}

export default function DashboardPage() {
  const { user, permissions } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalPermissions: 0,
    recentActions: 0,
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // Load users if they have permission
      if (permissions.includes('users:view')) {
        const usersRes = await api.get('/users');
        const users = usersRes.data;
        setStats((prev) => ({
          ...prev,
          totalUsers: users.length,
          activeUsers: users.filter((u: any) => u.status === 'active').length,
        }));
      }

      // Load audit if they have permission
      if (permissions.includes('audit:view')) {
        const auditRes = await api.get('/audit?limit=5');
        setRecentLogs(auditRes.data.data || []);
        setStats((prev) => ({
          ...prev,
          recentActions: auditRes.data.total || 0,
        }));
      }

      // Load permissions count
      const permsRes = await api.get('/permissions');
      setStats((prev) => ({
        ...prev,
        totalPermissions: permsRes.data.length,
      }));
    } catch (err) {
      console.error('Dashboard load error:', err);
    }
  };

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: HiOutlineUsers,
      color: 'bg-blue-500',
      permission: 'users:view',
    },
    {
      label: 'Active Users',
      value: stats.activeUsers,
      icon: HiOutlineCheckCircle,
      color: 'bg-emerald-500',
      permission: 'users:view',
    },
    {
      label: 'Permissions',
      value: stats.totalPermissions,
      icon: HiOutlineShieldCheck,
      color: 'bg-purple-500',
      permission: 'dashboard:view',
    },
    {
      label: 'Audit Actions',
      value: stats.recentActions,
      icon: HiOutlineClipboardList,
      color: 'bg-amber-500',
      permission: 'audit:view',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Overview of your system. Your permissions: {permissions.length} atoms active.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <PermissionGate key={card.label} permission={card.permission}>
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-xl`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </PermissionGate>
        ))}
      </div>

      {/* User Info & Permissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Permissions */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Active Permissions
          </h3>
          <div className="flex flex-wrap gap-2">
            {permissions.map((perm) => (
              <span
                key={perm}
                className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium"
              >
                {perm}
              </span>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <PermissionGate permission="audit:view">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentLogs.length > 0 ? (
                recentLogs.map((log: any) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div className="w-2 h-2 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700">{log.description}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No recent activity</p>
              )}
            </div>
          </div>
        </PermissionGate>
      </div>
    </div>
  );
}