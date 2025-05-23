// src/page/Admin/ExamDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, List, Card, Spin, message } from 'antd';

const { Title } = Typography;

const ExamDetail = () => {
  const { level, examId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/exams/${examId}/questions`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => setQuestions(data))
      .catch(() => message.error('Lỗi khi tải câu hỏi'))
      .finally(() => setLoading(false));
  }, [examId]);

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Danh sách câu hỏi – Đề {examId}</Title>

      <Button
        type="primary"
        style={{ marginBottom: 24 }}
        onClick={() => navigate(`/admin/exam/${level}/${examId}/add-question`)}
      >
        ➕ Thêm câu hỏi
      </Button>

      {loading ? (
        <Spin />
      ) : questions.length === 0 ? (
        <p>Chưa có câu hỏi nào.</p>
      ) : (
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={questions}
          renderItem={(q) => (
            <List.Item>
              <Card title={`Câu hỏi ${q.id}`}>
                <p><strong>{q.text}</strong></p>
                <ul>
                  {q.choices.map((c, idx) => (
                    <li key={idx}>
                      {String.fromCharCode(65 + idx)}. {c}
                    </li>
                  ))}
                </ul>
                <p>✅ Đáp án đúng: <strong>{q.correct}</strong></p>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default ExamDetail;
