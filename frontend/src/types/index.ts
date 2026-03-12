export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'suspended' | 'banned';
  phone?: string;
  avatar?: string;
  role: Role;
  roleId: string;
  managerId?: string;
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  permissions?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  hierarchy: number;
}

export interface Permission {
  id: string;
  atom: string;
  module: string;
  action: string;
  description?: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  description: string;
  metadata?: Record<string, any>;
  performedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  targetUserId?: string;
  ipAddress?: string;
  timestamp: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  requiredPermission: string;
}