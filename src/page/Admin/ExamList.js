import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, List, Modal, Typography, Spin, Tabs } from 'antd';
import ExamForm from './ExamForm';

const { Title } = Typography;

const AdminExamList = () => {
  const { level } = useParams(); // level từ URL
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Giả lập gọi API mỗi khi level đổi
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setExams([
        { id: 1, title: `Đề ${level.toUpperCase()} – 07/2024` },
        { id: 2, title: `Đề ${level.toUpperCase()} – 12/2023` },
      ]);
      setLoading(false);
    }, 500);
  }, [level]);

  // Thêm đề mới
  const handleAddExam = (newExam) => {
    setExams(prev => [newExam, ...prev]);
    setModalOpen(false);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Tiêu đề */}
      <Title level={3} style={{ textAlign: 'center', marginBottom: 16 }}>
        Luyện thi năng lực tiếng Nhật
      </Title>

      {/* Tabs cấp độ */}
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

      {/* Nút thêm đề */}
      <Button
        type="primary"
        onClick={() => setModalOpen(true)}
        style={{ marginBottom: 24 }}
      >
        ➕ Thêm đề thi
      </Button>

      {/* Danh sách đề */}
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
                  <Button onClick={() => navigate(`/admin/exam/${level}/${exam.id}`)}>
                    Xem / Thêm câu hỏi
                  </Button>,
                ]}
              />
            </List.Item>
          )}
        />
      )}

      {/* Modal thêm đề */}
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
