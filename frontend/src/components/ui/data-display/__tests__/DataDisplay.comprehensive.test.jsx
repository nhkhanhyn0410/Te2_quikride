/**
 * Data Display Components Comprehensive Tests
 * Tests for StandardTable, StandardChart, StandardSkeleton, and ErrorState components
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ConfigProvider } from 'antd';
import { antdTheme } from '../../../../theme/themeConfig';
import { StandardTable } from '../StandardTable';
import { StandardChart } from '../StandardChart';
import { StandardSkeleton } from '../StandardSkeleton';
import { ErrorState } from '../ErrorState';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Test wrapper with theme
const TestWrapper = ({ children }) => (
  <ConfigProvider theme={antdTheme}>
    {children}
  </ConfigProvider>
);

// Mock data for testing
const mockTableData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Operator' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Admin' },
];

const mockTableColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name', sorter: true },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Role', dataIndex: 'role', key: 'role', filters: [
    { text: 'Customer', value: 'Customer' },
    { text: 'Operator', value: 'Operator' },
    { text: 'Admin', value: 'Admin' },
  ]},
];

const mockChartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 500 },
  { name: 'Apr', value: 200 },
  { name: 'May', value: 600 },
];

describe('Data Display Components', () => {
  describe('StandardTable', () => {
    it('should render table with data correctly', () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockTableColumns}
            dataSource={mockTableData}
            rowKey="id"
          />
        </TestWrapper>
      );

      // Check table headers
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();

      // Check table data
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Customer')).toBeInTheDocument();
    });

    it('should handle sorting correctly', async () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockTableColumns}
            dataSource={mockTableData}
            rowKey="id"
          />
        </TestWrapper>
      );

      // Click on sortable column header
      const nameHeader = screen.getByText('Name');
      fireEvent.click(nameHeader);

      // Wait for sorting to apply
      await waitFor(() => {
        // Check if sorting indicators are present
        const sortIcon = document.querySelector('.ant-table-column-sorter');
        expect(sortIcon).toBeInTheDocument();
      });
    });

    it('should handle filtering correctly', async () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockTableColumns}
            dataSource={mockTableData}
            rowKey="id"
          />
        </TestWrapper>
      );

      // Click on filter dropdown
      const filterIcon = document.querySelector('.ant-table-filter-trigger');
      if (filterIcon) {
        fireEvent.click(filterIcon);

        await waitFor(() => {
          // Check if filter dropdown is visible
          const filterDropdown = document.querySelector('.ant-table-filter-dropdown');
          expect(filterDropdown).toBeInTheDocument();
        });
      }
    });

    it('should handle pagination correctly', () => {
      const largeDataSet = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: 'Customer',
      }));

      render(
        <TestWrapper>
          <StandardTable
            columns={mockTableColumns}
            dataSource={largeDataSet}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </TestWrapper>
      );

      // Check pagination is present
      const pagination = document.querySelector('.ant-pagination');
      expect(pagination).toBeInTheDocument();

      // Check page size
      const pageItems = document.querySelectorAll('.ant-table-tbody tr');
      expect(pageItems.length).toBeLessThanOrEqual(10);
    });

    it('should handle empty state correctly', () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockTableColumns}
            dataSource={[]}
            rowKey="id"
          />
        </TestWrapper>
      );

      // Check empty state
      expect(screen.getByText('No data')).toBeInTheDocument();
    });

    it('should handle loading state correctly', () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockTableColumns}
            dataSource={mockTableData}
            rowKey="id"
            loading={true}
          />
        </TestWrapper>
      );

      // Check loading spinner
      const loadingSpinner = document.querySelector('.ant-spin');
      expect(loadingSpinner).toBeInTheDocument();
    });

    it('should be accessible', async () => {
      const { container } = render(
        <TestWrapper>
          <StandardTable
            columns={mockTableColumns}
            dataSource={mockTableData}
            rowKey="id"
          />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should support keyboard navigation', () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockTableColumns}
            dataSource={mockTableData}
            rowKey="id"
          />
        </TestWrapper>
      );

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      // Test keyboard navigation
      fireEvent.keyDown(table, { key: 'Tab' });
      fireEvent.keyDown(table, { key: 'ArrowDown' });
      fireEvent.keyDown(table, { key: 'ArrowUp' });
    });
  });

  describe('StandardChart', () => {
    it('should render chart with data correctly', () => {
      render(
        <TestWrapper>
          <StandardChart
            type="line"
            data={mockChartData}
            xKey="name"
            yKey="value"
            title="Test Chart"
          />
        </TestWrapper>
      );

      // Check chart title
      expect(screen.getByText('Test Chart')).toBeInTheDocument();

      // Check chart container
      const chartContainer = document.querySelector('.recharts-wrapper');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should handle different chart types', () => {
      const chartTypes = ['line', 'bar', 'area', 'pie'];

      chartTypes.forEach(type => {
        const { unmount } = render(
          <TestWrapper>
            <StandardChart
              type={type}
              data={mockChartData}
              xKey="name"
              yKey="value"
              title={`${type} Chart`}
            />
          </TestWrapper>
        );

        // Check chart is rendered
        const chartContainer = document.querySelector('.recharts-wrapper');
        expect(chartContainer).toBeInTheDocument();

        unmount();
      });
    });

    it('should handle empty data gracefully', () => {
      render(
        <TestWrapper>
          <StandardChart
            type="line"
            data={[]}
            xKey="name"
            yKey="value"
            title="Empty Chart"
          />
        </TestWrapper>
      );

      // Should render without crashing
      expect(screen.getByText('Empty Chart')).toBeInTheDocument();
    });

    it('should handle responsive behavior', () => {
      render(
        <TestWrapper>
          <StandardChart
            type="line"
            data={mockChartData}
            xKey="name"
            yKey="value"
            title="Responsive Chart"
            responsive={true}
          />
        </TestWrapper>
      );

      const chartContainer = document.querySelector('.recharts-responsive-container');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should be accessible', async () => {
      const { container } = render(
        <TestWrapper>
          <StandardChart
            type="line"
            data={mockChartData}
            xKey="name"
            yKey="value"
            title="Accessible Chart"
          />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('StandardSkeleton', () => {
    it('should render skeleton with default props', () => {
      render(
        <TestWrapper>
          <StandardSkeleton />
        </TestWrapper>
      );

      const skeleton = document.querySelector('.ant-skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render different skeleton types', () => {
      const skeletonTypes = ['text', 'paragraph', 'avatar', 'button', 'input'];

      skeletonTypes.forEach(type => {
        const { unmount } = render(
          <TestWrapper>
            <StandardSkeleton type={type} />
          </TestWrapper>
        );

        const skeleton = document.querySelector('.ant-skeleton');
        expect(skeleton).toBeInTheDocument();

        unmount();
      });
    });

    it('should handle active animation', () => {
      render(
        <TestWrapper>
          <StandardSkeleton active />
        </TestWrapper>
      );

      const skeleton = document.querySelector('.ant-skeleton-active');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render custom skeleton layouts', () => {
      render(
        <TestWrapper>
          <StandardSkeleton
            avatar
            paragraph={{ rows: 4 }}
            title
          />
        </TestWrapper>
      );

      const avatar = document.querySelector('.ant-skeleton-avatar');
      const title = document.querySelector('.ant-skeleton-title');
      const paragraph = document.querySelector('.ant-skeleton-paragraph');

      expect(avatar).toBeInTheDocument();
      expect(title).toBeInTheDocument();
      expect(paragraph).toBeInTheDocument();
    });

    it('should be accessible', async () => {
      const { container } = render(
        <TestWrapper>
          <StandardSkeleton />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ErrorState', () => {
    it('should render error state with default props', () => {
      render(
        <TestWrapper>
          <ErrorState />
        </TestWrapper>
      );

      // Check default error message
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('should render custom error message', () => {
      const customMessage = 'Custom error message';
      
      render(
        <TestWrapper>
          <ErrorState message={customMessage} />
        </TestWrapper>
      );

      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    it('should render with custom title', () => {
      const customTitle = 'Custom Error Title';
      
      render(
        <TestWrapper>
          <ErrorState title={customTitle} />
        </TestWrapper>
      );

      expect(screen.getByText(customTitle)).toBeInTheDocument();
    });

    it('should render with action button', () => {
      const handleRetry = vi.fn();
      
      render(
        <TestWrapper>
          <ErrorState
            action={{
              text: 'Retry',
              onClick: handleRetry,
            }}
          />
        </TestWrapper>
      );

      const retryButton = screen.getByText('Retry');
      expect(retryButton).toBeInTheDocument();

      fireEvent.click(retryButton);
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    it('should render different error types', () => {
      const errorTypes = ['network', 'permission', 'notFound', 'server'];

      errorTypes.forEach(type => {
        const { unmount } = render(
          <TestWrapper>
            <ErrorState type={type} />
          </TestWrapper>
        );

        // Should render without crashing
        const errorContainer = document.querySelector('.error-state');
        expect(errorContainer).toBeInTheDocument();

        unmount();
      });
    });

    it('should handle custom icon', () => {
      const CustomIcon = () => <div data-testid="custom-icon">Custom Icon</div>;
      
      render(
        <TestWrapper>
          <ErrorState icon={<CustomIcon />} />
        </TestWrapper>
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('should be accessible', async () => {
      const { container } = render(
        <TestWrapper>
          <ErrorState />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should support keyboard navigation for action button', () => {
      const handleRetry = vi.fn();
      
      render(
        <TestWrapper>
          <ErrorState
            action={{
              text: 'Retry',
              onClick: handleRetry,
            }}
          />
        </TestWrapper>
      );

      const retryButton = screen.getByText('Retry');
      
      // Test keyboard activation
      fireEvent.keyDown(retryButton, { key: 'Enter' });
      expect(handleRetry).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(retryButton, { key: ' ' });
      expect(handleRetry).toHaveBeenCalledTimes(2);
    });
  });

  describe('Integration Tests', () => {
    it('should work together in a data display layout', async () => {
      const [loading, setLoading] = React.useState(true);
      const [error, setError] = React.useState(false);
      const [data, setData] = React.useState([]);

      const TestComponent = () => {
        React.useEffect(() => {
          // Simulate data loading
          setTimeout(() => {
            setLoading(false);
            setData(mockTableData);
          }, 100);
        }, []);

        if (loading) {
          return <StandardSkeleton paragraph={{ rows: 4 }} />;
        }

        if (error) {
          return <ErrorState action={{ text: 'Retry', onClick: () => setError(false) }} />;
        }

        return (
          <div>
            <StandardChart
              type="line"
              data={mockChartData}
              xKey="name"
              yKey="value"
              title="Data Overview"
            />
            <StandardTable
              columns={mockTableColumns}
              dataSource={data}
              rowKey="id"
            />
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Initially should show skeleton
      expect(document.querySelector('.ant-skeleton')).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Data Overview')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const results = await axe(document.body);
      expect(results).toHaveNoViolations();
    });
  });
});