import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { RolePermission } from './role-permission.entity';
import { UserPermission } from './user-permission.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  atom: string; // e.g., "dashboard:view", "users:create", "leads:edit"

  @Column()
  module: string; // e.g., "dashboard", "users", "leads"

  @Column()
  action: string; // e.g., "view", "create", "edit", "delete"

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => RolePermission, (rp) => rp.permission)
  rolePermissions: RolePermission[];

  @OneToMany(() => UserPermission, (up) => up.permission)
  userPermissions: UserPermission[];

  @CreateDateColumn()
  createdAt: Date;
}