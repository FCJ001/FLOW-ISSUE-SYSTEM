import React from "react";
import { IssueCard } from "./components/IssueCard";

export const App: React.FC = () => {
  return (
    <div style={{ padding: 32 }}>
      <h1>问题管理平台</h1>
      <IssueCard issueId={1} />
    </div>
  );
};
