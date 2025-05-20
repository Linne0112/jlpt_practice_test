import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, List, Typography, Spin, Tabs, message } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const { Title, Paragraph } = Typography;
const LEVELS = ['N1', 'N2', 'N3', 'N4', 'N5'];

const ExamPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const level = searchParams.get('level');
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  /* Gọi API mỗi khi level đổi */
  useEffect(() => {
  const fetchExams = async () => {
    try {
      setLoading(true);

      const response = await axios.get('http://localhost:8080/api/exam', {
        params: { level }
      });

      const data = response.data;
      console.log(data);

      if (!data || data.length === 0) {
        message.warning(`Không tìm thấy đề thi nào cho trình độ ${level}`);
        setExams([]);
      } else {
        setExams(data.map(exam => ({
          id: exam.id,
          title: `Đề ${exam.level} - ${exam.month}/${exam.year}`,
          questions: 75, 
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

  /* Đổi tab = đổi URL => level mới */
  const handleTabChange = (key) => {
    navigate(`/exam?level=${key}`);
  };
  /*chuyển trang test */
  const handleReady = async() => {
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
                id={exam.id}
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
