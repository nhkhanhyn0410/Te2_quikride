import { Layout, Row, Col, Space, Typography } from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

const CustomerFooter = () => {
  return (
    <Footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Row gutter={[32, 32]}>
          {/* Company Info */}
          <Col xs={24} sm={12} lg={6}>
            <div className="mb-4">
              <Title level={4} className="text-white mb-4">
                🚌 QuikRide
              </Title>
              <Text className="text-gray-300">
                Nền tảng đặt vé xe khách trực tuyến hàng đầu Việt Nam.
                Nhanh chóng, tiện lợi, an toàn.
              </Text>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} lg={6}>
            <Title level={5} className="text-white mb-4">
              Liên kết nhanh
            </Title>
            <div className="space-y-2">
              <div>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Trang chủ
                </Link>
              </div>
              <div>
                <Link href="/trips" className="text-gray-300 hover:text-white">
                  Tìm chuyến xe
                </Link>
              </div>
              <div>
                <Link href="/tickets/lookup" className="text-gray-300 hover:text-white">
                  Tra cứu vé
                </Link>
              </div>
              <div>
                <Link href="/loyalty" className="text-gray-300 hover:text-white">
                  Loyalty Program
                </Link>
              </div>
            </div>
          </Col>

          {/* Support */}
          <Col xs={24} sm={12} lg={6}>
            <Title level={5} className="text-white mb-4">
              Hỗ trợ
            </Title>
            <div className="space-y-2">
              <div>
                <Link href="/complaints" className="text-gray-300 hover:text-white">
                  Gửi khiếu nại
                </Link>
              </div>
              <div>
                <Link className="text-gray-300 hover:text-white">
                  Câu hỏi thường gặp
                </Link>
              </div>
              <div>
                <Link className="text-gray-300 hover:text-white">
                  Chính sách hoàn tiền
                </Link>
              </div>
              <div>
                <Link className="text-gray-300 hover:text-white">
                  Điều khoản sử dụng
                </Link>
              </div>
            </div>
          </Col>

          {/* Contact Info */}
          <Col xs={24} sm={12} lg={6}>
            <Title level={5} className="text-white mb-4">
              Liên hệ
            </Title>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <PhoneOutlined />
                <Text className="text-gray-300">1900 xxxx</Text>
              </div>
              <div className="flex items-center gap-2">
                <MailOutlined />
                <Text className="text-gray-300">support@quikride.vn</Text>
              </div>
              <div className="flex items-center gap-2">
                <EnvironmentOutlined />
                <Text className="text-gray-300">TP. Hồ Chí Minh, Việt Nam</Text>
              </div>
              <div className="flex gap-3 mt-4">
                <FacebookOutlined className="text-xl cursor-pointer hover:text-blue-500" />
                <TwitterOutlined className="text-xl cursor-pointer hover:text-blue-400" />
                <InstagramOutlined className="text-xl cursor-pointer hover:text-pink-500" />
                <YoutubeOutlined className="text-xl cursor-pointer hover:text-red-500" />
              </div>
            </div>
          </Col>
        </Row>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <Text className="text-gray-400">
            © 2024 QuikRide. All rights reserved.
          </Text>
        </div>
      </div>
    </Footer>
  );
};

export default CustomerFooter;
