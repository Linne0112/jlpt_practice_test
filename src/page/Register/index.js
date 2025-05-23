// src/page/Register/index.js
import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useAuth } from '../../contexts/AuthContext'; // Đảm bảo đúng đường dẫn tới AuthContext
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const { register } = useAuth(); // Giả sử bạn có hàm register trong AuthContext
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    if (values.password !== values.confirmPassword) {
      message.error('Mật khẩu và Nhập lại mật khẩu không khớp!');
      setLoading(false);
      return;
    }

    // Gọi hàm register trong context (cần bạn tự implement)
    const success = await register(values.email, values.password);
    setLoading(false);

    if (success) {
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } else {
      message.error('Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Card
        title="Đăng ký"
        style={{ width: 350, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      >
        <Form
          name="register"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự.' },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item
            label="Nhập lại mật khẩu"
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ borderRadius: '6px' }}
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          Bạn đã có tài khoản? <a href="/login">Đăng nhập ngay!</a>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
