import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Statistic,
  Row,
  Col,
  Tag,
  Progress,
  Modal,
  Form,
  Input,
  message,
  Alert,
  Descriptions,
  Space,
  Divider,
} from 'antd';
import {
  QrcodeOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  CarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import useActiveTripStore from '../../store/activeTripStore';
import useAuthStore from '../../store/authStore';
import tripManagerApi from '../../services/tripManagerApi';
import { getTripPassengers } from '../../services/ticketApi';

const ActiveTripPage = () => {
  const navigate = useNavigate();
  const { activeTrip, updateTrip, completeTrip, cancelTrip, hasActiveTrip } = useActiveTripStore();
  const { user, logout } = useAuthStore();
  const [passengers, setPassengers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    boarded: 0,
    notBoarded: 0,
  });
  const [loading, setLoading] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Redirect if no active trip
  useEffect(() => {
    if (!hasActiveTrip()) {
      message.warning('Không có chuyến xe đang hoạt động');
      navigate('/trip-manager/dashboard');
    }
  }, [hasActiveTrip, navigate]);

  // Fetch passengers data
  const fetchPassengers = async () => {
    if (!activeTrip?._id) return;

    setLoading(true);
    try {
      const response = await getTripPassengers(activeTrip._id);
      if (response.status === 'success') {
        const passengersData = response.data.passengers || [];
        setPassengers(passengersData);

        // Calculate stats
        const boardedCount = passengersData.filter((p) => p.isUsed || p.isBoarded).length;
        setStats({
          total: passengersData.length,
          boarded: boardedCount,
          notBoarded: passengersData.length - boardedCount,
        });
      }
    } catch (error) {
      console.error('Fetch passengers error:', error);
      message.error('Không thể tải danh sách hành khách');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassengers();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchPassengers, 30000);
    return () => clearInterval(interval);
  }, [activeTrip?._id]);

  // Handle complete trip
  const handleCompleteTrip = async () => {
    try {
      setLoading(true);
      const response = await tripManagerApi.updateTripStatus(activeTrip._id, {
        status: 'completed',
      });

      if (response.success) {
        message.success('Chuyến xe đã hoàn thành!');
        completeTrip(); // Clear active trip
        navigate('/trip-manager/dashboard');
      } else {
        message.error(response.message || 'Không thể hoàn thành chuyến');
      }
    } catch (error) {
      console.error('Complete trip error:', error);
      message.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
      setCompleteModalVisible(false);
    }
  };

  // Handle cancel trip
  const handleCancelTrip = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const response = await tripManagerApi.updateTripStatus(activeTrip._id, {
        status: 'cancelled',
        reason: values.reason,
      });

      if (response.success) {
        message.success('Chuyến xe đã được hủy');
        cancelTrip(); // Clear active trip
        navigate('/trip-manager/dashboard');
      } else {
        message.error(response.message || 'Không thể hủy chuyến');
      }
    } catch (error) {
      console.error('Cancel trip error:', error);
      message.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
      setCancelModalVisible(false);
    }
  };

  // Handle scan QR
  const handleScanQR = () => {
    navigate(`/trip-manager/trips/${activeTrip._id}/scan`);
  };

  // Handle view passengers
  const handleViewPassengers = () => {
    navigate(`/trip-manager/trips/${activeTrip._id}/passengers`);
  };

  // Handle logout - confirm first
  const handleLogout = () => {
    Modal.confirm({
      title: 'Xác nhận đăng xuất',
      content: 'Bạn đang làm việc trên chuyến xe. Bạn có chắc muốn đăng xuất?',
      icon: <WarningOutlined />,
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => {
        completeTrip(); // Clear active trip
        logout();
        navigate('/trip-manager/login');
      },
    });
  };

  if (!activeTrip) {
    return null;
  }

  const boardingPercentage = stats.total > 0 ? Math.round((stats.boarded / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-start">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                <CarOutlined className="text-3xl" />
                <div>
                  <h1 className="text-2xl font-bold">
                    {activeTrip.route?.routeName || 'Đang tải...'}
                  </h1>
                  <p className="text-blue-100 text-sm mt-1">
                    {activeTrip.bus?.busNumber} • {activeTrip.bus?.plateNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-blue-100">
                <span>
                  <ClockCircleOutlined className="mr-1" />
                  {dayjs(activeTrip.departureTime).format('HH:mm, DD/MM/YYYY')}
                </span>
                <span>
                  <EnvironmentOutlined className="mr-1" />
                  {activeTrip.route?.departureCity} → {activeTrip.route?.arrivalCity}
                </span>
              </div>
            </div>

            <div className="text-right">
              <Tag color="green" className="text-base px-4 py-1 mb-2">
                ĐANG HOẠT ĐỘNG
              </Tag>
              <p className="text-white text-sm">
                Quản lý: <strong>{user?.fullName}</strong>
              </p>
              <Button
                type="link"
                onClick={handleLogout}
                className="text-blue-100 hover:text-white p-0 mt-1"
                size="small"
              >
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert - Cannot go back */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Alert
          message="Bạn đang làm việc trên chuyến xe này"
          description="Vui lòng hoàn thành hoặc hủy chuyến để quay về trang quản lý chung"
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
        />
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng hành khách"
                value={stats.total}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đã lên xe"
                value={stats.boarded}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Chưa lên xe"
                value={stats.notBoarded}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div className="text-gray-600 mb-2 text-sm">Tỷ lệ lên xe</div>
              <Progress
                percent={boardingPercentage}
                status={boardingPercentage === 100 ? 'success' : 'active'}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Main Actions */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Card title="Chức năng quản lý chuyến">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Button
                type="primary"
                size="large"
                icon={<QrcodeOutlined />}
                onClick={handleScanQR}
                block
                className="h-20 text-lg"
              >
                Quét mã QR vé
              </Button>
            </Col>

            <Col xs={24} md={12}>
              <Button
                size="large"
                icon={<TeamOutlined />}
                onClick={handleViewPassengers}
                block
                className="h-20 text-lg"
              >
                Xem danh sách hành khách
              </Button>
            </Col>
          </Row>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Button
                type="primary"
                size="large"
                icon={<CheckCircleOutlined />}
                onClick={() => setCompleteModalVisible(true)}
                block
                loading={loading}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                className="h-16"
              >
                Hoàn thành chuyến
              </Button>
            </Col>

            <Col xs={24} md={12}>
              <Button
                danger
                size="large"
                icon={<CloseCircleOutlined />}
                onClick={() => setCancelModalVisible(true)}
                block
                loading={loading}
                className="h-16"
              >
                Hủy chuyến
              </Button>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Trip Details */}
      <div className="max-w-7xl mx-auto px-4 py-4 mb-6">
        <Card title="Thông tin chuyến xe">
          <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
            <Descriptions.Item label="Tuyến đường">
              {activeTrip.route?.routeName}
            </Descriptions.Item>
            <Descriptions.Item label="Biển số xe">
              {activeTrip.bus?.plateNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Số xe">
              {activeTrip.bus?.busNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Giờ khởi hành">
              {dayjs(activeTrip.departureTime).format('HH:mm DD/MM/YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Giờ đến dự kiến">
              {dayjs(activeTrip.arrivalTime).format('HH:mm DD/MM/YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng số ghế">
              {activeTrip.bus?.seatCapacity || activeTrip.totalSeats}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      {/* Complete Trip Modal */}
      <Modal
        title={
          <span>
            <CheckCircleOutlined className="mr-2" style={{ color: '#52c41a' }} />
            Hoàn thành chuyến xe
          </span>
        }
        open={completeModalVisible}
        onOk={handleCompleteTrip}
        onCancel={() => setCompleteModalVisible(false)}
        okText="Xác nhận hoàn thành"
        cancelText="Hủy"
        okButtonProps={{ loading, style: { backgroundColor: '#52c41a', borderColor: '#52c41a' } }}
      >
        <Alert
          message="Xác nhận hoàn thành chuyến xe"
          description={
            <div>
              <p className="mb-2">
                Chuyến <strong>{activeTrip.route?.routeName}</strong> đã đến điểm đích?
              </p>
              <ul className="list-disc ml-4 text-sm text-gray-600">
                <li>Tất cả hành khách đã xuống xe</li>
                <li>Xe đã đến điểm đến an toàn</li>
                <li>Hệ thống sẽ gửi email cảm ơn đến hành khách</li>
              </ul>
            </div>
          }
          type="success"
          showIcon
        />
      </Modal>

      {/* Cancel Trip Modal */}
      <Modal
        title={
          <span>
            <CloseCircleOutlined className="mr-2" style={{ color: '#ff4d4f' }} />
            Hủy chuyến xe
          </span>
        }
        open={cancelModalVisible}
        onOk={handleCancelTrip}
        onCancel={() => {
          setCancelModalVisible(false);
          form.resetFields();
        }}
        okText="Xác nhận hủy"
        cancelText="Đóng"
        okButtonProps={{ danger: true, loading }}
      >
        <Alert
          message="Cảnh báo"
          description="Hủy chuyến sẽ gửi thông báo đến tất cả hành khách. Vui lòng nhập lý do cụ thể."
          type="warning"
          showIcon
          className="mb-4"
        />

        <Form form={form} layout="vertical">
          <Form.Item
            name="reason"
            label="Lý do hủy chuyến"
            rules={[
              { required: true, message: 'Vui lòng nhập lý do hủy' },
              { min: 10, message: 'Lý do phải có ít nhất 10 ký tự' },
              { max: 500, message: 'Lý do không quá 500 ký tự' },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập lý do hủy chuyến (VD: Xe gặp sự cố, thời tiết xấu, ...)"
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ActiveTripPage;
