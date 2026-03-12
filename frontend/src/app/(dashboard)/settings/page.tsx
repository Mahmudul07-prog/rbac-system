'use client';

import { useAuthStore } from '@/store/auth-store';
import PermissionGate from '@/components/PermissionGate';
import { HiOutlineCog } from 'react-icons/hi';

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <HiOutlineCog className="w-7 h-7 text-indigo-600" />
          Settings
        </h1>
        <p className="text-gray-500 mt-1">Manage your account and system settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                defaultValue={`${user?.firstName} ${user?.lastName}`}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                defaultValue={user?.email}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
              />
            </div>
            <button className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium">
              Update Profile
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
              />
            </div>
            <button className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium">
              Change Password
            </button>
          </div>
        </div>

        {/* System Settings — Admin only */}
        <PermissionGate permission="settings:edit">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Maintenance Mode</p>
                  <p className="text-xs text-gray-500">Temporarily disable user access</p>
                </div>
                <button className="w-12 h-6 bg-gray-200 rounded-full relative transition">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow transition" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                  <p className="text-xs text-gray-500">Send email on critical actions</p>
                </div>
                <button className="w-12 h-6 bg-indigo-600 rounded-full relative transition">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow transition" />
                </button>
              </div>
            </div>
          </div>
        </PermissionGate>
      </div>
    </div>
  );
}