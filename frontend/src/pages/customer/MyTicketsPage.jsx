import { useState, useEffect } from 'react';
import {
  Tabs,
  Card,
  Table,
  Tag,
  Button,
  Input,
  Modal,
  message,
  Space,
  DatePicker,
  Spin,
  Empty,
  Tooltip
} from 'antd';
import {
  SearchOutlined,
  CloseCircleOutlined,
  SwapOutlined,
  MailOutlined,
  QrcodeOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  getCustomerTickets,
  cancelTicket,
  resendTicket
} from '../../services/ticketApi';
import toast from 'react-hot-toast';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const MyTicketsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrTicket, setQrTicket] = useState(null);

  // Fetch tickets
  const fetchTickets = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        type: activeTab,
        page,
        limit: pagination.pageSize,
      };

      if (searchText) {
        params.search = searchText;
      }

      if (dateRange && dateRange.length === 2) {
        params.fromDate = dateRange[0].format('YYYY-MM-DD');
        params.toDate = dateRange[1].format('YYYY-MM-DD');
      }

      const response = await getCustomerTickets(params);

      if (response.status === 'success') {
        setTickets(response.data.tickets || []);
        setPagination({
          ...pagination,
          current: response.data.pagination?.currentPage || 1,
          total: response.data.pagination?.total || 0,
        });
      }
    } catch (error) {
      console.error('Fetch tickets error:', error);
      message.error(error || 'Không thể tải danh sách vé');
    } finally {
      setLoading(false);
    }
  };

  // Load tickets when tab or filters change
  useEffect(() => {
    fetchTickets(1);
  }, [activeTab, searchText, dateRange]);

  // Handle show QR code
  const handleShowQR = (ticket) => {
    setQrTicket(ticket);
    setQrModalVisible(true);
  };

  // Handle resend ticket
  const handleResend = async (ticketId) => {
    try {
      await resendTicket(ticketId);
      message.success('Đã gửi lại vé qua email và SMS');
    } catch (error) {
      console.error('Resend ticket error:', error);
      message.error(error || 'Không thể gửi lại vé');
    }
  };

  // Handle cancel ticket
  const handleCancelTicket = async () => {
    if (!selectedTicket) return;

    try {
      await cancelTicket(selectedTicket._id, cancelReason);
      message.success('Hủy vé thành công. Tiền sẽ được hoàn lại trong 3-5 ngày làm việc.');
      setCancelModalVisible(false);
      setCancelReason('');
      setSelectedTicket(null);
      fetchTickets(pagination.current);
    } catch (error) {
      console.error('Cancel ticket error:', error);
      message.error(error || 'Không thể hủy vé');
    }
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

  // Check if ticket can be cancelled
  const canCancelTicket = (ticket) => {
    if (ticket.status !== 'valid') return false;

    const departureTime = dayjs(ticket.tripInfo?.departureTime);
    const now = dayjs();
    const hoursDiff = departureTime.diff(now, 'hour');

    // Can cancel if more than 24 hours before departure
    return hoursDiff > 24;
  };

  // Table columns
  const columns = [
    {
      title: 'Mã vé',
      dataIndex: 'ticketCode',
      key: 'ticketCode',
      render: (code) => (
        <span className="font-mono font-semibold text-blue-600">{code}</span>
      ),
    },
    {
      title: 'Tuyến đường',
      dataIndex: ['tripInfo', 'route'],
      key: 'route',
      render: (route) => (
        <div>
          <EnvironmentOutlined className="mr-1" />
          {route}
        </div>
      ),
    },
    {
      title: 'Ngày giờ đi',
      dataIndex: ['tripInfo', 'departureTime'],
      key: 'departureTime',
      render: (time) => (
        <div>
          <CalendarOutlined className="mr-1" />
          {dayjs(time).format('DD/MM/YYYY HH:mm')}
        </div>
      ),
    },
    {
      title: 'Số ghế',
      dataIndex: 'passengers',
      key: 'seats',
      render: (passengers) => (
        <div>
          {passengers?.map((p) => p.seatNumber).join(', ')}
        </div>
      ),
    },
    {
      title: 'Hành khách',
      dataIndex: 'passengers',
      key: 'passengers',
      render: (passengers) => (
        <div>
          <UserOutlined className="mr-1" />
          {passengers?.length || 0} người
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem mã QR">
            <Button
              type="primary"
              size="small"
              icon={<QrcodeOutlined />}
              onClick={() => handleShowQR(record)}
            />
          </Tooltip>

          <Tooltip title="Gửi lại vé">
            <Button
              size="small"
              icon={<MailOutlined />}
              onClick={() => handleResend(record._id)}
            />
          </Tooltip>

          {canCancelTicket(record) && (
            <Tooltip title="Hủy vé">
              <Button
                danger
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() => {
                  setSelectedTicket(record);
                  setCancelModalVisible(true);
                }}
              />
            </Tooltip>
          )}

          {/* TODO: Implement change ticket feature
          {canCancelTicket(record) && (
            <Tooltip title="Đổi vé">
              <Button
                size="small"
                icon={<SwapOutlined />}
                onClick={() => handleChangeTicket(record)}
              />
            </Tooltip>
          )}
          */}
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            <QrcodeOutlined className="mr-2" />
            Quản lý vé của tôi
          </h1>
          <p className="text-gray-600 mt-2">
            Xem, tải xuống và quản lý các vé đã đặt
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-4">
            <Input
              placeholder="Tìm kiếm theo mã vé, mã booking..."
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />

            <RangePicker
              format="DD/MM/YYYY"
              placeholder={['Từ ngày', 'Đến ngày']}
              value={dateRange}
              onChange={setDateRange}
            />
          </div>
        </Card>

        {/* Tabs */}
        <Card>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'upcoming',
                label: 'Sắp tới',
                children: null,
              },
              {
                key: 'past',
                label: 'Đã đi',
                children: null,
              },
              {
                key: 'cancelled',
                label: 'Đã hủy',
                children: null,
              },
            ]}
          />

          <Spin spinning={loading}>
            {tickets.length > 0 ? (
              <Table
                columns={columns}
                dataSource={tickets}
                rowKey="_id"
                pagination={{
                  ...pagination,
                  showSizeChanger: true,
                  showTotal: (total) => `Tổng ${total} vé`,
                }}
                onChange={(newPagination) => {
                  setPagination(newPagination);
                  fetchTickets(newPagination.current);
                }}
              />
            ) : (
              <Empty
                description={
                  activeTab === 'upcoming'
                    ? 'Bạn chưa có vé nào sắp tới'
                    : activeTab === 'past'
                    ? 'Bạn chưa có vé nào đã đi'
                    : 'Bạn chưa hủy vé nào'
                }
              />
            )}
          </Spin>
        </Card>

        {/* QR Code Modal */}
        <Modal
          title="Mã QR vé điện tử"
          open={qrModalVisible}
          onCancel={() => {
            setQrModalVisible(false);
            setQrTicket(null);
          }}
          footer={[
            <Button key="close" onClick={() => setQrModalVisible(false)}>
              Đóng
            </Button>
          ]}
          centered
          width={500}
        >
          {qrTicket && (
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg border-2 border-blue-500 inline-block mb-4">
                <img
                  src={qrTicket.qrCode}
                  alt="QR Code"
                  className="mx-auto"
                  style={{ width: 300, height: 300 }}
                />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-800">
                  Mã vé: <span className="text-blue-600">{qrTicket.ticketCode}</span>
                </p>
                <p className="text-gray-600">
                  {qrTicket.tripInfo?.routeName || qrTicket.tripInfo?.route}
                </p>
                <p className="text-gray-600">
                  {dayjs(qrTicket.tripInfo?.departureTime).format('DD/MM/YYYY HH:mm')}
                </p>
                <div className="bg-blue-50 border border-blue-200 p-3 rounded mt-4">
                  <p className="text-sm text-blue-800">
                    <QrcodeOutlined className="mr-1" />
                    Vui lòng xuất trình mã QR này khi lên xe
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Cancel Modal */}
        <Modal
          title="Hủy vé"
          open={cancelModalVisible}
          onOk={handleCancelTicket}
          onCancel={() => {
            setCancelModalVisible(false);
            setCancelReason('');
            setSelectedTicket(null);
          }}
          okText="Xác nhận hủy"
          cancelText="Đóng"
          okButtonProps={{ danger: true }}
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              Bạn có chắc chắn muốn hủy vé này?
            </p>

            {selectedTicket && (
              <div className="bg-gray-50 p-4 rounded">
                <p><strong>Mã vé:</strong> {selectedTicket.ticketCode}</p>
                <p><strong>Tuyến:</strong> {selectedTicket.tripInfo?.route}</p>
                <p>
                  <strong>Ngày giờ:</strong>{' '}
                  {dayjs(selectedTicket.tripInfo?.departureTime).format('DD/MM/YYYY HH:mm')}
                </p>
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-2">
                Lý do hủy vé (không bắt buộc):
              </label>
              <Input.TextArea
                rows={4}
                placeholder="Nhập lý do hủy vé..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Lưu ý:</strong> Tiền sẽ được hoàn lại theo chính sách hoàn tiền.
                Vé hủy trước 24h sẽ được hoàn 80%, trước 48h sẽ được hoàn 90%.
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default MyTicketsPage;
