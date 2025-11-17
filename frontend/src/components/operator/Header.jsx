import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import useAuthStore from '../../store/authStore';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/operator/login');
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ Sơ',
      onClick: () => navigate('/operator/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài Đặt',
      onClick: () => navigate('/operator/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng Xuất',
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title - can be dynamic based on route */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {/* Will be overridden by individual pages */}
          </h2>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <Dropdown menu={{ items: menuItems }} placement="bottomRight">
            <Button
              type="text"
              className="flex items-center space-x-2 hover:bg-gray-100"
            >
              <Avatar
                size="default"
                icon={<UserOutlined />}
                className="bg-blue-600"
              />
              <div className="text-left">
                <div className="text-sm font-medium text-gray-700">
                  {user?.companyName || 'Operator'}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.email}
                </div>
              </div>
            </Button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Header;
