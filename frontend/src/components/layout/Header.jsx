import { useNavigate } from 'react-router-dom';
import { Button, Space, Dropdown } from 'antd';
import {
  LoginOutlined,
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất');
  };

  const userMenuItems = [
    {
      key: 'my-tickets',
      label: 'Vé của tôi',
      icon: <UserOutlined />,
      onClick: () => navigate('/my-tickets'),
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="text-2xl font-bold text-red-600 cursor-pointer"
            onClick={() => navigate('/')}
          >
            Bus
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#home"
              className="text-gray-700 hover:text-red-600 transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
            >
              Trang chủ
            </a>
            <a
              href="#services"
              className="text-gray-700 hover:text-red-600 transition-colors cursor-pointer"
            >
              Dịch vụ
            </a>
            <a
              href="#tickets"
              className="text-gray-700 hover:text-red-600 transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                navigate('/tickets/lookup');
              }}
            >
              Vé xe
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-red-600 transition-colors cursor-pointer"
            >
              Giới thiệu
            </a>
          </nav>

          {/* Auth Section */}
          <Space size="middle">
            {isAuthenticated && user?.role === 'customer' ? (
              <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
                <Button type="text">
                  <Space>
                    <UserOutlined />
                    {user?.name || 'Tài khoản'}
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
            ) : (
              <Button
                type="primary"
                onClick={() => navigate('/login')}
                className="bg-red-600 hover:bg-red-700 border-red-600"
                icon={<LoginOutlined />}
              >
                Đăng nhập
              </Button>
            )}
          </Space>
        </div>
      </div>
    </header>
  );
};

export default Header;
