import axios from "axios";
import { IssueAction, IssueStatus } from "@flow/shared";

const api = axios.create({ baseURL: "http://localhost:3000" });

export interface Issue {
  id: number;
  title: string;
  status: IssueStatus;
  actions: IssueAction[];
}

export async function getIssue(id: number): Promise<Issue> {
  const res = await api.get(`/issues/${id}`);
  return res.data;
}

export async function executeAction(
  id: number,
  action: IssueAction
): Promise<Issue> {
  const res = await api.post(`/issues/${id}/actions`, { action });
  return res.data;
}
