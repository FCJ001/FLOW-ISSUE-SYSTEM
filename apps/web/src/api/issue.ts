import { Issue } from "../types/issue";

import { fetchApi } from "./fetchApi";

export const getIssue = (id: number): Promise<Issue> => {
  return fetchApi<Issue>(`http://localhost:3000/issues/${id}`);
};

export const executeIssueAction = (
  id: number,
  action: string
): Promise<Issue> => {
  return fetchApi<Issue>(`http://localhost:3000/issues/${id}/actions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
};
