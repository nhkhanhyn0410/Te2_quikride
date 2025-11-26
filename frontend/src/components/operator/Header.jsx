import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, Avatar, Breadcrumb } from 'antd';
import useAuthStore from '../../store/authStore';
import { useIcon } from '../../icons/IconProvider';
import StandardPanel from '../ui/StandardPanel';

const Header = ({ 
  title = '', 
  showBreadcrumb = false, 
  breadcrumbItems = [],
  onMenuToggle 
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { getIconByContext, createContextIcon } = useIcon();

  const handleLogout = () => {
    logout();
    navigate('/operator/login');
  };

  const menuItems = [
    {
      key: 'profile',
      icon: getIconByContext('authentication', 'profile'),
      label: 'Hồ Sơ',
      onClick: () => navigate('/operator/profile'),
    },
    {
      key: 'settings',
      icon: getIconByContext('navigation', 'settings'),
      label: 'Cài Đặt',
      onClick: () => navigate('/operator/settings'),
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
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {title}
              </h2>
            </div>
          </div>

          {/* Right Section: User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications (placeholder for future) */}
            <Button
              type="text"
              icon={getIconByContext('status', 'info')}
              className="hover:bg-gray-100"
              title="Thông báo"
            />

            {/* User Dropdown */}
            <Dropdown 
              menu={{ items: menuItems }} 
              placement="bottomRight"
              trigger={['click']}
            >
              <Button
                type="text"
                className="flex items-center space-x-3 hover:bg-gray-100 px-3 py-2 h-auto"
              >
                <Avatar
                  size="default"
                  icon={getIconByContext('authentication', 'profile')}
                  className="bg-blue-600"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-medium text-gray-700">
                    {user?.companyName || 'Operator'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.email}
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

export default Header;
