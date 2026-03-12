import { NavItem } from '@/types';

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    requiredPermission: 'dashboard:view',
  },
  {
    label: 'Users',
    href: '/users',
    icon: 'users',
    requiredPermission: 'users:view',
  },
  {
    label: 'Leads',
    href: '/leads',
    icon: 'leads',
    requiredPermission: 'leads:view',
  },
  {
    label: 'Tasks',
    href: '/tasks',
    icon: 'tasks',
    requiredPermission: 'tasks:view',
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: 'reports',
    requiredPermission: 'reports:view',
  },
  {
    label: 'Audit Log',
    href: '/audit',
    icon: 'audit',
    requiredPermission: 'audit:view',
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: 'settings',
    requiredPermission: 'settings:view',
  },
  {
    label: 'Customer Portal',
    href: '/portal',
    icon: 'portal',
    requiredPermission: 'portal:view',
  },
];

// Route-to-permission mapping for middleware
export const ROUTE_PERMISSIONS: Record<string, string> = {
  '/dashboard': 'dashboard:view',
  '/users': 'users:view',
  '/leads': 'leads:view',
  '/tasks': 'tasks:view',
  '/reports': 'reports:view',
  '/audit': 'audit:view',
  '/settings': 'settings:view',
  '/portal': 'portal:view',
};