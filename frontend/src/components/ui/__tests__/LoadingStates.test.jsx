/**
 * Loading States Components Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConfigProvider } from 'antd';
import { 
  LoadingSpinner, 
  PanelSkeleton, 
  TableSkeleton, 
  CardSkeleton, 
  FormSkeleton, 
  ChartSkeleton 
} from '../LoadingStates';
import { antdTheme } from '../../../theme/themeConfig';

// Test wrapper with Ant Design theme
const TestWrapper = ({ children }) => (
  <ConfigProvider theme={antdTheme}>
    {children}
  </ConfigProvider>
);

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    const { container } = render(
      <TestWrapper>
        <LoadingSpinner />
      </TestWrapper>
    );

    expect(container.querySelector('.ant-spin')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const sizes = ['small', 'default', 'large'];
    
    sizes.forEach((size) => {
      const { container } = render(
        <TestWrapper>
          <LoadingSpinner size={size} data-testid={`spinner-${size}`} />
        </TestWrapper>
      );

      expect(container.querySelector('.ant-spin')).toBeInTheDocument();
    });
  });

  it('renders with tip text', () => {
    render(
      <TestWrapper>
        <LoadingSpinner tip="Loading data..." />
      </TestWrapper>
    );

    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <LoadingSpinner className="custom-spinner" />
      </TestWrapper>
    );

    expect(container.querySelector('.custom-spinner')).toBeInTheDocument();
  });
});

describe('PanelSkeleton', () => {
  it('renders with default props', () => {
    const { container } = render(
      <TestWrapper>
        <PanelSkeleton />
      </TestWrapper>
    );

    expect(container.querySelector('.ant-skeleton')).toBeInTheDocument();
  });

  it('renders with custom rows', () => {
    const { container } = render(
      <TestWrapper>
        <PanelSkeleton rows={5} />
      </TestWrapper>
    );

    expect(container.querySelector('.ant-skeleton')).toBeInTheDocument();
  });

  it('renders with avatar', () => {
    const { container } = render(
      <TestWrapper>
        <PanelSkeleton avatar />
      </TestWrapper>
    );

    expect(container.querySelector('.ant-skeleton-avatar')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <PanelSkeleton className="custom-skeleton" />
      </TestWrapper>
    );

    expect(container.querySelector('.custom-skeleton')).toBeInTheDocument();
  });
});

describe('TableSkeleton', () => {
  it('renders with default props', () => {
    const { container } = render(
      <TestWrapper>
        <TableSkeleton />
      </TestWrapper>
    );

    // Should render skeleton inputs for table structure
    expect(container.querySelectorAll('.ant-skeleton-input')).toHaveLength(24); // 4 columns * 6 rows (header + 5 data rows)
  });

  it('renders with custom columns and rows', () => {
    const { container } = render(
      <TestWrapper>
        <TableSkeleton columns={3} rows={3} />
      </TestWrapper>
    );

    // Should render skeleton inputs for custom table structure
    expect(container.querySelectorAll('.ant-skeleton-input')).toHaveLength(12); // 3 columns * 4 rows (header + 3 data rows)
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <TableSkeleton className="custom-table-skeleton" />
      </TestWrapper>
    );

    expect(container.querySelector('.custom-table-skeleton')).toBeInTheDocument();
  });
});

describe('CardSkeleton', () => {
  it('renders with default props', () => {
    const { container } = render(
      <TestWrapper>
        <CardSkeleton />
      </TestWrapper>
    );

    expect(container.querySelector('.ant-skeleton-image')).toBeInTheDocument();
    expect(container.querySelector('.ant-skeleton-input')).toBeInTheDocument();
    expect(container.querySelector('.ant-skeleton')).toBeInTheDocument();
    expect(container.querySelectorAll('.ant-skeleton-button')).toHaveLength(2);
  });

  it('renders without image when image is false', () => {
    const { container } = render(
      <TestWrapper>
        <CardSkeleton image={false} />
      </TestWrapper>
    );

    expect(container.querySelector('.ant-skeleton-image')).not.toBeInTheDocument();
  });

  it('renders without actions when actions is false', () => {
    const { container } = render(
      <TestWrapper>
        <CardSkeleton actions={false} />
      </TestWrapper>
    );

    expect(container.querySelector('.ant-skeleton-button')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <CardSkeleton className="custom-card-skeleton" />
      </TestWrapper>
    );

    expect(container.querySelector('.custom-card-skeleton')).toBeInTheDocument();
  });
});

describe('FormSkeleton', () => {
  it('renders with default props', () => {
    const { container } = render(
      <TestWrapper>
        <FormSkeleton />
      </TestWrapper>
    );

    // Should render skeleton inputs for form fields and buttons
    expect(container.querySelectorAll('.ant-skeleton-input')).toHaveLength(8); // 4 fields * 2 (label + input)
    expect(container.querySelectorAll('.ant-skeleton-button')).toHaveLength(2);
  });

  it('renders with custom fields and buttons', () => {
    const { container } = render(
      <TestWrapper>
        <FormSkeleton fields={2} buttons={1} />
      </TestWrapper>
    );

    expect(container.querySelectorAll('.ant-skeleton-input')).toHaveLength(4); // 2 fields * 2 (label + input)
    expect(container.querySelectorAll('.ant-skeleton-button')).toHaveLength(1);
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <FormSkeleton className="custom-form-skeleton" />
      </TestWrapper>
    );

    expect(container.querySelector('.custom-form-skeleton')).toBeInTheDocument();
  });
});

describe('ChartSkeleton', () => {
  it('renders with default props', () => {
    const { container } = render(
      <TestWrapper>
        <ChartSkeleton />
      </TestWrapper>
    );

    expect(container.querySelector('.ant-skeleton-input')).toBeInTheDocument(); // Chart title
    expect(container.querySelector('.ant-spin')).toBeInTheDocument(); // Loading spinner in chart area
  });

  it('renders with different chart types', () => {
    const types = ['bar', 'line', 'pie', 'area'];
    
    types.forEach((type) => {
      const { container } = render(
        <TestWrapper>
          <ChartSkeleton type={type} />
        </TestWrapper>
      );

      expect(container.querySelector('.ant-skeleton-input')).toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <ChartSkeleton className="custom-chart-skeleton" />
      </TestWrapper>
    );

    expect(container.querySelector('.custom-chart-skeleton')).toBeInTheDocument();
  });
});