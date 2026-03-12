'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Permission } from '@/types';
import { useAuthStore } from '@/store/auth-store';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';
import {
  HiOutlineShieldCheck,
  HiOutlineShieldExclamation,
  HiOutlineSave,
} from 'react-icons/hi';

interface Props {
  userId: string;
  userName: string;
}

interface PermissionState {
  atom: string;
  roleGranted: boolean;
  userOverride: boolean | null; // null = no override
  effective: boolean;
}

export default function PermissionEditor({ userId, userName }: Props) {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [permStates, setPermStates] = useState<PermissionState[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const myPermissions = useAuthStore((s) => s.permissions);

  useEffect(() => {
    loadPermissions();
  }, [userId]);

  const loadPermissions = async () => {
    try {
      const [permsRes, userPermsRes] = await Promise.all([
        api.get('/permissions'),
        api.get(`/users/${userId}/permissions`),
      ]);

      const allPerms: Permission[] = permsRes.data;
      const {
        rolePermissions,
        userOverrides,
        resolved,
      } = userPermsRes.data;

      const roleAtoms = new Set(rolePermissions.map((p: Permission) => p.atom));
      const overrideMap = new Map<string, boolean>();
      userOverrides.forEach((uo: any) => {
        overrideMap.set(uo.permission.atom, uo.granted);
      });

      const states: PermissionState[] = allPerms.map((p) => {
        const roleGranted = roleAtoms.has(p.atom);
        const userOverride = overrideMap.has(p.atom) ? overrideMap.get(p.atom)! : null;
        const effective =
          userOverride !== null ? userOverride : roleGranted;

        return {
          atom: p.atom,
          roleGranted,
          userOverride,
          effective,
        };
      });

      setAllPermissions(allPerms);
      setPermStates(states);
      setHasChanges(false);
    } catch (err) {
      toast.error('Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (atom: string) => {
    // Grant ceiling: can't grant what you don't have
    if (!myPermissions.includes(atom)) {
      toast.error(`You cannot grant "${atom}" — you don't hold it yourself`);
      return;
    }

    setPermStates((prev) =>
      prev.map((ps) => {
        if (ps.atom !== atom) return ps;

        let newOverride: boolean | null;

        if (ps.userOverride === null) {
          // No override → toggle from role default
          newOverride = !ps.roleGranted;
        } else {
          // Has override → cycle: true → false → null (remove override)
          if (ps.userOverride === true) {
            newOverride = false;
          } else {
            newOverride = null; // Remove override, revert to role default
          }
        }

        return {
          ...ps,
          userOverride: newOverride,
          effective: newOverride !== null ? newOverride : ps.roleGranted,
        };
      }),
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const overrides = permStates
        .filter((ps) => ps.userOverride !== null)
        .map((ps) => ({
          atom: ps.atom,
          granted: ps.userOverride!,
        }));

      await api.put(`/users/${userId}/permissions`, {
        permissions: overrides,
      });

      toast.success('Permissions saved successfully');
      setHasChanges(false);
      loadPermissions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  // Group by module
  const grouped = allPermissions.reduce<Record<string, Permission[]>>(
    (acc, p) => {
      if (!acc[p.module]) acc[p.module] = [];
      acc[p.module].push(p);
      return acc;
    },
    {},
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Permissions for {userName}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Toggle permissions. Green = granted, Red = denied, Gray = inherited from role.
          </p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium disabled:opacity-50"
          >
            <HiOutlineSave className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span className="text-gray-600">Granted (effective)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span className="text-gray-600">Denied (override)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-300" />
          <span className="text-gray-600">Not granted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border-2 border-blue-400 bg-blue-50" />
          <span className="text-gray-600">From role (default)</span>
        </div>
      </div>

      {/* Permission Grid */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([module, perms]) => (
          <div
            key={module}
            className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <HiOutlineShieldCheck className="w-4 h-4 text-indigo-500" />
              {module}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {perms.map((perm) => {
                const state = permStates.find((ps) => ps.atom === perm.atom);
                if (!state) return null;

                const canGrant = myPermissions.includes(perm.atom);
                const isEffective = state.effective;
                const hasOverride = state.userOverride !== null;

                return (
                  <button
                    key={perm.atom}
                    onClick={() => togglePermission(perm.atom)}
                    disabled={!canGrant}
                    className={`relative flex items-center justify-between p-3 rounded-xl border-2 transition text-left
                      ${
                        !canGrant
                          ? 'opacity-40 cursor-not-allowed border-gray-100 bg-gray-50'
                          : isEffective
                          ? hasOverride
                            ? 'border-emerald-400 bg-emerald-50 hover:bg-emerald-100'
                            : 'border-blue-300 bg-blue-50 hover:bg-blue-100'
                          : hasOverride
                          ? 'border-red-300 bg-red-50 hover:bg-red-100'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }
                    `}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {perm.action}
                      </p>
                      <p className="text-xs text-gray-500">{perm.atom}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                        ${
                          isEffective
                            ? 'bg-emerald-500 text-white'
                            : hasOverride
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200'
                        }
                      `}
                    >
                      {isEffective && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {!isEffective && hasOverride && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>

                    {hasOverride && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}