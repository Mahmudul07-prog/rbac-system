import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { Permission } from '../entities/permission.entity';
export declare class RolesService {
    private rolesRepo;
    private rolePermRepo;
    private permRepo;
    constructor(rolesRepo: Repository<Role>, rolePermRepo: Repository<RolePermission>, permRepo: Repository<Permission>);
    findAll(): Promise<Role[]>;
    findOne(id: string): Promise<Role>;
    getRolePermissions(roleId: string): Promise<Permission[]>;
    setRolePermissions(roleId: string, permissionIds: string[]): Promise<RolePermission[]>;
}
