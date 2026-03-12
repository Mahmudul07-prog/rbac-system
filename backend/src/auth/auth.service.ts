import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { User, UserStatus } from '../entities/user.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { UserPermission } from '../entities/user-permission.entity';
import { RolePermission } from '../entities/role-permission.entity';

@Injectable()
export class AuthService {
  private blacklistedTokens: Set<string> = new Set();

  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,
    @InjectRepository(UserPermission)
    private userPermRepo: Repository<UserPermission>,
    @InjectRepository(RolePermission)
    private rolePermRepo: Repository<RolePermission>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { email },
      select: [
        'id', 'email', 'password', 'firstName', 'lastName',
        'status', 'roleId', 'failedLoginAttempts', 'lockUntil',
      ],
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.lockUntil && new Date() < new Date(user.lockUntil)) {
      throw new ForbiddenException('Account temporarily locked. Try again later.');
    }

    // Check account status
    if (user.status === UserStatus.BANNED) {
      throw new ForbiddenException('Account has been banned');
    }
    if (user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenException('Account is suspended');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        user.failedLoginAttempts = 0;
      }
      await this.usersRepo.save(user);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed attempts on success
    user.failedLoginAttempts = 0;
    user.lockUntil = null as any;
    await this.usersRepo.save(user);

    return user;
  }

  async login(user: User, ip?: string) {
    const permissions = await this.resolvePermissions(user.id, user.roleId);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
      permissions,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
      },
    );

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.usersRepo.update(user.id, { refreshToken: hashedRefresh });

    await this.auditRepo.save({
      action: 'auth.login',
      description: `User ${user.email} logged in`,
      performedById: user.id,
      targetUserId: user.id,
      ipAddress: ip || undefined,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
        permissions,
      },
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersRepo.findOne({
        where: { id: decoded.sub },
        select: ['id', 'email', 'firstName', 'lastName', 'refreshToken', 'status', 'roleId'],
        relations: ['role'],
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (user.status !== UserStatus.ACTIVE) {
        throw new ForbiddenException('Account is not active');
      }

      const isRefreshValid = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isRefreshValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const permissions = await this.resolvePermissions(user.id, user.roleId);

      const newAccessToken = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role.name,
        permissions,
      });

      const newRefreshToken = this.jwtService.sign(
        { sub: user.id },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      );

      const hashed = await bcrypt.hash(newRefreshToken, 10);
      await this.usersRepo.update(user.id, { refreshToken: hashed });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role.name,
          permissions,
        },
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, token: string, ip?: string) {
    this.blacklistedTokens.add(token);
    await this.usersRepo
      .createQueryBuilder()
      .update(User)
      .set({ refreshToken: null as any })
      .where('id = :id', { id: userId })
      .execute();

    await this.auditRepo.save({
      action: 'auth.logout',
      description: `User logged out`,
      performedById: userId,
      targetUserId: userId,
      ipAddress: ip || undefined,
    });
    return { message: 'Logged out successfully' };
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  async resolvePermissions(userId: string, roleId: string): Promise<string[]> {
    const rolePerms = await this.rolePermRepo.find({
      where: { roleId },
      relations: ['permission'],
    });

    const rolePermAtoms = rolePerms.map((rp) => rp.permission.atom);

    const userPerms = await this.userPermRepo.find({
      where: { userId },
      relations: ['permission'],
    });

    const permissionSet = new Set(rolePermAtoms);

    for (const up of userPerms) {
      if (up.granted) {
        permissionSet.add(up.permission.atom);
      } else {
        permissionSet.delete(up.permission.atom);
      }
    }

    return Array.from(permissionSet);
  }

  async getMe(userId: string) {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    if (!user) throw new UnauthorizedException();

    const permissions = await this.resolvePermissions(user.id, user.roleId);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role.name,
      roleId: user.roleId,
      status: user.status,
      avatar: user.avatar,
      phone: user.phone,
      managerId: user.managerId,
      permissions,
      createdAt: user.createdAt,
    };
  }
}