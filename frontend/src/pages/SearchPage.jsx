import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Row,
  Col,
  Typography,
  Space,
} from 'antd';
import {
  SearchOutlined,
  SwapOutlined,
  CalendarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import useBookingStore from '../store/bookingStore';

const { Title, Text } = Typography;

const SearchPage = () => {
  const navigate = useNavigate();
  const { searchCriteria, setSearchCriteria } = useBookingStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSearch = async (values) => {
    try {
      setLoading(true);

      // Format date to YYYY-MM-DD
      const searchData = {
        fromCity: values.fromCity,
        toCity: values.toCity,
        date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
        passengers: values.passengers || 1,
      };

      // Validate
      if (!searchData.fromCity || !searchData.toCity) {
        toast.error('Vui lòng nhập điểm đi và điểm đến');
        return;
      }

      if (!searchData.date) {
        toast.error('Vui lòng chọn ngày đi');
        return;
      }

      // Store search criteria
      setSearchCriteria(searchData);

      // Navigate to results page
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

  // Disable past dates
  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Title level={3} className="!mb-0 text-blue-600">
              🚌 QuikRide
            </Title>
            <Space>
              <Button type="link" onClick={() => navigate('/my-bookings')}>
                Vé của tôi
              </Button>
              <Button type="link" onClick={() => navigate('/operator/login')}>
                Nhà xe
              </Button>
            </Space>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <Title level={1} className="!text-4xl md:!text-5xl !mb-4">
            Đặt vé xe khách trực tuyến
          </Title>
          <Text className="text-lg text-gray-600">
            Tìm và đặt vé xe khách nhanh chóng, tiện lợi
          </Text>
        </div>

        {/* Search Card */}
        <Card className="shadow-2xl rounded-2xl max-w-4xl mx-auto">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSearch}
            initialValues={{
              fromCity: searchCriteria.fromCity,
              toCity: searchCriteria.toCity,
              date: searchCriteria.date ? dayjs(searchCriteria.date) : null,
              passengers: searchCriteria.passengers || 1,
            }}
          >
            <Row gutter={[16, 16]}>
              {/* From City */}
              <Col xs={24} md={11}>
                <Form.Item
                  name="fromCity"
                  label="Điểm đi"
                  rules={[{ required: true, message: 'Vui lòng nhập điểm đi' }]}
                >
                  <Input
                    size="large"
                    placeholder="VD: Hà Nội, TP HCM..."
                    prefix={<SearchOutlined className="text-gray-400" />}
                  />
                </Form.Item>
              </Col>

              {/* Swap Button */}
              <Col xs={24} md={2} className="flex items-center justify-center">
                <Button
                  type="text"
                  icon={<SwapOutlined />}
                  onClick={handleSwapCities}
                  className="mt-6"
                />
              </Col>

              {/* To City */}
              <Col xs={24} md={11}>
                <Form.Item
                  name="toCity"
                  label="Điểm đến"
                  rules={[{ required: true, message: 'Vui lòng nhập điểm đến' }]}
                >
                  <Input
                    size="large"
                    placeholder="VD: Đà Nẵng, Nha Trang..."
                    prefix={<SearchOutlined className="text-gray-400" />}
                  />
                </Form.Item>
              </Col>

              {/* Date */}
              <Col xs={24} md={12}>
                <Form.Item
                  name="date"
                  label="Ngày đi"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày đi' }]}
                >
                  <DatePicker
                    size="large"
                    className="w-full"
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày đi"
                    disabledDate={disabledDate}
                    suffixIcon={<CalendarOutlined />}
                  />
                </Form.Item>
              </Col>

              {/* Passengers */}
              <Col xs={24} md={12}>
                <Form.Item
                  name="passengers"
                  label="Số lượng ghế"
                  rules={[{ required: true, message: 'Vui lòng nhập số lượng ghế' }]}
                >
                  <InputNumber
                    size="large"
                    min={1}
                    max={10}
                    className="w-full"
                    placeholder="Số lượng ghế"
                    prefix={<UserOutlined className="text-gray-400" />}
                  />
                </Form.Item>
              </Col>

              {/* Submit Button */}
              <Col xs={24}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  icon={<SearchOutlined />}
                  className="w-full h-12 text-lg font-semibold"
                >
                  Tìm chuyến xe
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🎫</div>
            <Title level={4}>Đặt vé dễ dàng</Title>
            <Text className="text-gray-600">
              Tìm kiếm và đặt vé xe khách chỉ với vài bước đơn giản
            </Text>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">💳</div>
            <Title level={4}>Thanh toán an toàn</Title>
            <Text className="text-gray-600">
              Nhiều phương thức thanh toán tiện lợi và bảo mật
            </Text>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">⚡</div>
            <Title level={4}>Xác nhận nhanh chóng</Title>
            <Text className="text-gray-600">
              Nhận vé điện tử ngay sau khi thanh toán thành công
            </Text>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
