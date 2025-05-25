import React, { useEffect, useState } from 'react';
import { Table, Typography, Spin, Progress, Tag } from 'antd';
import { collection, getDocs, query, where, getFirestore } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../firebase';
import dayjs from 'dayjs';

const { Title } = Typography;

const AccountPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const db = getFirestore(auth);
        const q = query(
          collection(db, 'sessions'),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map(doc => {
          const d = doc.data();
          return {
            examId: d.examId,
            date: dayjs(Number(d.timestamp)).format('YYYY-MM-DD'),
            level: 'N5', // bạn có thể thêm trường `level` vào session nếu có
            totalScore: d.totalScore,
            parts: {
              vocab:     { score: d.vocabScore ?? 0, max: 60 },
              listening: { score: d.listeningScore ?? 0, max: 60 },
              reading:   { score: d.readingScore ?? 0, max: 60 },
            },
          };
        });

        setResults(data);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

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
