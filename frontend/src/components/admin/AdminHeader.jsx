import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, Avatar, Badge } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import useAuthStore from '../../store/authStore';

const AdminHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ Sơ',
      onClick: () => navigate('/admin/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài Đặt Hệ Thống',
      onClick: () => navigate('/admin/settings'),
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
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Page Title - can be dynamic based on route */}
        <div className="flex items-center space-x-3">
          <SafetyOutlined className="text-2xl text-indigo-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Admin Dashboard
            </h2>
            <p className="text-xs text-gray-500">System Administration Portal</p>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Badge count={0} showZero={false}>
            <Button
              type="text"
              icon={<BellOutlined className="text-xl" />}
              className="hover:bg-gray-100"
            />
          </Badge>

          {/* User Menu */}
          <Dropdown menu={{ items: menuItems }} placement="bottomRight">
            <Button
              type="text"
              className="flex items-center space-x-3 hover:bg-gray-100 h-auto px-3 py-2"
            >
              <Avatar
                size="default"
                icon={<UserOutlined />}
                className="bg-gradient-to-br from-purple-600 to-indigo-600"
              />
              <div className="text-left">
                <div className="text-sm font-medium text-gray-700">
                  {user?.fullName || user?.email || 'Admin'}
                </div>
                <div className="text-xs text-gray-500 flex items-center space-x-1">
                  <SafetyOutlined className="text-xs" />
                  <span>Administrator</span>
                </div>
              </div>
            </Button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
