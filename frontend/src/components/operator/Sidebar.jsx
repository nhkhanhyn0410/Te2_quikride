import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Button } from 'antd';
import { useIcon } from '../../icons/IconProvider';
import StandardPanel from '../ui/StandardPanel';

const Sidebar = ({ collapsed = false, onCollapse }) => {
  const location = useLocation();
  const { getIconByContext, createContextIcon } = useIcon();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const handleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onCollapse) {
      onCollapse(newCollapsed);
    }
  };

  const menuItems = [
    {
      key: 'dashboard',
      path: '/operator/dashboard',
      icon: getIconByContext('admin', 'dashboard'),
      label: 'Dashboard',
    },
    {
      key: 'routes',
      path: '/operator/routes',
      icon: getIconByContext('navigation', 'forward'),
      label: 'Tuyến Đường',
    },
    {
      key: 'buses',
      path: '/operator/buses',
      icon: createContextIcon('transport', 'bus', { size: 'base', color: 'inherit' }),
      label: 'Quản Lý Xe',
    },
    {
      key: 'trips',
      path: '/operator/trips',
      icon: getIconByContext('time', 'calendar'),
      label: 'Chuyến Xe',
    },
    {
      key: 'employees',
      path: '/operator/employees',
      icon: getIconByContext('admin', 'users'),
      label: 'Nhân Viên',
    },
    {
      key: 'reports',
      path: '/operator/reports',
      icon: getIconByContext('admin', 'reports'),
      label: 'Báo Cáo',
    },
    {
      key: 'vouchers',
      path: '/operator/vouchers',
      icon: getIconByContext('payment', 'gift'),
      label: 'Voucher',
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`h-full bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header with Logo and Collapse Button */}
      <StandardPanel
        variant="ghost"
        size="small"
        padding="compact"
        className="border-b border-blue-700 bg-transparent"
      >
        <div className="flex items-center justify-between">
          <Link 
            to="/operator/dashboard" 
            className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              {createContextIcon('transport', 'bus', { 
                size: 'lg', 
                color: 'primary',
                className: 'text-blue-600' 
              })}
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold">QuikRide</h1>
                <p className="text-xs text-blue-300">Operator Dashboard</p>
              </div>
            )}
          </Link>
          
          {/* Collapse Button */}
          <Button
            type="text"
            icon={getIconByContext('navigation', isCollapsed ? 'forward' : 'back')}
            onClick={handleCollapse}
            className="text-white hover:bg-blue-700 border-0 md:flex hidden"
            size="small"
          />
        </div>
      </StandardPanel>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className={`
              flex items-center px-4 py-3 rounded-lg transition-all group
              ${isCollapsed ? 'justify-center' : 'space-x-3'}
              ${
                isActive(item.path)
                  ? 'bg-blue-700 text-white shadow-lg'
                  : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'
              }
            `}
            title={isCollapsed ? item.label : ''}
          >
            <span className={`${isCollapsed ? 'text-xl' : 'text-base'} flex-shrink-0`}>
              {item.icon}
            </span>
            {!isCollapsed && (
              <span className="font-medium">{item.label}</span>
            )}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <StandardPanel
        variant="ghost"
        size="small"
        padding="compact"
        className="border-t border-blue-700 bg-transparent"
      >
        {!isCollapsed ? (
          <p className="text-xs text-blue-300 text-center">
            © 2024 QuikRide
          </p>
        ) : (
          <div className="flex justify-center">
            <span className="text-xs text-blue-300">©</span>
          </div>
        )}
      </StandardPanel>

      {/* Mobile Overlay */}
      <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
    </div>
  );
};

export default Sidebar;
