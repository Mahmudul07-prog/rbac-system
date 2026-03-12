import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
export declare class PermissionsService {
    private permRepo;
    constructor(permRepo: Repository<Permission>);
    findAll(): Promise<Permission[]>;
    findByModule(): Promise<Record<string, Permission[]>>;
}
