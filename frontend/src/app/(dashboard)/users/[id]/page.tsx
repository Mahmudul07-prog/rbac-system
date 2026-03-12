'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { User } from '@/types';
import PermissionEditor from '@/components/PermissionEditor';
import StatusBadge from '@/components/StatusBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft } from 'react-icons/hi';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      setUser(res.data);
    } catch (err) {
      toast.error('User not found');
      router.push('/users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.push('/users')}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
      >
        <HiOutlineArrowLeft className="w-4 h-4" />
        Back to Users
      </button>

      {/* User Info Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-bold">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-500">{user.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 capitalize">
                {user.role?.name}
              </span>
              <StatusBadge status={user.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Permission Editor */}
      <PermissionEditor
        userId={user.id}
        userName={`${user.firstName} ${user.lastName}`}
      />
    </div>
  );
}