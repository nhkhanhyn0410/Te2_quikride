import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  ShopOutlined,
  FileTextOutlined,
  CustomerServiceOutlined,
  BarChartOutlined,
  SafetyOutlined,
} from '@ant-design/icons';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: 'dashboard',
      path: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      description: 'Tổng quan hệ thống',
    },
    {
      key: 'users',
      path: '/admin/users',
      icon: <UserOutlined />,
      label: 'Người Dùng',
      description: 'Quản lý users',
    },
    {
      key: 'operators',
      path: '/admin/operators',
      icon: <ShopOutlined />,
      label: 'Nhà Xe',
      description: 'Duyệt & quản lý',
    },
    {
      key: 'complaints',
      path: '/admin/complaints',
      icon: <CustomerServiceOutlined />,
      label: 'Khiếu Nại',
      description: 'Xử lý khiếu nại',
    },
    {
      key: 'content',
      path: '/admin/content',
      icon: <FileTextOutlined />,
      label: 'Nội Dung',
      description: 'Banners, Blogs, FAQs',
    },
    {
      key: 'reports',
      path: '/admin/reports',
      icon: <BarChartOutlined />,
      label: 'Báo Cáo',
      description: 'Thống kê & phân tích',
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-full bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900 text-white flex flex-col shadow-2xl">
      {/* Logo */}
      <div className="p-6 border-b border-indigo-700">
        <Link to="/admin/dashboard" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-white to-indigo-100 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <SafetyOutlined className="text-2xl text-indigo-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold">QuikRide Admin</h1>
            <p className="text-xs text-indigo-300">System Administration</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className={`
              block px-4 py-3 rounded-xl transition-all group
              ${
                isActive(item.path)
                  ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm border border-white/20'
                  : 'text-indigo-100 hover:bg-white/5 hover:text-white'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <span
                className={`text-xl transition-transform group-hover:scale-110 ${
                  isActive(item.path) ? 'text-white' : 'text-indigo-300'
                }`}
              >
                {item.icon}
              </span>
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-indigo-300 opacity-80">
                  {item.description}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-indigo-700">
        <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-indigo-300">System Status</span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs text-green-400">Online</span>
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-indigo-700">
        <p className="text-xs text-indigo-300 text-center">
          © 2024 QuikRide Admin Panel
        </p>
      </div>
    </div>
  );
};

export default AdminSidebar;
