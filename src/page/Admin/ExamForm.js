import React from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const ExamForm = ({ level, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const accessToken = localStorage.getItem('accessToken');

  const handleSubmit = async (values) => {
    const { month, year } = values;

    const payload = {
      level: level.toUpperCase(),
      month,
      year,
    };

    try {
      const response = await axios.post('http://localhost:8080/api/questions/new', payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          withCredentials:true
        }
      );

      // Gọi lại onCreate với dữ liệu đã được định dạng
      const newExam = {
        id: response.data.id, // Lấy id thực từ backend
        level: response.data.level,
        month: response.data.month,
        year: response.data.year,
        title: `Đề ${response.data.level} – ${String(response.data.month).padStart(2, '0')}/${response.data.year}`,
      };

      onCreate(newExam);
      form.resetFields();
      message.success('Tạo đề thi thành công!');
    } catch (error) {
      console.error('Lỗi tạo đề:', error);
      message.error('Không thể tạo đề thi. Vui lòng thử lại.');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ month: 7, year: new Date().getFullYear() }}
    >
      <Form.Item label="Cấp độ">
        <Input value={level.toUpperCase()} disabled />
      </Form.Item>

      <Form.Item
        name="month"
        label="Tháng"
        rules={[{ required: true, message: 'Chọn tháng!' }]}
      >
        <Select>
          {[7, 12].map((m) => (
            <Option key={m} value={m}>
              Tháng {m}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="year"
        label="Năm"
        rules={[{ required: true, message: 'Nhập năm!' }]}
      >
        <Input type="number" min={2000} max={2100} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
          Tạo đề thi
        </Button>
        <Button onClick={onCancel}>Hủy</Button>
      </Form.Item>
    </Form>
  );
};

export default ExamForm;
