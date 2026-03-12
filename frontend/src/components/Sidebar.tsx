'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { NAV_ITEMS } from '@/lib/constants';
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
  HiOutlineChartBar,
  HiOutlineDocumentText,
  HiOutlineCog,
  HiOutlineGlobe,
  HiOutlineX,
} from 'react-icons/hi';

const ICONS: Record<string, any> = {
  dashboard: HiOutlineViewGrid,
  users: HiOutlineUsers,
  leads: HiOutlineClipboardList,
  tasks: HiOutlineCheckCircle,
  reports: HiOutlineChartBar,
  audit: HiOutlineDocumentText,
  settings: HiOutlineCog,
  portal: HiOutlineGlobe,
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const permissions = useAuthStore((s) => s.permissions);

  // Filter nav items based on user's permissions (dynamic sidebar)
  const visibleItems = NAV_ITEMS.filter((item) =>
    permissions.includes(item.requiredPermission),
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1E1E2D] text-gray-300 z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">RBAC</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 space-y-1">
          {visibleItems.map((item) => {
            const Icon = ICONS[item.icon] || HiOutlineViewGrid;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
                  ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50">
          <div className="text-xs text-gray-500 text-center">
            RBAC System v2.0
          </div>
        </div>
      </aside>
    </>
  );
}