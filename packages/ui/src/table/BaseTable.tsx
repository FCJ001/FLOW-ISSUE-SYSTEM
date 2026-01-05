import React from 'react';
import { Table, Empty } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';

import { BaseColumn } from './types';

export interface BaseTableProps<T> {
  data: T[];
  columns: BaseColumn<T>[];
  rowKey: (record: T) => React.Key;
  loading?: boolean;

  /** 分页 */
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };

  emptyText?: string;
}

export function BaseTable<T>(props: BaseTableProps<T>) {
  const { data, columns, rowKey, loading = false, pagination, emptyText = '暂无数据' } = props;

  const antdColumns = columns.map((col) => ({
    key: col.key,
    title: col.title,
    dataIndex: col.dataIndex as string | undefined,
    width: col.width,
    render: col.render,
  }));

  const paginationConfig: TablePaginationConfig | false = pagination
    ? {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        onChange: pagination.onChange,
        showSizeChanger: false,
      }
    : false;

  return (
    <Table
      rowKey={rowKey}
      loading={loading}
      dataSource={data}
      columns={antdColumns}
      pagination={paginationConfig}
      locale={{
        emptyText: <Empty description={emptyText} />,
      }}
    />
  );
}
