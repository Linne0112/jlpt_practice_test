// src/page/Exam/index.js
import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, List, Typography, Spin, Tabs } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const LEVELS = ['n1', 'n2', 'n3', 'n4', 'n5'];

const ExamPage = () => {
  const { level } = useParams();          // lấy level từ URL
  const navigate  = useNavigate();
  const [exams, setExams]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  /* Gọi API mỗi khi level đổi */
  useEffect(() => {
    setLoading(true);
    // TODO: fetch(`/api/exams?level=${level}`)
    setTimeout(() => {
      // Giả lập dữ liệu theo level
      setExams([
        { id: 1, title: `Đề ${level.toUpperCase()} – 07/2024`, questions: 75 },
        { id: 2, title: `Đề ${level.toUpperCase()} – 12/2023`, questions: 70 },
      ]);
      setLoading(false);
    }, 600);
  }, [level]);

  /* Đổi tab = đổi URL => level mới */
  const handleTabChange = (key) => {
    navigate(`/exam/${key}`);
  };

  const handleReady = () => {
    setModalOpen(false);
    navigate(`/test/${selectedExam.id}`);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Đề thi JLPT – Cấp độ {level.toUpperCase()}</Title>

      {/* Tabs chọn level */}
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
                title={exam.title}
                extra={`${exam.questions} câu`}
                actions={[
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={() => { setSelectedExam(exam); setModalOpen(true); }}
                  >
                    Làm bài
                  </Button>,
                ]}
              />
            </List.Item>
          )}
        />
      )}

      <Modal
        open={modalOpen}
        title="Bạn đã sẵn sàng làm bài?"
        onOk={handleReady}
        okText="Sẵn sàng"
        cancelText="Đóng"
        onCancel={() => setModalOpen(false)}
      >
        <Paragraph><strong>{selectedExam?.title}</strong></Paragraph>
        <Paragraph>Số câu: {selectedExam?.questions}</Paragraph>
        <Paragraph>Thời gian: 120 phút.</Paragraph>
      </Modal>
    </div>
  );
};

export default ExamPage;
