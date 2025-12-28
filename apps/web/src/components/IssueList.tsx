import React from "react";

import { Issue } from "../types/issue";

interface IssueListProps {
  issues: Issue[];
  onActionClick: (issueId: number, action: string) => void;
}

export const IssueList: React.FC<IssueListProps> = ({
  issues,
  onActionClick,
}) => {
  if (!issues || issues.length === 0) return <div>No issues found</div>;

  return (
    <ul>
      {issues.map((issue) => (
        <li
          key={issue.id}
          style={{ marginBottom: 16, border: "1px solid #ccc", padding: 8 }}
        >
          <h3>{issue.title}</h3>
          <p>Status: {issue.status}</p>
          {issue.actions.map((action) => (
            <button
              key={action}
              onClick={() => onActionClick(issue.id, action)}
              style={{ marginRight: 8 }}
            >
              {action}
            </button>
          ))}
        </li>
      ))}
    </ul>
  );
};
