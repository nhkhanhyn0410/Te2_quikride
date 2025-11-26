import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, Avatar, Badge, Breadcrumb } from 'antd';
import useAuthStore from '../../store/authStore';
import { useIcon } from '../../icons/IconProvider';
import StandardPanel from '../ui/StandardPanel';

const AdminHeader = ({
  title = 'Admin Dashboard',
  subtitle = 'System Administration Portal',
  showBreadcrumb = false,
  breadcrumbItems = [],
  onMenuToggle
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { getIconByContext, createContextIcon } = useIcon();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    {
      key: 'profile',
      icon: getIconByContext('authentication', 'profile'),
      label: 'Hồ Sơ',
      onClick: () => navigate('/admin/profile'),
    },
    {
      key: 'settings',
      icon: getIconByContext('navigation', 'settings'),
      label: 'Cài Đặt Hệ Thống',
      onClick: () => navigate('/admin/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: getIconByContext('authentication', 'logout'),
      label: 'Đăng Xuất',
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <>
      <StandardPanel
        variant="default"
        size="small"
        padding="comfortable"
        className="bg-white border-b border-gray-200 rounded-none shadow-sm"
      >
        <div className="flex items-center justify-between">
          {/* Left Section: Mobile Menu + Title */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Toggle */}
            <Button
              type="text"
              icon={getIconByContext('navigation', 'menu')}
              onClick={onMenuToggle}
              className="md:hidden hover:bg-gray-100"
            />

            {/* Page Title */}
            <div className="flex items-center space-x-3">
              {createContextIcon('admin', 'admin', {
                size: 'xl',
                color: 'primary',
                className: 'text-indigo-600'
              })}
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {title}
                </h2>
                <p className="text-xs text-gray-500">{subtitle}</p>
              </div>
            </div>
          </div>

          {/* Right Section: Actions + User Menu */}
          <div className="flex items-center space-x-4">
            {/* System Health Indicator */}
            <Button
              type="text"
              icon={getIconByContext('status', 'success')}
              className="hover:bg-gray-100 text-green-600"
              title="System Health"
            />

            {/* Notifications */}
            <Badge count={0} showZero={false}>
              <Button
                type="text"
                icon={getIconByContext('status', 'info')}
                className="hover:bg-gray-100"
                title="Notifications"
              />
            </Badge>

            {/* User Dropdown */}
            <Dropdown
              menu={{ items: menuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Button
                type="text"
                className="flex items-center space-x-3 hover:bg-gray-100 h-auto px-3 py-2"
              >
                <Avatar
                  size="default"
                  icon={getIconByContext('authentication', 'profile')}
                  className="bg-gradient-to-br from-purple-600 to-indigo-600"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-medium text-gray-700">
                    {user?.fullName || user?.email || 'Admin'}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center space-x-1">
                    {createContextIcon('admin', 'admin', {
                      size: 'xs',
                      color: 'muted'
                    })}
                    <span>Administrator</span>
                  </div>
                </div>
                {getIconByContext('navigation', 'down')}
              </Button>
            </Dropdown>
          </div>
        </div>
      </StandardPanel>

      {/* Breadcrumb Navigation */}
      {showBreadcrumb && breadcrumbItems.length > 0 && (
        <StandardPanel
          variant="ghost"
          size="small"
          padding="compact"
          className="bg-gray-50 border-b border-gray-200 rounded-none"
        >
          <Breadcrumb
            items={breadcrumbItems}
            separator={getIconByContext('navigation', 'forward')}
            className="text-sm"
          />
        </StandardPanel>
      )}
    </>
  );
};

export default AdminHeader;
