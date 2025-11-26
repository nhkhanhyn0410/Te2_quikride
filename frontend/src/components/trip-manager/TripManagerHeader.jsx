import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, Avatar, Badge, Breadcrumb } from 'antd';
import useAuthStore from '../../store/authStore';
import { useIcon } from '../../icons/IconProvider';
import StandardPanel from '../ui/StandardPanel';

const TripManagerHeader = ({ 
  title = 'Trip Manager', 
  subtitle = 'Trip Management Dashboard',
  showBreadcrumb = false, 
  breadcrumbItems = [],
  onMenuToggle,
  activeTrips = 0,
  emergencyAlerts = 0,
  className = ''
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { getIconByContext, createContextIcon } = useIcon();

  const handleLogout = () => {
    logout();
    navigate('/trip-manager/login');
  };

  const menuItems = [
    {
      key: 'profile',
      icon: getIconByContext('authentication', 'profile'),
      label: 'Hồ Sơ',
      onClick: () => navigate('/trip-manager/profile'),
    },
    {
      key: 'settings',
      icon: getIconByContext('navigation', 'settings'),
      label: 'Cài Đặt',
      onClick: () => navigate('/trip-manager/settings'),
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
        className={`bg-white border-b border-gray-200 rounded-none shadow-sm ${className}`}
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
              {createContextIcon('time', 'schedule', { 
                size: 'xl', 
                color: 'primary',
                className: 'text-orange-600' 
              })}
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {title}
                </h2>
                <p className="text-xs text-gray-500">{subtitle}</p>
              </div>
            </div>
          </div>

          {/* Right Section: Quick Actions + User Menu */}
          <div className="flex items-center space-x-4">
            {/* Trip Status Indicator */}
            <Badge count={activeTrips} showZero={true} className="bg-blue-500">
              <Button
                type="text"
                icon={createContextIcon('transport', 'bus', { size: 'base', color: 'primary' })}
                className="hover:bg-blue-50 text-blue-600"
                title={`Active Trips: ${activeTrips}`}
                onClick={() => navigate('/trip-manager/trips/active')}
              />
            </Badge>

            {/* Notifications */}
            <Badge count={0} showZero={false}>
              <Button
                type="text"
                icon={getIconByContext('status', 'info')}
                className="hover:bg-gray-100"
                title="Notifications"
                onClick={() => navigate('/trip-manager/notifications')}
              />
            </Badge>

            {/* Emergency Alert */}
            <Badge count={emergencyAlerts} showZero={false} className="bg-red-500">
              <Button
                type="text"
                icon={getIconByContext('status', 'warning')}
                className={`hover:bg-red-50 text-red-600 ${emergencyAlerts > 0 ? 'animate-pulse' : ''}`}
                title={`Emergency Alerts: ${emergencyAlerts}`}
                onClick={() => navigate('/trip-manager/emergency')}
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
                  className="bg-gradient-to-br from-orange-600 to-red-600"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-medium text-gray-700">
                    {user?.fullName || user?.email || 'Trip Manager'}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center space-x-1">
                    {createContextIcon('time', 'schedule', { 
                      size: 'xs', 
                      color: 'muted' 
                    })}
                    <span>Trip Manager</span>
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

export default TripManagerHeader;