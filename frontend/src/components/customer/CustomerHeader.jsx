import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Avatar,
  Space,
  Breadcrumb,
} from 'antd';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import { useIcon } from '../../icons/IconProvider';
import StandardPanel from '../ui/StandardPanel';

const { Header } = Layout;

const CustomerHeader = ({ showBreadcrumb = false, breadcrumbItems = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getIconByContext, createContextIcon } = useIcon();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất');
    navigate('/');
  };

  // Main navigation items using standardized icons
  const mainMenuItems = [
    {
      key: '/',
      icon: getIconByContext('navigation', 'home'),
      label: 'Trang chủ',
    },
    {
      key: '/trips',
      icon: getIconByContext('navigation', 'search'),
      label: 'Tìm chuyến',
    },
    {
      key: '/tickets/lookup',
      icon: getIconByContext('crud', 'read'),
      label: 'Tra cứu vé',
    },
  ];

  // User dropdown menu items using standardized icons
  const userMenuItems = isAuthenticated
    ? [
        {
          key: 'my-tickets',
          icon: createContextIcon('transport', 'ticket', { size: 'sm' }),
          label: 'Vé của tôi',
          onClick: () => navigate('/my-tickets'),
        },
        {
          key: 'divider-1',
          type: 'divider',
        },
        {
          key: 'my-reviews',
          icon: createContextIcon('support', 'review', { size: 'sm' }),
          label: 'Đánh giá của tôi',
          onClick: () => navigate('/my-reviews'),
        },
        {
          key: 'complaints',
          icon: createContextIcon('support', 'complaint', { size: 'sm' }),
          label: 'Khiếu nại',
          onClick: () => navigate('/complaints'),
        },
        {
          key: 'divider-2',
          type: 'divider',
        },
        {
          key: 'loyalty',
          icon: getIconByContext('payment', 'gift'),
          label: 'Loyalty Program',
          onClick: () => navigate('/loyalty'),
        },
        {
          key: 'divider-3',
          type: 'divider',
        },
        {
          key: 'logout',
          icon: getIconByContext('authentication', 'logout'),
          label: 'Đăng xuất',
          danger: true,
          onClick: handleLogout,
        },
      ]
    : [
        {
          key: 'login',
          icon: getIconByContext('authentication', 'login'),
          label: 'Đăng nhập',
          onClick: () => navigate('/login'),
        },
        {
          key: 'register',
          icon: getIconByContext('authentication', 'register'),
          label: 'Đăng ký',
          onClick: () => navigate('/register'),
        },
      ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <Header className="bg-white shadow-responsive-md sticky top-0 z-50 container-responsive">
        <div className="flex items-center justify-between h-full touch-manipulation">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="flex items-center gap-2">
              {createContextIcon('transport', 'bus', { 
                size: 'lg', 
                color: 'primary',
                className: 'text-blue-500' 
              })}
              <span className="text-responsive-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                QuikRide
              </span>
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
                <Button type="text" className="flex items-center gap-2 hover:bg-blue-50">
                  <Avatar
                    size="small"
                    icon={getIconByContext('authentication', 'profile')}
                    className="bg-blue-500"
                  />
                  <span className="hidden lg:inline text-gray-700">{user?.fullName || 'User'}</span>
                </Button>
              </Dropdown>
            ) : (
              <Space>
                <Button
                  type="text"
                  icon={getIconByContext('authentication', 'login')}
                  onClick={() => navigate('/login')}
                  className="hover:bg-blue-50 hover:text-blue-600"
                >
                  Đăng nhập
                </Button>
                <Button
                  type="primary"
                  onClick={() => navigate('/register')}
                  className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
                >
                  Đăng ký
                </Button>
              </Space>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            className="md:hidden hover:bg-blue-50 touch-target"
            type="text"
            icon={getIconByContext('navigation', 'menu')}
            onClick={() => setMobileMenuOpen(true)}
          />
        </div>
      </Header>

      {/* Breadcrumb Navigation */}
      {showBreadcrumb && breadcrumbItems.length > 0 && (
        <div className="bg-gray-50 border-b container-responsive py-2">
          <div>
            <Breadcrumb
              items={breadcrumbItems}
              separator={getIconByContext('navigation', 'forward')}
              className="text-sm"
            />
          </div>
        </div>
      )}

      {/* Mobile Navigation Panel */}
      <StandardPanel
        variant="ghost"
        className={`fixed inset-0 z-50 md:hidden transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Mobile Menu Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-responsive-xl transform transition-responsive ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <StandardPanel
            variant="default"
            size="medium"
            padding="comfortable"
            header={{
              title: (
                <div className="flex items-center gap-2">
                  {createContextIcon('transport', 'bus', { 
                    size: 'base', 
                    color: 'primary' 
                  })}
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    QuikRide
                  </span>
                </div>
              ),
              actions: [
                <Button
                  key="close"
                  type="text"
                  icon={getIconByContext('crud', 'cancel')}
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:bg-gray-100"
                />
              ]
            }}
            className="h-full border-0 rounded-none"
          >
            <div className="space-y-4">
              {/* User Info (if authenticated) */}
              {isAuthenticated && user && (
                <StandardPanel
                  variant="bordered"
                  size="small"
                  padding="compact"
                  className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      size={48}
                      icon={getIconByContext('authentication', 'profile')}
                      className="bg-blue-500"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">{user.fullName}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </div>
                </StandardPanel>
              )}

              {/* Main Menu */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Điều hướng
                </h3>
                <Menu
                  mode="inline"
                  selectedKeys={[location.pathname]}
                  items={mainMenuItems}
                  onClick={handleMenuClick}
                  className="border-0 bg-transparent"
                />
              </div>

              {/* User Menu */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  {isAuthenticated ? 'Tài khoản' : 'Xác thực'}
                </h3>
                <Menu
                  mode="inline"
                  items={userMenuItems}
                  className="border-0 bg-transparent"
                />
              </div>
            </div>
          </StandardPanel>
        </div>
      </StandardPanel>
    </>
  );
};

export default CustomerHeader;
