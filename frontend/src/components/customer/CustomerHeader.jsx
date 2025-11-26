import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Avatar,
  Badge,
  Space,
  Drawer,
} from 'antd';
import {
  HomeOutlined,
  SearchOutlined,
  FileTextOutlined,
  StarOutlined,
  ExclamationCircleOutlined,
  TrophyOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const { Header } = Layout;

const CustomerHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất');
    navigate('/');
  };

  // Main navigation items
  const mainMenuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
    },
    {
      key: '/trips',
      icon: <SearchOutlined />,
      label: 'Tìm chuyến',
    },
    {
      key: '/tickets/lookup',
      icon: <FileTextOutlined />,
      label: 'Tra cứu vé',
    },
  ];

  // User dropdown menu items
  const userMenuItems = isAuthenticated
    ? [
        {
          key: 'my-tickets',
          icon: <FileTextOutlined />,
          label: 'Vé của tôi',
          onClick: () => navigate('/my-tickets'),
        },
        {
          key: 'divider-1',
          type: 'divider',
        },
        {
          key: 'my-reviews',
          icon: <StarOutlined />,
          label: 'Đánh giá của tôi',
          onClick: () => navigate('/my-reviews'),
        },
        {
          key: 'complaints',
          icon: <ExclamationCircleOutlined />,
          label: 'Khiếu nại',
          onClick: () => navigate('/complaints'),
        },
        {
          key: 'divider-2',
          type: 'divider',
        },
        {
          key: 'loyalty',
          icon: <TrophyOutlined />,
          label: 'Loyalty Program',
          onClick: () => navigate('/loyalty'),
        },
        {
          key: 'divider-3',
          type: 'divider',
        },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'Đăng xuất',
          danger: true,
          onClick: handleLogout,
        },
      ]
    : [
        {
          key: 'login',
          icon: <LoginOutlined />,
          label: 'Đăng nhập',
          onClick: () => navigate('/login'),
        },
        {
          key: 'register',
          icon: <UserOutlined />,
          label: 'Đăng ký',
          onClick: () => navigate('/register'),
        },
      ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
    setMobileMenuOpen(false);
  };

  return (
    <Header className="bg-white shadow-md sticky top-0 z-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🚌 QuikRide
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={mainMenuItems}
            onClick={handleMenuClick}
            className="border-0 bg-transparent"
            style={{ minWidth: 0, flex: 'auto' }}
          />

          {/* User Menu */}
          {isAuthenticated ? (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Button type="text" className="flex items-center gap-2">
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  className="bg-blue-500"
                />
                <span className="hidden lg:inline">{user?.fullName || 'User'}</span>
              </Button>
            </Dropdown>
          ) : (
            <Space>
              <Button
                type="text"
                icon={<LoginOutlined />}
                onClick={() => navigate('/login')}
              >
                Đăng nhập
              </Button>
              <Button
                type="primary"
                onClick={() => navigate('/register')}
              >
                Đăng ký
              </Button>
            </Space>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          className="md:hidden"
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setMobileMenuOpen(true)}
        />
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🚌 QuikRide
            </span>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
      >
        <div className="space-y-4">
          {/* User Info (if authenticated) */}
          {isAuthenticated && user && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-4">
              <div className="flex items-center gap-3">
                <Avatar
                  size={48}
                  icon={<UserOutlined />}
                  className="bg-blue-500"
                />
                <div>
                  <div className="font-semibold">{user.fullName}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
            </div>
          )}

          {/* Main Menu */}
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={mainMenuItems}
            onClick={handleMenuClick}
            className="border-0"
          />

          {/* User Menu */}
          <div className="border-t pt-4">
            <Menu
              mode="inline"
              items={userMenuItems}
              className="border-0"
            />
          </div>
        </div>
      </Drawer>
    </Header>
  );
};

export default CustomerHeader;
