import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, Typography, Radio, Space, Button, Spin, Modal } from 'antd';
import axios from 'axios';

const { Title, Paragraph } = Typography;

const TestPage = () => {
  const { id } = useParams();
  const navigate  = useNavigate();

  const [exam,    setExam]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});      // { questionId: 'A'|'B'|... }
  const [active,  setActive]  = useState('vocabulary');
  const [endModal, setEndModal] = useState(false);

  const [sessionId, setSessionId] = useState('');
  const userId = '9383x';

  /* Lấy đề thi */
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/exam/start`, {
          params: {
            userId: '9383x',
            examId: id
          }
        });
        
        setExam(response.data.questionSets);
        setSessionId(response.data.sessionId);
        console.log(response.data)
      } catch (error) {
        console.error('Lỗi khi lấy đề thi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  console.log(exam);
  console.log(sessionId)

  

  const handleChoose = async (section, questionIndex, selectedOptionIndex) => {
    const key = `${section}-${questionIndex}`;
    setAnswers(prev => ({ ...prev, [key]: selectedOptionIndex }));
    console.log(sessionId + id + userId + section+  questionIndex + selectedOptionIndex );


    try {
      await axios.post(`http://localhost:8080/api/exam/answer`, {
        sessionId,
        examId: id,
        userId,
        section,
        questionIndex,
        selectedOptionIndex
      }, {withCredentials:true});
    } catch (error) {
      console.error('Lỗi khi gửi đáp án:', error);
    }
  };
  console.log(answers)
  /* Render câu hỏi */
  const renderQuestions = (section, questionItems) =>
    questionItems.map((q) => (
      <div key={q.index} style={{ marginBottom: 16 }}>
        <Paragraph strong>
          {q.question}
        </Paragraph>

        {q.audioUrl && (
          <audio controls style={{ marginBottom: 8 }}>
            <source src={q.audioUrl} type="audio/mpeg" />
          </audio>
        )}

        <Radio.Group
          onChange={(e) => handleChoose(section, q.index, e.target.value)}
          value={answers[`${section}-${q.index}`]}
        >
          <Space direction="vertical">
            {q.options.map((opt, i) => (
              <Radio key={i} value={i}>{opt}</Radio>
            ))}
          </Space>
        </Radio.Group>
      </div>
    ));

  /* Nộp bài */
  const handleFinish = async() => {
    setEndModal(false);
    try {
      await axios.post(`http://localhost:8080/api/exam/submit?sessionId=${sessionId}`, null, {
        withCredentials: true
      });
      
    } catch (error) {
      console.error('Lỗi khi submit', error);
    }
    console.log('Đáp án gửi backend:', answers);
    navigate('/account');  // hoặc trang kết quả
  };

  if (loading) return <Spin size="large" style={{ margin: 48 }} />;

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>{exam.title}</Title>

      <Tabs
        activeKey={active}
        onChange={setActive}
        items={exam.map(section => ({
          key: section.section,
          label: section.section.toUpperCase(),
          children: renderQuestions(section.section, section.questionItems),
        }))}
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
