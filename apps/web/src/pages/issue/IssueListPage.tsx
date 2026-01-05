import { BaseTable, BaseColumn } from '@flow/ui';

interface Issue {
  id: number;
  title: string;
  status: string;
}

const columns: BaseColumn<Issue>[] = [
  {
    key: 'title',
    title: '标题',
    dataIndex: 'title',
  },
  {
    key: 'status',
    title: '状态',
    render: (_, record) => (
      <span style={{ color: record.status === 'open' ? 'green' : 'gray' }}>{record.status}</span>
    ),
  },
];

export default function IssueTable() {
  return (
    <BaseTable<Issue>
      rowKey={(row) => row.id}
      columns={columns}
      data={[
        { id: 1, title: '登录失败', status: 'open' },
        { id: 2, title: '权限异常', status: 'closed' },
      ]}
      pagination={{
        current: 1,
        pageSize: 10,
        total: 2,
        onChange: (page) => console.log(page),
      }}
    />
  );
}
