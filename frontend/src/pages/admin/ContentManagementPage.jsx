import { useState } from 'react';
import { Tabs, Card } from 'antd';
import {
  FileImageOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

const ContentManagementPage = () => {
  const [activeTab, setActiveTab] = useState('banners');

  const items = [
    {
      key: 'banners',
      label: (
        <span>
          <FileImageOutlined />
          Banners
        </span>
      ),
      children: (
        <Card>
          <div className="text-center py-12">
            <FileImageOutlined className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">
              Banner Management
            </h3>
            <p className="text-gray-500 mt-2">
              Quản lý banner hiển thị trên trang chủ
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Tính năng đang được phát triển...
            </p>
          </div>
        </Card>
      ),
    },
    {
      key: 'blogs',
      label: (
        <span>
          <FileTextOutlined />
          Blogs
        </span>
      ),
      children: (
        <Card>
          <div className="text-center py-12">
            <FileTextOutlined className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">
              Blog Management
            </h3>
            <p className="text-gray-500 mt-2">
              Quản lý bài viết blog và tin tức
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Tính năng đang được phát triển...
            </p>
          </div>
        </Card>
      ),
    },
    {
      key: 'faqs',
      label: (
        <span>
          <QuestionCircleOutlined />
          FAQs
        </span>
      ),
      children: (
        <Card>
          <div className="text-center py-12">
            <QuestionCircleOutlined className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">
              FAQ Management
            </h3>
            <p className="text-gray-500 mt-2">
              Quản lý câu hỏi thường gặp
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Tính năng đang được phát triển...
            </p>
          </div>
        </Card>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Quản Lý Nội Dung</h1>
        <p className="text-gray-600 mt-1">
          Quản lý banners, blogs, FAQs và nội dung trang web
        </p>
      </div>

      {/* Tabs */}
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </div>
  );
};

export default ContentManagementPage;
