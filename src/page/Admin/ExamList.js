import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, List, Modal, Typography, Spin, Tabs, message } from 'antd';
import ExamForm from './ExamForm';
import axios from '../../axios';

const { Title } = Typography;

const AdminExamList = () => {
  const { level } = useParams();
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/questions/level/${level.toUpperCase()}`, 
        {headers: {
            Authorization: `Bearer ${accessToken}`
          }}
        );
        const formattedExams = response.data.map((item) => ({
          id: item.id,
          title: `Đề ${item.level} – ${String(item.month).padStart(2, '0')}/${item.year}`,
        }));
        setExams(formattedExams);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu đề thi:', error);
        message.error('Không thể tải danh sách đề thi.');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [level]);

  const handleAddExam = (newExam) => {
    setExams(prev => [newExam, ...prev]);
    setModalOpen(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 16 }}>
        Luyện thi năng lực tiếng Nhật
      </Title>

      <Tabs
        activeKey={level.toLowerCase()}
        onChange={(key) => navigate(`/admin/exam/${key}`)}
        centered
        style={{ marginBottom: 32 }}
        items={['n1', 'n2', 'n3', 'n4', 'n5'].map(lv => ({
          key: lv,
          label: lv.toUpperCase(),
        }))}
      />

      <Button
        type="primary"
        onClick={() => setModalOpen(true)}
        style={{ marginBottom: 24 }}
      >
        ➕ Thêm đề thi
      </Button>

      {loading ? (
        <Spin />
      ) : (
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={exams}
          renderItem={(exam) => (
            <List.Item>
              <Card
                title={exam.title}
                actions={[
                  <Button onClick={() => navigate(`/admin/exam/${level}/${exam.id}` )}>
                    Xem / Thêm câu hỏi
                  </Button>,
                ]}
              />
            </List.Item>
          )}
        />
      )}

      <Modal
        open={modalOpen}
        title="Thêm đề thi mới"
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <ExamForm
          level={level}
          onCreate={handleAddExam}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default AdminExamList;
