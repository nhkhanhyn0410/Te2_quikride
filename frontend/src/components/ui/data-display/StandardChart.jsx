import React from 'react';
import { Card, Empty, Spin } from 'antd';
import {
  ResponsiveContainer,
  LineChart,
  AreaChart,
  BarChart,
  PieChart,
  Line,
  Area,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import PropTypes from 'prop-types';
import { colorPalette } from '../../../theme/themeConfig';
import './StandardChart.css';

/**
 * StandardChart Component
 * 
 * A standardized chart component that wraps Recharts with consistent styling,
 * responsive behavior, and theme integration.
 */
const StandardChart = ({
  type = 'line',
  data = [],
  loading = false,
  title,
  subtitle,
  height = 300,
  colors = [],
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  responsive = true,
  className = '',
  xAxisKey = 'name',
  yAxisKeys = [],
  pieConfig = {},
  customTooltip,
  customLegend,
  emptyText = 'Không có dữ liệu',
  ...props
}) => {
  // Default color scheme from theme
  const defaultColors = [
    colorPalette.primary[500],
    colorPalette.success[500],
    colorPalette.warning[500],
    colorPalette.error[500],
    colorPalette.primary[300],
    colorPalette.success[300],
    colorPalette.warning[300],
    colorPalette.error[300],
  ];

  const chartColors = colors.length > 0 ? colors : defaultColors;

  // Common chart props
  const commonProps = {
    data,
    margin: { top: 20, right: 30, left: 20, bottom: 5 },
    ...props,
  };

  // Render chart based on type
  const renderChart = () => {
    if (loading) {
      return (
        <div className="standard-chart-loading">
          <Spin size="large" />
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="standard-chart-empty">
          <Empty description={emptyText} />
        </div>
      );
    }    s
witch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colorPalette.neutral[200]} />}
            <XAxis 
              dataKey={xAxisKey} 
              stroke={colorPalette.neutral[600]}
              fontSize={12}
            />
            <YAxis stroke={colorPalette.neutral[600]} fontSize={12} />
            {showTooltip && (customTooltip || <Tooltip />)}
            {showLegend && (customLegend || <Legend />)}
            {yAxisKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={chartColors[index % chartColors.length]}
                strokeWidth={2}
                dot={{ fill: chartColors[index % chartColors.length], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: chartColors[index % chartColors.length], strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              {yAxisKeys.map((key, index) => (
                <linearGradient key={`gradient-${key}`} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors[index % chartColors.length]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartColors[index % chartColors.length]} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colorPalette.neutral[200]} />}
            <XAxis 
              dataKey={xAxisKey} 
              stroke={colorPalette.neutral[600]}
              fontSize={12}
            />
            <YAxis stroke={colorPalette.neutral[600]} fontSize={12} />
            {showTooltip && (customTooltip || <Tooltip />)}
            {showLegend && (customLegend || <Legend />)}
            {yAxisKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={chartColors[index % chartColors.length]}
                fillOpacity={1}
                fill={`url(#color-${key})`}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colorPalette.neutral[200]} />}
            <XAxis 
              dataKey={xAxisKey} 
              stroke={colorPalette.neutral[600]}
              fontSize={12}
            />
            <YAxis stroke={colorPalette.neutral[600]} fontSize={12} />
            {showTooltip && (customTooltip || <Tooltip />)}
            {showLegend && (customLegend || <Legend />)}
            {yAxisKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={chartColors[index % chartColors.length]}
                radius={[2, 2, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'pie':
        const { dataKey = 'value', nameKey = 'name', ...pieProps } = pieConfig;
        return (
          <PieChart {...commonProps}>
            {showTooltip && (customTooltip || <Tooltip />)}
            {showLegend && (customLegend || <Legend />)}
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
              {...pieProps}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={chartColors[index % chartColors.length]} 
                />
              ))}
            </Pie>
          </PieChart>
        );

      default:
        return (
          <div className="standard-chart-error">
            <Empty description={`Unsupported chart type: ${type}`} />
          </div>
        );
    }
  };

  const chartContent = responsive ? (
    <ResponsiveContainer width="100%" height={height}>
      {renderChart()}
    </ResponsiveContainer>
  ) : (
    <div style={{ width: '100%', height }}>
      {renderChart()}
    </div>
  );

  // If title is provided, wrap in Card
  if (title) {
    return (
      <Card
        title={title}
        extra={subtitle && <span className="text-gray-500 text-sm">{subtitle}</span>}
        className={`standard-chart-card ${className}`}
      >
        {chartContent}
      </Card>
    );
  }

  return (
    <div className={`standard-chart ${className}`}>
      {chartContent}
    </div>
  );
};

StandardChart.propTypes = {
  /** Chart type */
  type: PropTypes.oneOf(['line', 'area', 'bar', 'pie']),
  /** Chart data */
  data: PropTypes.array,
  /** Loading state */
  loading: PropTypes.bool,
  /** Chart title */
  title: PropTypes.string,
  /** Chart subtitle */
  subtitle: PropTypes.string,
  /** Chart height */
  height: PropTypes.number,
  /** Custom colors array */
  colors: PropTypes.array,
  /** Show grid lines */
  showGrid: PropTypes.bool,
  /** Show legend */
  showLegend: PropTypes.bool,
  /** Show tooltip */
  showTooltip: PropTypes.bool,
  /** Enable responsive behavior */
  responsive: PropTypes.bool,
  /** Additional CSS class */
  className: PropTypes.string,
  /** X-axis data key */
  xAxisKey: PropTypes.string,
  /** Y-axis data keys array */
  yAxisKeys: PropTypes.array,
  /** Pie chart specific configuration */
  pieConfig: PropTypes.object,
  /** Custom tooltip component */
  customTooltip: PropTypes.element,
  /** Custom legend component */
  customLegend: PropTypes.element,
  /** Empty state text */
  emptyText: PropTypes.string,
};

export default StandardChart;