import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button, Select, InputNumber, message, Tabs, Spin, Radio } from 'antd';
import { seatLayoutApi } from '../../services/operatorApi';

const { Option } = Select;
const { TabPane } = Tabs;

const SeatLayoutBuilder = ({ busType, initialLayout, onSave }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customLayout, setCustomLayout] = useState(null);
  const [rows, setRows] = useState(10);
  const [columns, setColumns] = useState(4);
  const [floors, setFloors] = useState(1);
  const [mode, setMode] = useState('template'); // 'template' or 'custom'
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [buildingLayout, setBuildingLayout] = useState(false);

  // Reset states when busType changes
  useEffect(() => {
    if (busType) {
      loadTemplates();
      // Reset custom layout states when busType changes
      setSelectedTemplate(null);
      setCustomLayout(null);
      setRows(10);
      setColumns(4);
      setFloors(1);
    }
  }, [busType]);

  useEffect(() => {
    // Set initial layout if provided
    if (initialLayout) {
      setCustomLayout(initialLayout);
      // Auto-switch to custom mode if there's an initial layout
      if (mode === 'template' && !selectedTemplate) {
        setMode('custom');
      }
    }
  }, [initialLayout, mode, selectedTemplate]);

  const loadTemplates = async () => {
    if (!busType) return;

    setLoadingTemplates(true);
    try {
      const response = await seatLayoutApi.getAllTemplates();
      const filtered = response.data.templates.filter(
        (t) => !busType || t.busType === busType
      );
      setTemplates(filtered);
    } catch (error) {
      console.error('Load templates error:', error);
      message.error(error?.response?.data?.message || error?.message || 'Không thể tải templates');
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleSelectTemplate = async (templateKey) => {
    if (!busType) {
      message.warning('Vui lòng chọn loại xe trước');
      return;
    }

    console.log('Selected template key:', templateKey);

    setLoadingTemplate(true);
    try {
      // Use templateKey instead of template name
      const response = await seatLayoutApi.getTemplate(busType, templateKey);
      console.log('Template response:', response);

      if (response.status === 'success' && response.data?.template) {
        setSelectedTemplate(response.data.template);
        message.success('Đã tải template thành công');
      } else {
        message.error('Không thể tải template');
      }
    } catch (error) {
      console.error('Get template error:', error);
      message.error(error?.response?.data?.message || error?.message || 'Không thể tải template');
    } finally {
      setLoadingTemplate(false);
    }
  };

  const handleBuildCustom = async () => {
    if (!busType) {
      message.warning('Vui lòng chọn loại xe trước');
      return;
    }

    if (!rows || rows < 1 || rows > 20) {
      message.warning('Số hàng phải từ 1 đến 20');
      return;
    }

    if (!columns || columns < 2 || columns > 6) {
      message.warning('Số cột phải từ 2 đến 6');
      return;
    }

    if (!floors || floors < 1 || floors > 2) {
      message.warning('Số tầng phải là 1 hoặc 2');
      return;
    }

    setBuildingLayout(true);
    try {
      const response = await seatLayoutApi.buildLayout({
        busType,
        rows,
        columns,
        floors,
      });
      console.log('Build custom layout response:', response);

      if (response.status === 'success' && response.data?.seatLayout) {
        setCustomLayout(response.data.seatLayout);
        message.success('Đã tạo sơ đồ tùy chỉnh');
      } else {
        message.error('Không thể tạo sơ đồ');
      }
    } catch (error) {
      console.error('Build custom layout error:', error);
      message.error(error?.response?.data?.message || error?.message || 'Không thể tạo sơ đồ');
    } finally {
      setBuildingLayout(false);
    }
  };

  const handleSave = useCallback(() => {
    const layoutToSave = mode === 'template' ? selectedTemplate : customLayout;
    if (layoutToSave) {
      onSave(layoutToSave);
    } else {
      message.warning('Vui lòng tạo hoặc chọn sơ đồ ghế');
    }
  }, [mode, selectedTemplate, customLayout, onSave]);

  const handleCancel = useCallback(() => {
    // Reset all states when cancelling
    setSelectedTemplate(null);
    setCustomLayout(null);
    setRows(10);
    setColumns(4);
    setFloors(1);
    setMode('template');
    onSave(null);
  }, [onSave]);

  const getSeatClass = (seat) => {
    if (!seat || seat === '') return 'bg-transparent';
    if (seat === 'DRIVER' || seat === '🚗') return 'bg-blue-500 text-white border-blue-600';
    if (seat === 'FLOOR_2') return 'bg-amber-500 text-white border-amber-600';
    if (seat.toLowerCase().includes('aisle')) return 'bg-gray-300';
    return 'bg-green-500 text-white border-green-600';
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
                row.map((seat, seatIndex) => {
                  const seatClass = getSeatClass(seat);
                  const isSpecial = seat === 'DRIVER' || seat === 'FLOOR_2';
                  const displayText = seat === 'DRIVER' ? '🚗' :
                                     seat === 'FLOOR_2' ? 'T2' :
                                     (seat && !seat.toLowerCase().includes('aisle') ? seat : '');

                  return (
                    <div
                      key={seatIndex}
                      className={`w-10 h-10 flex items-center justify-center text-xs font-medium rounded border-2 ${seatClass}`}
                      title={seat === 'DRIVER' ? 'Ghế lái' : seat === 'FLOOR_2' ? 'Tầng 2' : seat}
                    >
                      {displayText}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-600 space-y-1">
          <p className="font-semibold">Tổng số ghế: {layout.totalSeats}</p>
          <p>Kích thước: {layout.rows} hàng × {layout.columns} cột</p>
          {layout.floors > 1 && <p>Số tầng: {layout.floors}</p>}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-gray-300 space-y-2">
          <p className="text-xs font-semibold text-gray-700">Chú thích:</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-green-500 border-2 border-green-600 rounded"></div>
              <span>Ghế thường</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-blue-500 border-2 border-blue-600 rounded flex items-center justify-center text-white">🚗</div>
              <span>Ghế lái</span>
            </div>
            {layout.floors > 1 && (
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 bg-amber-500 border-2 border-amber-600 rounded flex items-center justify-center text-white text-[9px]">T2</div>
                <span>Tầng 2</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
              <span>Lối đi</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Memoize the current layout to save
  const currentLayout = useMemo(() => {
    return mode === 'template' ? selectedTemplate : customLayout;
  }, [mode, selectedTemplate, customLayout]);

  const hasValidLayout = useMemo(() => {
    return currentLayout !== null && currentLayout !== undefined;
  }, [currentLayout]);

  // Determine if floors input should be shown based on bus type
  const canHaveMultipleFloors = useMemo(() => {
    return busType === 'sleeper' || busType === 'double_decker';
  }, [busType]);

  return (
    <div className="space-y-4">
      <Tabs activeKey={mode} onChange={setMode}>
        <TabPane tab="Chọn Template" key="template">
          <Spin spinning={loadingTemplates || loadingTemplate}>
            <div className="space-y-4">
              <Select
                className="w-full"
                placeholder="Chọn template sơ đồ ghế"
                onChange={handleSelectTemplate}
                disabled={!busType || loadingTemplates || loadingTemplate}
                loading={loadingTemplates}
              >
                {templates.map((template) => (
                  <Option key={template.templateKey} value={template.templateKey}>
                    {template.name} - {template.totalSeats} ghế
                    {template.floors > 1 ? ` (${template.floors} tầng)` : ''}
                  </Option>
                ))}
              </Select>

              {!busType && (
                <div className="text-amber-600 text-sm p-3 bg-amber-50 rounded">
                  ⚠️ Vui lòng chọn loại xe trước khi chọn template
                </div>
              )}

              {templates.length === 0 && busType && !loadingTemplates && (
                <div className="text-gray-500 text-sm p-3 bg-gray-50 rounded">
                  Không có template nào cho loại xe này
                </div>
              )}

              {selectedTemplate && renderSeatGrid(selectedTemplate)}
            </div>
          </Spin>
        </TabPane>

        <TabPane tab="Tùy Chỉnh" key="custom">
          <Spin spinning={buildingLayout}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Số Hàng: <span className="text-gray-500">(1-20)</span>
                  </label>
                  <InputNumber
                    min={1}
                    max={20}
                    value={rows}
                    onChange={setRows}
                    className="w-full"
                    disabled={!busType || buildingLayout}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Số Cột: <span className="text-gray-500">(2-6)</span>
                  </label>
                  <InputNumber
                    min={2}
                    max={6}
                    value={columns}
                    onChange={setColumns}
                    className="w-full"
                    disabled={!busType || buildingLayout}
                  />
                </div>
              </div>

              {/* Floors input - only show for sleeper and double_decker */}
              {canHaveMultipleFloors && (
                <div>
                  <label className="block mb-2 text-sm font-medium">Số Tầng:</label>
                  <Radio.Group
                    value={floors}
                    onChange={(e) => setFloors(e.target.value)}
                    disabled={!busType || buildingLayout}
                  >
                    <Radio value={1}>1 Tầng</Radio>
                    <Radio value={2}>2 Tầng</Radio>
                  </Radio.Group>
                  <div className="text-xs text-gray-500 mt-1">
                    {floors === 2 && '⚠️ Xe 2 tầng sẽ có thêm dấu phân cách giữa các tầng'}
                  </div>
                </div>
              )}

              <Button
                type="primary"
                onClick={handleBuildCustom}
                disabled={!busType || buildingLayout}
                loading={buildingLayout}
                block
              >
                {buildingLayout ? 'Đang tạo sơ đồ...' : 'Tạo Sơ Đồ'}
              </Button>

              {!busType && (
                <div className="text-amber-600 text-sm p-3 bg-amber-50 rounded">
                  ⚠️ Vui lòng chọn loại xe trước khi tạo sơ đồ tùy chỉnh
                </div>
              )}

              {customLayout && renderSeatGrid(customLayout)}
            </div>
          </Spin>
        </TabPane>
      </Tabs>

      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-gray-600">
          {hasValidLayout ? (
            <span className="text-green-600 font-medium">
              ✓ Sơ đồ đã sẵn sàng ({currentLayout.totalSeats} ghế
              {currentLayout.floors > 1 ? `, ${currentLayout.floors} tầng` : ''})
            </span>
          ) : (
            <span className="text-gray-500">Chưa có sơ đồ nào được chọn</span>
          )}
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleCancel}>Hủy</Button>
          <Button type="primary" onClick={handleSave} disabled={!hasValidLayout}>
            Lưu Sơ Đồ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeatLayoutBuilder;
