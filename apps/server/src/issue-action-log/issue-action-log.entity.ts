import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IssueAction, IssueStatus } from '@flow/shared';

import { IssueEntity } from '../issue/issue.entity';

@Entity('issue_action_logs')
export class IssueActionLogEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => IssueEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'issueId' })
  issue!: IssueEntity;

  @Column()
  issueId!: number;

  @Column({
    type: 'enum',
    enum: IssueAction,
  })
  action!: IssueAction;

  @Column({
    type: 'enum',
    enum: IssueStatus,
  })
  fromStatus!: IssueStatus;

  @Column({
    type: 'enum',
    enum: IssueStatus,
  })
  toStatus!: IssueStatus;

  @Column({ type: 'varchar', length: 100, nullable: true })
  operator?: string; // 暂时用 string，后面换 userId

  @CreateDateColumn()
  createdAt!: Date;
}
