import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog) private auditRepo: Repository<AuditLog>,
  ) {}

  async findAll(page = 1, limit = 50) {
    const [data, total] = await this.auditRepo.findAndCount({
      relations: ['performedBy'],
      order: { timestamp: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
      select: {
        performedBy: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByUser(userId: string) {
    return this.auditRepo.find({
      where: [
        { performedById: userId },
        { targetUserId: userId },
      ],
      order: { timestamp: 'DESC' },
      take: 100,
    });
  }
}