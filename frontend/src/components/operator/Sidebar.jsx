import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  CarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  BarChartOutlined,
  GiftOutlined,
} from '@ant-design/icons';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: 'dashboard',
      path: '/operator/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'routes',
      path: '/operator/routes',
      icon: <EnvironmentOutlined />,
      label: 'Tuyến Đường',
    },
    {
      key: 'buses',
      path: '/operator/buses',
      icon: <CarOutlined />,
      label: 'Quản Lý Xe',
    },
    {
      key: 'employees',
      path: '/operator/employees',
      icon: <TeamOutlined />,
      label: 'Nhân Viên',
    },
    {
      key: 'reports',
      path: '/operator/reports',
      icon: <BarChartOutlined />,
      label: 'Báo Cáo',
    },
    {
      key: 'vouchers',
      path: '/operator/vouchers',
      icon: <GiftOutlined />,
      label: 'Voucher',
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-full bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-blue-700">
        <Link to="/operator/dashboard" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-2xl">🚌</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">QuikRide</h1>
            <p className="text-xs text-blue-300">Operator Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className={`
              flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
              ${
                isActive(item.path)
                  ? 'bg-blue-700 text-white shadow-lg'
                  : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'
              }
            `}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-700">
        <p className="text-xs text-blue-300 text-center">
          © 2024 QuikRide
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
