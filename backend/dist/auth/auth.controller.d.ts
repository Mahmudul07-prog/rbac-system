import { Request, Response } from 'express';
import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: Request, res: Response): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            permissions: string[];
        };
    }>;
    refresh(req: Request, res: Response): Promise<Response<any, Record<string, any>> | {
        accessToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            permissions: string[];
        };
    }>;
    logout(user: any, req: Request, res: Response): Promise<{
        message: string;
    }>;
    getMe(user: any): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        roleId: string;
        status: import("../entities/user.entity").UserStatus;
        avatar: string;
        phone: string;
        managerId: string;
        permissions: string[];
        createdAt: Date;
    }>;
}
