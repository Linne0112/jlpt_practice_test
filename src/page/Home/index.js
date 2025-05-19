import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css'; // Đảm bảo file này có tồn tại!
import { Button, Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Home = () => {
  const [selectedLevel, setSelectedLevel] = useState('N2');
  const navigate = useNavigate();
  
  const levels = ['N1', 'N2', 'N3', 'N4', 'N5'];

  const handleLevelClick = (level) => {
    setSelectedLevel(level);
  };

  const handleStartPractice = () => {
    navigate(`/exam/${selectedLevel.toLowerCase()}`);
  };

  return (
    <div className="home-container">
      <Title className="app-title">JLPT Practice Test</Title>
      <Title level={3} className="app-subtitle">Luyện thi Năng lực tiếng Nhật</Title>
      
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
        <Title level={4} className="selection-title">Chọn cấp độ luyện thi</Title>
        <Paragraph className="selection-subtitle">Hãy chọn cấp độ JLPT bạn muốn luyện thi</Paragraph>
        
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
                {level === selectedLevel ? 'Đã chọn' : 'Nhấn để chọn'}
              </p>
            </Card>
          ))}
        </div>
        
        <Button
          type="primary"
          size="large"
          className="start-button"
          onClick={handleStartPractice}
        >
          Bắt đầu luyện thi 
        </Button>
      </div>
      
      <div className="japanese-quote">
        <Paragraph>"努力は必ず実を結ぶ。"</Paragraph>
        <Paragraph>(Doryoku wa kanarazu mi o musubu.)</Paragraph>
        <Paragraph><i>Nỗ lực nhất định sẽ mang lại thành quả.</i></Paragraph>
      </div>
    </div>
  );
};

export default Home;
