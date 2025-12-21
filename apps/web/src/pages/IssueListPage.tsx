import React, { useEffect, useState } from "react";
import { Issue } from "../types/issue";
import { IssueList } from "../components/IssueList";
import { getIssue, executeIssueAction } from "../api/issue";

export const IssueListPage: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        [1, 2, 3].map((id) => getIssue(id).catch(() => null))
      );
      setIssues(results.filter((i): i is Issue => i !== null));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleActionClick = async (id: number, action: string) => {
    try {
      await executeIssueAction(id, action);
      await fetchIssues(); // 操作后刷新数据
    } catch (err) {
      alert(`Action failed: ${err}`);
    }
  };

  if (loading) return <div>Loading issues...</div>;

  return (
    <div>
      <h1>Issue List</h1>
      <IssueList issues={issues} onActionClick={handleActionClick} />
    </div>
  );
};
