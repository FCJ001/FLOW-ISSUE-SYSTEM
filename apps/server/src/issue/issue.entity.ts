import { IssueStatus } from '@flow/shared';

export interface Issue {
  id: number;
  title: string;
  status: IssueStatus;
}
