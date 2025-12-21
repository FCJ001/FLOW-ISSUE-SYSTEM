import React, { useEffect, useState } from "react";
import { fetchApi } from "../api/fetchApi";

interface Issue {
  id: number;
  title: string;
  status: string;
  actions: string[];
}

interface IssueActionDto {
  action: string;
}

interface Props {
  id: number;
}

export default function IssueDetail({ id }: Props) {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchApi<Issue>(`http://localhost:3000/issues/${id}`)
      .then(setIssue)
      .catch((err) => setError(err.message));
  }, [id]);

  const handleAction = async (action: string) => {
    try {
      const updated = await fetchApi<Issue>(
        `http://localhost:3000/issues/${id}/actions`,
        {
          method: "POST",
          body: JSON.stringify({ action } as IssueActionDto),
        }
      );
      setIssue(updated);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!issue) return <div>Loading...</div>;

  return (
    <div>
      <h1>{issue.title}</h1>
      <p>Status: {issue.status}</p>
      <div>
        {issue.actions.map((a) => (
          <button key={a} onClick={() => handleAction(a)} className="mr-2">
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}
