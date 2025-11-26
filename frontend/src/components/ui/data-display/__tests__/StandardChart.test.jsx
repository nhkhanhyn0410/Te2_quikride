import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import StandardChart from '../StandardChart';
import { antdTheme } from '../../../../theme/themeConfig';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  Area: () => <div data-testid="area" />,
  Bar: () => <div data-testid="bar" />,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

// Mock data for testing
const mockData = [
  { name: 'Jan', value: 100, sales: 200 },
  { name: 'Feb', value: 150, sales: 250 },
  { name: 'Mar', value: 120, sales: 180 },
  { name: 'Apr', value: 180, sales: 300 },
];

const TestWrapper = ({ children }) => (
  <ConfigProvider theme={antdTheme}>
    {children}
  </ConfigProvider>
);

describe('StandardChart Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders line chart correctly', () => {
      render(
        <TestWrapper>
          <StandardChart
            type="line"
            data={mockData}
            yAxisKeys={['value', 'sales']}
          />
        </TestWrapper>
      );

      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getAllByTestId('line')).toHaveLength(2);
    });

    it('renders area chart correctly', () => {
      render(
        <TestWrapper>
          <StandardChart
            type="area"
            data={mockData}
            yAxisKeys={['value']}
          />
        </TestWrapper>
      );

      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
      expect(screen.getByTestId('area')).toBeInTheDocument();
    });

    it('renders bar chart correctly', () => {
      render(
        <TestWrapper>
          <StandardChart
            type="bar"
            data={mockData}
            yAxisKeys={['value', 'sales']}
          />
        </TestWrapper>
      );

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getAllByTestId('bar')).toHaveLength(2);
    });

    it('renders pie chart correctly', () => {
      render(
        <TestWrapper>
          <StandardChart
            type="pie"
            data={mockData}
            pieConfig={{ dataKey: 'value', nameKey: 'name' }}
          />
        </TestWrapper>
      );

      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
      expect(screen.getByTestId('pie')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when loading is true', () => {
      render(
        <TestWrapper>
          <StandardChart
            type="line"
            data={mockData}
            loading={true}
            yAxisKeys={['value']}
          />
        </TestWrapper>
      );

      expect(screen.getByTestId('loading-spinner') || document.querySelector('.ant-spin')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no data provided', () => {
      render(
        <TestWrapper>
          <StandardChart
            type="line"
            data={[]}
            yAxisKeys={['value']}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Không có dữ liệu')).toBeInTheDocument();
    });

    it('shows custom empty text', () => {
      render(
        <TestWrapper>
          <StandardChart
            type="line"
            data={[]}
            yAxisKeys={['value']}
            emptyText="Custom empty message"
          />
        </TestWrapper>
      );

      expect(screen.getByText('Custom empty message')).toBeInTheDocument();
    });
  });

  describe('Chart with Title', () => {
    it('renders chart wrapped in Card when title is provided', () => {
      render(
        <TestWrapper>
          <StandardChart
            type="line"
            data={mockData}
            yAxisKeys={['value']}
            title="Test Chart"
            subtitle="Test Subtitle"
          />
        </TestWrapper>
      );

      expect(screen.getByText('Test Chart')).toBeInTheDocument();
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
      expect(document.querySelector('.ant-card')).toBeInTheDocument();
    });

    it('renders chart without Card when no title provided', () => {
      render(
        <TestWrapper>
          <StandardChart
            type="line"
            data={mockData}
            yAxisKeys={['value']}
          />
        </TestWrapper>
      );

      expect(document.querySelector('.ant-card')).not.toBeInTheDocument();
      expect(document.querySelector('.standard-chart')).toBeInTheDocument();
    });
  });

  describe('Chart Configuration', () => {
    it('applies custom height', () => {
      render(
        <TestWrapper>
          <StandardChart
            type="line"
            data={mockData}
            yAxisKeys={['value']}
            height={400}
          />
        </TestWrapper>
      );

      const container = screen.getByTestId('responsive-container');
      expect(container).toBeInTheDocument();
    });

    it('disables responsive behavior when responsive is false', () => {
      render(
        <TestWrapper>
          <StandardChart
            type="line"
            data={mockData}
            yAxisKeys={['value']}
            responsive={false}
            height={300}
          />
        </TestWrapper>
      );

      expect(screen.queryByTestId('responsive-container')).not.toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('hides grid when showGrid is false', () => {
      render(
        <TestWrapper>
          <StandardChart
            type="line"
            data={mockData}
            yAxisKeys={['value']}
            showGrid={false}
          />
        </TestWrapper>
      );

      expect(screen.queryByTestId('cartesian-grid')).not.toBeInTheDocument();
    });

    it('hides legend when showLegend is false', () => {
      render(
        <TestWrapper>
          <StandardChart
            type="line"
            data={mockData}
            yAxisKeys={['value']}
            showLegend={false}
          />
        </TestWrapper>
      );

      expect(screen.queryByTestId('legend')).not.toBeInTheDocument();
    });

    it('hides tooltip when showTooltip is false', () => {
      render(
        <TestWrapper>
          <StandardChart
            type="line"
            data={mockData}
            yAxisKeys={['value']}
            showTooltip={false}
          />
        </TestWrapper>
      );

      expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
    });
  });

  describe('Custom Configuration', () => {
    it('uses custom xAxisKey', () => {
      render(
        <TestWrapper>
          <StandardChart
            type="line"
            data={mockData}
            yAxisKeys={['value']}
            xAxisKey="customKey"
          />
        </TestWrapper>
      );

      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    });

    it('applies custom colors', () => {
      const customColors = ['#ff0000', '#00ff00', '#0000ff'];
      
      render(
        <TestWrapper>
          <StandardChart
            type="line"
            data={mockData}
            yAxisKeys={['value', 'sales']}
            colors={customColors}
          />
        </TestWrapper>
      );

      expect(screen.getAllByTestId('line')).toHaveLength(2);
    });

    it('applies custom className', () => {
      render(
        <TestWrapper>
          <StandardChart
            type="line"
            data={mockData}
            yAxisKeys={['value']}
            className="custom-chart-class"
          />
        </TestWrapper>
      );

      expect(document.querySelector('.custom-chart-class')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('shows error message for unsupported chart type', () => {
      render(
        <TestWrapper>
          <StandardChart
            type="unsupported"
            data={mockData}
            yAxisKeys={['value']}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Unsupported chart type: unsupported')).toBeInTheDocument();
    });
  });

  describe('Pie Chart Specific', () => {
    it('renders pie chart with custom configuration', () => {
      const pieData = [
        { name: 'A', value: 100 },
        { name: 'B', value: 200 },
        { name: 'C', value: 150 },
      ];

      render(
        <TestWrapper>
          <StandardChart
            type="pie"
            data={pieData}
            pieConfig={{
              dataKey: 'value',
              nameKey: 'name',
              outerRadius: 100,
            }}
          />
        </TestWrapper>
      );

      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
      expect(screen.getByTestId('pie')).toBeInTheDocument();
      expect(screen.getAllByTestId('cell')).toHaveLength(pieData.length);
    });
  });

  describe('Accessibility', () => {
    it('maintains proper structure for screen readers', () => {
      render(
        <TestWrapper>
          <StandardChart
            type="line"
            data={mockData}
            yAxisKeys={['value']}
            title="Accessible Chart"
          />
        </TestWrapper>
      );

      expect(screen.getByText('Accessible Chart')).toBeInTheDocument();
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });
  });
});