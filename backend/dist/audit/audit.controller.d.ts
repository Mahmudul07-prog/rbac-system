import { AuditService } from './audit.service';
export declare class AuditController {
    private auditService;
    constructor(auditService: AuditService);
    findAll(page?: string, limit?: string): Promise<{
        data: import("../entities/audit-log.entity").AuditLog[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findByUser(id: string): Promise<import("../entities/audit-log.entity").AuditLog[]>;
}
