import { RolePermission } from './role-permission.entity';
import { UserPermission } from './user-permission.entity';
export declare class Permission {
    id: string;
    atom: string;
    module: string;
    action: string;
    description: string;
    rolePermissions: RolePermission[];
    userPermissions: UserPermission[];
    createdAt: Date;
}
