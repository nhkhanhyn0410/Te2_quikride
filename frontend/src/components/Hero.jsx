import { Typography } from "antd";

const { Title, Text } = Typography;

const HeroSection = () => {
  return (
    <div className="text-center mb-8">
      <Title level={1} className="!text-4xl md:!text-5xl !mb-4">
        Đặt vé xe khách trực tuyến
      </Title>
      <Text className="text-lg text-gray-600">
        Tìm và đặt vé xe khách nhanh chóng, tiện lợi
      </Text>
    </div>
  );
};

export default HeroSection;
