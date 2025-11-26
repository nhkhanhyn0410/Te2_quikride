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
  message,
  Badge,
} from 'antd';
import {
  FiArrowLeft,
  FiMapPin,
  FiAlertCircle,
} from 'react-icons/fi';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { getTripDetails, getAvailableSeats } from '../services/bookingApi';
import useBookingStore from '../store/bookingStore';
import SeatMapComponent from '../components/SeatMapComponent';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const { Title, Text } = Typography;

const TripDetailPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const {
    selectedTrip,
    setSelectedTrip,
    selectedSeats,
    setPickupPoint,
    setDropoffPoint,
    clearSeats,
  } = useBookingStore();

  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedDropoff, setSelectedDropoff] = useState(null);

  useEffect(() => {
    clearSeats();
    fetchTripDetails();
    fetchAvailableSeats();
  }, [tripId]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const response = await getTripDetails(tripId);

      if (response.status === 'success' && response.data?.trip) {
        const tripData = response.data.trip;
        setTrip(tripData);
        setSelectedTrip(tripData);

        // Auto-select first pickup and dropoff points
        if (tripData.route?.pickupPoints?.length > 0) {
          setSelectedPickup(tripData.route.pickupPoints[0]);
        }
        if (tripData.route?.dropoffPoints?.length > 0) {
          setSelectedDropoff(tripData.route.dropoffPoints[0]);
        }
      } else {
        toast.error('Không tìm thấy thông tin chuyến xe');
        navigate('/');
      }
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSeats = async () => {
    try {
      const response = await getAvailableSeats(tripId);
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

    setPickupPoint(selectedPickup);
    setDropoffPoint(selectedDropoff);
    navigate('/booking/passenger-info');
  };

  const formatTime = (dateString) => {
    return dayjs(dateString).format('HH:mm');
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format('DD/MM/YYYY');
  };

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return '0đ';
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const getSeatPrice = () => {
    return trip?.pricing?.finalPrice || trip?.finalPrice || trip?.pricing?.basePrice || 0;
  };

  const calculateTotalPrice = () => {
    if (!trip || selectedSeats.length === 0) return 0;
    const price = getSeatPrice();
    return price * selectedSeats.length;
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
      <Header />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            icon={<FiArrowLeft />}
            onClick={() => navigate('/trips')}
            className="mb-4 text-white border-white hover:bg-white/20"
          >
            Quay lại
          </Button>
          <Title level={1} className="!text-white !mb-2">
            Chi Tiết Xe
          </Title>
          <Text className="text-gray-300">
            Nhấp vào ghế trống để đặt chỗ
          </Text>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Row gutter={[24, 24]}>
          {/* Left Section - Seat Map */}
          <Col xs={24} lg={14}>
            <Card title="Sơ Đồ Chỗ Ngồi" className="shadow-lg">
              <SeatMapComponent
                seatLayout={trip.bus?.seatLayout}
                bookedSeats={trip.seats?.bookedSeatNumbers || []}
                heldSeats={trip.seats?.heldSeatNumbers || []}
                availableSeats={availableSeats}
              />
            </Card>

            {/* Pickup Points */}
            {trip.route?.pickupPoints && trip.route.pickupPoints.length > 0 && (
              <Card title="Điểm Đón" className="mt-6 shadow-lg">
                <Space direction="vertical" className="w-full">
                  {trip.route.pickupPoints.map((point, index) => (
                    <Card
                      key={index}
                      size="small"
                      className={`cursor-pointer transition-all ${
                        selectedPickup?.name === point.name
                          ? 'border-red-600 border-2 bg-red-50'
                          : 'hover:border-red-400'
                      }`}
                      onClick={() => setSelectedPickup(point)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <Text strong>{point.name}</Text>
                          <div className="text-sm text-gray-500">
                            <FiMapPin className="inline mr-1" /> {point.address}
                          </div>
                        </div>
                        <Text strong className="text-red-600">
                          {formatTime(trip.departureTime)}
                        </Text>
                      </div>
                    </Card>
                  ))}
                </Space>
              </Card>
            )}

            {/* Dropoff Points */}
            {trip.route?.dropoffPoints && trip.route.dropoffPoints.length > 0 && (
              <Card title="Điểm Trả" className="mt-6 shadow-lg">
                <Space direction="vertical" className="w-full">
                  {trip.route.dropoffPoints.map((point, index) => (
                    <Card
                      key={index}
                      size="small"
                      className={`cursor-pointer transition-all ${
                        selectedDropoff?.name === point.name
                          ? 'border-red-600 border-2 bg-red-50'
                          : 'hover:border-red-400'
                      }`}
                      onClick={() => setSelectedDropoff(point)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <Text strong>{point.name}</Text>
                          <div className="text-sm text-gray-500">
                            <FiMapPin className="inline mr-1" /> {point.address}
                          </div>
                        </div>
                        <Text strong className="text-red-600">
                          {formatTime(trip.arrivalTime)}
                        </Text>
                      </div>
                    </Card>
                  ))}
                </Space>
              </Card>
            )}
          </Col>

          {/* Right Section - Booking Summary */}
          <Col xs={24} lg={10}>
            <Card className="shadow-lg sticky top-4">
              {/* Your Destination */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <Title level={5} className="!mb-0">
                    Điểm Đến Của Bạn
                  </Title>
                  <Button
                    type="link"
                    size="small"
                    className="text-red-600"
                    onClick={() => navigate('/trips')}
                  >
                    Thay đổi tuyến
                  </Button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <Text className="text-xs text-gray-500 block">Từ (Điểm Đón)</Text>
                      <Text strong className="block">
                        {selectedPickup?.name || trip.route?.origin?.city || 'Chưa chọn'}
                      </Text>
                      <Text className="text-xs text-gray-600">
                        {trip.route?.origin?.city} ({formatTime(trip.departureTime)})
                      </Text>
                    </div>
                    <Badge
                      count={`${selectedSeats.length}`}
                      showZero
                      className="bg-red-600"
                      style={{ backgroundColor: '#DC2626' }}
                    />
                  </div>

                  <Divider className="my-3" />

                  <div>
                    <Text className="text-xs text-gray-500 block">Đến</Text>
                    <Text strong className="block">
                      {selectedDropoff?.name || trip.route?.destination?.city || 'Chưa chọn'}
                    </Text>
                    <Text className="text-xs text-gray-600">
                      {trip.route?.destination?.city} ({formatTime(trip.arrivalTime)})
                    </Text>
                  </div>
                </div>
              </div>

              <Divider />

              {/* Selected Seats */}
              <div className="mb-6">
                <Title level={5} className="!mb-3">
                  Ghế Đã Chọn
                </Title>
                {selectedSeats.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <Text className="text-yellow-700">Chưa chọn ghế nào</Text>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <Space wrap size={[8, 8]}>
                      {selectedSeats.map(seat => (
                        <Tag
                          key={seat.seatNumber}
                          color="red"
                          className="text-base px-4 py-2 font-semibold"
                        >
                          {seat.seatNumber}
                        </Tag>
                      ))}
                    </Space>
                    <Divider className="my-3" />
                    <div className="flex justify-between items-center">
                      <Text className="text-sm text-gray-600">Tổng ghế:</Text>
                      <Text strong className="text-lg">
                        {selectedSeats.length} ghế
                      </Text>
                    </div>
                  </div>
                )}
              </div>

              {selectedSeats.length > 0 && (
                <>
                  <Divider />

                  {/* Fare Details */}
                  <div className="mb-6">
                    <Title level={5} className="!mb-3">
                      Chi Tiết Giá
                    </Title>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Text className="text-gray-600">Giá cơ bản:</Text>
                        <Text>{formatPrice(getSeatPrice())}</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text className="text-gray-600">Số lượng ghế:</Text>
                        <Text>{selectedSeats.length} x {formatPrice(getSeatPrice())}</Text>
                      </div>
                      {trip.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <Text className="text-green-600">Giảm giá ({trip.discount}%):</Text>
                          <Text className="text-green-600">
                            -{formatPrice(getSeatPrice() * selectedSeats.length * trip.discount / 100)}
                          </Text>
                        </div>
                      )}
                      <Divider className="my-2" />
                      <div className="flex justify-between items-center">
                        <Text strong className="text-lg">Tổng Giá:</Text>
                        <Text strong className="text-2xl text-red-600">
                          NPR {calculateTotalPrice()}
                        </Text>
                      </div>
                      <Text className="text-xs text-gray-500 block text-center">
                        (Đã bao gồm thuế)
                      </Text>
                    </div>
                  </div>
                </>
              )}

              {/* Checkout Button */}
              <Button
                type="primary"
                size="large"
                block
                onClick={handleContinue}
                disabled={selectedSeats.length === 0 || !selectedPickup || !selectedDropoff}
                className="!h-14 text-lg font-bold bg-red-600 hover:bg-red-700 border-red-600 disabled:bg-gray-400"
              >
                TIẾN HÀNH THANH TOÁN
              </Button>

              {/* Refund Notice */}
              <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
                <Text className="text-xs text-orange-700 flex items-center justify-center gap-2">
                  <FiAlertCircle /> Không hoàn tiền
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <Footer />
    </div>
  );
};

export default TripDetailPage;
