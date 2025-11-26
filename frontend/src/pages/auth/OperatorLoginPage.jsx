import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import useAuthStore from '../../store/authStore';
import { operatorAuth } from '../../services/operatorApi';

const OperatorLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await operatorAuth.login(values);

      // Response structure: { status, message, data: { operator, accessToken, refreshToken } }
      if (response.status === 'success') {
        const { operator, accessToken } = response.data;

        // Set user as operator role
        login({ ...operator, role: 'operator' }, accessToken);

        message.success('Đăng nhập thành công!');
        navigate('/operator/dashboard');
      }
    } catch (error) {
      message.error(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <span className="text-3xl">🚌</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Vé xe nhanh</h1>
          <p className="text-gray-600">Operator Dashboard</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Đăng Nhập
          </h2>

          <Form
            name="operator-login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="operator@example.com"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Nhập mật khẩu"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link
                to="/operator/register"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          © 2024 Vé xe nhanh. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default OperatorLoginPage;
