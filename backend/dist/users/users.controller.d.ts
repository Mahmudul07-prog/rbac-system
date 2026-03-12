import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from '../entities/user.entity';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(user: any): Promise<import("../entities/user.entity").User[]>;
    findOne(id: string): Promise<import("../entities/user.entity").User>;
    create(dto: CreateUserDto, user: any): Promise<import("../entities/user.entity").User>;
    update(id: string, dto: UpdateUserDto, user: any): Promise<import("../entities/user.entity").User>;
    updateStatus(id: string, status: UserStatus, user: any): Promise<import("../entities/user.entity").User>;
    delete(id: string, user: any): Promise<{
        message: string;
    }>;
    getUserPermissions(id: string): Promise<{
        rolePermissions: import("../entities/permission.entity").Permission[];
        userOverrides: {
            permission: import("../entities/permission.entity").Permission;
            granted: boolean;
            grantedBy: {
                id: string;
                firstName: string;
                lastName: string;
            };
            grantedAt: Date;
        }[];
        resolved: string[];
        allPermissions: import("../entities/permission.entity").Permission[];
    }>;
    setUserPermissions(id: string, permissions: {
        atom: string;
        granted: boolean;
    }[], user: any): Promise<{
        rolePermissions: import("../entities/permission.entity").Permission[];
        userOverrides: {
            permission: import("../entities/permission.entity").Permission;
            granted: boolean;
            grantedBy: {
                id: string;
                firstName: string;
                lastName: string;
            };
            grantedAt: Date;
        }[];
        resolved: string[];
        allPermissions: import("../entities/permission.entity").Permission[];
    }>;
}
