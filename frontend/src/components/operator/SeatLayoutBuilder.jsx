import { useState, useEffect } from 'react';
import { Button, Select, InputNumber, message, Tabs } from 'antd';
import { seatLayoutApi } from '../../services/operatorApi';

const { Option } = Select;
const { TabPane } = Tabs;

const SeatLayoutBuilder = ({ busType, initialLayout, onSave }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customLayout, setCustomLayout] = useState(null);
  const [rows, setRows] = useState(10);
  const [columns, setColumns] = useState(4);
  const [mode, setMode] = useState('template'); // 'template' or 'custom'

  useEffect(() => {
    if (busType) {
      loadTemplates();
    }
    if (initialLayout) {
      setCustomLayout(initialLayout);
    }
  }, [busType, initialLayout]);

  const loadTemplates = async () => {
    try {
      const response = await seatLayoutApi.getAllTemplates();
      const filtered = response.data.templates.filter(
        (t) => !busType || t.busType === busType
      );
      setTemplates(filtered);
    } catch (error) {
      message.error('Không thể tải templates');
    }
  };

  const handleSelectTemplate = async (templateName) => {
    try {
      const response = await seatLayoutApi.buildLayout({
        busType,
        templateName,
      });
      setSelectedTemplate(response.data.seatLayout);
    } catch (error) {
      message.error('Không thể tải template');
    }
  };

  const handleBuildCustom = async () => {
    try {
      const response = await seatLayoutApi.buildLayout({
        busType,
        rows,
        columns,
        type: 'custom',
      });
      setCustomLayout(response.data.seatLayout);
      message.success('Đã tạo sơ đồ tùy chỉnh');
    } catch (error) {
      message.error('Không thể tạo sơ đồ');
    }
  };

  const handleSave = () => {
    const layoutToSave = mode === 'template' ? selectedTemplate : customLayout;
    if (layoutToSave) {
      onSave(layoutToSave);
    } else {
      message.warning('Vui lòng tạo hoặc chọn sơ đồ ghế');
    }
  };

  const renderSeatGrid = (layout) => {
    if (!layout || !layout.layout || !Array.isArray(layout.layout)) return null;

    const seatLayout = layout.layout;
    if (seatLayout.length === 0) return null;

    return (
      <div className="p-4 bg-gray-100 rounded overflow-auto max-h-96">
        <div className="inline-block">
          {seatLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1 mb-1">
              {Array.isArray(row) &&
                row.map((seat, seatIndex) => (
                  <div
                    key={seatIndex}
                    className={`w-10 h-10 flex items-center justify-center text-xs font-medium rounded
                      ${
                        seat === '' || seat === null
                          ? 'bg-transparent'
                          : seat.toLowerCase().includes('aisle')
                          ? 'bg-gray-300'
                          : 'bg-blue-500 text-white'
                      }
                    `}
                  >
                    {seat && !seat.toLowerCase().includes('aisle') ? seat : ''}
                  </div>
                ))}
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>Tổng số ghế: {layout.totalSeats}</p>
          <p>
            Kích thước: {layout.rows} hàng × {layout.columns} cột
          </p>
          {layout.floors > 1 && <p>Số tầng: {layout.floors}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Tabs activeKey={mode} onChange={setMode}>
        <TabPane tab="Chọn Template" key="template">
          <div className="space-y-4">
            <Select
              className="w-full"
              placeholder="Chọn template sơ đồ ghế"
              onChange={handleSelectTemplate}
              disabled={!busType}
            >
              {templates.map((template) => (
                <Option key={template.name} value={template.name}>
                  {template.name} - {template.totalSeats} ghế
                </Option>
              ))}
            </Select>

            {selectedTemplate && renderSeatGrid(selectedTemplate)}
          </div>
        </TabPane>

        <TabPane tab="Tùy Chỉnh" key="custom">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Số Hàng:</label>
                <InputNumber min={1} max={20} value={rows} onChange={setRows} className="w-full" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Số Cột:</label>
                <InputNumber
                  min={2}
                  max={6}
                  value={columns}
                  onChange={setColumns}
                  className="w-full"
                />
              </div>
            </div>

            <Button type="primary" onClick={handleBuildCustom} disabled={!busType}>
              Tạo Sơ Đồ
            </Button>

            {customLayout && renderSeatGrid(customLayout)}
          </div>
        </TabPane>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button onClick={() => onSave(null)}>Hủy</Button>
        <Button type="primary" onClick={handleSave}>
          Lưu Sơ Đồ
        </Button>
      </div>

      {!busType && (
        <div className="text-yellow-600 text-sm">
          ⚠️ Vui lòng chọn loại xe trước khi tạo sơ đồ ghế
        </div>
      )}
    </div>
  );
};

export default SeatLayoutBuilder;
