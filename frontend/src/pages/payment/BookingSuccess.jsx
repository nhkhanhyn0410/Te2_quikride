import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Result, Button, Descriptions, Tag, Spin, Divider } from 'antd';
import {
  CheckCircleOutlined,
  DownloadOutlined,
  HomeOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import useBookingStore from '../../store/bookingStore';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingCode = searchParams.get('bookingCode');

  const { currentBooking, selectedTrip, selectedSeats, pickupPoint, dropoffPoint, contactInfo } = useBookingStore();

  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    // Use currentBooking from store if available
    if (currentBooking && currentBooking.bookingCode === bookingCode) {
      setBooking(currentBooking);
    } else if (selectedTrip && bookingCode) {
      // Construct booking from store data if currentBooking not available
      const seatPrice = selectedTrip?.pricing?.finalPrice || selectedTrip?.finalPrice || selectedTrip?.pricing?.basePrice || 0;
      const finalPrice = seatPrice * (selectedSeats?.length || 0);

      const constructedBooking = {
        bookingCode,
        tripId: selectedTrip,
        seats: selectedSeats,
        pickupPoint,
        dropoffPoint,
        contactInfo,
        finalPrice,
        paymentMethod: 'cash', // Default, will be updated if payment info available
        paymentStatus: 'pending',
      };
      setBooking(constructedBooking);
    }
  }, [bookingCode, currentBooking, selectedTrip, selectedSeats, pickupPoint, dropoffPoint, contactInfo]);

  const handlePrintTicket = () => {
    window.print();
  };

  const handleDownloadTicket = async () => {
    try {
      // TODO: Implement ticket download
      console.log('Download ticket for booking:', bookingCode);
    } catch (error) {
      console.error('Download ticket error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Result
          status="success"
          title="Đặt vé thành công!"
          subTitle={
            booking
              ? `Mã đặt vé của bạn là ${booking.bookingCode}. Vui lòng kiểm tra email để nhận vé điện tử.`
              : 'Vé điện tử đã được gửi đến email của bạn.'
          }
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
        />

        {booking && (
          <Card className="mt-6 shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Thông tin đặt vé</h2>
              <p className="text-gray-500">Mã đặt vé: <strong className="text-blue-600">{booking.bookingCode}</strong></p>
            </div>

            <Descriptions bordered column={1}>
              <Descriptions.Item label="Tuyến xe">
                {booking.tripId?.routeId?.fromCity} → {booking.tripId?.routeId?.toCity}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian khởi hành">
                {dayjs(booking.tripId?.departureTime).format('HH:mm, DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Điểm đón">
                {booking.pickupPoint?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Điểm trả">
                {booking.dropoffPoint?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Số ghế">
                <div className="flex gap-2 flex-wrap">
                  {booking.seats?.map((seat) => (
                    <Tag key={seat.seatNumber} color="blue">
                      {seat.seatNumber}
                    </Tag>
                  ))}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Hành khách">
                {booking.contactInfo?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {booking.contactInfo?.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {booking.contactInfo?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                <Tag color={booking.paymentMethod === 'cash' ? 'green' : 'blue'}>
                  {booking.paymentMethod === 'cash' ? 'Tiền mặt khi lên xe' : 'VNPay'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">
                <Tag color={booking.paymentStatus === 'paid' ? 'success' : 'warning'}>
                  {booking.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <strong className="text-xl text-blue-600">
                  {booking.finalPrice?.toLocaleString('vi-VN')}đ
                </strong>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                type="primary"
                icon={<PrinterOutlined />}
                onClick={handlePrintTicket}
                size="large"
              >
                In vé
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleDownloadTicket}
                size="large"
              >
                Tải vé
              </Button>
              <Button
                icon={<HomeOutlined />}
                onClick={() => navigate('/')}
                size="large"
              >
                Về trang chủ
              </Button>
            </div>

            {booking.paymentMethod === 'cash' && (
              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="text-yellow-800">
                  <strong>Lưu ý:</strong> Vui lòng chuẩn bị tiền mặt và thanh toán cho tài xế khi lên xe.
                  Số tiền cần thanh toán: <strong>{booking.finalPrice?.toLocaleString('vi-VN')}đ</strong>
                </p>
              </div>
            )}
          </Card>
        )}

        {!booking && (
          <div className="text-center mt-6">
            <Button type="primary" size="large" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSuccess;
