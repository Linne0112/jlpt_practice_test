import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from 'antd';

const { Title } = Typography;
const levels = ['N1', 'N2', 'N3', 'N4', 'N5'];

const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Trang quản trị Admin</Title>
      <p>Chọn cấp độ để xem hoặc thêm đề thi:</p>

      {levels.map((lv) => (
        <Button
          key={lv}
          style={{ margin: 8 }}
          onClick={() => navigate(`/admin/exam/${lv.toLowerCase()}`)}
        >
          {lv}
        </Button>
      ))}
    </div>
  );
};

export default AdminHome;
