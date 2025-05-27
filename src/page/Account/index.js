import React, { useEffect, useState } from 'react';
import { Table, Typography, Spin, Progress, Tag, Alert } from 'antd';
import { collection, getDocs, query, where, getFirestore } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { firebaseApp } from '../../firebase';
import dayjs from 'dayjs';

const { Title } = Typography;

const AccountPage = () => {
  const { user } = useAuth();
  const [initialLoading, setInitialLoading] = useState(true); // Chỉ loading lần đầu
  const [results, setResults] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [error, setError] = useState(null);
  const [waitingForScoring, setWaitingForScoring] = useState(false);

  useEffect(() => {
    if (!user) return;

    let intervalId;

    const fetchResults = async () => {
      // Lần đầu mới bật loading, lần sau thì không
      if (initialLoading) setInitialLoading(true);
      setError(null);
      try {
        const db = getFirestore(firebaseApp);
        const q = query(
          collection(db, 'sessions'),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setResults([]);
          setWaitingForScoring(true);
        } else {
          const data = snapshot.docs.map(doc => {
            const d = doc.data();
            return {
              examId: doc.id,
              date: dayjs(Number(d.timestamp)).format('YYYY-MM-DD'),
              level: d.level ?? '不明',
              totalScore: d.totalScore ?? 0,
              parts: {
                vocab:     { score: d.vocabScore ?? 0, max: 60 },
                listening: { score: d.listeningScore ?? 0, max: 60 },
                reading:   { score: d.readingScore ?? 0, max: 60 },
              },
            };
          });
          setResults(data);
          setWaitingForScoring(false);
        }
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError('データの読み込みに失敗しました。再度お試しください。');
        setWaitingForScoring(false);
      } finally {
        // Chỉ tắt loading lần đầu thôi
        if (initialLoading) setInitialLoading(false);
      }
    };

    fetchResults();

    intervalId = setInterval(fetchResults, 10000);

    return () => clearInterval(intervalId);
  }, [user, initialLoading]);

  const expandedRowRender = (record) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 40 }}>
      {Object.entries(record.parts).map(([key, p]) => (
        <div key={key} style={{ width: 260 }}>
          <span style={{ marginRight: 8, display: 'inline-block', width: 120 }}>
            {key === 'vocab' ? '語彙・漢字・文法' : key === 'listening' ? '聴解' : '読解'}
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
    { title: '試験日', dataIndex: 'date', key: 'date' },
    {
      title: 'レベル',
      dataIndex: 'level',
      key: 'level',
      render: lv => <Tag color="blue">{lv}</Tag>,
    },
    { title: '合計点', dataIndex: 'totalScore', key: 'totalScore' },
  ];

  const handleExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([record.examId]);
    } else {
      setExpandedRowKeys([]);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>試験履歴</Title>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}

      {waitingForScoring && !initialLoading && !error && (
        <Alert
          message="あなたの試験は現在採点中です。結果はまもなく表示されます。"
          type="info"
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}

      {initialLoading ? (
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <Spin size="large" tip="データを読み込み中です…" />
        </div>
      ) : (
        <Table
          rowKey="examId"
          columns={columns}
          dataSource={results}
          expandable={{
            expandedRowRender,
            expandedRowKeys,
            onExpand: handleExpand,
          }}
          pagination={false}
        />
      )}
    </div>
  );
};

export default AccountPage;
