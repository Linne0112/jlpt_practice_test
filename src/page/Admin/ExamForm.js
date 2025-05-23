import React from 'react';
import { Form, Input, Select, Button } from 'antd';

const { Option } = Select;

const ExamForm = ({ level, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const { month, year } = values;

    const newExam = {
      id: Date.now(),
      level,
      month,
      year,
      title: `Đề ${level.toUpperCase()} – ${month}/${year}` // ✅ Tạo cứng tên đề
    };

    onCreate(newExam);
    form.resetFields();
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
