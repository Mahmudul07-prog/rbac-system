import { RolesService } from './roles.service';
export declare class RolesController {
    private rolesService;
    constructor(rolesService: RolesService);
    findAll(): Promise<import("../entities/role.entity").Role[]>;
    findOne(id: string): Promise<import("../entities/role.entity").Role>;
    getRolePermissions(id: string): Promise<import("../entities/permission.entity").Permission[]>;
    setRolePermissions(id: string, permissionIds: string[]): Promise<import("../entities/role-permission.entity").RolePermission[]>;
}
