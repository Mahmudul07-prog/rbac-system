import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission) private permRepo: Repository<Permission>,
  ) {}

  async findAll() {
    return this.permRepo.find({ order: { module: 'ASC', action: 'ASC' } });
  }

  async findByModule() {
    const perms = await this.permRepo.find({ order: { module: 'ASC', action: 'ASC' } });

    const grouped: Record<string, Permission[]> = {};
    for (const p of perms) {
      if (!grouped[p.module]) grouped[p.module] = [];
      grouped[p.module].push(p);
    }

    return grouped;
  }
}