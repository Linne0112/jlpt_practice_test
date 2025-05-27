import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, List, Typography, Spin, Tabs, message } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../../axios';

const { Title, Paragraph } = Typography;
const LEVELS = ['N1', 'N2', 'N3', 'N4', 'N5'];

const ExamPage = () => {
  const [searchParams] = useSearchParams();
  const level = searchParams.get('level');
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/exam', {
          params: { level },
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        const data = response.data;

        if (!data || data.length === 0) {
          message.warning(`Không tìm thấy đề thi nào cho trình độ ${level}`);
          setExams([]);
        } else {
          setExams(data.map(exam => ({
            id: exam.id,
            title: ` ${exam.level} 模擬試験 - ${exam.year}/${exam.month}`,
            examData: exam
          })));
        }

      } catch (error) {
        console.error('Lỗi khi tải danh sách đề thi:', error);
        message.error('Đã xảy ra lỗi khi tải đề thi');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [level]);

  const handleTabChange = (key) => {
    navigate(`/exam?level=${key}`);
  };

  const handleReady = () => {
    setModalOpen(false);
    navigate(`/test/${selectedExam.id}`);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>JLPT試験問題 – {level.toUpperCase()} レベル</Title>

      <Tabs
        activeKey={level}
        onChange={handleTabChange}
        items={LEVELS.map(l => ({
          key: l,
          label: l.toUpperCase(),
        }))}
        style={{ marginBottom: 24 }}
      />

      {loading ? (
        <Spin size="large" />
      ) : (
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={exams}
          renderItem={(exam) => (
            <List.Item>
              <Card
                id={exam.id}
                title={exam.title}
                actions={[
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={() => { setSelectedExam(exam); setModalOpen(true); }}
                  >
                    試験を受ける
                  </Button>,
                ]}
              />
            </List.Item>
          )}
        />
      )}

      <Modal
        open={modalOpen}
        title="試験を受ける準備はできましたか？"
        onOk={handleReady}
        okText="準備OK"
        cancelText="閉じる"
        onCancel={() => setModalOpen(false)}
      >
        <Paragraph><strong>{selectedExam?.title}</strong></Paragraph>
      </Modal>
    </div>
  );
};

export default ExamPage;
