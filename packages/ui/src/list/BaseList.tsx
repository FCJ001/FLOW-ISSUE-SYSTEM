import React from 'react';
import { List, Spin, Empty } from 'antd';

export interface BaseListProps<T> {
  data: T[];
  loading?: boolean;
  rowKey: (item: T) => React.Key;
  renderItem: (item: T) => React.ReactNode;
  emptyText?: string;
}

export function BaseList<T>(props: BaseListProps<T>) {
  const { data, loading = false, rowKey, renderItem, emptyText = '暂无数据' } = props;

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <Empty description={emptyText} />;
  }

  return (
    <List
      dataSource={data}
      renderItem={(item) => <List.Item key={rowKey(item)}>{renderItem(item)}</List.Item>}
    />
  );
}
