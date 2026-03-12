import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, UserStatus } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { UserPermission } from '../entities/user-permission.entity';
import { AuditLog } from '../entities/audit-log.entity';


const DB_PASSWORD = '6300';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: DB_PASSWORD,
  database: 'rbac_system',
  entities: [User, Role, Permission, RolePermission, UserPermission, AuditLog],
  synchronize: true,
});

const PERMISSION_ATOMS = [
  { atom: 'dashboard:view', module: 'dashboard', action: 'view', description: 'View dashboard' },
  { atom: 'users:view', module: 'users', action: 'view', description: 'View users list' },
  { atom: 'users:create', module: 'users', action: 'create', description: 'Create new users' },
  { atom: 'users:edit', module: 'users', action: 'edit', description: 'Edit users' },
  { atom: 'users:delete', module: 'users', action: 'delete', description: 'Delete users' },
  { atom: 'permissions:view', module: 'permissions', action: 'view', description: 'View permissions' },
  { atom: 'permissions:assign', module: 'permissions', action: 'assign', description: 'Assign permissions' },
  { atom: 'leads:view', module: 'leads', action: 'view', description: 'View leads' },
  { atom: 'leads:create', module: 'leads', action: 'create', description: 'Create leads' },
  { atom: 'leads:edit', module: 'leads', action: 'edit', description: 'Edit leads' },
  { atom: 'leads:delete', module: 'leads', action: 'delete', description: 'Delete leads' },
  { atom: 'tasks:view', module: 'tasks', action: 'view', description: 'View tasks' },
  { atom: 'tasks:create', module: 'tasks', action: 'create', description: 'Create tasks' },
  { atom: 'tasks:edit', module: 'tasks', action: 'edit', description: 'Edit tasks' },
  { atom: 'tasks:delete', module: 'tasks', action: 'delete', description: 'Delete tasks' },
  { atom: 'reports:view', module: 'reports', action: 'view', description: 'View reports' },
  { atom: 'reports:export', module: 'reports', action: 'export', description: 'Export reports' },
  { atom: 'audit:view', module: 'audit', action: 'view', description: 'View audit logs' },
  { atom: 'settings:view', module: 'settings', action: 'view', description: 'View settings' },
  { atom: 'settings:edit', module: 'settings', action: 'edit', description: 'Edit settings' },
  { atom: 'portal:view', module: 'portal', action: 'view', description: 'View customer portal' },
  { atom: 'portal:tickets', module: 'portal', action: 'tickets', description: 'Access tickets' },
];

async function seed() {
  await AppDataSource.initialize();
  console.log('Connected to database');

  const roleRepo = AppDataSource.getRepository(Role);
  const permRepo = AppDataSource.getRepository(Permission);
  const rolePermRepo = AppDataSource.getRepository(RolePermission);
  const userRepo = AppDataSource.getRepository(User);

  // Create Roles
  const roles = [
    { name: 'admin', description: 'Full system access', hierarchy: 0 },
    { name: 'manager', description: 'Team management access', hierarchy: 1 },
    { name: 'agent', description: 'Operational access', hierarchy: 2 },
    { name: 'customer', description: 'Self-service portal access', hierarchy: 3 },
  ];

  const savedRoles: Record<string, Role> = {};
  for (const r of roles) {
    let role = await roleRepo.findOne({ where: { name: r.name } });
    if (!role) {
      role = await roleRepo.save(roleRepo.create(r));
    }
    savedRoles[r.name] = role;
  }
  console.log('Roles created');

  // Create Permissions
  const savedPerms: Record<string, Permission> = {};
  for (const p of PERMISSION_ATOMS) {
    let perm = await permRepo.findOne({ where: { atom: p.atom } });
    if (!perm) {
      perm = await permRepo.save(permRepo.create(p));
    }
    savedPerms[p.atom] = perm;
  }
  console.log('Permissions created');

  // Assign Permissions to Roles
  const rolePermMap: Record<string, string[]> = {
    admin: PERMISSION_ATOMS.map((p) => p.atom),
    manager: [
      'dashboard:view', 'users:view', 'users:create', 'users:edit',
      'permissions:view', 'permissions:assign',
      'leads:view', 'leads:create', 'leads:edit', 'leads:delete',
      'tasks:view', 'tasks:create', 'tasks:edit', 'tasks:delete',
      'reports:view', 'reports:export', 'audit:view', 'settings:view',
    ],
    agent: [
      'dashboard:view',
      'leads:view', 'leads:create', 'leads:edit',
      'tasks:view', 'tasks:create', 'tasks:edit',
    ],
    customer: ['portal:view', 'portal:tickets'],
  };

  for (const [roleName, atoms] of Object.entries(rolePermMap)) {
    const role = savedRoles[roleName];
    await rolePermRepo.delete({ roleId: role.id });
    for (const atom of atoms) {
      const perm = savedPerms[atom];
      if (perm) {
        await rolePermRepo.save(rolePermRepo.create({ roleId: role.id, permissionId: perm.id }));
      }
    }
  }
  console.log('Role permissions assigned');

  // Create Default Users
  const adminExists = await userRepo.findOne({ where: { email: 'admin@rbac.com' } });

  if (!adminExists) {
    const hashedPw = await bcrypt.hash('Admin@123', 12);

    const admin = await userRepo.save(userRepo.create({
      firstName: 'System', lastName: 'Admin', email: 'admin@rbac.com',
      password: hashedPw, roleId: savedRoles['admin'].id, status: UserStatus.ACTIVE,
    }));

    const manager = await userRepo.save(userRepo.create({
      firstName: 'John', lastName: 'Manager', email: 'manager@rbac.com',
      password: hashedPw, roleId: savedRoles['manager'].id, status: UserStatus.ACTIVE,
    }));

    await userRepo.save(userRepo.create({
      firstName: 'Jane', lastName: 'Agent', email: 'agent@rbac.com',
      password: hashedPw, roleId: savedRoles['agent'].id,
      managerId: manager.id, status: UserStatus.ACTIVE,
    }));

    await userRepo.save(userRepo.create({
      firstName: 'Bob', lastName: 'Customer', email: 'customer@rbac.com',
      password: hashedPw, roleId: savedRoles['customer'].id,
      managerId: manager.id, status: UserStatus.ACTIVE,
    }));

    console.log('Default users created:');
    console.log('  admin@rbac.com / Admin@123');
    console.log('  manager@rbac.com / Admin@123');
    console.log('  agent@rbac.com / Admin@123');
    console.log('  customer@rbac.com / Admin@123');
  } else {
    console.log('Users already exist, skipping');
  }

  await AppDataSource.destroy();
  console.log('Seed complete!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});