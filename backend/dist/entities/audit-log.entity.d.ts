import { User } from './user.entity';
export declare class AuditLog {
    id: string;
    action: string;
    description: string;
    metadata: Record<string, any>;
    performedBy: User;
    performedById: string;
    targetUserId: string;
    ipAddress: string;
    timestamp: Date;
}
