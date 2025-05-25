import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Typography, Button, List, Card, message, Tabs } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const AdminExamDetail = () => {
  const { level, examId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('vocabulary');

  const accessToken = localStorage.getItem('accessToken');
  

  const fetchQuestions = async (section) => {
    if (!examId) {
      message.error('examId không hợp lệ');
      return;
    }
    try {
      const url = `http://localhost:8080/api/questions/?examId=${examId}&section=${section}`;
      const response = await axios.get(url, {headers: {
            Authorization: `Bearer ${accessToken}`
          }});
      setQuestions(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
      message.error('Lỗi khi tải câu hỏi');
      setQuestions([]);
    }
  };

  useEffect(() => {
    fetchQuestions(activeTab);
  }, [activeTab, examId]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Danh sách câu hỏi </Title>

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={[
          { key: 'vocabulary', label: 'Từ vựng' },
          { key: 'reading', label: 'Đọc hiểu' },
          { key: 'listening', label: 'Nghe hiểu' },
        ]}
        style={{ marginBottom: 24 }}
      />

      <Button
        type="primary"
        style={{ marginBottom: 24 }}
        onClick={() => navigate(`/admin/exam/${level}/${examId}/new_question`)}
      >
        ➕ Thêm câu hỏi
      </Button>

      {questions.length === 0 ? (
        <p>Chưa có câu hỏi nào.</p>
      ) : (
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={questions}
          renderItem={(q, index) => (
            <List.Item key={index}>
              <Card title={`Câu hỏi ${index + 1}`}>
                <p><strong>{q.question}</strong></p>
                <ul>
                  {q.options.map((option, idx) => (
                    <li key={idx}>
                      {String.fromCharCode(65 + idx)}. {option}
                    </li>
                  ))}
                </ul>
                <p>
                  ⭕️ Đáp án đúng:{' '}
                  <strong>{String.fromCharCode(65 + q.correctAnswerIndex)}</strong>
                </p>
                {q.audioUrl && (
                  <audio controls src={q.audioUrl} style={{ marginTop: 10 }}>
                    Trình duyệt không hỗ trợ thẻ audio.
                  </audio>
                )}
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default AdminExamDetail;
