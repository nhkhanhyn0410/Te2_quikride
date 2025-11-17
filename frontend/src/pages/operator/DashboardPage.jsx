import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, message } from 'antd';
import {
  CarOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  ToolOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { busesApi, employeesApi, routesApi } from '../../services/operatorApi';
import useAuthStore from '../../store/authStore';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    buses: null,
    employees: null,
    routes: null,
  });
  const { user } = useAuthStore();

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const [busStats, empStats, routeStats] = await Promise.all([
        busesApi.getStatistics(),
        employeesApi.getStatistics(),
        routesApi.getMyRoutes({ page: 1, limit: 1 }), // Just to get total count
      ]);

      setStats({
        buses: busStats.data.statistics,
        employees: empStats.data.statistics,
        routes: routeStats.data,
      });
    } catch (error) {
      message.error('Không thể tải thống kê');
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Xin chào, {user?.companyName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Tổng quan hoạt động của nhà xe
        </p>
      </div>

      {/* Bus Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <CarOutlined className="mr-2" />
          Quản Lý Xe
        </h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng Số Xe"
                value={stats.buses?.totalBuses || 0}
                prefix={<CarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đang Hoạt Động"
                value={stats.buses?.activeBuses || 0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đang Bảo Trì"
                value={stats.buses?.maintenanceBuses || 0}
                prefix={<ToolOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Ngừng Hoạt Động"
                value={stats.buses?.retiredBuses || 0}
                prefix={<StopOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Employee Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <TeamOutlined className="mr-2" />
          Nhân Viên
        </h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng Nhân Viên"
                value={stats.employees?.totalEmployees || 0}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tài Xế"
                value={stats.employees?.totalDrivers || 0}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Quản Lý Chuyến"
                value={stats.employees?.totalTripManagers || 0}
                valueStyle={{ color: '#13c2c2' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đang Hoạt Động"
                value={stats.employees?.activeEmployees || 0}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Route Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <EnvironmentOutlined className="mr-2" />
          Tuyến Đường
        </h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Tổng Tuyến Đường"
                value={stats.routes?.pagination?.total || 0}
                prefix={<EnvironmentOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Alerts */}
      {stats.employees?.driversWithExpiringLicense > 0 && (
        <Card className="bg-yellow-50 border-yellow-300">
          <div className="flex items-center">
            <div className="text-yellow-600 text-2xl mr-4">⚠️</div>
            <div>
              <h3 className="font-semibold text-yellow-800">
                Cảnh báo giấy phép lái xe
              </h3>
              <p className="text-yellow-700">
                Có {stats.employees.driversWithExpiringLicense} tài xế có giấy phép sắp hết hạn trong 30 ngày tới
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;
