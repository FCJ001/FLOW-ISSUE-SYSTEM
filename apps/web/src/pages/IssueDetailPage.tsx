import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Issue, IssueAction } from "../types/issue";
import { fetchApi } from "../api/fetchApi";

export const IssueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadIssue = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await fetchApi<Issue>(`http://localhost:3000/issues/${id}`);
      setIssue(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssue();
  }, [id]);

  const handleAction = async (action: IssueAction) => {
    if (!id) return;
    try {
      await fetchApi<Issue>(`http://localhost:3000/issues/${id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      loadIssue(); // 执行动作后刷新
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!issue) return <div>Issue not found</div>;

  return (
    <div>
      <h1>{issue.title}</h1>
      <p>Status: {issue.status}</p>
      <div>
        {issue.actions.map((action) => (
          <button
            key={action}
            onClick={() => handleAction(action)}
            style={{ marginRight: 10 }}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
};
