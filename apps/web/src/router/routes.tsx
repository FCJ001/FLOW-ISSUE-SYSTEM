import { RouteObject } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home/index";
import IssueListPage from "@/pages/issue/IssueListPage";
import IssueDetailPage from "@/pages/issue/IssueDetailPage";
import NotFound from "@/pages/NotFound";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "issues",
        element: <IssueListPage />,
      },
      {
        path: "issues/:id",
        element: <IssueDetailPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
