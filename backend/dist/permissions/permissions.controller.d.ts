import { PermissionsService } from './permissions.service';
export declare class PermissionsController {
    private permissionsService;
    constructor(permissionsService: PermissionsService);
    findAll(): Promise<import("../entities/permission.entity").Permission[]>;
    findByModule(): Promise<Record<string, import("../entities/permission.entity").Permission[]>>;
}
