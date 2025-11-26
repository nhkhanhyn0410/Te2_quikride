import { useNavigate } from 'react-router-dom';
import { Row, Col, Typography } from 'antd';
import {
  InstagramOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  TwitterOutlined,
} from '@ant-design/icons';

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
              Bus is all about booking ticket through nine platform to make comfortable to the passenger. Lorem ipsum, dolor sit amet consectetur adipiscing elit.
            </Text>
            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded flex items-center justify-center transition-colors"
              >
                <InstagramOutlined className="text-white text-lg" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded flex items-center justify-center transition-colors"
              >
                <FacebookOutlined className="text-white text-lg" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded flex items-center justify-center transition-colors"
              >
                <YoutubeOutlined className="text-white text-lg" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded flex items-center justify-center transition-colors"
              >
                <TwitterOutlined className="text-white text-lg" />
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} lg={6}>
            <Title level={5} className="!text-white !mb-4">
              Quick Links
            </Title>
            <ul className="space-y-2">
              <li>
                <Link
                  onClick={() => navigate('/')}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => navigate('/my-tickets')}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => navigate('/tickets/lookup')}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  Reserve your ticket
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => navigate('/register')}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  Create your account
                </Link>
              </li>
            </ul>
          </Col>

          {/* Top Reserved Routes */}
          <Col xs={24} sm={12} lg={6}>
            <Title level={5} className="!text-white !mb-4">
              Top Reserved Routes
            </Title>
            <ul className="space-y-2">
              <li>
                <Link className="text-gray-400 hover:text-red-600 transition-colors">
                  Kathmandu - Pokhara
                </Link>
              </li>
              <li>
                <Link className="text-gray-400 hover:text-red-600 transition-colors">
                  Pokhara - Mustang
                </Link>
              </li>
              <li>
                <Link className="text-gray-400 hover:text-red-600 transition-colors">
                  Kathmandu - Chitwan
                </Link>
              </li>
              <li>
                <Link className="text-gray-400 hover:text-red-600 transition-colors">
                  Kathmandu - Lumbini
                </Link>
              </li>
            </ul>
          </Col>

          {/* Support Links */}
          <Col xs={24} sm={12} lg={6}>
            <Title level={5} className="!text-white !mb-4">
              Support Links
            </Title>
            <ul className="space-y-2">
              <li>
                <Link className="text-gray-400 hover:text-red-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="text-gray-400 hover:text-red-600 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link className="text-gray-400 hover:text-red-600 transition-colors">
                  Help & Support Center
                </Link>
              </li>
              <li>
                <Link className="text-gray-400 hover:text-red-600 transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </Col>
        </Row>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Text className="text-gray-500 text-sm">
              Copyright © 2024. All rights reserved.
            </Text>
            <div className="flex gap-4 mt-4 md:mt-0">
              <img src="/payment-icons/mastercard.png" alt="Mastercard" className="h-8 opacity-70" onError={(e) => e.target.style.display = 'none'} />
              <img src="/payment-icons/visa.png" alt="Visa" className="h-8 opacity-70" onError={(e) => e.target.style.display = 'none'} />
              <img src="/payment-icons/amex.png" alt="Amex" className="h-8 opacity-70" onError={(e) => e.target.style.display = 'none'} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
