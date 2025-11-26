import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Form, Input, Button, Card, message, Divider, Checkbox } from 'antd';
import { FiMail, FiLock, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import useAuthStore from '../../store/authStore';
import customerApi from '../../services/customerApi';

const CustomerLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Transform email to identifier for backend
      const loginData = {
        identifier: values.email,
        password: values.password,
      };

      const response = await customerApi.login(loginData);

      // Response structure: { status, message, data: { user, accessToken, refreshToken } }
      if (response.status === 'success') {
        const { user, accessToken } = response.data;

        // Set user as customer role
        login({ ...user, role: 'customer' }, accessToken);

        message.success('Đăng nhập thành công!');

        // Redirect to previous page or home
        navigate(from, { replace: true });
      }
    } catch (error) {
      message.error(error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    message.info('Tính năng đăng nhập Google đang được phát triển');
  };

  const handleFacebookLogin = async () => {
    message.info('Tính năng đăng nhập Facebook đang được phát triển');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 to-red-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="max-w-md">
            {/* Logo */}
            <div className="mb-8">
              <h1 className="text-6xl font-bold mb-4">Bus</h1>
              <div className="w-20 h-1 bg-white rounded"></div>
            </div>

            {/* Title */}
            <h2 className="text-4xl font-bold mb-6">
              Chào mừng trở lại!
            </h2>
            <p className="text-xl text-red-100 mb-8">
              Đăng nhập để tiếp tục hành trình của bạn. Đặt vé nhanh chóng, dễ dàng và an toàn.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <FiCheck className="text-white" />
                </div>
                <span className="text-red-50">Đặt vé online 24/7</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <FiCheck className="text-white" />
                </div>
                <span className="text-red-50">Thanh toán an toàn & bảo mật</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <FiCheck className="text-white" />
                </div>
                <span className="text-red-50">Hỗ trợ khách hàng 24/7</span>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="mt-12 text-9xl opacity-10">
              🚌
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Back to Home Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors mb-8"
          >
            <FiArrowLeft />
            <span>Về trang chủ</span>
          </Link>

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-bold text-red-600 mb-2">Bus</h1>
            <p className="text-gray-600">Hệ thống đặt vé xe khách trực tuyến</p>
          </div>

          {/* Login Card */}
          <Card className="shadow-xl border-0">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Đăng Nhập
              </h2>
              <p className="text-gray-600">
                Nhập thông tin để truy cập tài khoản
              </p>
            </div>

            <Form
              name="customer-login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              autoComplete="off"
            >
              <Form.Item
                name="email"
                label={<span className="text-gray-700 font-medium">Email</span>}
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input
                  prefix={<FiMail className="text-gray-400" />}
                  placeholder="example@email.com"
                  className="!py-3"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span className="text-gray-700 font-medium">Mật khẩu</span>}
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password
                  prefix={<FiLock className="text-gray-400" />}
                  placeholder="Nhập mật khẩu"
                  className="!py-3"
                />
              </Form.Item>

              <div className="flex items-center justify-between mb-6">
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                >
                  <span className="text-gray-700">Ghi nhớ đăng nhập</span>
                </Checkbox>
                <Link
                  to="/forgot-password"
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <Form.Item className="mb-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="!h-12 text-base font-semibold bg-red-600 hover:bg-red-700 border-red-600"
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                </Button>
              </Form.Item>
            </Form>

            <Divider plain className="text-gray-500">
              <span className="text-sm">Hoặc đăng nhập với</span>
            </Divider>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                icon={<FaGoogle />}
                onClick={handleGoogleLogin}
                className="!h-11 flex items-center justify-center gap-2 hover:border-red-600 hover:text-red-600"
              >
                Google
              </Button>
              <Button
                icon={<FaFacebook />}
                onClick={handleFacebookLogin}
                className="!h-11 flex items-center justify-center gap-2 hover:border-red-600 hover:text-red-600"
              >
                Facebook
              </Button>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-gray-600">
                Chưa có tài khoản?{' '}
                <Link
                  to="/register"
                  className="text-red-600 hover:text-red-700 font-semibold"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </Card>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-8">
            © 2024 Bus. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerLoginPage;
