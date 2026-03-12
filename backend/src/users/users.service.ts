import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, UserStatus } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { UserPermission } from '../entities/user-permission.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { Permission } from '../entities/permission.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
    @InjectRepository(AuditLog) private auditRepo: Repository<AuditLog>,
    @InjectRepository(UserPermission) private userPermRepo: Repository<UserPermission>,
    @InjectRepository(RolePermission) private rolePermRepo: Repository<RolePermission>,
    @InjectRepository(Permission) private permRepo: Repository<Permission>,
  ) {}

  async findAll(currentUser: any) {
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

    // If the current user is a manager, only show their managed users
    if (currentUser.role === 'manager') {
      query.where(
        '(user.managerId = :managerId OR user.id = :userId)',
        { managerId: currentUser.sub, userId: currentUser.sub },
      );
    }

    return query.getMany();
  }

  async findOne(id: string) {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: ['role', 'manager'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto, performedBy: any) {
    // Check if email already exists
    const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already in use');

    // Validate the role exists
    const role = await this.rolesRepo.findOne({ where: { id: dto.roleId } });
    if (!role) throw new BadRequestException('Invalid role');

    // Managers can only create agents and customers
    if (performedBy.role === 'manager') {
      if (role.name === 'admin' || role.name === 'manager') {
        throw new ForbiddenException('Managers cannot create admin or manager accounts');
      }
      dto.managerId = performedBy.sub;
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = this.usersRepo.create({
      ...dto,
      password: hashedPassword,
    });

    const saved = await this.usersRepo.save(user);

    // Audit
    await this.auditRepo.save({
      action: 'user.created',
      description: `Created user ${dto.email} with role ${role.name}`,
      performedById: performedBy.sub,
      targetUserId: saved.id,
      metadata: { roleId: dto.roleId, roleName: role.name },
    });

    return this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateUserDto, performedBy: any) {
    const user = await this.findOne(id);

    // Managers can only update their own agents/customers
    if (performedBy.role === 'manager') {
      if (user.managerId !== performedBy.sub && user.id !== performedBy.sub) {
        throw new ForbiddenException('You can only manage your own team');
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

  async updateStatus(id: string, status: UserStatus, performedBy: any) {
    const user = await this.findOne(id);

    if (performedBy.role === 'manager') {
      if (user.managerId !== performedBy.sub) {
        throw new ForbiddenException('You can only manage your own team');
      }
      if (user.role.name === 'admin' || user.role.name === 'manager') {
        throw new ForbiddenException('Cannot change status of admin or manager');
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

  async delete(id: string, performedBy: any) {
    const user = await this.findOne(id);

    if (user.role.name === 'admin') {
      throw new ForbiddenException('Cannot delete admin accounts');
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

  // ─── Permission Management ───────────────────────────

  async getUserPermissions(userId: string) {
    const user = await this.findOne(userId);

    // Get role permissions
    const rolePerms = await this.rolePermRepo.find({
      where: { roleId: user.roleId },
      relations: ['permission'],
    });

    // Get user-specific overrides
    const userPerms = await this.userPermRepo.find({
      where: { userId },
      relations: ['permission', 'grantedBy'],
    });

    // Get all permissions for reference
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

  async setUserPermissions(
    targetUserId: string,
    permissionAtoms: { atom: string; granted: boolean }[],
    performedBy: any,
  ) {
    const targetUser = await this.findOne(targetUserId);

    // Grant ceiling check: the granter must hold each permission they're giving
    const granterPermissions: string[] = performedBy.permissions || [];

    for (const perm of permissionAtoms) {
      if (perm.granted && !granterPermissions.includes(perm.atom)) {
        throw new ForbiddenException(
          `Cannot grant permission "${perm.atom}" — you don't hold it yourself`,
        );
      }
    }

    // Remove existing user-level overrides
    await this.userPermRepo.delete({ userId: targetUserId });

    // Insert new overrides
    for (const perm of permissionAtoms) {
      const permission = await this.permRepo.findOne({ where: { atom: perm.atom } });
      if (!permission) continue;

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

  private resolvePermissionSet(
    rolePerms: any[],
    userPerms: any[],
  ): string[] {
    const permSet = new Set(rolePerms.map((rp) => rp.permission.atom));

    for (const up of userPerms) {
      if (up.granted) {
        permSet.add(up.permission.atom);
      } else {
        permSet.delete(up.permission.atom);
      }
    }

    return Array.from(permSet);
  }
}