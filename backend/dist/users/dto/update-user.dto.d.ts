import { UserStatus } from '../../entities/user.entity';
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    roleId?: string;
    managerId?: string;
    status?: UserStatus;
    phone?: string;
    avatar?: string;
}
