import React from 'react';
import './style.css';

const ExamCard = ({ exam, onStart }) => {
  return (
    <div className="exam-card">
      <div className="exam-info">
        <h3>{exam.title}</h3>
        <p>Ngày: {exam.date}</p>
        <p>Số câu: {exam.questions}</p>
      </div>
      <button className="start-btn" onClick={onStart}>
        Làm bài
      </button>
    </div>
  );
};

export default ExamCard;