import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IssueStatus } from '@flow/shared';

@Entity('issues')
export class IssueEntity {
  @PrimaryGeneratedColumn()
  id!: number; // ❗非空断言

  @Column({ length: 100 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string; // 可选字段不用 !

  @Column({
    type: 'enum',
    enum: IssueStatus,
    default: IssueStatus.DRAFT,
  })
  status!: IssueStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
