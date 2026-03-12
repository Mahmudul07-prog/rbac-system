"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../entities/user.entity");
const role_entity_1 = require("../entities/role.entity");
const audit_log_entity_1 = require("../entities/audit-log.entity");
const user_permission_entity_1 = require("../entities/user-permission.entity");
const role_permission_entity_1 = require("../entities/role-permission.entity");
const permission_entity_1 = require("../entities/permission.entity");
let UsersService = class UsersService {
    constructor(usersRepo, rolesRepo, auditRepo, userPermRepo, rolePermRepo, permRepo) {
        this.usersRepo = usersRepo;
        this.rolesRepo = rolesRepo;
        this.auditRepo = auditRepo;
        this.userPermRepo = userPermRepo;
        this.rolePermRepo = rolePermRepo;
        this.permRepo = permRepo;
    }
    async findAll(currentUser) {
        const query = this.usersRepo
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'role')
            .leftJoinAndSelect('user.manager', 'manager')
            .select([
            'user.id', 'user.firstName', 'user.lastName', 'user.email',
            'user.status', 'user.phone', 'user.avatar', 'user.createdAt',
            'user.updatedAt', 'user.managerId',
            'role.id', 'role.name',
            'manager.id', 'manager.firstName', 'manager.lastName',
        ]);
        if (currentUser.role === 'manager') {
            query.where('(user.managerId = :managerId OR user.id = :userId)', { managerId: currentUser.sub, userId: currentUser.sub });
        }
        return query.getMany();
    }
    async findOne(id) {
        const user = await this.usersRepo.findOne({
            where: { id },
            relations: ['role', 'manager'],
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async create(dto, performedBy) {
        const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
        if (existing)
            throw new common_1.BadRequestException('Email already in use');
        const role = await this.rolesRepo.findOne({ where: { id: dto.roleId } });
        if (!role)
            throw new common_1.BadRequestException('Invalid role');
        if (performedBy.role === 'manager') {
            if (role.name === 'admin' || role.name === 'manager') {
                throw new common_1.ForbiddenException('Managers cannot create admin or manager accounts');
            }
            dto.managerId = performedBy.sub;
        }
        const hashedPassword = await bcrypt.hash(dto.password, 12);
        const user = this.usersRepo.create({
            ...dto,
            password: hashedPassword,
        });
        const saved = await this.usersRepo.save(user);
        await this.auditRepo.save({
            action: 'user.created',
            description: `Created user ${dto.email} with role ${role.name}`,
            performedById: performedBy.sub,
            targetUserId: saved.id,
            metadata: { roleId: dto.roleId, roleName: role.name },
        });
        return this.findOne(saved.id);
    }
    async update(id, dto, performedBy) {
        const user = await this.findOne(id);
        if (performedBy.role === 'manager') {
            if (user.managerId !== performedBy.sub && user.id !== performedBy.sub) {
                throw new common_1.ForbiddenException('You can only manage your own team');
            }
        }
        if (dto.password) {
            dto.password = await bcrypt.hash(dto.password, 12);
        }
        await this.usersRepo.update(id, dto);
        await this.auditRepo.save({
            action: 'user.updated',
            description: `Updated user ${user.email}`,
            performedById: performedBy.sub,
            targetUserId: id,
            metadata: { changes: Object.keys(dto) },
        });
        return this.findOne(id);
    }
    async updateStatus(id, status, performedBy) {
        const user = await this.findOne(id);
        if (performedBy.role === 'manager') {
            if (user.managerId !== performedBy.sub) {
                throw new common_1.ForbiddenException('You can only manage your own team');
            }
            if (user.role.name === 'admin' || user.role.name === 'manager') {
                throw new common_1.ForbiddenException('Cannot change status of admin or manager');
            }
        }
        await this.usersRepo.update(id, { status });
        await this.auditRepo.save({
            action: `user.${status}`,
            description: `Set user ${user.email} status to ${status}`,
            performedById: performedBy.sub,
            targetUserId: id,
            metadata: { previousStatus: user.status, newStatus: status },
        });
        return this.findOne(id);
    }
    async delete(id, performedBy) {
        const user = await this.findOne(id);
        if (user.role.name === 'admin') {
            throw new common_1.ForbiddenException('Cannot delete admin accounts');
        }
        await this.auditRepo.save({
            action: 'user.deleted',
            description: `Deleted user ${user.email}`,
            performedById: performedBy.sub,
            targetUserId: id,
        });
        await this.usersRepo.remove(user);
        return { message: 'User deleted' };
    }
    async getUserPermissions(userId) {
        const user = await this.findOne(userId);
        const rolePerms = await this.rolePermRepo.find({
            where: { roleId: user.roleId },
            relations: ['permission'],
        });
        const userPerms = await this.userPermRepo.find({
            where: { userId },
            relations: ['permission', 'grantedBy'],
        });
        const allPerms = await this.permRepo.find();
        return {
            rolePermissions: rolePerms.map((rp) => rp.permission),
            userOverrides: userPerms.map((up) => ({
                permission: up.permission,
                granted: up.granted,
                grantedBy: up.grantedBy
                    ? { id: up.grantedBy.id, firstName: up.grantedBy.firstName, lastName: up.grantedBy.lastName }
                    : null,
                grantedAt: up.grantedAt,
            })),
            resolved: this.resolvePermissionSet(rolePerms, userPerms),
            allPermissions: allPerms,
        };
    }
    async setUserPermissions(targetUserId, permissionAtoms, performedBy) {
        const targetUser = await this.findOne(targetUserId);
        const granterPermissions = performedBy.permissions || [];
        for (const perm of permissionAtoms) {
            if (perm.granted && !granterPermissions.includes(perm.atom)) {
                throw new common_1.ForbiddenException(`Cannot grant permission "${perm.atom}" — you don't hold it yourself`);
            }
        }
        await this.userPermRepo.delete({ userId: targetUserId });
        for (const perm of permissionAtoms) {
            const permission = await this.permRepo.findOne({ where: { atom: perm.atom } });
            if (!permission)
                continue;
            await this.userPermRepo.save({
                userId: targetUserId,
                permissionId: permission.id,
                granted: perm.granted,
                grantedById: performedBy.sub,
            });
        }
        await this.auditRepo.save({
            action: 'permissions.updated',
            description: `Updated permissions for ${targetUser.email}`,
            performedById: performedBy.sub,
            targetUserId,
            metadata: { permissions: permissionAtoms },
        });
        return this.getUserPermissions(targetUserId);
    }
    resolvePermissionSet(rolePerms, userPerms) {
        const permSet = new Set(rolePerms.map((rp) => rp.permission.atom));
        for (const up of userPerms) {
            if (up.granted) {
                permSet.add(up.permission.atom);
            }
            else {
                permSet.delete(up.permission.atom);
            }
        }
        return Array.from(permSet);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(2, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __param(3, (0, typeorm_1.InjectRepository)(user_permission_entity_1.UserPermission)),
    __param(4, (0, typeorm_1.InjectRepository)(role_permission_entity_1.RolePermission)),
    __param(5, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map