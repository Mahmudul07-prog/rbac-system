'use client';

import { useAuthStore } from '@/store/auth-store';
import { ReactNode } from 'react';

interface PermissionGateProps {
  permission: string | string[];
  children: ReactNode;
  fallback?: ReactNode;
  requireAll?: boolean;
}

export default function PermissionGate({
  permission,
  children,
  fallback = null,
  requireAll = false,
}: PermissionGateProps) {
  const permissions = useAuthStore((s) => s.permissions);

  const atoms = Array.isArray(permission) ? permission : [permission];

  const hasAccess = requireAll
    ? atoms.every((a) => permissions.includes(a))
    : atoms.some((a) => permissions.includes(a));

  if (!hasAccess) return <>{fallback}</>;
  return <>{children}</>;
}