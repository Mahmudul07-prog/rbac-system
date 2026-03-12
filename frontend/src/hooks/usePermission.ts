import { useAuthStore } from '@/store/auth-store';

export function usePermission(atom: string): boolean {
  return useAuthStore((s) => s.permissions.includes(atom));
}

export function useAnyPermission(atoms: string[]): boolean {
  return useAuthStore((s) => atoms.some((a) => s.permissions.includes(a)));
}

export function useAllPermissions(atoms: string[]): boolean {
  return useAuthStore((s) => atoms.every((a) => s.permissions.includes(a)));
}