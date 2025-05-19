import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const Level = () => {
  const navigate = useNavigate();
  
  const handleLevelClick = (level) => {
    navigate(`/exam/${level}`);
  };

  return (
    <div className="level-container">
      <h2>Chọn trình độ JLPT</h2>
      <div className="level-buttons">
        {['N1', 'N2', 'N3', 'N4', 'N5'].map(level => (
          <button
            key={level}
            className={`level-btn ${level.toLowerCase()}`}
            onClick={() => handleLevelClick(level.toLowerCase())}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Level;