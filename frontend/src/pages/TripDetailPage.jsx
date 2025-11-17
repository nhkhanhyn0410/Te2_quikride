import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Space,
  Tag,
  Divider,
  Spin,
  Descriptions,
  message,
} from 'antd';
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  ArrowLeftOutlined,
  CarOutlined,
  PhoneOutlined,
  MailOutlined,
  StarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { getTripDetails, getAvailableSeats } from '../services/bookingApi';
import useBookingStore from '../store/bookingStore';
import SeatMapComponent from '../components/SeatMapComponent';

const { Title, Text } = Typography;

const TripDetailPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { selectedTrip, setSelectedTrip, selectedSeats, setPickupPoint, setDropoffPoint } =
    useBookingStore();

  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedDropoff, setSelectedDropoff] = useState(null);

  useEffect(() => {
    fetchTripDetails();
    fetchAvailableSeats();
  }, [tripId]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const response = await getTripDetails(tripId);

      console.log('Trip detail response:', response);

      if (response.status === 'success' && response.data?.trip) {
        setTrip(response.data.trip);
        setSelectedTrip(response.data.trip);
      } else {
        toast.error('Không tìm thấy thông tin chuyến xe');
        navigate('/');
      }
    } catch (error) {
      console.error('Fetch trip details error:', error);
      toast.error(error || 'Có lỗi xảy ra');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSeats = async () => {
    try {
      const response = await getAvailableSeats(tripId);
      console.log('Available seats response:', response);

      if (response.status === 'success' && response.data) {
        setAvailableSeats(response.data.availableSeats || response.data.available || []);
      }
    } catch (error) {
      console.error('Fetch available seats error:', error);
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      message.warning('Vui lòng chọn ghế');
      return;
    }

    if (!selectedPickup) {
      message.warning('Vui lòng chọn điểm đón');
      return;
    }

    if (!selectedDropoff) {
      message.warning('Vui lòng chọn điểm trả');
      return;
    }

    // Store pickup/dropoff points
    setPickupPoint(selectedPickup);
    setDropoffPoint(selectedDropoff);

    // Navigate to passenger info
    navigate('/booking/passenger-info');
  };

  const formatTime = (dateString) => {
    return dayjs(dateString).format('HH:mm, DD/MM/YYYY');
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const calculateTotalPrice = () => {
    if (!trip) return 0;
    return trip.finalPrice * selectedSeats.length;
  };

  if (loading || !trip) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Đang tải thông tin chuyến xe..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/trips')}
          >
            Quay lại
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Row gutter={[24, 24]}>
          {/* Trip Information */}
          <Col xs={24} lg={16}>
            {/* Operator Info */}
            <Card className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <Title level={3}>{trip.operator?.companyName}</Title>
                  {trip.operator?.rating && (
                    <div>
                      <Tag color="gold">
                        <StarOutlined /> {trip.operator.rating.average?.toFixed(1)}
                      </Tag>
                      <Text className="text-gray-500">
                        ({trip.operator.rating.total} đánh giá)
                      </Text>
                    </div>
                  )}
                </div>
                <Space direction="vertical" className="text-right">
                  <Text>
                    <PhoneOutlined /> {trip.operator?.phone}
                  </Text>
                  <Text>
                    <MailOutlined /> {trip.operator?.email}
                  </Text>
                </Space>
              </div>
            </Card>

            {/* Route & Schedule Info */}
            <Card title="Thông tin lộ trình" className="mb-6">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Tuyến đường">
                  <strong>{trip.route?.name}</strong> ({trip.route?.code})
                </Descriptions.Item>
                <Descriptions.Item label="Điểm đi">
                  <EnvironmentOutlined /> {trip.route?.origin?.city} - {trip.route?.origin?.address}
                </Descriptions.Item>
                <Descriptions.Item label="Điểm đến">
                  <EnvironmentOutlined /> {trip.route?.destination?.city} -{' '}
                  {trip.route?.destination?.address}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian khởi hành">
                  <ClockCircleOutlined /> {formatTime(trip.departureTime)}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian đến">
                  <ClockCircleOutlined /> {formatTime(trip.arrivalTime)}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian di chuyển">
                  {trip.duration?.formatted || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Khoảng cách">
                  {trip.route?.distance} km
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Bus Info */}
            <Card title={<><CarOutlined /> Thông tin xe</>} className="mb-6">
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Biển số xe">{trip.bus?.busNumber}</Descriptions.Item>
                <Descriptions.Item label="Loại xe">{trip.bus?.busType}</Descriptions.Item>
                <Descriptions.Item label="Tổng số ghế" span={2}>
                  {trip.seats?.total} ghế ({trip.seats?.available} ghế trống)
                </Descriptions.Item>
                <Descriptions.Item label="Tiện nghi" span={2}>
                  <Space wrap>
                    {trip.bus?.amenities?.map(amenity => (
                      <Tag key={amenity} color="blue">{amenity}</Tag>
                    ))}
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Pickup Points */}
            <Card title="Điểm đón" className="mb-6">
              <Space direction="vertical" className="w-full">
                {trip.route?.pickupPoints?.map((point, index) => (
                  <Card
                    key={index}
                    size="small"
                    className={`cursor-pointer ${
                      selectedPickup?.name === point.name ? 'border-blue-500 border-2' : ''
                    }`}
                    onClick={() => setSelectedPickup(point)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <Text strong>{point.name}</Text>
                        <div className="text-sm text-gray-500">{point.address}</div>
                      </div>
                      <Text>{dayjs(point.time).format('HH:mm')}</Text>
                    </div>
                  </Card>
                ))}
              </Space>
            </Card>

            {/* Dropoff Points */}
            <Card title="Điểm trả" className="mb-6">
              <Space direction="vertical" className="w-full">
                {trip.route?.dropoffPoints?.map((point, index) => (
                  <Card
                    key={index}
                    size="small"
                    className={`cursor-pointer ${
                      selectedDropoff?.name === point.name ? 'border-blue-500 border-2' : ''
                    }`}
                    onClick={() => setSelectedDropoff(point)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <Text strong>{point.name}</Text>
                        <div className="text-sm text-gray-500">{point.address}</div>
                      </div>
                      <Text>{dayjs(point.time).format('HH:mm')}</Text>
                    </div>
                  </Card>
                ))}
              </Space>
            </Card>

            {/* Policies */}
            {trip.policies && (
              <Card title="Chính sách" className="mb-6">
                <div className="whitespace-pre-line">{trip.policies}</div>
              </Card>
            )}
          </Col>

          {/* Seat Selection & Booking Summary */}
          <Col xs={24} lg={8}>
            {/* Seat Map */}
            <Card title="Chọn ghế" className="mb-6 sticky top-4">
              <SeatMapComponent
                seatLayout={trip.bus?.seatLayout}
                bookedSeats={trip.seats?.bookedSeatNumbers || []}
                availableSeats={availableSeats}
              />

              <Divider />

              {/* Selected Seats */}
              <div className="mb-4">
                <Text strong>Ghế đã chọn:</Text>
                <div className="mt-2">
                  {selectedSeats.length === 0 ? (
                    <Text className="text-gray-400">Chưa chọn ghế</Text>
                  ) : (
                    <Space wrap>
                      {selectedSeats.map(seat => (
                        <Tag key={seat.seatNumber} color="blue" className="text-base px-3 py-1">
                          {seat.seatNumber}
                        </Tag>
                      ))}
                    </Space>
                  )}
                </div>
              </div>

              <Divider />

              {/* Price Summary */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <Text>Giá vé ({selectedSeats.length} ghế)</Text>
                  <Text>{formatPrice(calculateTotalPrice())}</Text>
                </div>
                {trip.pricing?.discount > 0 && (
                  <div className="flex justify-between mb-2">
                    <Text>Giảm giá ({trip.pricing.discount}%)</Text>
                    <Text className="text-red-500">
                      -{formatPrice(trip.pricing.basePrice * selectedSeats.length - calculateTotalPrice())}
                    </Text>
                  </div>
                )}
                <Divider className="my-2" />
                <div className="flex justify-between">
                  <Text strong className="text-lg">Tổng cộng</Text>
                  <Text strong className="text-lg text-blue-600">
                    {formatPrice(calculateTotalPrice())}
                  </Text>
                </div>
              </div>

              <Button
                type="primary"
                size="large"
                block
                onClick={handleContinue}
                disabled={selectedSeats.length === 0 || !selectedPickup || !selectedDropoff}
              >
                Tiếp tục
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TripDetailPage;
