import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User, UserStatus } from '../entities/user.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { UserPermission } from '../entities/user-permission.entity';
import { RolePermission } from '../entities/role-permission.entity';
export declare class AuthService {
    private usersRepo;
    private auditRepo;
    private userPermRepo;
    private rolePermRepo;
    private jwtService;
    private configService;
    private blacklistedTokens;
    constructor(usersRepo: Repository<User>, auditRepo: Repository<AuditLog>, userPermRepo: Repository<UserPermission>, rolePermRepo: Repository<RolePermission>, jwtService: JwtService, configService: ConfigService);
    validateUser(email: string, password: string): Promise<User>;
    login(user: User, ip?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            permissions: string[];
        };
    }>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            permissions: string[];
        };
    }>;
    logout(userId: string, token: string, ip?: string): Promise<{
        message: string;
    }>;
    isTokenBlacklisted(token: string): boolean;
    resolvePermissions(userId: string, roleId: string): Promise<string[]>;
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        roleId: string;
        status: UserStatus;
        avatar: string;
        phone: string;
        managerId: string;
        permissions: string[];
        createdAt: Date;
    }>;
}
