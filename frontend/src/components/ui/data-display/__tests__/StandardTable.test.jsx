import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import StandardTable from '../StandardTable';
import { antdTheme } from '../../../../theme/themeConfig';

// Mock data for testing
const mockData = [
  {
    key: '1',
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    createdAt: '2024-01-01',
  },
  {
    key: '2',
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'inactive',
    createdAt: '2024-01-02',
  },
  {
    key: '3',
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    status: 'active',
    createdAt: '2024-01-03',
  },
];

const mockColumns = [
  {
    title: 'Tên',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    filters: [
      { text: 'Active', value: 'active' },
      { text: 'Inactive', value: 'inactive' },
    ],
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdAt',
    key: 'createdAt',
    priority: 2, // Lower priority for mobile
  },
];

// Test wrapper with theme provider
const TestWrapper = ({ children }) => (
  <ConfigProvider theme={antdTheme}>
    {children}
  </ConfigProvider>
);

describe('StandardTable Component', () => {
  beforeEach(() => {
    // Reset any mocks
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders table with data correctly', () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockColumns}
            dataSource={mockData}
          />
        </TestWrapper>
      );

      // Check if table is rendered
      expect(screen.getByRole('table')).toBeInTheDocument();
      
      // Check if data is displayed
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('active')).toBeInTheDocument();
    });

    it('renders empty table when no data provided', () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockColumns}
            dataSource={[]}
          />
        </TestWrapper>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('No data')).toBeInTheDocument();
    });

    it('applies correct CSS classes for variants', () => {
      const { rerender } = render(
        <TestWrapper>
          <StandardTable
            columns={mockColumns}
            dataSource={mockData}
            variant="default"
            className="custom-class"
          />
        </TestWrapper>
      );

      let tableContainer = document.querySelector('.standard-table');
      expect(tableContainer).toHaveClass('standard-table--default');
      expect(tableContainer).toHaveClass('custom-class');

      // Test bordered variant
      rerender(
        <TestWrapper>
          <StandardTable
            columns={mockColumns}
            dataSource={mockData}
            variant="bordered"
          />
        </TestWrapper>
      );

      tableContainer = document.querySelector('.standard-table');
      expect(tableContainer).toHaveClass('standard-table--bordered');
    });
  });

  describe('Size Variants', () => {
    it('applies correct size classes', () => {
      const { rerender } = render(
        <TestWrapper>
          <StandardTable
            columns={mockColumns}
            dataSource={mockData}
            size="small"
          />
        </TestWrapper>
      );

      let tableContainer = document.querySelector('.standard-table');
      expect(tableContainer).toHaveClass('standard-table--small');

      rerender(
        <TestWrapper>
          <StandardTable
            columns={mockColumns}
            dataSource={mockData}
            size="large"
          />
        </TestWrapper>
      );

      tableContainer = document.querySelector('.standard-table');
      expect(tableContainer).toHaveClass('standard-table--large');
    });
  });

  describe('Pagination', () => {
    it('renders default pagination', () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockColumns}
            dataSource={mockData}
            pagination={true}
          />
        </TestWrapper>
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByText(/1-3 của 3 mục/)).toBeInTheDocument();
    });

    it('hides pagination when disabled', () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockColumns}
            dataSource={mockData}
            pagination={false}
          />
        </TestWrapper>
      );

      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('applies custom pagination configuration', () => {
      const customPagination = {
        pageSize: 2,
        showSizeChanger: false,
        showQuickJumper: false,
      };

      render(
        <TestWrapper>
          <StandardTable
            columns={mockColumns}
            dataSource={mockData}
            pagination={customPagination}
          />
        </TestWrapper>
      );

      expect(screen.getByText(/1-2 của 3 mục/)).toBeInTheDocument();
    });
  });

  describe('Action Column', () => {
    const mockHandlers = {
      onView: jest.fn(),
      onEdit: jest.fn(),
      onDelete: jest.fn(),
      onCustomAction: jest.fn(),
    };

    beforeEach(() => {
      Object.values(mockHandlers).forEach(mock => mock.mockClear());
    });

    it('renders action column when showActions is true', () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockColumns}
            dataSource={mockData}
            showActions={true}
            {...mockHandlers}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Thao tác')).toBeInTheDocument();
      
      // Should have action buttons for each row
      const viewButtons = screen.getAllByLabelText('Xem chi tiết');
      const editButtons = screen.getAllByLabelText('Chỉnh sửa');
      const deleteButtons = screen.getAllByLabelText('Xóa');
      
      expect(viewButtons).toHaveLength(mockData.length);
      expect(editButtons).toHaveLength(mockData.length);
      expect(deleteButtons).toHaveLength(mockData.length);
    });

    it('calls correct handlers when action buttons are clicked', async () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockColumns}
            dataSource={mockData}
            showActions={true}
            {...mockHandlers}
          />
        </TestWrapper>
      );

      // Click view button for first row
      const viewButtons = screen.getAllByLabelText('Xem chi tiết');
      fireEvent.click(viewButtons[0]);
      expect(mockHandlers.onView).toHaveBeenCalledWith(mockData[0]);

      // Click edit button for first row
      const editButtons = screen.getAllByLabelText('Chỉnh sửa');
      fireEvent.click(editButtons[0]);
      expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockData[0]);

      // Click delete button for first row
      const deleteButtons = screen.getAllByLabelText('Xóa');
      fireEvent.click(deleteButtons[0]);
      expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockData[0]);
    });

    it('does not render action column when showActions is false', () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockColumns}
            dataSource={mockData}
            showActions={false}
          />
        </TestWrapper>
      );

      expect(screen.queryByText('Thao tác')).not.toBeInTheDocument();
    });

    it('renders only specified action buttons', () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockColumns}
            dataSource={mockData}
            showActions={true}
            onView={mockHandlers.onView}
            // Only onView provided, others should not render
          />
        </TestWrapper>
      );

      expect(screen.getAllByLabelText('Xem chi tiết')).toHaveLength(mockData.length);
      expect(screen.queryByLabelText('Chỉnh sửa')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Xóa')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('applies responsive classes when enabled', () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockColumns}
            dataSource={mockData}
            responsive={true}
          />
        </TestWrapper>
      );

      const tableContainer = document.querySelector('.standard-table');
      expect(tableContainer).toHaveClass('standard-table--responsive');
    });

    it('does not apply responsive classes when disabled', () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockColumns}
            dataSource={mockData}
            responsive={false}
          />
        </TestWrapper>
      );

      const tableContainer = document.querySelector('.standard-table');
      expect(tableContainer).not.toHaveClass('standard-table--responsive');
    });
  });

  describe('Sticky Header', () => {
    it('applies sticky header classes when enabled', () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockColumns}
            dataSource={mockData}
            stickyHeader={true}
          />
        </TestWrapper>
      );

      const tableContainer = document.querySelector('.standard-table');
      expect(tableContainer).toHaveClass('standard-table--sticky');
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when loading is true', () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockColumns}
            dataSource={mockData}
            loading={true}
          />
        </TestWrapper>
      );

      expect(screen.getByTestId('loading-spinner') || document.querySelector('.ant-spin')).toBeInTheDocument();
    });
  });

  describe('Column Processing', () => {
    it('adds standard classes to columns', () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockColumns}
            dataSource={mockData}
          />
        </TestWrapper>
      );

      // Check if columns have standard classes applied
      const headerCells = document.querySelectorAll('.ant-table-thead th');
      headerCells.forEach(cell => {
        expect(cell).toHaveClass('standard-table-column');
      });
    });

    it('preserves existing column classes', () => {
      const columnsWithClass = [
        {
          ...mockColumns[0],
          className: 'custom-column-class',
        },
        ...mockColumns.slice(1),
      ];

      render(
        <TestWrapper>
          <StandardTable
            columns={columnsWithClass}
            dataSource={mockData}
          />
        </TestWrapper>
      );

      const firstHeaderCell = document.querySelector('.ant-table-thead th');
      expect(firstHeaderCell).toHaveClass('custom-column-class');
      expect(firstHeaderCell).toHaveClass('standard-table-column');
    });
  });

  describe('Row Styling', () => {
    it('applies alternating row classes', () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockColumns}
            dataSource={mockData}
          />
        </TestWrapper>
      );

      const rows = document.querySelectorAll('.ant-table-tbody tr');
      expect(rows[0]).toHaveClass('standard-table-row--even');
      expect(rows[1]).toHaveClass('standard-table-row--odd');
      expect(rows[2]).toHaveClass('standard-table-row--even');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for action buttons', () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockColumns}
            dataSource={mockData}
            showActions={true}
            onView={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </TestWrapper>
      );

      expect(screen.getAllByLabelText('Xem chi tiết')).toHaveLength(mockData.length);
      expect(screen.getAllByLabelText('Chỉnh sửa')).toHaveLength(mockData.length);
      expect(screen.getAllByLabelText('Xóa')).toHaveLength(mockData.length);
    });

    it('maintains table semantics', () => {
      render(
        <TestWrapper>
          <StandardTable
            columns={mockColumns}
            dataSource={mockData}
          />
        </TestWrapper>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')).toHaveLength(mockColumns.length);
      expect(screen.getAllByRole('row')).toHaveLength(mockData.length + 1); // +1 for header
    });
  });
});