import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  Steps,
  Typography,
  Space,
  Divider,
  Select,
  message,
  Spin,
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  ArrowLeftOutlined,
  CreditCardOutlined,
  TagOutlined,
} from '@ant-design/icons';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import {
  holdSeats,
  validateVoucher,
  getPaymentMethods,
  getBankList,
  createPayment,
} from '../services/bookingApi';
import useBookingStore from '../store/bookingStore';

const { Title, Text } = Typography;
const { Step } = Steps;
const { Option } = Select;

const PassengerInfoPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const {
    selectedTrip,
    selectedSeats,
    pickupPoint,
    dropoffPoint,
    setContactInfo,
    setCurrentBooking,
    setSessionId,
    setExpiresAt,
    voucherCode,
    setVoucherCode,
    setAppliedVoucher,
    appliedVoucher,
  } = useBookingStore();

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('vnpay');
  const [selectedBank, setSelectedBank] = useState('');
  const [voucherValidating, setVoucherValidating] = useState(false);

  useEffect(() => {
    // Validate booking state
    if (!selectedTrip || selectedSeats.length === 0 || !pickupPoint || !dropoffPoint) {
      toast.error('Thông tin đặt vé không hợp lệ');
      navigate('/');
      return;
    }

    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      const [methodsRes, banksRes] = await Promise.all([
        getPaymentMethods(),
        getBankList(),
      ]);

      if (methodsRes.success) {
        setPaymentMethods(methodsRes.data.filter(m => m.enabled));
      }

      if (banksRes.success) {
        setBankList(banksRes.data);
      }
    } catch (error) {
      console.error('Fetch payment data error:', error);
    }
  };

  const handleValidateVoucher = async () => {
    if (!voucherCode || !voucherCode.trim()) {
      return;
    }

    try {
      setVoucherValidating(true);
      const totalAmount = selectedTrip.finalPrice * selectedSeats.length;

      const response = await validateVoucher(voucherCode, {
        tripId: selectedTrip._id,
        totalAmount,
      });

      if (response.success && response.data) {
        setAppliedVoucher(response.data);
        message.success(`Áp dụng voucher thành công! Giảm ${formatPrice(response.data.discountAmount)}`);
      }
    } catch (error) {
      console.error('Validate voucher error:', error);
      message.error(error || 'Mã voucher không hợp lệ');
      setAppliedVoucher(null);
    } finally {
      setVoucherValidating(false);
    }
  };

  const handlePassengerInfoSubmit = async (values) => {
    try {
      setLoading(true);

      // Store contact info
      setContactInfo({
        name: values.name,
        phone: values.phone,
        email: values.email,
      });

      // Prepare passenger data for each seat
      const passengers = selectedSeats.map((seat, index) => ({
        seatNumber: seat.seatNumber,
        passengerName: values[`passenger_${index}_name`] || values.name,
        passengerPhone: values[`passenger_${index}_phone`] || values.phone,
        passengerEmail: values[`passenger_${index}_email`] || values.email,
      }));

      // Hold seats
      const holdData = {
        tripId: selectedTrip._id,
        seats: passengers,
        contactInfo: {
          name: values.name,
          phone: values.phone,
          email: values.email,
        },
        pickupPoint: pickupPoint,
        dropoffPoint: dropoffPoint,
        voucherCode: appliedVoucher ? voucherCode : undefined,
      };

      const holdResponse = await holdSeats(holdData);

      if (holdResponse.success && holdResponse.data) {
        setCurrentBooking(holdResponse.data.booking);
        setSessionId(holdResponse.data.lockInfo.sessionId);
        setExpiresAt(holdResponse.data.lockInfo.expiresAt);

        message.success('Giữ chỗ thành công! Vui lòng hoàn tất thanh toán trong 15 phút');
        setCurrentStep(1);
      }
    } catch (error) {
      console.error('Hold seats error:', error);
      toast.error(error || 'Có lỗi xảy ra khi giữ chỗ');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      const { currentBooking } = useBookingStore.getState();

      if (!currentBooking) {
        toast.error('Không tìm thấy thông tin booking');
        return;
      }

      // Create payment
      const paymentData = {
        bookingId: currentBooking._id,
        paymentMethod: selectedPaymentMethod,
        amount: currentBooking.finalPrice,
        bankCode: selectedBank,
        locale: 'vn',
      };

      const paymentResponse = await createPayment(paymentData);

      if (paymentResponse.success && paymentResponse.data) {
        // Redirect to payment URL
        if (paymentResponse.data.paymentUrl) {
          window.location.href = paymentResponse.data.paymentUrl;
        } else {
          toast.success('Thanh toán thành công!');
          navigate(`/booking/confirmation/${currentBooking.bookingCode}`);
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error || 'Có lỗi xảy ra khi thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const calculateTotal = () => {
    const baseTotal = selectedTrip.finalPrice * selectedSeats.length;
    const voucherDiscount = appliedVoucher?.discountAmount || 0;
    return Math.max(0, baseTotal - voucherDiscount);
  };

  if (!selectedTrip) {
    return <Spin fullscreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Steps */}
        <Card className="mb-6">
          <Steps current={currentStep}>
            <Step title="Thông tin hành khách" icon={<UserOutlined />} />
            <Step title="Thanh toán" icon={<CreditCardOutlined />} />
          </Steps>
        </Card>

        {currentStep === 0 ? (
          /* Step 1: Passenger Information */
          <Card title="Thông tin hành khách">
            <Form
              form={form}
              layout="vertical"
              onFinish={handlePassengerInfoSubmit}
            >
              {/* Contact Information */}
              <Title level={5}>Thông tin liên hệ</Title>
              <div className="bg-gray-50 p-4 rounded mb-6">
                <Form.Item
                  name="name"
                  label="Họ và tên"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                  <Input size="large" prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                    { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' },
                  ]}
                >
                  <Input size="large" prefix={<PhoneOutlined />} placeholder="0123456789" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email' },
                    { type: 'email', message: 'Email không hợp lệ' },
                  ]}
                >
                  <Input size="large" prefix={<MailOutlined />} placeholder="email@example.com" />
                </Form.Item>
              </div>

              {/* Passenger Details for each seat */}
              <Title level={5}>Thông tin hành khách ({selectedSeats.length} ghế)</Title>
              <div className="bg-blue-50 p-4 rounded mb-4">
                <Text className="text-sm text-gray-600">
                  Thông tin liên hệ sẽ được sử dụng mặc định cho tất cả ghế. Bạn có thể cập nhật riêng cho từng ghế nếu cần.
                </Text>
              </div>

              {/* Voucher */}
              <Title level={5}>Mã giảm giá</Title>
              <div className="bg-gray-50 p-4 rounded mb-6">
                <Space.Compact className="w-full">
                  <Input
                    size="large"
                    prefix={<TagOutlined />}
                    placeholder="Nhập mã giảm giá"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  />
                  <Button
                    size="large"
                    type="primary"
                    onClick={handleValidateVoucher}
                    loading={voucherValidating}
                  >
                    Áp dụng
                  </Button>
                </Space.Compact>
                {appliedVoucher && (
                  <div className="mt-2 text-green-600">
                    ✓ Giảm {formatPrice(appliedVoucher.discountAmount)}
                  </div>
                )}
              </div>

              {/* Price Summary */}
              <Card className="mb-6 bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Text>Giá vé ({selectedSeats.length} ghế)</Text>
                    <Text>{formatPrice(selectedTrip.finalPrice * selectedSeats.length)}</Text>
                  </div>
                  {appliedVoucher && (
                    <div className="flex justify-between text-green-600">
                      <Text>Giảm giá voucher</Text>
                      <Text>-{formatPrice(appliedVoucher.discountAmount)}</Text>
                    </div>
                  )}
                  <Divider className="my-2" />
                  <div className="flex justify-between">
                    <Text strong className="text-lg">Tổng thanh toán</Text>
                    <Text strong className="text-lg text-blue-600">
                      {formatPrice(calculateTotal())}
                    </Text>
                  </div>
                </div>
              </Card>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                Tiếp tục thanh toán
              </Button>
            </Form>
          </Card>
        ) : (
          /* Step 2: Payment */
          <Card title="Phương thức thanh toán">
            <div className="mb-6">
              <Text strong>Chọn phương thức thanh toán</Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {paymentMethods.map(method => (
                  <Card
                    key={method.code}
                    className={`cursor-pointer ${
                      selectedPaymentMethod === method.code ? 'border-blue-500 border-2' : ''
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.code)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{method.icon === 'vnpay' ? '💳' : '💰'}</div>
                      <div>
                        <Text strong>{method.name}</Text>
                        <div className="text-sm text-gray-500">{method.description}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {selectedPaymentMethod === 'vnpay' && (
              <div className="mb-6">
                <Text strong>Chọn ngân hàng</Text>
                <Select
                  size="large"
                  className="w-full mt-2"
                  placeholder="Chọn ngân hàng"
                  value={selectedBank}
                  onChange={setSelectedBank}
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {bankList.map(bank => (
                    <Option key={bank.code} value={bank.code}>
                      {bank.name}
                    </Option>
                  ))}
                </Select>
              </div>
            )}

            <Card className="mb-6 bg-blue-50">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Text>Tổng thanh toán</Text>
                  <Text strong className="text-xl text-blue-600">
                    {formatPrice(calculateTotal())}
                  </Text>
                </div>
              </div>
            </Card>

            <Button
              type="primary"
              size="large"
              block
              loading={loading}
              onClick={handlePayment}
            >
              Thanh toán
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PassengerInfoPage;
