import { DataSource } from 'typeorm';

import { RoleEntity } from '../role/role.entity';

import { PermissionEntity } from './permission.entity';

export async function assignDefaultPermissions(dataSource: DataSource) {
  const roleRepo = dataSource.getRepository(RoleEntity);
  const permRepo = dataSource.getRepository(PermissionEntity);

  const userRole = await roleRepo.findOne({
    where: { code: 'USER' },
    relations: ['permissions'],
  });

  const reviewerRole = await roleRepo.findOne({
    where: { code: 'REVIEWER' },
    relations: ['permissions'],
  });

  const adminRole = await roleRepo.findOne({
    where: { code: 'ADMIN' },
    relations: ['permissions'],
  });

  // 🔥 安全的 get 方法：找不到直接报错
  const get = async (code: string): Promise<PermissionEntity> => {
    const p = await permRepo.findOne({ where: { code } });

    if (!p) {
      throw new Error(`Permission ${code} not found`);
    }

    return p;
  };

  if (userRole) {
    userRole.permissions = [await get('issue:create'), await get('issue:view')];
    await roleRepo.save(userRole);
  }

  if (reviewerRole) {
    reviewerRole.permissions = [
      await get('issue:approve'),
      await get('issue:reject'),
      await get('issue:view'),
    ];
    await roleRepo.save(reviewerRole);
  }

  if (adminRole) {
    // 管理员拥有所有权限
    adminRole.permissions = await permRepo.find();
    await roleRepo.save(adminRole);
  }

  console.log('✅ 角色权限分配完成');
}
