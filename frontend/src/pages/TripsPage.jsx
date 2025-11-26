import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Button,
  Select,
  Slider,
  Typography,
  Space,
  Tag,
  Empty,
  Spin,
  Input,
  Form,
  DatePicker,
} from 'antd';
import {
  FiClock,
  FiSearch,
  FiCalendar,
  FiMapPin,
  FiFilter,
  FiWifi,
  FiMonitor,
  FiZap,
  FiTv,
} from 'react-icons/fi';
import { MdSwapHoriz } from 'react-icons/md';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { searchTrips } from '../services/bookingApi';
import useBookingStore from '../store/bookingStore';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const { Title, Text } = Typography;
const { Option } = Select;

const TripsPage = () => {
  const navigate = useNavigate();
  const { searchCriteria, setSelectedTrip, setSearchCriteria } = useBookingStore();
  const [form] = Form.useForm();
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [sortBy, setSortBy] = useState('time');
  const [busType, setBusType] = useState('');

  useEffect(() => {
    if (!searchCriteria.fromCity || !searchCriteria.toCity || !searchCriteria.date) {
      navigate('/');
      return;
    }
    form.setFieldsValue({
      fromCity: searchCriteria.fromCity,
      toCity: searchCriteria.toCity,
      date: dayjs(searchCriteria.date),
    });
    fetchTrips();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [trips, priceRange, sortBy, busType]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await searchTrips(searchCriteria);

      if (response.status === 'success' && response.data?.trips) {
        setTrips(response.data.trips);

        if (response.data.trips.length > 0) {
          const prices = response.data.trips.map(t => t.finalPrice);
          const max = Math.max(...prices);
          setMaxPrice(Math.ceil(max / 10000) * 10000);
          setPriceRange([0, Math.ceil(max / 10000) * 10000]);
        }
      } else {
        setTrips([]);
        toast.error('Không tìm thấy chuyến xe phù hợp');
      }
    } catch (error) {
      setTrips([]);
      toast.error(error || 'Có lỗi xảy ra khi tìm kiếm chuyến xe');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...trips];

    filtered = filtered.filter(
      trip => trip.finalPrice >= priceRange[0] && trip.finalPrice <= priceRange[1]
    );

    if (busType) {
      filtered = filtered.filter(trip => trip.busId?.busType === busType);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'price') {
        return a.finalPrice - b.finalPrice;
      }
      return new Date(a.departureTime) - new Date(b.departureTime);
    });

    setFilteredTrips(filtered);
  };

  const handleTripSelect = (trip) => {
    setSelectedTrip(trip);
    navigate(`/trips/${trip._id}`);
  };

  const handleSearch = async (values) => {
    const searchData = {
      fromCity: values.fromCity,
      toCity: values.toCity,
      date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
      passengers: 1,
    };

    if (!searchData.fromCity || !searchData.toCity || !searchData.date) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setSearchCriteria(searchData);
    fetchTrips();
  };

  const handleSwapCities = () => {
    const fromCity = form.getFieldValue('fromCity');
    const toCity = form.getFieldValue('toCity');
    form.setFieldsValue({
      fromCity: toCity,
      toCity: fromCity,
    });
  };

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  const formatTime = (dateString) => {
    return dayjs(dateString).format('HH:mm');
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const getBusTypes = () => {
    const types = new Set();
    trips.forEach(trip => {
      if (trip.busId?.busType) {
        types.add(trip.busId.busType);
      }
    });
    return Array.from(types);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header with Background */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Title level={1} className="!text-white !mb-2">
            Đặt Vé Của Bạn
          </Title>
        </div>
      </div>

      {/* Want to change the route? Section */}
      <div className="bg-white shadow-md py-8 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Title level={4} className="text-center !mb-6">
            Bạn muốn thay đổi tuyến đường?
          </Title>

          <Card className="max-w-5xl mx-auto shadow-lg">
            <Form form={form} onFinish={handleSearch}>
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={10}>
                  <Form.Item
                    name="fromCity"
                    className="!mb-0"
                    rules={[{ required: true, message: 'Bắt buộc' }]}
                  >
                    <Input
                      size="large"
                      placeholder="Từ..."
                      prefix={<FiMapPin className="text-gray-400" />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={2} className="flex justify-center">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<MdSwapHoriz className="text-white text-xl" />}
                    onClick={handleSwapCities}
                    size="large"
                    className="bg-red-600 hover:bg-red-700 border-red-600"
                  />
                </Col>

                <Col xs={24} md={10}>
                  <Form.Item
                    name="toCity"
                    className="!mb-0"
                    rules={[{ required: true, message: 'Bắt buộc' }]}
                  >
                    <Input
                      size="large"
                      placeholder="Đến..."
                      prefix={<FiMapPin className="text-gray-400" />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="date"
                    className="!mb-0"
                    rules={[{ required: true, message: 'Bắt buộc' }]}
                  >
                    <DatePicker
                      size="large"
                      className="w-full"
                      format="DD/MM/YYYY"
                      placeholder="dd/mm/yyyy"
                      disabledDate={disabledDate}
                      suffixIcon={<FiCalendar />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    icon={<FiSearch />}
                    className="w-full bg-red-600 hover:bg-red-700 border-red-600"
                  >
                    Tìm kiếm
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Row gutter={[24, 24]}>
          {/* Filters Sidebar */}
          <Col xs={24} lg={6}>
            <Card
              title={<><FiFilter className="inline mr-2" />Bộ Lọc</>}
              className="sticky top-4"
            >
              <div className="mb-6">
                <Text strong className="block mb-3">
                  Sắp Xếp Theo
                </Text>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  className="w-full"
                  size="large"
                >
                  <Option value="time">Thời gian khởi hành</Option>
                  <Option value="price">Giá vé</Option>
                </Select>
              </div>

              <div className="mb-6">
                <Text strong className="block mb-3">
                  Khoảng Giá
                </Text>
                <Slider
                  range
                  min={0}
                  max={maxPrice}
                  step={10000}
                  value={priceRange}
                  onChange={setPriceRange}
                  tooltip={{
                    formatter: (value) => formatPrice(value),
                  }}
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Rs. {priceRange[0]}</span>
                  <span>Rs. {maxPrice}</span>
                </div>
              </div>

              {getBusTypes().length > 0 && (
                <div>
                  <Text strong className="block mb-3">
                    Loại Xe
                  </Text>
                  <Select
                    value={busType}
                    onChange={setBusType}
                    className="w-full"
                    placeholder="Tất cả loại xe"
                    size="large"
                    allowClear
                  >
                    {getBusTypes().map(type => (
                      <Option key={type} value={type}>
                        {type}
                      </Option>
                    ))}
                  </Select>
                </div>
              )}
            </Card>
          </Col>

          {/* Trip List */}
          <Col xs={24} lg={18}>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Spin size="large" tip="Đang tìm kiếm chuyến xe..." />
              </div>
            ) : filteredTrips.length === 0 ? (
              <Empty
                description="Không tìm thấy chuyến xe phù hợp"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <Space direction="vertical" size="large" className="w-full">
                {filteredTrips.map(trip => (
                  <Card
                    key={trip._id}
                    className="hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => handleTripSelect(trip)}
                  >
                    <Row gutter={[16, 16]}>
                      {/* Left Section - Trip Info */}
                      <Col xs={24} md={16}>
                        {/* Bus Type Badge */}
                        <div className="mb-3">
                          <Tag color="blue" className="px-3 py-1">
                            <Space>
                              <span>AC</span>
                              <span>{trip.busId?.busType}</span>
                            </Space>
                          </Tag>
                          <Tag color="orange" className="px-3 py-1">
                            {trip.availableSeats} ghế trống
                          </Tag>
                        </div>

                        {/* Time and Route */}
                        <Row align="middle" gutter={16}>
                          <Col xs={8}>
                            <Title level={2} className="!mb-0">
                              {formatTime(trip.departureTime)}
                            </Title>
                            <Text className="text-sm text-gray-600">
                              {trip.routeId?.origin?.city || 'Kathmandu'}
                            </Text>
                          </Col>

                          <Col xs={8} className="text-center">
                            <div className="border-t-2 border-dashed border-gray-300 relative">
                              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2">
                                <FiClock className="text-gray-400" />
                              </div>
                            </div>
                            <Text className="text-xs text-gray-500 block mt-2">
                              {trip.routeId?.estimatedDuration
                                ? `${Math.floor(trip.routeId.estimatedDuration / 60)}h`
                                : '5h'}
                            </Text>
                          </Col>

                          <Col xs={8} className="text-right">
                            <Title level={2} className="!mb-0">
                              {formatTime(trip.arrivalTime)}
                            </Title>
                            <Text className="text-sm text-gray-600">
                              {trip.routeId?.destination?.city || 'Pyuthan'}
                            </Text>
                          </Col>
                        </Row>

                        {/* Amenities */}
                        <div className="mt-4 flex gap-3 text-sm text-gray-600">
                          <Space>
                            <FiWifi />
                            <span>WiFi</span>
                          </Space>
                          <Space>
                            <FiTv />
                            <span>TV</span>
                          </Space>
                          <Space>
                            <FiMonitor />
                            <span>Màn hình</span>
                          </Space>
                          <Space>
                            <FiZap />
                            <span>Sạc điện thoại</span>
                          </Space>
                        </div>
                      </Col>

                      {/* Right Section - Price and Button */}
                      <Col xs={24} md={8} className="flex flex-col justify-between items-end">
                        <div className="text-right">
                          <Text className="text-3xl font-bold">
                            NPR {trip.finalPrice}
                          </Text>
                          <Text className="block text-sm text-gray-500">
                            /mỗi ghế
                          </Text>
                        </div>

                        <Button
                          type="primary"
                          size="large"
                          className="mt-4 bg-red-600 hover:bg-red-700 border-red-600 px-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTripSelect(trip);
                          }}
                        >
                          Đặt Chỗ
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Space>
            )}
          </Col>
        </Row>
      </div>

      <Footer />
    </div>
  );
};

export default TripsPage;
