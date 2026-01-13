import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

import { UserEntity } from '../user/user.entity';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code!: string;

  @Column()
  name!: string;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users!: UserEntity[];
}
