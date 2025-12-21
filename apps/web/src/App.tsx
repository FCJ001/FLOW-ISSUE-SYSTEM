import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { IssueListPage } from "./pages/IssueListPage";
import { IssueDetailPage } from "./pages/IssueDetailPage";

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IssueListPage />} />
        <Route path="/issues/:id" element={<IssueDetailPage />} />
      </Routes>
    </Router>
  );
};
