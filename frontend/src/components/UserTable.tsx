'use client';

import { User } from '@/types';
import StatusBadge from './StatusBadge';
import PermissionGate from './PermissionGate';
import Link from 'next/link';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineKey } from 'react-icons/hi';

interface Props {
  users: User[];
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export default function UserTable({ users, onStatusChange, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
              Manager
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
              Joined
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50/50 transition">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-bold">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                  {user.role?.name || 'N/A'}
                </span>
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={user.status} />
              </td>
              <td className="py-3 px-4 hidden md:table-cell">
                <span className="text-sm text-gray-500">
                  {user.manager
                    ? `${user.manager.firstName} ${user.manager.lastName}`
                    : '—'}
                </span>
              </td>
              <td className="py-3 px-4 hidden lg:table-cell">
                <span className="text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-1">
                  <PermissionGate permission="permissions:assign">
                    <Link
                      href={`/users/${user.id}`}
                      className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition"
                      title="Manage Permissions"
                    >
                      <HiOutlineKey className="w-4 h-4" />
                    </Link>
                  </PermissionGate>

                  <PermissionGate permission="users:edit">
                    <div className="relative group">
                      <button className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition">
                        <HiOutlinePencil className="w-4 h-4" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 hidden group-hover:block z-10 min-w-[140px]">
                        {user.status !== 'active' && (
                          <button
                            onClick={() => onStatusChange(user.id, 'active')}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-emerald-600"
                          >
                            Activate
                          </button>
                        )}
                        {user.status !== 'suspended' && (
                          <button
                            onClick={() => onStatusChange(user.id, 'suspended')}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-amber-600"
                          >
                            Suspend
                          </button>
                        )}
                        {user.status !== 'banned' && (
                          <button
                            onClick={() => onStatusChange(user.id, 'banned')}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
                          >
                            Ban
                          </button>
                        )}
                      </div>
                    </div>
                  </PermissionGate>

                  <PermissionGate permission="users:delete">
                    <button
                      onClick={() => onDelete(user.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition"
                      title="Delete User"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </PermissionGate>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No users found
        </div>
      )}
    </div>
  );
}