import React, { useState } from 'react';
import {
  Form, Input, Button, Typography, Space, message, Select, Upload
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios';

const { Title } = Typography;
const { Option } = Select;

const QuestionForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { level, examId } = useParams();
  const [section, setSection] = useState('vocabulary');
  const [audioFile, setAudioFile] = useState(null);

  const accessToken = localStorage.getItem('accessToken');

  const onFinish = async (values) => {
    const sectionSelected = section;
    const correctAnswerIndex = ['A', 'B', 'C', 'D'].indexOf(values.correct);
    const options = [values.a, values.b, values.c, values.d];

    let audioUrl = '';
    if (sectionSelected === 'listening' && audioFile) {
      // Upload audio to a service or server, for now we fake a URL
      audioUrl = `https://example.com/${audioFile.name}`;
    }

    const payload = {
      question: values.text,
      options: options,
      correctAnswerIndex: correctAnswerIndex,
      audioUrl: sectionSelected === 'listening' ? audioUrl : ''
    };

    try {
      const response = await axios.post(
        `/questions?examId=${examId}&section=${sectionSelected}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          withCredentials:true
        }
      );

      message.success('Đã thêm câu hỏi!');
      navigate(`/admin/exam/${level}/${examId}`);
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi thêm câu hỏi!');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Thêm câu hỏi – Đề {examId}</Title>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Chọn phần" name="section">
          <Select value={section} onChange={setSection}>
            <Option value="vocabulary">Vocabulary</Option>
            <Option value="reading">Reading</Option>
            <Option value="listening">Listening</Option>
          </Select>
        </Form.Item>

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
          label="Đáp án đúng"
          rules={[{ required: true, message: 'Vui lòng chọn đáp án đúng' }]}
        >
          <Select placeholder="Chọn đáp án đúng">
            <Option value="A">A</Option>
            <Option value="B">B</Option>
            <Option value="C">C</Option>
            <Option value="D">D</Option>
          </Select>
        </Form.Item>

        {section === 'listening' && (
          <Form.Item label="Tải lên file âm thanh (mp3/mp4)">
            <Upload
              beforeUpload={(file) => {
                setAudioFile(file);
                return false; // Ngăn Upload tự động
              }}
              accept=".mp3,.mp4"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>
        )}

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
            <Button onClick={() => navigate(-1)}>Hủy</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default QuestionForm;
