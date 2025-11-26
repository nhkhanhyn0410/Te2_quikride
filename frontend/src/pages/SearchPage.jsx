import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  DatePicker,
  Button,
  Row,
  Col,
  Typography,
  Spin,
} from 'antd';
import {
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiLock,
  FiRefreshCw,
  FiHeadphones,
  FiWifi,
  FiMonitor,
  FiZap,
  FiTv,
} from 'react-icons/fi';
import { MdSwapHoriz } from 'react-icons/md';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import useBookingStore from '../store/bookingStore';
import { getPopularRoutes } from '../services/bookingApi';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const { Title, Text } = Typography;

const SearchPage = () => {
  const navigate = useNavigate();
  const { searchCriteria, setSearchCriteria } = useBookingStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);

  useEffect(() => {
    fetchPopularRoutes();
  }, []);

  const fetchPopularRoutes = async () => {
    try {
      setLoadingRoutes(true);
      const response = await getPopularRoutes();
      if (response.status === 'success' && response.data?.routes) {
        setPopularRoutes(response.data.routes);
      }
    } catch (error) {
      console.error('Error fetching popular routes:', error);
      // Use fallback data if API fails
      setPopularRoutes([]);
    } finally {
      setLoadingRoutes(false);
    }
  };

  const handleSearch = async (values) => {
    try {
      setLoading(true);

      const searchData = {
        fromCity: values.fromCity,
        toCity: values.toCity,
        date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
        passengers: 1,
      };

      if (!searchData.fromCity || !searchData.toCity) {
        toast.error('Vui lòng nhập điểm đi và điểm đến');
        return;
      }

      if (!searchData.date) {
        toast.error('Vui lòng chọn ngày đi');
        return;
      }

      setSearchCriteria(searchData);
      navigate('/trips');
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi tìm kiếm');
    } finally {
      setLoading(false);
    }
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

  const handleRouteClick = (from, to) => {
    form.setFieldsValue({
      fromCity: from,
      toCity: to,
      date: dayjs(),
    });
    // Auto search when clicking a route
    handleSearch({
      fromCity: from,
      toCity: to,
      date: dayjs(),
    });
  };

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) {
      return <FiWifi className="inline mr-1" />;
    } else if (amenityLower.includes('tv') || amenityLower.includes('tivi')) {
      return <FiTv className="inline mr-1" />;
    } else if (amenityLower.includes('charging') || amenityLower.includes('sạc')) {
      return <FiZap className="inline mr-1" />;
    } else if (amenityLower.includes('monitor') || amenityLower.includes('màn hình')) {
      return <FiMonitor className="inline mr-1" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section with Bus Showcase */}
      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200">
        {/* Background placeholder for bus image */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-300/50 to-gray-400/50">
          <div className="max-w-7xl mx-auto h-full flex items-center justify-center">
            <div className="text-center text-gray-500 opacity-30">
              <div className="text-9xl mb-4">🚌</div>
              <Text className="text-2xl">Hình ảnh giới thiệu xe</Text>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center mb-8">
            <Text className="text-gray-700 text-lg mb-2 block">
              Đặt vé xe khách của bạn
            </Text>
            <Title level={1} className="!text-4xl md:!text-5xl !mb-6 !font-bold">
              Tìm Chuyến Xe Tốt Nhất Cho Bạn!
            </Title>
          </div>

          {/* Search Form */}
          <Card className="max-w-5xl mx-auto shadow-2xl">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSearch}
              initialValues={{
                fromCity: searchCriteria.fromCity,
                toCity: searchCriteria.toCity,
                date: searchCriteria.date ? dayjs(searchCriteria.date) : null,
              }}
            >
              <Row gutter={[16, 16]} align="middle">
                {/* From City */}
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
                      className="!py-3"
                    />
                  </Form.Item>
                </Col>

                {/* Swap Button */}
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

                {/* To City */}
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
                      className="!py-3"
                    />
                  </Form.Item>
                </Col>

                {/* Date */}
                <Col xs={24} md={12}>
                  <Form.Item
                    name="date"
                    className="!mb-0"
                    rules={[{ required: true, message: 'Bắt buộc' }]}
                  >
                    <DatePicker
                      size="large"
                      className="w-full !py-3"
                      format="DD/MM/YYYY"
                      placeholder="dd/mm/yyyy"
                      disabledDate={disabledDate}
                      suffixIcon={<FiCalendar />}
                    />
                  </Form.Item>
                </Col>

                {/* Search Button */}
                <Col xs={24} md={12}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    icon={<FiSearch />}
                    className="w-full !py-6 !h-auto text-lg font-semibold bg-red-600 hover:bg-red-700 border-red-600"
                  >
                    Tìm kiếm
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Title level={2} className="!mb-2">
              Dịch Vụ <span className="text-red-600">Của Chúng Tôi</span>
            </Title>
          </div>

          <Row gutter={[32, 32]}>
            {/* Secure Payment */}
            <Col xs={24} md={8}>
              <Card className="text-center h-full hover:shadow-xl transition-shadow border-gray-200">
                <div className="mb-4 flex justify-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiLock className="text-4xl text-gray-700" />
                  </div>
                </div>
                <Title level={4} className="!mb-3">
                  Thanh Toán An Toàn
                </Title>
                <Text className="text-gray-600">
                  Tích hợp cổng thanh toán an toàn để người dùng thanh toán vé của họ
                </Text>
              </Card>
            </Col>

            {/* Refund Policy */}
            <Col xs={24} md={8}>
              <Card className="text-center h-full hover:shadow-xl transition-shadow border-gray-200">
                <div className="mb-4 flex justify-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiRefreshCw className="text-4xl text-gray-700" />
                  </div>
                </div>
                <Title level={4} className="!mb-3">
                  Chính Sách Hoàn Tiền
                </Title>
                <Text className="text-gray-600">
                  Cung cấp các tùy chọn cho người dùng mua vé có thể hoàn lại với điều khoản rõ ràng
                </Text>
              </Card>
            </Col>

            {/* 24/7 Support */}
            <Col xs={24} md={8}>
              <Card className="text-center h-full hover:shadow-xl transition-shadow border-gray-200">
                <div className="mb-4 flex justify-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiHeadphones className="text-4xl text-gray-700" />
                  </div>
                </div>
                <Title level={4} className="!mb-3">
                  Hỗ Trợ 24/7
                </Title>
                <Text className="text-gray-600">
                  Nhận hỗ trợ bất cứ lúc nào qua chat, email hoặc điện thoại
                </Text>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Top Search Routes Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Title level={2} className="!mb-2">
              Tuyến Đường <span className="text-red-600">Phổ Biến</span>
            </Title>
          </div>

          {loadingRoutes ? (
            <div className="flex justify-center py-12">
              <Spin size="large" tip="Đang tải tuyến đường phổ biến..." />
            </div>
          ) : popularRoutes.length === 0 ? (
            <div className="text-center py-12">
              <Text className="text-gray-500">Không có tuyến đường phổ biến</Text>
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {popularRoutes.map((route, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <Card
                    className="hover:shadow-xl transition-all cursor-pointer border-gray-200"
                    onClick={() => handleRouteClick(route.from, route.to)}
                  >
                    {/* Route Header */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <Text strong className="block text-base">
                            Từ
                          </Text>
                          <Title level={5} className="!mb-0">
                            {route.from}
                          </Title>
                        </div>
                        <div className="text-center px-2">
                          <div className="text-gray-400">→</div>
                        </div>
                        <div className="text-right">
                          <Text strong className="block text-base">
                            Đến
                          </Text>
                          <Title level={5} className="!mb-0">
                            {route.to}
                          </Title>
                        </div>
                      </div>

                      {/* Route Info */}
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <FiMapPin />
                          {route.distance || 'N/A'} km
                        </span>
                        {route.duration && (
                          <span className="flex items-center gap-1">
                            • {route.duration}
                          </span>
                        )}
                      </div>

                      {/* Amenities */}
                      {route.amenities && route.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                          {route.amenities.map((amenity, i) => (
                            <span key={i} className="flex items-center gap-1">
                              {getAmenityIcon(amenity)}
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Price and Button */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <Text className="text-xs text-gray-500 block">Từ</Text>
                        <Text className="text-2xl font-bold text-red-600">
                          {route.minPrice ? `${route.minPrice.toLocaleString('vi-VN')}đ` : 'N/A'}
                        </Text>
                      </div>
                      <Button
                        type="primary"
                        size="large"
                        className="bg-red-600 hover:bg-red-700 border-red-600"
                        icon={<FiSearch />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRouteClick(route.from, route.to);
                        }}
                      >
                        Đặt Vé
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;
