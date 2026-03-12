import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
export declare class AuditService {
    private auditRepo;
    constructor(auditRepo: Repository<AuditLog>);
    findAll(page?: number, limit?: number): Promise<{
        data: AuditLog[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findByUser(userId: string): Promise<AuditLog[]>;
}
