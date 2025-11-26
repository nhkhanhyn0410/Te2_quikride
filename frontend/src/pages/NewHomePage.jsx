import { useState } from 'react';
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
  Space,
  Statistic,
} from 'antd';
import {
  SearchOutlined,
  SwapOutlined,
  CalendarOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  DollarOutlined,
  StarOutlined,
  TrophyOutlined,
  GiftOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { toast } from 'react-hot-toast';
import useBookingStore from '../store/bookingStore';
import CustomerLayout from '../components/customer/CustomerLayout';

const { Title, Text, Paragraph } = Typography;

const NewHomePage = () => {
  const navigate = useNavigate();
  const { setSearchCriteria } = useBookingStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

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

  const features = [
    {
      icon: <ThunderboltOutlined className="text-4xl text-blue-500" />,
      title: 'Đặt vé nhanh chóng',
      description: 'Chỉ vài bước đơn giản để hoàn tất đặt vé',
    },
    {
      icon: <SafetyOutlined className="text-4xl text-green-500" />,
      title: 'An toàn & tin cậy',
      description: 'Đối tác với các nhà xe uy tín',
    },
    {
      icon: <DollarOutlined className="text-4xl text-orange-500" />,
      title: 'Giá tốt nhất',
      description: 'So sánh giá từ nhiều nhà xe',
    },
    {
      icon: <GiftOutlined className="text-4xl text-purple-500" />,
      title: 'Ưu đãi hấp dẫn',
      description: 'Voucher và khuyến mãi liên tục',
    },
  ];

  const loyaltyFeatures = [
    {
      icon: <TrophyOutlined className="text-3xl text-yellow-500" />,
      title: 'Tích điểm Loyalty',
      description: '1 điểm mỗi 10,000 VND chi tiêu',
      link: '/loyalty',
    },
    {
      icon: <StarOutlined className="text-3xl text-blue-500" />,
      title: 'Đánh giá & Review',
      description: 'Chia sẻ trải nghiệm của bạn',
      link: '/my-reviews',
    },
    {
      icon: <ExclamationCircleOutlined className="text-3xl text-orange-500" />,
      title: 'Hỗ trợ 24/7',
      description: 'Gửi khiếu nại mọi lúc',
      link: '/complaints',
    },
  ];

  return (
    <CustomerLayout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-12">
            <Title level={1} className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Đặt vé xe khách trực tuyến
            </Title>
            <Paragraph className="text-xl text-white opacity-90">
              Nhanh chóng • Tiện lợi • An toàn
            </Paragraph>
          </div>

          {/* Search Form */}
          <Card className="max-w-4xl mx-auto shadow-2xl">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSearch}
              initialValues={{
                date: dayjs(),
              }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={10}>
                  <Form.Item
                    name="fromCity"
                    rules={[{ required: true, message: 'Vui lòng nhập điểm đi!' }]}
                  >
                    <Input
                      size="large"
                      placeholder="Điểm đi (VD: Hà Nội)"
                      prefix={<EnvironmentOutlined className="text-gray-400" />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={4} className="flex items-center justify-center">
                  <Button
                    type="text"
                    icon={<SwapOutlined />}
                    onClick={handleSwapCities}
                    size="large"
                    className="text-blue-500"
                  />
                </Col>

                <Col xs={24} md={10}>
                  <Form.Item
                    name="toCity"
                    rules={[{ required: true, message: 'Vui lòng nhập điểm đến!' }]}
                  >
                    <Input
                      size="large"
                      placeholder="Điểm đến (VD: TP. Hồ Chí Minh)"
                      prefix={<EnvironmentOutlined className="text-gray-400" />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="date"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                  >
                    <DatePicker
                      size="large"
                      placeholder="Chọn ngày đi"
                      format="DD/MM/YYYY"
                      disabledDate={(current) =>
                        current && current < dayjs().startOf('day')
                      }
                      className="w-full"
                      suffixIcon={<CalendarOutlined />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Button
                    type="primary"
                    size="large"
                    block
                    htmlType="submit"
                    loading={loading}
                    icon={<SearchOutlined />}
                    className="h-full"
                  >
                    Tìm chuyến xe
                  </Button>
                </Col>
              </Row>
            </Form>

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Space wrap className="w-full justify-center">
                <Button
                  type="link"
                  icon={<FileTextOutlined />}
                  onClick={() => navigate('/tickets/lookup')}
                >
                  Tra cứu vé
                </Button>
                <Button
                  type="link"
                  icon={<TrophyOutlined />}
                  onClick={() => navigate('/loyalty')}
                >
                  Loyalty Program
                </Button>
                <Button
                  type="link"
                  icon={<ExclamationCircleOutlined />}
                  onClick={() => navigate('/complaints')}
                >
                  Gửi khiếu nại
                </Button>
              </Space>
            </div>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Row gutter={[32, 32]}>
            <Col xs={12} sm={6}>
              <Statistic
                title="Nhà xe"
                value={50}
                suffix="+"
                valueStyle={{ color: '#3f8600', textAlign: 'center' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Tuyến đường"
                value={200}
                suffix="+"
                valueStyle={{ color: '#1890ff', textAlign: 'center' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Khách hàng"
                value={10000}
                suffix="+"
                valueStyle={{ color: '#fa8c16', textAlign: 'center' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Đánh giá 5⭐"
                value={95}
                suffix="%"
                valueStyle={{ color: '#fadb14', textAlign: 'center' }}
              />
            </Col>
          </Row>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Title level={2}>Tại sao chọn QuikRide?</Title>
            <Paragraph className="text-lg text-gray-600">
              Trải nghiệm đặt vé tốt nhất cho bạn
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col key={index} xs={24} sm={12} lg={6}>
                <Card
                  hoverable
                  className="text-center h-full"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <Title level={4}>{feature.title}</Title>
                  <Paragraph className="text-gray-600">
                    {feature.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Loyalty & Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Title level={2}>Tính năng nổi bật</Title>
            <Paragraph className="text-lg text-gray-600">
              Tận hưởng các tiện ích độc quyền
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {loyaltyFeatures.map((feature, index) => (
              <Col key={index} xs={24} md={8}>
                <Card
                  hoverable
                  className="h-full"
                  onClick={() => navigate(feature.link)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">{feature.icon}</div>
                    <div>
                      <Title level={4} className="mb-2">
                        {feature.title}
                      </Title>
                      <Paragraph className="text-gray-600 mb-0">
                        {feature.description}
                      </Paragraph>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Title level={2} className="text-white mb-4">
            Sẵn sàng cho chuyến đi của bạn?
          </Title>
          <Paragraph className="text-xl text-white opacity-90 mb-8">
            Đặt vé ngay hôm nay và nhận ưu đãi hấp dẫn!
          </Paragraph>
          <Space size="large">
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Tìm chuyến xe ngay
            </Button>
            <Button
              size="large"
              icon={<TrophyOutlined />}
              onClick={() => navigate('/loyalty')}
              className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600"
            >
              Khám phá Loyalty
            </Button>
          </Space>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default NewHomePage;
