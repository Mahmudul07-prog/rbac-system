'use client';

import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import {
  HiOutlineBell,
  HiOutlineLogout,
  HiOutlineMenu,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <HiOutlineMenu className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Welcome back, {user?.firstName}
          </h2>
          <p className="text-xs text-gray-400 capitalize">
            {user?.role?.name || (user as any)?.role} Account
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
          <HiOutlineBell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition"
          title="Logout"
        >
          <HiOutlineLogout className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}