import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { routesApi } from '../../services/operatorApi';

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    setLoading(true);
    try {
      const response = await routesApi.getMyRoutes();
      setRoutes(response.data.routes || []);
    } catch (error) {
      message.error('Không thể tải danh sách tuyến đường');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingRoute(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRoute(record);
    form.setFieldsValue({
      routeName: record.routeName,
      routeCode: record.routeCode,
      originCity: record.origin?.city,
      originProvince: record.origin?.province,
      originStation: record.origin?.station,
      destinationCity: record.destination?.city,
      destinationProvince: record.destination?.province,
      destinationStation: record.destination?.station,
      distance: record.distance,
      estimatedDuration: record.estimatedDuration,
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const routeData = {
        routeName: values.routeName,
        routeCode: values.routeCode,
        origin: {
          city: values.originCity,
          province: values.originProvince,
          station: values.originStation,
        },
        destination: {
          city: values.destinationCity,
          province: values.destinationProvince,
          station: values.destinationStation,
        },
        distance: values.distance,
        estimatedDuration: values.estimatedDuration,
      };

      if (editingRoute) {
        await routesApi.update(editingRoute._id, routeData);
        message.success('Cập nhật tuyến đường thành công');
      } else {
        await routesApi.create(routeData);
        message.success('Tạo tuyến đường thành công');
      }

      setModalVisible(false);
      loadRoutes();
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    try {
      await routesApi.delete(id);
      message.success('Xóa tuyến đường thành công');
      loadRoutes();
    } catch (error) {
      message.error('Không thể xóa tuyến đường');
    }
  };

  const handleToggleActive = async (record) => {
    try {
      await routesApi.toggleActive(record._id);
      message.success('Cập nhật trạng thái thành công');
      loadRoutes();
    } catch (error) {
      message.error('Không thể cập nhật trạng thái');
    }
  };

  const columns = [
    {
      title: 'Mã Tuyến',
      dataIndex: 'routeCode',
      key: 'routeCode',
      width: 120,
    },
    {
      title: 'Tên Tuyến',
      dataIndex: 'routeName',
      key: 'routeName',
      width: 200,
    },
    {
      title: 'Điểm Đi',
      key: 'origin',
      render: (_, record) => `${record.origin?.city}, ${record.origin?.province}`,
    },
    {
      title: 'Điểm Đến',
      key: 'destination',
      render: (_, record) => `${record.destination?.city}, ${record.destination?.province}`,
    },
    {
      title: 'Khoảng Cách',
      dataIndex: 'distance',
      key: 'distance',
      width: 120,
      render: (distance) => `${distance} km`,
    },
    {
      title: 'Thời Gian',
      dataIndex: 'estimatedDuration',
      key: 'estimatedDuration',
      width: 120,
      render: (duration) => `${duration} phút`,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive) =>
        isActive ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Hoạt động
          </Tag>
        ) : (
          <Tag icon={<StopOutlined />} color="error">
            Ngừng
          </Tag>
        ),
    },
    {
      title: 'Hành Động',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button
            size="small"
            type={record.isActive ? 'default' : 'primary'}
            onClick={() => handleToggleActive(record)}
          >
            {record.isActive ? 'Tắt' : 'Bật'}
          </Button>
          <Popconfirm
            title="Xác nhận xóa tuyến đường này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản Lý Tuyến Đường</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Tạo Tuyến Mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={routes}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingRoute ? 'Chỉnh Sửa Tuyến Đường' : 'Tạo Tuyến Đường Mới'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
        okText={editingRoute ? 'Cập Nhật' : 'Tạo'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="routeName" label="Tên Tuyến" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: Hà Nội - Đà Nẵng" />
          </Form.Item>
          <Form.Item name="routeCode" label="Mã Tuyến" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: HN-DN-001" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Điểm Đi</h3>
              <Form.Item name="originCity" label="Thành Phố" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="originProvince" label="Tỉnh" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="originStation" label="Bến Xe">
                <Input />
              </Form.Item>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Điểm Đến</h3>
              <Form.Item name="destinationCity" label="Thành Phố" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="destinationProvince" label="Tỉnh" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="destinationStation" label="Bến Xe">
                <Input />
              </Form.Item>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="distance" label="Khoảng Cách (km)" rules={[{ required: true }]}>
              <InputNumber min={1} className="w-full" />
            </Form.Item>
            <Form.Item
              name="estimatedDuration"
              label="Thời Gian Ước Tính (phút)"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} className="w-full" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default RoutesPage;
