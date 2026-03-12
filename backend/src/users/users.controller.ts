import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from '../entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @RequirePermissions('users:view')
  findAll(@CurrentUser() user: any) {
    return this.usersService.findAll(user);
  }

  @Get(':id')
  @RequirePermissions('users:view')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @RequirePermissions('users:create')
  create(@Body() dto: CreateUserDto, @CurrentUser() user: any) {
    return this.usersService.create(dto, user);
  }

  @Put(':id')
  @RequirePermissions('users:edit')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: any,
  ) {
    return this.usersService.update(id, dto, user);
  }

  @Patch(':id/status')
  @RequirePermissions('users:edit')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: UserStatus,
    @CurrentUser() user: any,
  ) {
    return this.usersService.updateStatus(id, status, user);
  }

  @Delete(':id')
  @RequirePermissions('users:delete')
  delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.usersService.delete(id, user);
  }

  // Permission management endpoints
  @Get(':id/permissions')
  @RequirePermissions('users:view')
  getUserPermissions(@Param('id') id: string) {
    return this.usersService.getUserPermissions(id);
  }

  @Put(':id/permissions')
  @RequirePermissions('permissions:assign')
  setUserPermissions(
    @Param('id') id: string,
    @Body('permissions') permissions: { atom: string; granted: boolean }[],
    @CurrentUser() user: any,
  ) {
    return this.usersService.setUserPermissions(id, permissions, user);
  }
}