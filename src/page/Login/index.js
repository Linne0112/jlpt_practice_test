// src/page/Login/index.js
import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async values => {
    setLoading(true);
    const success = await login(values.username, values.password);
    setLoading(false);
    if (success) {
      message.success('Đăng nhập thành công!');
      navigate('/', { replace: true }); // redirect về trang chủ
    } else {
      message.error('Sai tài khoản hoặc mật khẩu.');
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center',
      alignItems: 'center', height: '100vh'
    }}>
      <Card title="Đăng nhập" style={{ width: 300 }}>
        <Form name="login" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Nhập username!' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Nhập password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
