// packages/ui/src/components/PageContainer.tsx
import { Card } from "antd";
import type { ReactNode } from "react";

interface PageContainerProps {
  title?: string;
  children: ReactNode;
}

export function PageContainer(props: PageContainerProps) {
  const { title, children } = props;

  return (
    <Card title={title} style={{ minHeight: "100%" }}>
      {children}
    </Card>
  );
}
