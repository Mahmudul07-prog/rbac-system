import { User } from './user.entity';
import { Permission } from './permission.entity';
export declare class UserPermission {
    id: string;
    user: User;
    userId: string;
    permission: Permission;
    permissionId: string;
    granted: boolean;
    grantedBy: User;
    grantedById: string;
    grantedAt: Date;
}
