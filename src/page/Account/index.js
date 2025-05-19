import React, { useEffect, useState } from 'react';
import { Table, Typography, Spin, Progress, Tag } from 'antd';

const { Title } = Typography;

const AccountPage = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);

  useEffect(() => {
    // demo data
    setResults([
      {
        examId: 1,
        level: 'N2',
        date: '2025-05-18',
        totalScore: 116,
        parts: {
          vocab:     { score: 38, max: 60 },
          listening: { score: 38, max: 60 },
          reading:   { score: 40, max: 60 },
        },
      },
    ]);
    setLoading(false);
  }, []);

  const expandedRowRender = (record) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 40 }}>
      {Object.entries(record.parts).map(([key, p]) => (
        <div key={key} style={{ width: 260 }}>
          <span style={{ marginRight: 8, display: 'inline-block', width: 120 }}>
            {key === 'vocab' ? 'Từ vựng-Ngữ pháp' : key === 'listening' ? 'Nghe' : 'Đọc'}
          </span>
          <Progress
            percent={Math.round((p.score / p.max) * 100)}
            format={() => `${p.score}/${p.max}`}
            size="small"
          />
        </div>
      ))}
    </div>
  );

  const columns = [
    { title: 'Ngày thi', dataIndex: 'date', key: 'date' },
    {
      title: 'Cấp độ',
      dataIndex: 'level',
      key: 'level',
      render: lv => <Tag color="blue">{lv}</Tag>,
    },
    { title: 'Điểm tổng', dataIndex: 'totalScore', key: 'totalScore' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Lịch sử bài thi</Title>
      {loading ? (
        <Spin />
      ) : (
        <Table
          rowKey="examId"
          columns={columns}
          dataSource={results}
          expandable={{ expandedRowRender }}
          pagination={false}
        />
      )}
    </div>
  );
};

export default AccountPage;
