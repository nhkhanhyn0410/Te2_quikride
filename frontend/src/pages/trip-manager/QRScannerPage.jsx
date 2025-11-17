import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  message,
  Descriptions,
  Tag,
  Space,
  Alert,
  Modal,
  Upload,
  Spin,
  Result,
} from 'antd';
import {
  QrcodeOutlined,
  CameraOutlined,
  UploadOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { Html5Qrcode } from 'html5-qrcode';
import { verifyTicketQR } from '../../services/ticketApi';
import api from '../../services/api';

const QRScannerPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [verifiedTicket, setVerifiedTicket] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const html5QrCodeRef = useRef(null);

  // Fetch trip details
  const fetchTrip = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/trips/${tripId}`);
      if (response.status === 'success') {
        setTrip(response.data.trip);
      }
    } catch (error) {
      console.error('Fetch trip error:', error);
      message.error(error || 'Không thể tải thông tin chuyến xe');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [tripId]);

  // Start QR scanner
  const startScanner = async () => {
    try {
      setScanning(true);
      setVerificationResult(null);

      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' }, // Use back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        handleScanSuccess,
        handleScanError
      );
    } catch (error) {
      console.error('Start scanner error:', error);
      message.error('Không thể khởi động camera. Vui lòng kiểm tra quyền truy cập.');
      setScanning(false);
    }
  };

  // Stop QR scanner
  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      } catch (error) {
        console.error('Stop scanner error:', error);
      }
    }
    setScanning(false);
  };

  // Handle scan success
  const handleScanSuccess = async (decodedText) => {
    // Stop scanner
    await stopScanner();

    // Verify ticket
    await verifyTicket(decodedText);
  };

  // Handle scan error
  const handleScanError = (error) => {
    // Ignore continuous scanning errors
    // console.warn('Scan error:', error);
  };

  // Verify ticket with QR data
  const verifyTicket = async (qrCodeData) => {
    setLoading(true);
    try {
      const response = await verifyTicketQR(tripId, qrCodeData);

      if (response.status === 'success') {
        setVerifiedTicket(response.data.ticket);
        setVerificationResult({
          success: true,
          message: 'Vé hợp lệ! Hành khách đã được xác nhận lên xe.',
        });
        message.success('Xác thực vé thành công');
      }
    } catch (error) {
      console.error('Verify ticket error:', error);
      setVerificationResult({
        success: false,
        message: error || 'Vé không hợp lệ',
      });
      message.error(error || 'Vé không hợp lệ');
    } finally {
      setLoading(false);
    }
  };

  // Handle upload QR image
  const handleUploadQR = async (file) => {
    try {
      setLoading(true);

      const html5QrCode = new Html5Qrcode('qr-reader-upload');

      // Scan from file
      const decodedText = await html5QrCode.scanFile(file, false);

      // Verify ticket
      await verifyTicket(decodedText);
    } catch (error) {
      console.error('Upload QR error:', error);
      message.error('Không thể đọc mã QR từ ảnh. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }

    // Prevent upload
    return false;
  };

  // Reset verification
  const handleReset = () => {
    setVerificationResult(null);
    setVerifiedTicket(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  if (loading && !trip) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/trip-manager/dashboard')}
            >
              Quay lại
            </Button>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                <QrcodeOutlined className="mr-2" />
                Quét vé QR
              </h1>
              {trip && (
                <p className="text-gray-600 mt-1">
                  {trip.route?.routeName} - {new Date(trip.departureTime).toLocaleString('vi-VN')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Verification Result */}
        {verificationResult && (
          <Card className="mb-6">
            <Result
              status={verificationResult.success ? 'success' : 'error'}
              title={verificationResult.message}
              icon={
                verificationResult.success ? (
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                ) : (
                  <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                )
              }
              extra={[
                <Button
                  key="scan-again"
                  type="primary"
                  onClick={handleReset}
                >
                  Quét vé khác
                </Button>,
              ]}
            />

            {verifiedTicket && (
              <div className="mt-6">
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Mã vé">
                    <span className="font-mono font-semibold text-blue-600">
                      {verifiedTicket.ticketCode}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item label="Trạng thái">
                    <Tag color="success">Đã xác nhận lên xe</Tag>
                  </Descriptions.Item>

                  <Descriptions.Item label="Hành khách">
                    <div className="space-y-2">
                      {verifiedTicket.passengers?.map((p, index) => (
                        <div key={index}>
                          <Tag color="blue">Ghế {p.seatNumber}</Tag>
                          <span className="ml-2">{p.fullName}</span>
                          <span className="ml-2 text-gray-500">{p.phone}</span>
                        </div>
                      ))}
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              </div>
            )}
          </Card>
        )}

        {/* Scanner Card */}
        {!verificationResult && (
          <Card>
            <Space direction="vertical" size="large" className="w-full">
              {/* Instructions */}
              <Alert
                message="Hướng dẫn sử dụng"
                description={
                  <ul className="list-disc ml-4 mt-2">
                    <li>Nhấn nút "Mở camera" để quét mã QR từ vé của hành khách</li>
                    <li>Hoặc nhấn "Tải ảnh QR" để tải ảnh mã QR từ thiết bị</li>
                    <li>Đưa mã QR vào khung hình để quét tự động</li>
                    <li>Hệ thống sẽ tự động xác thực vé</li>
                  </ul>
                }
                type="info"
                showIcon
              />

              {/* Scanner Buttons */}
              {!scanning && (
                <Space className="w-full justify-center">
                  <Button
                    type="primary"
                    size="large"
                    icon={<CameraOutlined />}
                    onClick={startScanner}
                  >
                    Mở camera
                  </Button>

                  <Upload
                    beforeUpload={handleUploadQR}
                    accept="image/*"
                    showUploadList={false}
                  >
                    <Button size="large" icon={<UploadOutlined />}>
                      Tải ảnh QR
                    </Button>
                  </Upload>
                </Space>
              )}

              {/* QR Reader Container */}
              <div>
                {scanning && (
                  <div className="mb-4 text-center">
                    <Alert
                      message="Đang quét..."
                      description="Vui lòng đưa mã QR vào khung hình"
                      type="warning"
                      showIcon
                    />
                  </div>
                )}

                <div
                  id="qr-reader"
                  style={{
                    width: '100%',
                    display: scanning ? 'block' : 'none',
                  }}
                />

                {/* Hidden div for upload scanning */}
                <div id="qr-reader-upload" style={{ display: 'none' }} />

                {scanning && (
                  <div className="text-center mt-4">
                    <Button onClick={stopScanner}>Dừng quét</Button>
                  </div>
                )}
              </div>

              {/* Loading */}
              {loading && (
                <div className="text-center">
                  <Spin tip="Đang xác thực vé..." />
                </div>
              )}
            </Space>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QRScannerPage;
