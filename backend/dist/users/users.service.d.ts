import { Repository } from 'typeorm';
import { User, UserStatus } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { UserPermission } from '../entities/user-permission.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { Permission } from '../entities/permission.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private usersRepo;
    private rolesRepo;
    private auditRepo;
    private userPermRepo;
    private rolePermRepo;
    private permRepo;
    constructor(usersRepo: Repository<User>, rolesRepo: Repository<Role>, auditRepo: Repository<AuditLog>, userPermRepo: Repository<UserPermission>, rolePermRepo: Repository<RolePermission>, permRepo: Repository<Permission>);
    findAll(currentUser: any): Promise<User[]>;
    findOne(id: string): Promise<User>;
    create(dto: CreateUserDto, performedBy: any): Promise<User>;
    update(id: string, dto: UpdateUserDto, performedBy: any): Promise<User>;
    updateStatus(id: string, status: UserStatus, performedBy: any): Promise<User>;
    delete(id: string, performedBy: any): Promise<{
        message: string;
    }>;
    getUserPermissions(userId: string): Promise<{
        rolePermissions: Permission[];
        userOverrides: {
            permission: Permission;
            granted: boolean;
            grantedBy: {
                id: string;
                firstName: string;
                lastName: string;
            };
            grantedAt: Date;
        }[];
        resolved: string[];
        allPermissions: Permission[];
    }>;
    setUserPermissions(targetUserId: string, permissionAtoms: {
        atom: string;
        granted: boolean;
    }[], performedBy: any): Promise<{
        rolePermissions: Permission[];
        userOverrides: {
            permission: Permission;
            granted: boolean;
            grantedBy: {
                id: string;
                firstName: string;
                lastName: string;
            };
            grantedAt: Date;
        }[];
        resolved: string[];
        allPermissions: Permission[];
    }>;
    private resolvePermissionSet;
}
