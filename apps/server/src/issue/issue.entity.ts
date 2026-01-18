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
  id!: number;

  // ===== 基础信息 =====
  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ length: 20 })
  type!: string;

  @Column({ length: 50, nullable: true })
  module?: string;

  @Column({ length: 20, nullable: true })
  source?: string;

  @Column({ length: 10 })
  priority!: string;

  @Column({ length: 10, nullable: true })
  severity?: string;

  @Column('simple-array', { nullable: true })
  tags?: string[];

  // ===== 人员 =====
  @Column()
  creatorId!: number;

  @Column({ nullable: true })
  assigneeId?: number;

  @Column({ nullable: true })
  reviewerId?: number;

  @Column('simple-array', { nullable: true })
  ccUsers?: number[];

  // ===== 时间 =====
  @Column({ type: 'timestamp', nullable: true })
  deadline?: Date;

  @Column({ type: 'timestamp', nullable: true })
  expectTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  submitTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  approveTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  resolveTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  closeTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  reopenTime?: Date;

  // ===== 状态与流程 =====
  @Column({ length: 20, default: 'DRAFT' })
  status!: IssueStatus;

  @Column({ length: 20, nullable: true })
  stage?: string;

  @Column({ nullable: true })
  processInstanceId?: string;

  @Column({ length: 20, nullable: true })
  lastAction?: string;

  // ===== SLA =====
  @Column({ length: 10, nullable: true })
  slaLevel?: string;

  @Column({ type: 'int', nullable: true })
  responseTime?: number;

  @Column({ type: 'int', nullable: true })
  handleTime?: number;

  @Column({ default: false })
  overdue!: boolean;

  // ===== 业务 =====
  @Column({ length: 50, nullable: true })
  department?: string;

  @Column({ length: 50, nullable: true })
  project?: string;

  @Column({ length: 20, nullable: true })
  version?: string;

  @Column({ length: 20, nullable: true })
  env?: string;

  // ===== 系统 =====
  @Column({ default: false })
  isDeleted!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
