import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

import { RoleEntity } from '../role/role.entity';

@Entity('permissions')
export class PermissionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code!: string; // 例如：issue:approve

  @Column()
  name!: string; // 例如：审批 Issue

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles!: RoleEntity[];
}
