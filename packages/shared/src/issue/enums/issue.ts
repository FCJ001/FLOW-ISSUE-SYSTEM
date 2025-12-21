// packages/shared/src/enums/issue.ts
export enum IssueStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CLOSED = "CLOSED",
}

export enum IssueAction {
  SUBMIT = "SUBMIT",
  APPROVE = "APPROVE",
  REJECT = "REJECT",
  REPROCESS = "REPROCESS",
  CLOSE = "CLOSE",
}
