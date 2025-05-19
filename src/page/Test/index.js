import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, Typography, Radio, Space, Button, Spin, Modal } from 'antd';

const { Title, Paragraph } = Typography;

const TestPage = () => {
  const { id } = useParams();
  const navigate  = useNavigate();

  const [exam,    setExam]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});      // { questionId: 'A'|'B'|... }
  const [active,  setActive]  = useState('vocab');
  const [endModal, setEndModal] = useState(false);

  /* Lấy đề thi */
  useEffect(() => {
    async function fetchExam() {
      // TODO: fetch(`/api/exams/${id}`)
      const mock = {
        id,
        title: `Đề thi số ${id}`,
        parts: {
          vocab: [
            { id: 1, text: 'Từ “速い“ nghĩa là gì?', choices: ['A','B','C','D'] },
          ],
          listening: [
            { id: 11, text: 'Nghe Audio 1 và chọn đáp án', audio: '/audio/01.mp3', choices: ['A','B','C','D'] },
          ],
          reading: [
            { id: 21, text: 'Đọc đoạn sau và chọn đáp án đúng.', choices: ['A','B','C','D'] },
          ],
        },
        duration: 120,
      };
      setExam(mock);
      setLoading(false);
    }
    fetchExam();
  }, [id]);

  /* Chọn đáp án (value = `${qid}-${A|B|C|D}`) */
  const handleChoose = (qid, val) => {
    const choice = val.split('-')[1];               // 'A' | 'B' | ...
    setAnswers(prev => ({ ...prev, [qid]: choice }));
  };

  /* Render câu hỏi */
  const renderQuestions = (list) =>
    list.map(q => (
      <div key={q.id} style={{ marginBottom: 16 }}>
        <Paragraph strong>{q.text}</Paragraph>

        {q.audio && (
          <audio controls style={{ marginBottom: 8 }}>
            <source src={q.audio} type="audio/mpeg" />
          </audio>
        )}

        <Radio.Group
          onChange={(e) => handleChoose(q.id, e.target.value)}
          value={answers[q.id] ? `${q.id}-${answers[q.id]}` : undefined}
        >
          <Space direction="vertical">
            {q.choices.map(ch => (
              <Radio key={ch} value={`${q.id}-${ch}`}>{ch}</Radio>
            ))}
          </Space>
        </Radio.Group>
      </div>
    ));

  /* Nộp bài */
  const handleFinish = () => {
    setEndModal(false);
    // TODO: POST /api/exams/:id/submit  { answers }
    console.log('Đáp án gửi backend:', answers);
    navigate('/exam/n2');  // hoặc trang kết quả
  };

  if (loading) return <Spin size="large" style={{ margin: 48 }} />;

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>{exam.title}</Title>

      <Tabs
        activeKey={active}
        onChange={setActive}
        items={[
          { key: 'vocab',     label: 'Từ vựng - Ngữ pháp', children: renderQuestions(exam.parts.vocab) },
          { key: 'listening', label: 'Nghe',               children: renderQuestions(exam.parts.listening) },
          { key: 'reading',   label: 'Đọc',                children: renderQuestions(exam.parts.reading) },
        ]}
      />

      <Button type="primary" danger onClick={() => setEndModal(true)}>
        Kết thúc bài thi
      </Button>

      <Modal
        open={endModal}
        title="Xác nhận kết thúc bài thi?"
        okText="Nộp bài"
        cancelText="Tiếp tục làm"
        onOk={handleFinish}
        onCancel={() => setEndModal(false)}
      >
        <Paragraph>Sau khi nộp bạn sẽ không thể thay đổi đáp án. Bạn chắc chắn?</Paragraph>
      </Modal>
    </div>
  );
};

export default TestPage;
