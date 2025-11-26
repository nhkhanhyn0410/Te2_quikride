import { useNavigate } from 'react-router-dom';
import { Row, Col, Typography } from 'antd';
import { FaInstagram, FaFacebookF, FaYoutube, FaTwitter } from 'react-icons/fa';

const { Title, Text, Link } = Typography;

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <Row gutter={[32, 32]} className="mb-8">
          {/* Brand Section */}
          <Col xs={24} sm={12} lg={6}>
            <Title level={3} className="!text-white !mb-4">
              Bus
            </Title>
            <Text className="text-gray-400">
              Hệ thống đặt vé xe khách trực tuyến hàng đầu Việt Nam.
              Chúng tôi mang đến trải nghiệm đặt vé thuận tiện, nhanh chóng và an toàn cho hành khách.
            </Text>
            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded flex items-center justify-center transition-colors"
              >
                <FaInstagram className="text-white text-lg" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded flex items-center justify-center transition-colors"
              >
                <FaFacebookF className="text-white text-lg" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded flex items-center justify-center transition-colors"
              >
                <FaYoutube className="text-white text-lg" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded flex items-center justify-center transition-colors"
              >
                <FaTwitter className="text-white text-lg" />
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} lg={6}>
            <Title level={5} className="!text-white !mb-4">
              Liên Kết Nhanh
            </Title>
            <ul className="space-y-2">
              <li>
                <Link
                  onClick={() => navigate('/')}
                  className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Giới Thiệu
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => navigate('/my-tickets')}
                  className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Tài Khoản Của Tôi
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => navigate('/tickets/lookup')}
                  className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Tra Cứu Vé
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => navigate('/register')}
                  className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Tạo Tài Khoản
                </Link>
              </li>
            </ul>
          </Col>

          {/* Top Routes */}
          <Col xs={24} sm={12} lg={6}>
            <Title level={5} className="!text-white !mb-4">
              Tuyến Đường Phổ Biến
            </Title>
            <ul className="space-y-2">
              <li>
                <Link className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                  Hà Nội - Sapa
                </Link>
              </li>
              <li>
                <Link className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                  TP.HCM - Đà Lạt
                </Link>
              </li>
              <li>
                <Link className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                  Hà Nội - Hải Phòng
                </Link>
              </li>
              <li>
                <Link className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                  TP.HCM - Vũng Tàu
                </Link>
              </li>
            </ul>
          </Col>

          {/* Support Links */}
          <Col xs={24} sm={12} lg={6}>
            <Title level={5} className="!text-white !mb-4">
              Hỗ Trợ Khách Hàng
            </Title>
            <ul className="space-y-2">
              <li>
                <Link className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                  Chính Sách Bảo Mật
                </Link>
              </li>
              <li>
                <Link className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                  Điều Khoản Sử Dụng
                </Link>
              </li>
              <li>
                <Link className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                  Trung Tâm Trợ Giúp
                </Link>
              </li>
              <li>
                <Link className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                  Câu Hỏi Thường Gặp
                </Link>
              </li>
            </ul>
          </Col>
        </Row>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Text className="text-gray-500 text-sm">
              Bản quyền © 2024. Tất cả quyền được bảo lưu.
            </Text>
            <div className="flex gap-4 mt-4 md:mt-0">
              <img
                src="/payment-icons/mastercard.png"
                alt="Mastercard"
                className="h-8 opacity-70"
                onError={(e) => e.target.style.display = 'none'}
              />
              <img
                src="/payment-icons/visa.png"
                alt="Visa"
                className="h-8 opacity-70"
                onError={(e) => e.target.style.display = 'none'}
              />
              <img
                src="/payment-icons/amex.png"
                alt="American Express"
                className="h-8 opacity-70"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
