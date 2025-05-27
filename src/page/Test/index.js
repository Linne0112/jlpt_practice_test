import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, Typography, Radio, Space, Button, Spin, Modal } from 'antd';
import axios from '../../axios';
import { useAuth } from '../../contexts/AuthContext';

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
  const {user} =useAuth();
  const userId = user ? user.uid : null;
  const accessToken = localStorage.getItem('accessToken');

  const sectionLabels = {
    vocabulary: '語彙・漢字・文法',
    reading: '読解',
    listening: '聴解',
  };

  /* Lấy đề thi */
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axios.get(`/exam/start`, {
          params: {
            userId: userId,
            examId: id
          },
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        
        setExam(response.data.questionSets);
        setSessionId(response.data.sessionId);
      } catch (error) {
        console.error('Lỗi khi lấy đề thi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id]);


  

  const handleChoose = async (section, questionIndex, selectedOptionIndex) => {
    const key = `${section}-${questionIndex}`;
    setAnswers(prev => ({ ...prev, [key]: selectedOptionIndex }));


    try {
      await axios.post(`/exam/answer`, {
        sessionId,
        examId: id,
        userId,
        section,
        questionIndex,
        selectedOptionIndex
      }, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        withCredentials:true
      });
    } catch (error) {
      console.error('Lỗi khi gửi đáp án:', error);
    }
  };
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
  const handleFinish = async () => {
    setEndModal(false);

    // Tính tổng số câu hỏi
    const totalQuestions = exam.reduce(
      (total, section) => total + section.questionItems.length,
      0
    );

    // Số câu đã trả lời
    const answeredCount = Object.keys(answers).length;

    if (answeredCount < totalQuestions) {
      alert(`Bạn chưa trả lời hết tất cả các câu hỏi! Vui lòng hoàn thành trước khi nộp.`);
      return;  // Dừng hàm, không gửi bài
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `/exam/submit?sessionId=${sessionId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          withCredentials: true,
          validateStatus: () => true  // Tự xử lý status code
        }
      );

      if (response.status >= 200 && response.status < 300) {
        navigate('/account');
      } else {
        console.error('Submit thất bại với status:', response.status, response.data);
        alert('Gửi bài không thành công. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Lỗi khi gửi bài:', error);
      alert('Lỗi kết nối. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
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
          label: sectionLabels[section.section] || section.section,
          children: renderQuestions(section.section, section.questionItems),
        }))}
      />

      <Button type="primary" danger onClick={() => setEndModal(true)}>
        試験終了
      </Button>

      <Modal
        open={endModal}
        title="試験を終了してもよろしいですか？"
        okText="提出する"
        cancelText="続ける"
        onOk={handleFinish}
        onCancel={() => setEndModal(false)}
      >
        <Paragraph>提出後は解答を変更できません。よろしいですか？</Paragraph>
      </Modal>
    </div>
  );
};

export default TestPage;
