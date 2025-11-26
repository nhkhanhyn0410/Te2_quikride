import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Button } from 'antd';
import { useIcon } from '../../icons/IconProvider';
import StandardPanel from '../ui/StandardPanel';

const AdminSidebar = ({ collapsed = false, onCollapse }) => {
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
      path: '/admin/dashboard',
      icon: getIconByContext('admin', 'dashboard'),
      label: 'Dashboard',
      description: 'Tổng quan hệ thống',
    },
    {
      key: 'users',
      path: '/admin/users',
      icon: getIconByContext('admin', 'users'),
      label: 'Người Dùng',
      description: 'Quản lý users',
    },
    {
      key: 'operators',
      path: '/admin/operators',
      icon: getIconByContext('payment', 'shop'),
      label: 'Nhà Xe',
      description: 'Duyệt & quản lý',
    },
    {
      key: 'complaints',
      path: '/admin/complaints',
      icon: createContextIcon('support', 'complaint', { size: 'base', color: 'inherit' }),
      label: 'Khiếu Nại',
      description: 'Xử lý khiếu nại',
    },
    {
      key: 'content',
      path: '/admin/content',
      icon: getIconByContext('crud', 'read'),
      label: 'Nội Dung',
      description: 'Banners, Blogs, FAQs',
    },
    {
      key: 'reports',
      path: '/admin/reports',
      icon: getIconByContext('admin', 'reports'),
      label: 'Báo Cáo',
      description: 'Thống kê & phân tích',
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`h-full bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900 text-white flex flex-col shadow-2xl transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header with Logo and Collapse Button */}
      <StandardPanel
        variant="ghost"
        size="small"
        padding="comfortable"
        className="border-b border-indigo-700 bg-transparent"
      >
        <div className="flex items-center justify-between">
          <Link 
            to="/admin/dashboard" 
            className={`flex items-center space-x-3 group ${isCollapsed ? 'justify-center' : ''}`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-white to-indigo-100 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              {createContextIcon('admin', 'admin', { 
                size: 'lg', 
                color: 'primary',
                className: 'text-indigo-700' 
              })}
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold">QuikRide Admin</h1>
                <p className="text-xs text-indigo-300">System Administration</p>
              </div>
            )}
          </Link>
          
          {/* Collapse Button */}
          <Button
            type="text"
            icon={getIconByContext('navigation', isCollapsed ? 'forward' : 'back')}
            onClick={handleCollapse}
            className="text-white hover:bg-indigo-700 border-0 md:flex hidden"
            size="small"
          />
        </div>
      </StandardPanel>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className={`
              block px-4 py-3 rounded-xl transition-all group
              ${isCollapsed ? 'flex justify-center' : ''}
              ${
                isActive(item.path)
                  ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm border border-white/20'
                  : 'text-indigo-100 hover:bg-white/5 hover:text-white'
              }
            `}
            title={isCollapsed ? item.label : ''}
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <span
                className={`${isCollapsed ? 'text-xl' : 'text-base'} transition-transform group-hover:scale-110 flex-shrink-0 ${
                  isActive(item.path) ? 'text-white' : 'text-indigo-300'
                }`}
              >
                {item.icon}
              </span>
              {!isCollapsed && (
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-indigo-300 opacity-80">
                    {item.description}
                  </div>
                </div>
              )}
            </div>
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-300">{item.description}</div>
              </div>
            )}
          </Link>
        ))}
      </nav>

      {/* System Status */}
      <StandardPanel
        variant="ghost"
        size="small"
        padding="compact"
        className="border-t border-indigo-700 bg-transparent"
      >
        {!isCollapsed ? (
          <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-indigo-300">System Status</span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-xs text-green-400">Online</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse" title="System Online"></span>
          </div>
        )}
      </StandardPanel>

      {/* Footer */}
      <StandardPanel
        variant="ghost"
        size="small"
        padding="compact"
        className="border-t border-indigo-700 bg-transparent"
      >
        {!isCollapsed ? (
          <p className="text-xs text-indigo-300 text-center">
            © 2024 QuikRide Admin Panel
          </p>
        ) : (
          <div className="flex justify-center">
            <span className="text-xs text-indigo-300">©</span>
          </div>
        )}
      </StandardPanel>

      {/* Mobile Overlay */}
      <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
    </div>
  );
};

export default AdminSidebar;
