// src/components/GoHomeButton/index.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const GoHomeButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      type="primary"
      icon={<HomeOutlined />}
      onClick={() => navigate('/')}
      style={{
        marginBottom: 16,
        borderRadius: '6px'
      }}
    >
      Trang chủ
    </Button>
  );
};

export default GoHomeButton;
