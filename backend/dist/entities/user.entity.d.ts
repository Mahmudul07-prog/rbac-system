import { Role } from './role.entity';
import { UserPermission } from './user-permission.entity';
import { AuditLog } from './audit-log.entity';
export declare enum UserStatus {
    ACTIVE = "active",
    SUSPENDED = "suspended",
    BANNED = "banned"
}
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    status: UserStatus;
    avatar: string;
    phone: string;
    role: Role;
    roleId: string;
    manager: User;
    managerId: string;
    userPermissions: UserPermission[];
    auditLogs: AuditLog[];
    refreshToken: string | null;
    failedLoginAttempts: number;
    lockUntil: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
