import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer, Menu, Button, Badge, Avatar, Space } from 'antd';
import useAuthStore from '../../store/authStore';
import { useIcon } from '../../icons/IconProvider';
import StandardPanel from '../ui/StandardPanel';

const TripManagerMobileNav = ({ 
  visible, 
  onClose, 
  activeTrips = 0, 
  emergencyAlerts = 0,
  pendingIssues = 0 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { getIconByContext, createContextIcon } = useIcon();

  const handleLogout = () => {
    logout();
    navigate('/trip-manager/login');
    onClose();
  };

  const handleMenuClick = ({ key }) => {
    navigate(key);
    onClose();
  };

  // Main navigation menu items
  const mainMenuItems = [
    {
      key: '/trip-manager/dashboard',
      icon: getIconByContext('navigation', 'home'),
      label: 'Dashboard',
    },
    {
      key: '/trip-manager/trips',
      icon: createContextIcon('transport', 'bus', { size: 'sm' }),
      label: (
        <div className="flex items-center justify-between w-full">
          <span>Active Trips</span>
          {activeTrips > 0 && (
            <Badge count={activeTrips} size="small" className="bg-blue-500" />
          )}
        </div>
      ),
    },
    {
      key: '/trip-manager/emergency',
      icon: getIconByContext('status', 'warning'),
      label: (
        <div className="flex items-center justify-between w-full">
          <span>Emergency Alerts</span>
          {emergencyAlerts > 0 && (
            <Badge count={emergencyAlerts} size="small" className="bg-red-500" />
          )}
        </div>
      ),
      className: emergencyAlerts > 0 ? 'animate-pulse' : '',
    },
    {
      key: '/trip-manager/issues',
      icon: createContextIcon('support', 'complaint', { size: 'sm' }),
      label: (
        <div className="flex items-center justify-between w-full">
          <span>Pending Issues</span>
          {pendingIssues > 0 && (
            <Badge count={pendingIssues} size="small" className="bg-orange-500" />
          )}
        </div>
      ),
    },
    {
      key: '/trip-manager/schedule',
      icon: getIconByContext('time', 'calendar'),
      label: 'Schedule Management',
    },
    {
      key: '/trip-manager/drivers',
      icon: createContextIcon('transport', 'driver', { size: 'sm' }),
      label: 'Driver Status',
    },
    {
      key: '/trip-manager/reports',
      icon: getIconByContext('admin', 'reports'),
      label: 'Trip Reports',
    },
  ];

  // User menu items
  const userMenuItems = [
    {
      key: '/trip-manager/profile',
      icon: getIconByContext('authentication', 'profile'),
      label: 'Hồ Sơ',
    },
    {
      key: '/trip-manager/settings',
      icon: getIconByContext('navigation', 'settings'),
      label: 'Cài Đặt',
    },
    {
      key: 'logout',
      icon: getIconByContext('authentication', 'logout'),
      label: 'Đăng Xuất',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Drawer
      title={null}
      placement="left"
      onClose={onClose}
      open={visible}
      width={280}
      bodyStyle={{ padding: 0 }}
      headerStyle={{ display: 'none' }}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <StandardPanel
          variant="default"
          size="medium"
          padding="comfortable"
          className="border-b border-gray-200 rounded-none"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {createContextIcon('time', 'schedule', { 
                size: 'lg', 
                color: 'primary',
                className: 'text-orange-600' 
              })}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Trip Manager
                </h3>
                <p className="text-xs text-gray-500">Mobile Navigation</p>
              </div>
            </div>
            <Button
              type="text"
              icon={getIconByContext('crud', 'cancel')}
              onClick={onClose}
              className="hover:bg-gray-100"
            />
          </div>
        </StandardPanel>

        {/* User Info */}
        {user && (
          <StandardPanel
            variant="bordered"
            size="small"
            padding="comfortable"
            className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 rounded-none"
          >
            <div className="flex items-center space-x-3">
              <Avatar
                size={48}
                icon={getIconByContext('authentication', 'profile')}
                className="bg-gradient-to-br from-orange-600 to-red-600"
              />
              <div>
                <div className="font-semibold text-gray-800">
                  {user.fullName || user.email || 'Trip Manager'}
                </div>
                <div className="text-sm text-gray-600 flex items-center space-x-1">
                  {createContextIcon('time', 'schedule', { 
                    size: 'xs', 
                    color: 'muted' 
                  })}
                  <span>Trip Manager</span>
                </div>
              </div>
            </div>
          </StandardPanel>
        )}

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Navigation
            </h4>
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              items={mainMenuItems}
              onClick={handleMenuClick}
              className="border-0 bg-transparent"
            />
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Quick Stats
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{activeTrips}</div>
                <div className="text-xs text-blue-600">Active Trips</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-xl font-bold text-orange-600">{pendingIssues}</div>
                <div className="text-xs text-orange-600">Issues</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-xl font-bold text-red-600">{emergencyAlerts}</div>
                <div className="text-xs text-red-600">Alerts</div>
              </div>
            </div>
          </div>

          {/* Emergency Actions */}
          {emergencyAlerts > 0 && (
            <div className="p-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-red-600 uppercase tracking-wide mb-3">
                Emergency Actions
              </h4>
              <Space direction="vertical" className="w-full">
                <Button
                  type="primary"
                  danger
                  block
                  icon={getIconByContext('status', 'warning')}
                  onClick={() => {
                    navigate('/trip-manager/emergency');
                    onClose();
                  }}
                  className="animate-pulse"
                >
                  Handle Emergency ({emergencyAlerts})
                </Button>
                <Button
                  type="primary"
                  danger
                  block
                  icon={getIconByContext('authentication', 'phone')}
                  onClick={() => window.open('tel:911')}
                >
                  Emergency Hotline
                </Button>
              </Space>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="border-t border-gray-200 p-4">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Account
          </h4>
          <Menu
            mode="inline"
            items={userMenuItems}
            className="border-0 bg-transparent"
          />
        </div>
      </div>
    </Drawer>
  );
};

export default TripManagerMobileNav;