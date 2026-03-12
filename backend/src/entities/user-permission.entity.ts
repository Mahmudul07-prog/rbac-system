import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Permission } from './permission.entity';

@Entity('user_permissions')
@Unique(['userId', 'permissionId'])
export class UserPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userPermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Permission, (p) => p.userPermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;

  @Column()
  permissionId: string;

  @Column({ default: true })
  granted: boolean; // true = granted, false = explicitly denied

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'grantedById' })
  grantedBy: User;

  @Column({ nullable: true })
  grantedById: string;

  @CreateDateColumn()
  grantedAt: Date;
}