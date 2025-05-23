import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Typography, Space, message } from 'antd';

const { Title } = Typography;

const QuestionForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { level, examId } = useParams();

  const onFinish = async (values) => {
    const payload = {
      text: values.text,
      choices: [values.a, values.b, values.c, values.d],
      correct: values.correct.trim().toUpperCase()
    };

    try {
      // (Giả lập) gửi lên backend
      console.log('Câu hỏi mới:', payload);

      // ✅ Sau khi gửi thành công → chuyển về trang chi tiết đề
      message.success('Đã thêm câu hỏi!');
      navigate(`/admin/exam/${level}/${examId}`);
    } catch (err) {
      message.error('Có lỗi xảy ra.');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Thêm câu hỏi – Đề {examId}</Title>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="text"
          label="Nội dung câu hỏi"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Đáp án A" name="a" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Đáp án B" name="b" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Đáp án C" name="c" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Đáp án D" name="d" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="correct"
          label="Đáp án đúng (A, B, C, D)"
          rules={[{ required: true }]}
        >
          <Input placeholder="Ví dụ: A" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">Lưu</Button>
            <Button onClick={() => navigate(-1)}>Hủy</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default QuestionForm;
