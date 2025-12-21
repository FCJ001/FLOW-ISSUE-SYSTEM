// packages/shared/src/enums/issue.ts
export enum IssueStatus {
  DRAFT = "DRAFT", // 草稿
  SUBMITTED = "SUBMITTED", // 已提交
  APPROVED = "APPROVED", // 已通过
  REJECTED = "REJECTED", // 已驳回
  CLOSED = "CLOSED", // 已关闭
}

export enum IssueAction {
  SUBMIT = "SUBMIT",
  APPROVE = "APPROVE",
  REJECT = "REJECT",
  CLOSE = "CLOSE",
}
