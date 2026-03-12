import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
    @InjectRepository(RolePermission) private rolePermRepo: Repository<RolePermission>,
    @InjectRepository(Permission) private permRepo: Repository<Permission>,
  ) {}

  async findAll() {
    return this.rolesRepo.find({ order: { hierarchy: 'ASC' } });
  }

  async findOne(id: string) {
    const role = await this.rolesRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async getRolePermissions(roleId: string) {
    const perms = await this.rolePermRepo.find({
      where: { roleId },
      relations: ['permission'],
    });
    return perms.map((rp) => rp.permission);
  }

  async setRolePermissions(roleId: string, permissionIds: string[]) {
    await this.rolePermRepo.delete({ roleId });

    const entries = permissionIds.map((permissionId) =>
      this.rolePermRepo.create({ roleId, permissionId }),
    );

    return this.rolePermRepo.save(entries);
  }
}