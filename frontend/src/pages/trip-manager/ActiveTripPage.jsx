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
  Timeline,
  Select,
  Badge,
  Tooltip,
  Spin,
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
  CheckOutlined,
  LoadingOutlined,
  AimOutlined,
  HomeOutlined,
  FlagOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import useActiveTripStore from '../../store/activeTripStore';
import useAuthStore from '../../store/authStore';
import tripManagerApi from '../../services/tripManagerApi';
import { getTripPassengers } from '../../services/ticketApi';

const { TextArea } = Input;

const ActiveTripPage = () => {
  const navigate = useNavigate();
  const { activeTrip, updateTrip, completeTrip, cancelTrip, hasActiveTrip } = useActiveTripStore();
  const { user, logout } = useAuthStore();

  // Passengers & Stats
  const [passengers, setPassengers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    boarded: 0,
    notBoarded: 0,
  });

  // Journey tracking
  const [journey, setJourney] = useState(null);
  const [stops, setStops] = useState([]);
  const [statusHistory, setStatusHistory] = useState([]);

  // UI State
  const [loading, setLoading] = useState(false);
  const [journeyLoading, setJourneyLoading] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  // Forms
  const [form] = Form.useForm();
  const [statusForm] = Form.useForm();

  // Redirect if no active trip
  useEffect(() => {
    if (!hasActiveTrip()) {
      message.warning('Không có chuyến xe đang hoạt động');
      navigate('/trip-manager/dashboard');
    }
  }, [hasActiveTrip, navigate]);

  // Fetch trip details to get full bus info including seatLayout
  const fetchTripDetails = async () => {
    if (!activeTrip?._id) return;

    try {
      const response = await tripManagerApi.getTripDetails(activeTrip._id);
      if (response.success && response.data.trip) {
        // Update active trip in store with full details
        updateTrip(response.data.trip);
      }
    } catch (error) {
      console.error('Fetch trip details error:', error);
    }
  };

  // Fetch passengers data
  const fetchPassengers = async () => {
    if (!activeTrip?._id) return;

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
    }
  };

  // Fetch journey details with stops
  const fetchJourneyDetails = async () => {
    if (!activeTrip?._id) return;

    setJourneyLoading(true);
    try {
      const response = await tripManagerApi.getJourneyDetails(activeTrip._id);
      if (response.data) {
        setJourney(response.data.journey);
        setStops(response.data.stops || []);
        setStatusHistory(response.data.statusHistory || []);
      }
    } catch (error) {
      console.error('Fetch journey error:', error);
      // Silently fail - journey tracking is optional
    } finally {
      setJourneyLoading(false);
    }
  };

  useEffect(() => {
    fetchTripDetails();
    fetchPassengers();
    fetchJourneyDetails();

    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      fetchTripDetails();
      fetchPassengers();
      fetchJourneyDetails();
    }, 30000);

    return () => clearInterval(interval);
  }, [activeTrip?._id]);

  // Handle update journey status
  const handleUpdateJourneyStatus = async (values) => {
    try {
      setLoading(true);
      const response = await tripManagerApi.updateJourneyStatus(activeTrip._id, values);

      if (response.success) {
        message.success(response.message || 'Cập nhật trạng thái thành công');
        fetchJourneyDetails(); // Reload journey data
        setStatusModalVisible(false);
        statusForm.resetFields();
      } else {
        message.error(response.message || 'Không thể cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Update journey status error:', error);
      message.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

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

  // Get status label and color
  const getStatusInfo = (status) => {
    const statusMap = {
      preparing: { label: 'Chuẩn bị', color: 'blue' },
      checking_tickets: { label: 'Soát vé', color: 'cyan' },
      in_transit: { label: 'Đang di chuyển', color: 'processing' },
      at_stop: { label: 'Tại điểm dừng', color: 'orange' },
      completed: { label: 'Hoàn thành', color: 'success' },
      cancelled: { label: 'Đã hủy', color: 'error' },
    };
    return statusMap[status] || { label: status, color: 'default' };
  };

  // Render seat map
  const renderSeatMap = () => {
    // Get bus layout
    const seatLayout = activeTrip?.bus?.seatLayout;

    if (!seatLayout || !seatLayout.layout) {
      return (
        <Alert
          message="Không có thông tin sơ đồ ghế"
          description="Không tìm thấy thông tin sơ đồ ghế của xe"
          type="warning"
          showIcon
        />
      );
    }

    // Group passengers by seat number
    const seatMap = {};
    passengers.forEach((passenger) => {
      const seatNum = passenger.seatNumber;
      if (seatNum) {
        seatMap[seatNum] = {
          ...passenger,
          isBoarded: passenger.isUsed || passenger.isBoarded,
        };
      }
    });

    const { layout, rows, columns } = seatLayout;

    // Helper function to determine seat type
    const determineSeatType = (seatNumber) => {
      if (!seatNumber || seatNumber === '') return 'aisle';
      if (seatNumber === 'DRIVER' || seatNumber === '🚗' || seatNumber.includes('Driver')) return 'driver';
      if (seatNumber === 'FLOOR_2') return 'floor_separator';
      return 'seat';
    };

    // Helper function to get seat class
    const getSeatClass = (seatNumber) => {
      const seatType = determineSeatType(seatNumber);

      if (seatType === 'aisle') return 'seat-invisible';
      if (seatType === 'driver') return 'seat-driver';
      if (seatType === 'floor_separator') return 'seat-floor-separator';

      const passenger = seatMap[seatNumber];
      if (!passenger) return 'seat-empty'; // Empty seat
      if (passenger.isBoarded) return 'seat-boarded'; // Boarded
      return 'seat-pending'; // Booked but not boarded
    };

    // Helper function to get seat display content
    const getSeatContent = (seatNumber) => {
      const seatType = determineSeatType(seatNumber);

      if (seatType === 'aisle') return null;
      if (seatType === 'driver') return '🚗';
      if (seatType === 'floor_separator') return '--- Tầng 2 ---';

      const passenger = seatMap[seatNumber];
      if (!passenger) {
        return (
          <div className="seat-content">
            <div className="seat-number">{seatNumber}</div>
            <div className="seat-label">Trống</div>
          </div>
        );
      }

      return (
        <div className="seat-content">
          <div className="seat-number">{seatNumber}</div>
          <div className="seat-label">
            {passenger.fullName.split(' ').pop()}
          </div>
          {passenger.isBoarded && <CheckCircleOutlined className="seat-icon" />}
        </div>
      );
    };

    // Helper function to get tooltip
    const getSeatTooltip = (seatNumber) => {
      const seatType = determineSeatType(seatNumber);

      if (seatType === 'driver') return 'Ghế lái';
      if (seatType === 'floor_separator') return 'Dấu phân tách tầng 2';
      if (seatType === 'aisle') return '';

      const passenger = seatMap[seatNumber];
      if (!passenger) {
        return `Ghế ${seatNumber} - Trống`;
      }

      return (
        <div>
          <div><strong>Ghế {seatNumber}</strong></div>
          <div>{passenger.fullName}</div>
          <div>{passenger.phone}</div>
          <div>{passenger.isBoarded ? 'Đã lên xe ✓' : 'Chưa lên xe'}</div>
        </div>
      );
    };

    return (
      <div className="seat-map-wrapper">
        {/* Driver indicator */}
        <div className="text-center mb-3 text-sm text-gray-600 font-medium">
          ↑ Đầu xe
        </div>

        <div className="seat-map-container bg-gray-100 p-4 rounded-lg">
          {layout.map((row, rowIndex) => (
            <div key={rowIndex} className="seat-row">
              {row.map((seatNumber, colIndex) => {
                const seatClass = getSeatClass(seatNumber);
                const seatContent = getSeatContent(seatNumber);
                const seatTooltip = getSeatTooltip(seatNumber);

                return (
                  <Tooltip key={`${rowIndex}-${colIndex}`} title={seatTooltip}>
                    <div className={`seat ${seatClass}`}>
                      {seatContent}
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>

        {/* Seat Map Styles */}
        <style>{`
          .seat-map-wrapper {
            width: 100%;
          }

          .seat-row {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-bottom: 8px;
          }

          .seat {
            width: 56px;
            height: 56px;
            border-radius: 8px;
            border: 2px solid transparent;
            font-size: 11px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
            position: relative;
            transition: all 0.2s ease;
          }

          .seat-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2px;
            width: 100%;
            text-align: center;
          }

          .seat-number {
            font-size: 12px;
            font-weight: 700;
            line-height: 1;
          }

          .seat-label {
            font-size: 9px;
            font-weight: 500;
            opacity: 0.9;
            line-height: 1.1;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .seat-icon {
            font-size: 10px;
            margin-top: 1px;
          }

          .seat-empty {
            background-color: #f3f4f6;
            border-color: #d1d5db;
            color: #9ca3af;
          }

          .seat-pending {
            background-color: #fef3c7;
            border-color: #fbbf24;
            color: #92400e;
          }

          .seat-pending:hover {
            box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
          }

          .seat-boarded {
            background-color: #d1fae5;
            border-color: #10b981;
            color: #065f46;
          }

          .seat-boarded:hover {
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
          }

          .seat-driver {
            background-color: #3b82f6;
            border-color: #2563eb;
            color: white;
            font-size: 20px;
          }

          .seat-floor-separator {
            width: 100%;
            background-color: #fbbf24;
            border-color: #f59e0b;
            color: #78350f;
            font-size: 11px;
            font-weight: 700;
            text-align: center;
            padding: 4px 8px;
          }

          .seat-invisible {
            visibility: hidden;
            pointer-events: none;
          }

          @media (max-width: 768px) {
            .seat {
              width: 48px;
              height: 48px;
            }

            .seat-number {
              font-size: 11px;
            }

            .seat-label {
              font-size: 8px;
            }

            .seat-row {
              gap: 6px;
              margin-bottom: 6px;
            }
          }

          @media (max-width: 640px) {
            .seat {
              width: 44px;
              height: 44px;
            }

            .seat-number {
              font-size: 10px;
            }

            .seat-label {
              font-size: 7px;
            }

            .seat-row {
              gap: 4px;
              margin-bottom: 4px;
            }
          }
        `}</style>
      </div>
    );
  };

  // Render journey timeline
  const renderJourneyTimeline = () => {
    if (journeyLoading) {
      return (
        <div className="text-center py-8">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          <p className="text-gray-500 mt-2">Đang tải thông tin hành trình...</p>
        </div>
      );
    }

    if (!journey || stops.length === 0) {
      return (
        <Alert
          message="Chưa có điểm dừng"
          description="Tuyến đường này không có điểm dừng trung gian được cấu hình"
          type="info"
          showIcon
        />
      );
    }

    const currentStopIndex = journey.currentStopIndex ?? -1;
    const currentStatus = journey.currentStatus || 'preparing';

    // Build timeline items: Origin -> Stops -> Destination
    const timelineItems = [];

    // Origin - passed if we've left (in_transit with index >= -1 or reached any stop)
    const hasLeftOrigin = currentStatus === 'in_transit' || currentStopIndex >= 0;
    timelineItems.push({
      key: 'origin',
      dot: hasLeftOrigin ? <CheckOutlined /> : <HomeOutlined />,
      color: hasLeftOrigin ? 'green' : 'blue',
      children: (
        <div>
          <div className="font-semibold">Điểm xuất phát</div>
          <div className="text-sm text-gray-600">
            {activeTrip.route?.origin?.city || activeTrip.route?.departureCity}
          </div>
          {journey.actualDepartureTime && (
            <div className="text-xs text-gray-500">
              Khởi hành: {dayjs(journey.actualDepartureTime).format('HH:mm DD/MM')}
            </div>
          )}
        </div>
      ),
    });

    // Stops
    stops.forEach((stop, index) => {
      const stopNumber = index + 1;
      // Stop status logic:
      // - Passed: if currentStopIndex > index (we've been to this stop and left)
      // - Current: if currentStopIndex === index AND status === 'at_stop' (currently at this stop)
      //            OR if currentStopIndex === index - 1 AND status === 'in_transit' (heading to this stop)
      const isPassed = currentStopIndex > index;
      const isAtThisStop = currentStopIndex === index && currentStatus === 'at_stop';
      const isHeadingToThisStop = currentStopIndex === index - 1 && currentStatus === 'in_transit';
      const isCurrent = isAtThisStop || isHeadingToThisStop;

      const estimatedTime = dayjs(activeTrip.departureTime).add(
        stop.estimatedArrivalMinutes,
        'minute'
      );

      let statusText = '';
      if (isPassed) statusText = 'Đã qua';
      else if (isAtThisStop) statusText = 'Đang tại đây';
      else if (isHeadingToThisStop) statusText = 'Đang đến';

      timelineItems.push({
        key: `stop-${stopNumber}`,
        dot: isPassed ? <CheckOutlined /> : isCurrent ? <LoadingOutlined spin /> : <EnvironmentOutlined />,
        color: isPassed ? 'green' : isCurrent ? 'blue' : 'gray',
        children: (
          <div>
            <div className="font-semibold">
              Điểm dừng {stopNumber}: {stop.name}
              {isCurrent && <Badge status="processing" text={statusText} className="ml-2" />}
              {isPassed && <Badge status="success" text={statusText} className="ml-2" />}
            </div>
            <div className="text-sm text-gray-600">{stop.address}</div>
            <div className="text-xs text-gray-500">
              Dự kiến: {estimatedTime.format('HH:mm')} • Dừng {stop.stopDuration || 15} phút
            </div>
          </div>
        ),
      });
    });

    // Destination
    const isCompleted = journey.currentStatus === 'completed';
    timelineItems.push({
      key: 'destination',
      dot: isCompleted ? <CheckOutlined /> : <FlagOutlined />,
      color: isCompleted ? 'green' : 'gray',
      children: (
        <div>
          <div className="font-semibold">Điểm đến</div>
          <div className="text-sm text-gray-600">
            {activeTrip.route?.destination?.city || activeTrip.route?.arrivalCity}
          </div>
          {journey.actualArrivalTime && (
            <div className="text-xs text-gray-500">
              Đến: {dayjs(journey.actualArrivalTime).format('HH:mm DD/MM')}
            </div>
          )}
        </div>
      ),
    });

    return (
      <div>
        <Timeline items={timelineItems} />

        {/* Progress bar */}
        <div className="mt-4">
          <div className="text-sm text-gray-600 mb-2">Tiến trình chuyến đi</div>
          <Progress
            percent={parseFloat(journey.progressPercentage || 0)}
            status={isCompleted ? 'success' : 'active'}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </div>
      </div>
    );
  };

  if (!activeTrip) {
    return null;
  }

  const boardingPercentage = stats.total > 0 ? Math.round((stats.boarded / stats.total) * 100) : 0;
  const currentStatus = journey?.currentStatus || 'preparing';
  const statusInfo = getStatusInfo(currentStatus);

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
              <Tag color={statusInfo.color} className="text-base px-4 py-1 mb-2">
                {statusInfo.label.toUpperCase()}
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

      {/* Journey Timeline */}
      {stops.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Card
            title={
              <div className="flex justify-between items-center">
                <span>
                  <EnvironmentOutlined className="mr-2" />
                  Hành trình chuyến đi
                </span>
                <Button
                  type="primary"
                  size="small"
                  icon={<AimOutlined />}
                  onClick={() => setStatusModalVisible(true)}
                  disabled={currentStatus === 'completed'}
                >
                  Cập nhật vị trí
                </Button>
              </div>
            }
          >
            {renderJourneyTimeline()}
          </Card>
        </div>
      )}

      {/* Seat Map */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Card title={
          <span>
            <TeamOutlined className="mr-2" />
            Sơ đồ ghế xe
          </span>
        }>
          <div className="mb-4 flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-green-100 border-2 border-green-500 rounded text-xs font-semibold text-green-700">
                ✓
              </div>
              <span>Đã lên xe ({stats.boarded})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-yellow-50 border-2 border-yellow-400 rounded text-xs font-semibold text-yellow-800">
                A1
              </div>
              <span>Chưa lên xe ({stats.notBoarded})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-gray-50 border-2 border-gray-300 rounded text-xs text-gray-400">
                B1
              </div>
              <span>Ghế trống ({(activeTrip?.bus?.seatCapacity || activeTrip?.totalSeats || 0) - stats.total})</span>
            </div>
          </div>
          {renderSeatMap()}
        </Card>
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

      {/* Update Journey Status Modal */}
      <Modal
        title={
          <span>
            <AimOutlined className="mr-2" />
            Cập nhật trạng thái hành trình
          </span>
        }
        open={statusModalVisible}
        onOk={() => statusForm.submit()}
        onCancel={() => {
          setStatusModalVisible(false);
          statusForm.resetFields();
        }}
        okText="Cập nhật"
        cancelText="Hủy"
        okButtonProps={{ loading }}
        width={700}
      >
        <Alert
          message="Hướng dẫn cập nhật trạng thái"
          description={
            <div className="text-sm">
              <p className="mb-2"><strong>Quy trình cập nhật:</strong></p>
              <ol className="list-decimal ml-4 space-y-1">
                <li><strong>Chuẩn bị khởi hành</strong> → Xe đang chuẩn bị tại bến</li>
                <li><strong>Đang soát vé</strong> → Kiểm tra vé hành khách trước khi xuất phát</li>
                <li><strong>Đang di chuyển</strong> → Xe đã khởi hành và đang di chuyển (tự động chuyển đến điểm dừng 1)</li>
                <li><strong>Tại điểm dừng</strong> → Chọn điểm dừng đã đến</li>
                <li><strong>Đang di chuyển</strong> → Rời điểm dừng, tiếp tục hành trình (tự động chuyển đến điểm dừng tiếp theo)</li>
                <li>Lặp lại bước 4-5 cho các điểm dừng tiếp theo</li>
                <li>Sau điểm dừng cuối cùng, khi chọn "Đang di chuyển" sẽ <strong>tự động hoàn thành</strong> chuyến đi</li>
              </ol>
            </div>
          }
          type="info"
          showIcon
          className="mb-4"
        />

        <Form
          form={statusForm}
          layout="vertical"
          onFinish={handleUpdateJourneyStatus}
        >
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            initialValue={currentStatus}
          >
            <Select size="large">
              <Select.Option value="preparing">🚏 Chuẩn bị khởi hành</Select.Option>
              <Select.Option value="checking_tickets">🎫 Đang soát vé</Select.Option>
              <Select.Option value="in_transit">🚌 Đang di chuyển</Select.Option>
              <Select.Option value="at_stop">📍 Tại điểm dừng</Select.Option>
              <Select.Option value="completed">✅ Hoàn thành</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.status !== curr.status}
          >
            {({ getFieldValue }) =>
              getFieldValue('status') === 'at_stop' ? (
                <Form.Item
                  name="stopIndex"
                  label="Điểm dừng"
                  rules={[{ required: true, message: 'Vui lòng chọn điểm dừng' }]}
                >
                  <Select size="large" placeholder="Chọn điểm dừng">
                    {stops.map((stop, index) => (
                      <Select.Option key={index} value={index + 1}>
                        Điểm dừng {index + 1}: {stop.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <TextArea
              rows={3}
              placeholder="Nhập ghi chú (tùy chọn)"
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>

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
            <TextArea
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
