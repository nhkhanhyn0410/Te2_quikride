import { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Steps,
  message,
  Descriptions,
  Tag,
  Space,
  Modal,
} from 'antd';
import {
  SearchOutlined,
  PhoneOutlined,
  SafetyOutlined,
  DownloadOutlined,
  QrcodeOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  requestTicketLookupOTP,
  verifyTicketLookupOTP,
  downloadTicket,
} from '../services/ticketApi';

const { Step } = Steps;

const GuestTicketLookupPage = () => {
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lookupData, setLookupData] = useState({
    ticketCode: '',
    phone: '',
  });
  const [ticket, setTicket] = useState(null);
  const [qrModalVisible, setQrModalVisible] = useState(false);

  // Step 1: Request OTP
  const handleRequestOTP = async (values) => {
    setLoading(true);
    try {
      const response = await requestTicketLookupOTP({
        ticketCode: values.ticketCode,
        phone: values.phone,
      });

      if (response.status === 'success') {
        setLookupData({
          ticketCode: values.ticketCode,
          phone: values.phone,
        });
        setCurrentStep(1);
        message.success('Mã OTP đã được gửi đến số điện thoại của bạn');
      }
    } catch (error) {
      console.error('Request OTP error:', error);
      message.error(error || 'Không thể gửi mã OTP. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and get ticket
  const handleVerifyOTP = async (values) => {
    setLoading(true);
    try {
      const response = await verifyTicketLookupOTP({
        ticketCode: lookupData.ticketCode,
        phone: lookupData.phone,
        otp: values.otp,
      });

      if (response.status === 'success') {
        setTicket(response.data.ticket);
        setCurrentStep(2);
        message.success('Tra cứu vé thành công');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      message.error(error || 'Mã OTP không đúng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Handle download ticket
  const handleDownload = async () => {
    if (!ticket) return;

    try {
      const blob = await downloadTicket(ticket._id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket-${ticket.ticketCode}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      message.success('Tải vé thành công');
    } catch (error) {
      console.error('Download ticket error:', error);
      message.error(error || 'Không thể tải vé');
    }
  };

  // Reset form
  const handleReset = () => {
    form.resetFields();
    otpForm.resetFields();
    setCurrentStep(0);
    setLookupData({ ticketCode: '', phone: '' });
    setTicket(null);
  };

  // Get status tag
  const getStatusTag = (status) => {
    const statusConfig = {
      valid: { color: 'success', text: 'Hợp lệ' },
      used: { color: 'default', text: 'Đã sử dụng' },
      cancelled: { color: 'error', text: 'Đã hủy' },
      expired: { color: 'warning', text: 'Hết hạn' },
    };

    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            <SearchOutlined className="mr-2" />
            Tra cứu vé
          </h1>
          <p className="text-gray-600">
            Tra cứu thông tin vé đã đặt bằng mã vé và số điện thoại
          </p>
        </div>

        {/* Steps */}
        <Card className="mb-6">
          <Steps current={currentStep}>
            <Step title="Nhập thông tin" icon={<SearchOutlined />} />
            <Step title="Xác thực OTP" icon={<SafetyOutlined />} />
            <Step title="Thông tin vé" icon={<QrcodeOutlined />} />
          </Steps>
        </Card>

        {/* Step 1: Enter ticket code and phone */}
        {currentStep === 0 && (
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleRequestOTP}
              autoComplete="off"
            >
              <Form.Item
                label="Mã vé"
                name="ticketCode"
                rules={[
                  { required: true, message: 'Vui lòng nhập mã vé' },
                  { min: 10, message: 'Mã vé không hợp lệ' },
                ]}
              >
                <Input
                  prefix={<QrcodeOutlined />}
                  placeholder="Ví dụ: TKT-20240115-ABCDEFGH"
                  size="large"
                  style={{ textTransform: 'uppercase' }}
                />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  {
                    pattern: /^(0|\+84)[0-9]{9,10}$/,
                    message: 'Số điện thoại không hợp lệ',
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Nhập số điện thoại đã đặt vé"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                >
                  Tiếp tục
                </Button>
              </Form.Item>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded mt-4">
                <p className="text-sm text-blue-800">
                  <strong>Lưu ý:</strong> Mã vé được gửi qua email hoặc SMS sau khi
                  đặt vé thành công. Vui lòng kiểm tra hộp thư hoặc tin nhắn của bạn.
                </p>
              </div>
            </Form>
          </Card>
        )}

        {/* Step 2: Verify OTP */}
        {currentStep === 1 && (
          <Card>
            <div className="text-center mb-6">
              <SafetyOutlined className="text-5xl text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Xác thực OTP</h2>
              <p className="text-gray-600">
                Mã OTP đã được gửi đến số điện thoại{' '}
                <strong>{lookupData.phone}</strong>
              </p>
            </div>

            <Form
              form={otpForm}
              layout="vertical"
              onFinish={handleVerifyOTP}
              autoComplete="off"
            >
              <Form.Item
                label="Mã OTP (6 chữ số)"
                name="otp"
                rules={[
                  { required: true, message: 'Vui lòng nhập mã OTP' },
                  {
                    pattern: /^[0-9]{6}$/,
                    message: 'Mã OTP phải có 6 chữ số',
                  },
                ]}
              >
                <Input
                  prefix={<SafetyOutlined />}
                  placeholder="Nhập mã OTP"
                  size="large"
                  maxLength={6}
                  style={{ letterSpacing: '0.5em', textAlign: 'center' }}
                />
              </Form.Item>

              <Form.Item>
                <Space className="w-full" direction="vertical" size="middle">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={loading}
                  >
                    Xác nhận
                  </Button>

                  <Button size="large" block onClick={handleReset}>
                    Quay lại
                  </Button>
                </Space>
              </Form.Item>

              <div className="text-center">
                <Button type="link" onClick={() => handleRequestOTP(lookupData)}>
                  Gửi lại mã OTP
                </Button>
              </div>
            </Form>
          </Card>
        )}

        {/* Step 3: Show ticket details */}
        {currentStep === 2 && ticket && (
          <Card>
            <div className="text-center mb-6">
              <QrcodeOutlined className="text-5xl text-green-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Thông tin vé</h2>
            </div>

            <Descriptions bordered column={1}>
              <Descriptions.Item label="Mã vé">
                <span className="font-mono font-semibold text-blue-600">
                  {ticket.ticketCode}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                {getStatusTag(ticket.status)}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <>
                    <EnvironmentOutlined className="mr-1" />
                    Tuyến đường
                  </>
                }
              >
                {ticket.tripInfo?.route}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <>
                    <CalendarOutlined className="mr-1" />
                    Ngày giờ đi
                  </>
                }
              >
                {dayjs(ticket.tripInfo?.departureTime).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <>
                    <CalendarOutlined className="mr-1" />
                    Ngày giờ đến
                  </>
                }
              >
                {dayjs(ticket.tripInfo?.arrivalTime).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>

              <Descriptions.Item label="Điểm đón">
                {ticket.tripInfo?.pickupPoint}
              </Descriptions.Item>

              <Descriptions.Item label="Điểm trả">
                {ticket.tripInfo?.dropoffPoint}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <>
                    <UserOutlined className="mr-1" />
                    Hành khách
                  </>
                }
              >
                <div className="space-y-2">
                  {ticket.passengers?.map((passenger, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Tag color="blue">Ghế {passenger.seatNumber}</Tag>
                      <span>{passenger.fullName}</span>
                      <span className="text-gray-500">{passenger.phone}</span>
                    </div>
                  ))}
                </div>
              </Descriptions.Item>
            </Descriptions>

            <div className="mt-6 flex gap-4 justify-center">
              <Button
                type="primary"
                size="large"
                icon={<DownloadOutlined />}
                onClick={handleDownload}
              >
                Tải vé PDF
              </Button>

              <Button
                size="large"
                icon={<QrcodeOutlined />}
                onClick={() => setQrModalVisible(true)}
              >
                Xem mã QR
              </Button>

              <Button size="large" onClick={handleReset}>
                Tra cứu vé khác
              </Button>
            </div>
          </Card>
        )}

        {/* QR Code Modal */}
        <Modal
          title="Mã QR vé"
          open={qrModalVisible}
          onCancel={() => setQrModalVisible(false)}
          footer={null}
          centered
        >
          {ticket && (
            <div className="text-center">
              <img
                src={ticket.qrCode}
                alt="QR Code"
                className="mx-auto mb-4"
                style={{ maxWidth: 300 }}
              />
              <p className="text-gray-600">
                Vui lòng xuất trình mã QR này khi lên xe
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Mã vé: <strong>{ticket.ticketCode}</strong>
              </p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default GuestTicketLookupPage;
