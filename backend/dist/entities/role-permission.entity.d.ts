import { Role } from './role.entity';
import { Permission } from './permission.entity';
export declare class RolePermission {
    id: string;
    role: Role;
    roleId: string;
    permission: Permission;
    permissionId: string;
}
