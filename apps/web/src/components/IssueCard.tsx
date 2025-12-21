import React, { useEffect, useState } from "react";
import { Issue, getIssue, executeAction } from "../api/issue";
import { IssueAction, canExecute } from "@flow/shared";

interface Props {
  issueId: number;
}

export const IssueCard: React.FC<Props> = ({ issueId }) => {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchIssue();
  }, [issueId]);

  async function fetchIssue() {
    const data = await getIssue(issueId);
    setIssue(data);
  }

  async function handleAction(action: IssueAction) {
    if (!issue) return;
    if (!canExecute(issue.status, action)) {
      alert(`Action "${action}" not allowed`);
      return;
    }
    setLoading(true);
    try {
      const updated = await executeAction(issue.id, action);
      setIssue(updated);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!issue) return <div>Loading...</div>;

  return (
    <div style={{ border: "1px solid #ddd", padding: 16, marginBottom: 16 }}>
      <h3>
        {issue.title} [{issue.status}]
      </h3>
      <div>
        {issue.actions.map((action) => (
          <button
            key={action}
            onClick={() => handleAction(action)}
            disabled={loading || !canExecute(issue.status, action)}
            style={{ marginRight: 8 }}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
};
