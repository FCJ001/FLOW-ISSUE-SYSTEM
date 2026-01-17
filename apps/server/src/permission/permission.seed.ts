import { DataSource } from 'typeorm';

import { PermissionEntity } from './permission.entity';

export async function seedPermissions(dataSource: DataSource) {
  const repo = dataSource.getRepository(PermissionEntity);

  const permissions = [
    { code: 'issue:create', name: '创建 Issue' },
    { code: 'issue:view', name: '查看 Issue' },
    { code: 'issue:approve', name: '审批 Issue' },
    { code: 'issue:reject', name: '驳回 Issue' },
    { code: 'issue:close', name: '关闭 Issue' },
    { code: 'user:manage', name: '用户管理' },
  ];

  for (const p of permissions) {
    const exist = await repo.findOne({ where: { code: p.code } });

    if (!exist) {
      await repo.save(repo.create(p));
    }
  }

  console.log('✅ 初始化权限完成');
}
