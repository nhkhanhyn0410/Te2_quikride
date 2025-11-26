import React from 'react';
import { Card, Row, Col, Select, Button, Space } from 'antd';
import { DownloadOutlined, FullscreenOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import './ChartContainer.css';

const { Option } = Select;

/**
 * ChartContainer Component
 * 
 * A standardized container for charts with consistent header, controls, and layout.
 * Provides common functionality like chart type switching, export, and fullscreen.
 */
const ChartContainer = ({
  title,
  subtitle,
  children,
  showTypeSelector = false,
  chartType = 'line',
  chartTypes = [
    { value: 'line', label: 'Line Chart' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'area', label: 'Area Chart' },
  ],
  onChartTypeChange,
  showExport = false,
  onExport,
  showFullscreen = false,
  onFullscreen,
  loading = false,
  className = '',
  headerExtra,
  ...props
}) => {
  const renderHeaderControls = () => {
    const controls = [];

    if (showTypeSelector && onChartTypeChange) {
      controls.push(
        <Select
          key="type-selector"
          value={chartType}
          onChange={onChartTypeChange}
          size="small"
          style={{ width: 120 }}
          className="chart-type-selector"
        >
          {chartTypes.map(type => (
            <Option key={type.value} value={type.value}>
              {type.label}
            </Option>
          ))}
        </Select>
      );
    }

    if (showExport && onExport) {
      controls.push(
        <Button
          key="export"
          type="text"
          size="small"
          icon={<DownloadOutlined />}
          onClick={onExport}
          className="chart-export-btn"
        >
          Xuất
        </Button>
      );
    }

    if (showFullscreen && onFullscreen) {
      controls.push(
        <Button
          key="fullscreen"
          type="text"
          size="small"
          icon={<FullscreenOutlined />}
          onClick={onFullscreen}
          className="chart-fullscreen-btn"
        />
      );
    }

    if (headerExtra) {
      controls.push(headerExtra);
    }

    return controls.length > 0 ? (
      <Space size="small">
        {controls}
      </Space>
    ) : null;
  };

  const cardTitle = (
    <div className="chart-container-header">
      <div className="chart-container-title">
        <h3 className="chart-title">{title}</h3>
        {subtitle && <p className="chart-subtitle">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <Card
      title={cardTitle}
      extra={renderHeaderControls()}
      loading={loading}
      className={`chart-container ${className}`}
      {...props}
    >
      <div className="chart-content">
        {children}
      </div>
    </Card>
  );
};

ChartContainer.propTypes = {
  /** Chart title */
  title: PropTypes.string.isRequired,
  /** Chart subtitle */
  subtitle: PropTypes.string,
  /** Chart content */
  children: PropTypes.node.isRequired,
  /** Show chart type selector */
  showTypeSelector: PropTypes.bool,
  /** Current chart type */
  chartType: PropTypes.string,
  /** Available chart types */
  chartTypes: PropTypes.array,
  /** Chart type change handler */
  onChartTypeChange: PropTypes.func,
  /** Show export button */
  showExport: PropTypes.bool,
  /** Export handler */
  onExport: PropTypes.func,
  /** Show fullscreen button */
  showFullscreen: PropTypes.bool,
  /** Fullscreen handler */
  onFullscreen: PropTypes.func,
  /** Loading state */
  loading: PropTypes.bool,
  /** Additional CSS class */
  className: PropTypes.string,
  /** Additional header content */
  headerExtra: PropTypes.node,
};

export default ChartContainer;