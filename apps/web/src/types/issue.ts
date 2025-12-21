export type IssueStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "CLOSED";

export type IssueAction = "SUBMIT" | "APPROVE" | "REJECT" | "CLOSE";

export interface Issue {
  id: number;
  title: string;
  status: IssueStatus;
  actions: IssueAction[];
}
