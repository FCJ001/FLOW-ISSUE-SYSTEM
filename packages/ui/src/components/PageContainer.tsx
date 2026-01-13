import { Card } from 'antd';
import type { CardProps } from 'antd';
import type { ReactNode } from 'react';

interface PageContainerProps {
  title?: CardProps['title'];
  children: ReactNode;
}

export function PageContainer({ title, children }: PageContainerProps) {
  return (
    <Card title={title as CardProps['title']} style={{ minHeight: '100%' }}>
      {children}
    </Card>
  );
}
