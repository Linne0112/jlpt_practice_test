// src/page/Login/index.js
import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useAuth } from '../../contexts/AuthContext'; // Đảm bảo đúng đường dẫn tới AuthContext
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const {login } = useAuth(); // Chỉ cần hàm login ở đây, không cần user vì sẽ lấy từ giá trị trả về
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async values => {
      setLoading(true);
      
      const loggedInUser = await login(values.username, values.password); // ✅ Trả về user object nếu thành công
      setLoading(false);

      if (loggedInUser) {
        message.success('Đăng nhập thành công!');

        // ✅ Dùng loggedInUser để điều hướng
        if (loggedInUser.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        message.error('Sai tài khoản hoặc mật khẩu.');
      }
    };


  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5' // Thêm màu nền cho đẹp hơn với Ant Design
    }}>
      <Card title="ログイン" style={{ width: 350, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical" // Để các trường form xếp dọc
        >
          <Form.Item
            label="メールアドレス"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input placeholder="メールアドレス" />
          </Form.Item>

          <Form.Item
            label="パスワード"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password placeholder="パスワード" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ borderRadius: '6px' }} // Thêm bo góc cho nút
            >
              ログイン
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
            アカウントをお持ちでない方？ <a href="/register">今すぐ登録！</a>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
