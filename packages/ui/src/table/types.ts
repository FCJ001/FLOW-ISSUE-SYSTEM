// packages/ui/src/table/types.ts
import React from 'react';

export interface BaseColumn<T> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  width?: number;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}
