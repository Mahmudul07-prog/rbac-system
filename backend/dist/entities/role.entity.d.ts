import { User } from './user.entity';
import { RolePermission } from './role-permission.entity';
export declare class Role {
    id: string;
    name: string;
    description: string;
    hierarchy: number;
    users: User[];
    rolePermissions: RolePermission[];
    createdAt: Date;
    updatedAt: Date;
}
