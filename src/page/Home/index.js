import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css'; 
import { Button, Card, Typography } from 'antd';
import axios from '../../axios';

const { Title, Paragraph } = Typography;

const Home = () => {
  const [selectedLevel, setSelectedLevel] = useState('N2');
  const navigate = useNavigate();
  const [btnLoading,setBtnLoading] = useState(false);
  const levels = ['N1', 'N2', 'N3', 'N4', 'N5'];
  const accessToken = localStorage.getItem('accessToken');


  const handleLevelClick = (level) => {
    setSelectedLevel(level);
  };

  const handleStartPractice = async () => {
    setBtnLoading(true);
    try {
      const response = await axios.get(`/exam`, {
        params: {
          level: selectedLevel
        },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const exams = response.data;

      if (!exams || exams.length === 0) {
        alert(`Không tìm thấy đề thi nào cho trình độ ${selectedLevel}`);
        return;
      }

      navigate(`/exam?level=${selectedLevel}`);
    } catch (error) {
      console.error('Lỗi khi kiểm tra đề thi:', error);
      alert('Đã xảy ra lỗi khi kiểm tra đề thi');
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="home-container">
      <Title className="app-title">JLPT模擬試験</Title>
      <Title level={3} className="app-subtitle">日本語能力試験対策</Title>
      
      <div className="level-tabs">
        {levels.map(level => (
          <Button 
            key={level}
            type={level === selectedLevel ? 'primary' : 'default'}
            className="level-tab"
            onClick={() => handleLevelClick(level)}
          >
            {level}
          </Button>
        ))}
      </div>
      
      <div className="level-selection-panel">
        <Title level={4} className="selection-title">受験レベルを選択してください</Title>
        <Paragraph className="selection-subtitle">受験したいJLPTのレベルを選んでください</Paragraph>
        
        <div className="level-cards">
          {levels.map(level => (
            <Card
              key={level}
              className={`level-card ${level === selectedLevel ? 'selected' : ''}`}
              onClick={() => handleLevelClick(level)}
              hoverable
            >
              <p className="level-name">{level}</p>
              <p className="level-status">
                {level === selectedLevel ? '選択済み' : 'クリックして選択'}
              </p>
            </Card>
          ))}
        </div>
        
        <Button
          type="primary"
          size="large"
          className="start-button"
          onClick={handleStartPractice}
          loading={btnLoading}
        >
          スタート 
        </Button>
      </div>
      
      <div className="japanese-quote">
        <Paragraph>"努力は必ず実を結ぶ"</Paragraph>
      </div>
    </div>
  );
};

export default Home;
