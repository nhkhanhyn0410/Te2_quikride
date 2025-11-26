import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import ChartContainer from '../ChartContainer';
import { antdTheme } from '../../../../theme/themeConfig';

const TestWrapper = ({ children }) => (
  <ConfigProvider theme={antdTheme}>
    {children}
  </ConfigProvider>
);

describe('ChartContainer Component', () => {
  const mockHandlers = {
    onChartTypeChange: jest.fn(),
    onExport: jest.fn(),
    onFullscreen: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with title and children', () => {
      render(
        <TestWrapper>
          <ChartContainer title="Test Chart">
            <div data-testid="chart-content">Chart Content</div>
          </ChartContainer>
        </TestWrapper>
      );

      expect(screen.getByText('Test Chart')).toBeInTheDocument();
      expect(screen.getByTestId('chart-content')).toBeInTheDocument();
    });

    it('renders with title and subtitle', () => {
      render(
        <TestWrapper>
          <ChartContainer title="Test Chart" subtitle="Test Subtitle">
            <div>Chart Content</div>
          </ChartContainer>
        </TestWrapper>
      );

      expect(screen.getByText('Test Chart')).toBeInTheDocument();
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <TestWrapper>
          <ChartContainer title="Test Chart" className="custom-container">
            <div>Chart Content</div>
          </ChartContainer>
        </TestWrapper>
      );

      expect(document.querySelector('.custom-container')).toBeInTheDocument();
    });
  });

  describe('Chart Type Selector', () => {
    it('renders chart type selector when enabled', () => {
      render(
        <TestWrapper>
          <ChartContainer
            title="Test Chart"
            showTypeSelector={true}
            chartType="line"
            onChartTypeChange={mockHandlers.onChartTypeChange}
          >
            <div>Chart Content</div>
          </ChartContainer>
        </TestWrapper>
      );

      expect(screen.getByDisplayValue('Line Chart')).toBeInTheDocument();
    });

    it('calls onChartTypeChange when type is changed', () => {
      render(
        <TestWrapper>
          <ChartContainer
            title="Test Chart"
            showTypeSelector={true}
            chartType="line"
            onChartTypeChange={mockHandlers.onChartTypeChange}
          >
            <div>Chart Content</div>
          </ChartContainer>
        </TestWrapper>
      );

      const selector = screen.getByDisplayValue('Line Chart');
      fireEvent.mouseDown(selector);
      
      const barOption = screen.getByText('Bar Chart');
      fireEvent.click(barOption);

      expect(mockHandlers.onChartTypeChange).toHaveBeenCalledWith('bar');
    });

    it('uses custom chart types', () => {
      const customTypes = [
        { value: 'custom1', label: 'Custom Type 1' },
        { value: 'custom2', label: 'Custom Type 2' },
      ];

      render(
        <TestWrapper>
          <ChartContainer
            title="Test Chart"
            showTypeSelector={true}
            chartType="custom1"
            chartTypes={customTypes}
            onChartTypeChange={mockHandlers.onChartTypeChange}
          >
            <div>Chart Content</div>
          </ChartContainer>
        </TestWrapper>
      );

      expect(screen.getByDisplayValue('Custom Type 1')).toBeInTheDocument();
    });

    it('does not render selector when showTypeSelector is false', () => {
      render(
        <TestWrapper>
          <ChartContainer
            title="Test Chart"
            showTypeSelector={false}
            chartType="line"
          >
            <div>Chart Content</div>
          </ChartContainer>
        </TestWrapper>
      );

      expect(screen.queryByDisplayValue('Line Chart')).not.toBeInTheDocument();
    });
  });

  describe('Export Button', () => {
    it('renders export button when enabled', () => {
      render(
        <TestWrapper>
          <ChartContainer
            title="Test Chart"
            showExport={true}
            onExport={mockHandlers.onExport}
          >
            <div>Chart Content</div>
          </ChartContainer>
        </TestWrapper>
      );

      expect(screen.getByText('Xuất')).toBeInTheDocument();
    });

    it('calls onExport when export button is clicked', () => {
      render(
        <TestWrapper>
          <ChartContainer
            title="Test Chart"
            showExport={true}
            onExport={mockHandlers.onExport}
          >
            <div>Chart Content</div>
          </ChartContainer>
        </TestWrapper>
      );

      const exportButton = screen.getByText('Xuất');
      fireEvent.click(exportButton);

      expect(mockHandlers.onExport).toHaveBeenCalled();
    });

    it('does not render export button when showExport is false', () => {
      render(
        <TestWrapper>
          <ChartContainer
            title="Test Chart"
            showExport={false}
          >
            <div>Chart Content</div>
          </ChartContainer>
        </TestWrapper>
      );

      expect(screen.queryByText('Xuất')).not.toBeInTheDocument();
    });
  });

  describe('Fullscreen Button', () => {
    it('renders fullscreen button when enabled', () => {
      render(
        <TestWrapper>
          <ChartContainer
            title="Test Chart"
            showFullscreen={true}
            onFullscreen={mockHandlers.onFullscreen}
          >
            <div>Chart Content</div>
          </ChartContainer>
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /fullscreen/i })).toBeInTheDocument();
    });

    it('calls onFullscreen when fullscreen button is clicked', () => {
      render(
        <TestWrapper>
          <ChartContainer
            title="Test Chart"
            showFullscreen={true}
            onFullscreen={mockHandlers.onFullscreen}
          >
            <div>Chart Content</div>
          </ChartContainer>
        </TestWrapper>
      );

      const fullscreenButton = screen.getByRole('button', { name: /fullscreen/i });
      fireEvent.click(fullscreenButton);

      expect(mockHandlers.onFullscreen).toHaveBeenCalled();
    });

    it('does not render fullscreen button when showFullscreen is false', () => {
      render(
        <TestWrapper>
          <ChartContainer
            title="Test Chart"
            showFullscreen={false}
          >
            <div>Chart Content</div>
          </ChartContainer>
        </TestWrapper>
      );

      expect(screen.queryByRole('button', { name: /fullscreen/i })).not.toBeInTheDocument();
    });
  });

  describe('Header Extra Content', () => {
    it('renders custom header extra content', () => {
      const headerExtra = <button data-testid="custom-button">Custom Button</button>;

      render(
        <TestWrapper>
          <ChartContainer
            title="Test Chart"
            headerExtra={headerExtra}
          >
            <div>Chart Content</div>
          </ChartContainer>
        </TestWrapper>
      );

      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });

    it('renders multiple controls together', () => {
      const headerExtra = <button data-testid="custom-button">Custom</button>;

      render(
        <TestWrapper>
          <ChartContainer
            title="Test Chart"
            showTypeSelector={true}
            chartType="line"
            onChartTypeChange={mockHandlers.onChartTypeChange}
            showExport={true}
            onExport={mockHandlers.onExport}
            showFullscreen={true}
            onFullscreen={mockHandlers.onFullscreen}
            headerExtra={headerExtra}
          >
            <div>Chart Content</div>
          </ChartContainer>
        </TestWrapper>
      );

      expect(screen.getByDisplayValue('Line Chart')).toBeInTheDocument();
      expect(screen.getByText('Xuất')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /fullscreen/i })).toBeInTheDocument();
      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading state when loading is true', () => {
      render(
        <TestWrapper>
          <ChartContainer
            title="Test Chart"
            loading={true}
          >
            <div>Chart Content</div>
          </ChartContainer>
        </TestWrapper>
      );

      expect(document.querySelector('.ant-card-loading')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains proper heading structure', () => {
      render(
        <TestWrapper>
          <ChartContainer title="Accessible Chart">
            <div>Chart Content</div>
          </ChartContainer>
        </TestWrapper>
      );

      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
      expect(screen.getByText('Accessible Chart')).toBeInTheDocument();
    });

    it('provides proper button labels', () => {
      render(
        <TestWrapper>
          <ChartContainer
            title="Test Chart"
            showExport={true}
            onExport={mockHandlers.onExport}
            showFullscreen={true}
            onFullscreen={mockHandlers.onFullscreen}
          >
            <div>Chart Content</div>
          </ChartContainer>
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /xuất/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /fullscreen/i })).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('applies responsive classes', () => {
      render(
        <TestWrapper>
          <ChartContainer title="Test Chart">
            <div>Chart Content</div>
          </ChartContainer>
        </TestWrapper>
      );

      expect(document.querySelector('.chart-container')).toBeInTheDocument();
    });
  });
});