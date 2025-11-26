import { Card, Typography } from "antd";

const { Title, Text } = Typography;

const Features = () => {
  const data = [
    { icon: "🎫", title: "Đặt vé dễ dàng", desc: "Chỉ vài bước đơn giản" },
    { icon: "💳", title: "Thanh toán an toàn", desc: "Bảo mật & tiện lợi" },
    { icon: "⚡", title: "Xác nhận nhanh chóng", desc: "Nhận vé ngay sau thanh toán" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      {data.map((item) => (
        <Card key={item.title} className="text-center hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-4">{item.icon}</div>
          <Title level={4}>{item.title}</Title>
          <Text className="text-gray-600">{item.desc}</Text>
        </Card>
      ))}
    </div>
  );
};

export default Features;
