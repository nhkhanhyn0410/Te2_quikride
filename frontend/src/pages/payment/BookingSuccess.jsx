import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Result, Button, Descriptions, Tag, Spin, Divider, message } from 'antd';
import {
  CheckCircleOutlined,
  DownloadOutlined,
  HomeOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import useBookingStore from '../../store/bookingStore';
import api from '../../services/api';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingCode = searchParams.get('bookingCode');
  const phone = searchParams.get('phone'); // Optional phone for guest lookup

  const { currentBooking, selectedTrip, selectedSeats, pickupPoint, dropoffPoint, contactInfo } = useBookingStore();

  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const loadBooking = async () => {
      // First try: Use currentBooking from store if available and matches
      if (currentBooking && currentBooking.bookingCode === bookingCode) {
        console.log('Using currentBooking from store:', currentBooking);
        setBooking(currentBooking);
        return;
      }

      // Second try: Construct from store data if available
      if (selectedTrip && bookingCode) {
        console.log('Constructing booking from store data');
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
          paymentMethod: 'vnpay', // Will be updated from API if fetched
          paymentStatus: 'pending',
        };
        setBooking(constructedBooking);

        // Try to fetch full booking data in background
        fetchBookingData();
        return;
      }

      // Third try: Fetch from API
      if (bookingCode) {
        fetchBookingData();
      }
    };

    const fetchBookingData = async () => {
      try {
        setLoading(true);
        const phoneParam = phone || contactInfo?.phone;

        if (!phoneParam) {
          console.warn('No phone number available for booking lookup');
          return;
        }

        console.log('Fetching booking from API:', { bookingCode, phone: phoneParam });
        const response = await api.get(`/bookings/code/${bookingCode}`, {
          params: { phone: phoneParam },
        });

        console.log('Booking fetched from API:', response);
        // Support both response formats
        const isSuccess = response.success === true || response.status === 'success';
        if (isSuccess && response.data) {
          setBooking(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch booking:', error);
        // Don't show error to user if we already have partial data from store
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingCode, phone, currentBooking, selectedTrip, selectedSeats, pickupPoint, dropoffPoint, contactInfo]);

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
                {booking.tripId?.routeId?.fromCity || booking.tripInfo?.origin?.city || 'N/A'} → {booking.tripId?.routeId?.toCity || booking.tripInfo?.destination?.city || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian khởi hành">
                {booking.tripId?.departureTime ? dayjs(booking.tripId.departureTime).format('HH:mm, DD/MM/YYYY') : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Điểm đón">
                {booking.pickupPoint?.name || booking.tripInfo?.pickupPoint?.name || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Điểm trả">
                {booking.dropoffPoint?.name || booking.tripInfo?.dropoffPoint?.name || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Số ghế">
                <div className="flex gap-2 flex-wrap">
                  {booking.seats && booking.seats.length > 0 ? (
                    booking.seats.map((seat, index) => (
                      <Tag key={seat.seatNumber || index} color="blue">
                        {seat.seatNumber || seat}
                      </Tag>
                    ))
                  ) : (
                    <span>N/A</span>
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Hành khách">
                {booking.contactInfo?.name || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {booking.contactInfo?.phone || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {booking.contactInfo?.email || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                <Tag color={booking.paymentMethod === 'cash' ? 'green' : 'blue'}>
                  {booking.paymentMethod === 'cash' ? 'Tiền mặt khi lên xe' : booking.paymentMethod === 'vnpay' ? 'VNPay' : booking.paymentMethod || 'N/A'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">
                <Tag color={booking.paymentStatus === 'paid' ? 'success' : 'warning'}>
                  {booking.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <strong className="text-xl text-blue-600">
                  {booking.finalPrice ? booking.finalPrice.toLocaleString('vi-VN') : '0'}đ
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
