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
  Divider,
  Input,
} from 'antd';
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  StarOutlined,
  ArrowLeftOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { searchTrips } from '../services/bookingApi';
import useBookingStore from '../store/bookingStore';
import { getAmenityIcon } from '../utils/constants';

const { Title, Text } = Typography;
const { Option } = Select;

const TripsPage = () => {
  const navigate = useNavigate();
  const { searchCriteria, setSelectedTrip } = useBookingStore();
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [sortBy, setSortBy] = useState('time');
  const [sortOrder, setSortOrder] = useState('asc');
  const [busType, setBusType] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('');

  useEffect(() => {
    if (!searchCriteria.fromCity || !searchCriteria.toCity || !searchCriteria.date) {
      navigate('/');
      return;
    }
    fetchTrips();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [trips, priceRange, sortBy, sortOrder, busType, operatorFilter]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await searchTrips(searchCriteria);

      console.log('Search response:', response);

      if (response.status === 'success' && response.data?.trips) {
        setTrips(response.data.trips);

        // Calculate max price for slider
        if (response.data.trips.length > 0) {
          const prices = response.data.trips.map(t => t.finalPrice);
          const max = Math.max(...prices);
          setMaxPrice(Math.ceil(max / 10000) * 10000); // Round up to nearest 10k
          setPriceRange([0, Math.ceil(max / 10000) * 10000]);
        }
      } else {
        setTrips([]);
        toast.error('Không tìm thấy chuyến xe phù hợp');
      }
    } catch (error) {
      console.error('Fetch trips error:', error);
      setTrips([]);
      toast.error(error || 'Có lỗi xảy ra khi tìm kiếm chuyến xe');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...trips];

    // Filter by price range
    filtered = filtered.filter(
      trip => trip.finalPrice >= priceRange[0] && trip.finalPrice <= priceRange[1]
    );

    // Filter by bus type
    if (busType) {
      filtered = filtered.filter(trip => trip.busId?.busType === busType);
    }

    // Filter by operator
    if (operatorFilter) {
      filtered = filtered.filter(trip =>
        trip.operatorId?.companyName.toLowerCase().includes(operatorFilter.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'price':
          comparison = a.finalPrice - b.finalPrice;
          break;
        case 'rating':
          comparison = (b.operatorId?.averageRating || 0) - (a.operatorId?.averageRating || 0);
          break;
        case 'time':
        default:
          comparison = new Date(a.departureTime) - new Date(b.departureTime);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredTrips(filtered);
  };

  const handleTripSelect = (trip) => {
    setSelectedTrip(trip);
    navigate(`/trips/${trip._id}`);
  };

  const formatTime = (dateString) => {
    return dayjs(dateString).format('HH:mm');
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format('DD/MM/YYYY');
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
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Space>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/')}
              >
                Quay lại
              </Button>
              <Title level={4} className="!mb-0">
                {searchCriteria.fromCity} → {searchCriteria.toCity}
              </Title>
            </Space>
            <Text className="text-gray-600">
              {formatDate(searchCriteria.date)}
            </Text>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Row gutter={[24, 24]}>
          {/* Filters Sidebar */}
          <Col xs={24} lg={6}>
            <Card title={<><FilterOutlined /> Bộ lọc</>} className="sticky top-4">
              {/* Sort */}
              <div className="mb-4">
                <Text strong>Sắp xếp theo</Text>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  className="w-full mt-2"
                >
                  <Option value="time">Thời gian</Option>
                  <Option value="price">Giá vé</Option>
                  <Option value="rating">Đánh giá</Option>
                </Select>
              </div>

              <div className="mb-4">
                <Text strong>Thứ tự</Text>
                <Select
                  value={sortOrder}
                  onChange={setSortOrder}
                  className="w-full mt-2"
                >
                  <Option value="asc">Tăng dần</Option>
                  <Option value="desc">Giảm dần</Option>
                </Select>
              </div>

              <Divider />

              {/* Price Range */}
              <div className="mb-4">
                <Text strong>Khoảng giá</Text>
                <Slider
                  range
                  min={0}
                  max={maxPrice}
                  step={10000}
                  value={priceRange}
                  onChange={setPriceRange}
                  className="mt-2"
                  tooltip={{
                    formatter: (value) => formatPrice(value),
                  }}
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>

              <Divider />

              {/* Bus Type */}
              <div className="mb-4">
                <Text strong>Loại xe</Text>
                <Select
                  value={busType}
                  onChange={setBusType}
                  className="w-full mt-2"
                  placeholder="Tất cả"
                  allowClear
                >
                  {getBusTypes().map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </div>

              <Divider />

              {/* Operator Filter */}
              <div>
                <Text strong>Nhà xe</Text>
                <Input
                  placeholder="Tìm theo tên nhà xe"
                  value={operatorFilter}
                  onChange={(e) => setOperatorFilter(e.target.value)}
                  className="mt-2"
                  allowClear
                />
              </div>
            </Card>
          </Col>

          {/* Trip List */}
          <Col xs={24} lg={18}>
            <div className="mb-4 flex justify-between items-center">
              <Text strong className="text-lg">
                Tìm thấy {filteredTrips.length} chuyến xe
              </Text>
            </div>

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
              <Space direction="vertical" size="middle" className="w-full">
                {filteredTrips.map(trip => (
                  <Card
                    key={trip._id}
                    hoverable
                    className="cursor-pointer"
                    onClick={() => handleTripSelect(trip)}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={18}>
                        {/* Operator Name */}
                        <div className="mb-2">
                          <Text strong className="text-lg">
                            {trip.operatorId?.companyName}
                          </Text>
                          {trip.operatorId?.averageRating && (
                            <Tag color="gold" className="ml-2">
                              <StarOutlined /> {trip.operatorId.averageRating.toFixed(1)}
                            </Tag>
                          )}
                        </div>

                        {/* Route Info */}
                        <div className="flex items-center gap-4 mb-2">
                          <div>
                            <Text className="text-2xl font-bold">
                              {formatTime(trip.departureTime)}
                            </Text>
                            <div className="text-sm text-gray-600">
                              {trip.routeId?.origin?.city}
                            </div>
                          </div>

                          <div className="flex-1 text-center">
                            <div className="text-gray-400">
                              <ClockCircleOutlined /> ~{Math.floor(trip.routeId?.estimatedDuration / 60)}h
                            </div>
                            <div className="border-t-2 border-dashed border-gray-300 my-1"></div>
                            <Text className="text-xs text-gray-500">
                              {trip.routeId?.distance}km
                            </Text>
                          </div>

                          <div className="text-right">
                            <Text className="text-2xl font-bold">
                              {formatTime(trip.arrivalTime)}
                            </Text>
                            <div className="text-sm text-gray-600">
                              {trip.routeId?.destination?.city}
                            </div>
                          </div>
                        </div>

                        {/* Bus Info */}
                        <div className="flex gap-2 flex-wrap">
                          <Tag>{trip.busId?.busType}</Tag>
                          <Tag>
                            {trip.availableSeats}/{trip.totalSeats} ghế trống
                          </Tag>
                          {trip.busId?.amenities?.map(amenity => (
                            <Tag key={amenity} color="blue">
                              {getAmenityIcon(amenity)} {amenity}
                            </Tag>
                          ))}
                        </div>
                      </Col>

                      <Col xs={24} md={6} className="flex flex-col justify-between items-end">
                        <div className="text-right">
                          {trip.discount > 0 && (
                            <Text delete className="text-gray-400 block">
                              {formatPrice(trip.basePrice)}
                            </Text>
                          )}
                          <Text className="text-2xl font-bold text-blue-600">
                            {formatPrice(trip.finalPrice)}
                          </Text>
                          {trip.discount > 0 && (
                            <Tag color="red" className="mt-1">
                              -{trip.discount}%
                            </Tag>
                          )}
                        </div>

                        <Button
                          type="primary"
                          size="large"
                          className="mt-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTripSelect(trip);
                          }}
                        >
                          Chọn chuyến
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
    </div>
  );
};

export default TripsPage;
