import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import StandardSkeleton from '../StandardSkeleton';
import { antdTheme } from '../../../../theme/themeConfig';

const TestWrapper = ({ children }) => (
  <ConfigProvider theme={antdTheme}>
    {children}
  </ConfigProvider>
);

describe('StandardSkeleton Component', () => {
  describe('Basic Rendering', () => {
    it('renders default skeleton', () => {
      render(
        <TestWrapper>
          <StandardSkeleton />
        </TestWrapper>
      );

      expect(document.querySelector('.standard-skeleton')).toBeInTheDocument();
      expect(document.querySelector('.ant-skeleton')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <TestWrapper>
          <StandardSkeleton className="custom-skeleton-class" />
        </TestWrapper>
      );

      expect(document.querySelector('.custom-skeleton-class')).toBeInTheDocument();
    });

    it('applies size classes', () => {
      const { rerender } = render(
        <TestWrapper>
          <StandardSkeleton size="small" />
        </TestWrapper>
      );

      expect(document.querySelector('.standard-skeleton--small')).toBeInTheDocument();

      rerender(
        <TestWrapper>
          <StandardSkeleton size="large" />
        </TestWrapper>
      );

      expect(document.querySelector('.standard-skeleton--large')).toBeInTheDocument();
    });
  });

  describe('Skeleton Types', () => {
    it('renders avatar skeleton', () => {
      render(
        <TestWrapper>
          <StandardSkeleton type="avatar" />
        </TestWrapper>
      );

      expect(document.querySelector('.ant-skeleton-avatar')).toBeInTheDocument();
    });

    it('renders button skeleton', () => {
      render(
        <TestWrapper>
          <StandardSkeleton type="button" />
        </TestWrapper>
      );

      expect(document.querySelector('.ant-skeleton-button')).toBeInTheDocument();
    });

    it('renders input skeleton', () => {
      render(
        <TestWrapper>
          <StandardSkeleton type="input" />
        </TestWrapper>
      );

      expect(document.querySelector('.ant-skeleton-input')).toBeInTheDocument();
    });

    it('renders image skeleton', () => {
      render(
        <TestWrapper>
          <StandardSkeleton type="image" />
        </TestWrapper>
      );

      expect(document.querySelector('.ant-skeleton-image')).toBeInTheDocument();
    });

    it('renders paragraph skeleton', () => {
      render(
        <TestWrapper>
          <StandardSkeleton type="paragraph" />
        </TestWrapper>
      );

      expect(document.querySelector('.ant-skeleton-paragraph')).toBeInTheDocument();
    });

    it('renders title skeleton', () => {
      render(
        <TestWrapper>
          <StandardSkeleton type="title" />
        </TestWrapper>
      );

      expect(document.querySelector('.ant-skeleton-title')).toBeInTheDocument();
    });
  });

  describe('Complex Skeleton Types', () => {
    it('renders card skeleton', () => {
      render(
        <TestWrapper>
          <StandardSkeleton type="card" />
        </TestWrapper>
      );

      expect(document.querySelector('.standard-skeleton--card')).toBeInTheDocument();
      expect(document.querySelector('.standard-skeleton-card-image')).toBeInTheDocument();
      expect(document.querySelector('.standard-skeleton-card-content')).toBeInTheDocument();
      expect(document.querySelector('.standard-skeleton-card-actions')).toBeInTheDocument();
    });

    it('renders table skeleton with custom columns and rows', () => {
      render(
        <TestWrapper>
          <StandardSkeleton type="table" columns={5} rows={3} />
        </TestWrapper>
      );

      expect(document.querySelector('.standard-skeleton--table')).toBeInTheDocument();
      expect(document.querySelector('.standard-skeleton-table-header')).toBeInTheDocument();
      expect(document.querySelector('.standard-skeleton-table-body')).toBeInTheDocument();
      
      // Check if correct number of columns in header
      const headerColumns = document.querySelectorAll('.standard-skeleton-table-header .ant-skeleton-input');
      expect(headerColumns).toHaveLength(5);
      
      // Check if correct number of rows
      const bodyRows = document.querySelectorAll('.standard-skeleton-table-row');
      expect(bodyRows).toHaveLength(3);
    });

    it('renders form skeleton with custom fields', () => {
      render(
        <TestWrapper>
          <StandardSkeleton type="form" fields={3} />
        </TestWrapper>
      );

      expect(document.querySelector('.standard-skeleton--form')).toBeInTheDocument();
      expect(document.querySelector('.standard-skeleton-form-actions')).toBeInTheDocument();
      
      // Check if correct number of form fields
      const formFields = document.querySelectorAll('.standard-skeleton-form-field');
      expect(formFields).toHaveLength(3);
    });

    it('renders chart skeleton', () => {
      render(
        <TestWrapper>
          <StandardSkeleton type="chart" />
        </TestWrapper>
      );

      expect(document.querySelector('.standard-skeleton--chart')).toBeInTheDocument();
      expect(document.querySelector('.standard-skeleton-chart-title')).toBeInTheDocument();
      expect(document.querySelector('.standard-skeleton-chart-area')).toBeInTheDocument();
      expect(document.querySelector('.standard-skeleton-chart-legend')).toBeInTheDocument();
      expect(document.querySelector('.standard-skeleton-chart-bars')).toBeInTheDocument();
    });

    it('renders list skeleton with custom items', () => {
      render(
        <TestWrapper>
          <StandardSkeleton type="list" items={4} />
        </TestWrapper>
      );

      expect(document.querySelector('.standard-skeleton--list')).toBeInTheDocument();
      
      // Check if correct number of list items
      const listItems = document.querySelectorAll('.standard-skeleton-list-item');
      expect(listItems).toHaveLength(4);
    });
  });

  describe('Animation Control', () => {
    it('enables animation by default', () => {
      render(
        <TestWrapper>
          <StandardSkeleton type="avatar" />
        </TestWrapper>
      );

      expect(document.querySelector('.ant-skeleton-avatar-active')).toBeInTheDocument();
    });

    it('disables animation when animated is false', () => {
      render(
        <TestWrapper>
          <StandardSkeleton type="avatar" animated={false} />
        </TestWrapper>
      );

      expect(document.querySelector('.ant-skeleton-avatar-active')).not.toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('applies correct size for avatar skeleton', () => {
      const { rerender } = render(
        <TestWrapper>
          <StandardSkeleton type="avatar" size="small" />
        </TestWrapper>
      );

      let avatar = document.querySelector('.ant-skeleton-avatar');
      expect(avatar).toHaveClass('ant-skeleton-avatar-sm');

      rerender(
        <TestWrapper>
          <StandardSkeleton type="avatar" size="large" />
        </TestWrapper>
      );

      avatar = document.querySelector('.ant-skeleton-avatar');
      expect(avatar).toHaveClass('ant-skeleton-avatar-lg');
    });

    it('applies correct size for button skeleton', () => {
      const { rerender } = render(
        <TestWrapper>
          <StandardSkeleton type="button" size="small" />
        </TestWrapper>
      );

      let button = document.querySelector('.ant-skeleton-button');
      expect(button).toHaveClass('ant-skeleton-button-sm');

      rerender(
        <TestWrapper>
          <StandardSkeleton type="button" size="large" />
        </TestWrapper>
      );

      button = document.querySelector('.ant-skeleton-button');
      expect(button).toHaveClass('ant-skeleton-button-lg');
    });
  });

  describe('Default Values', () => {
    it('uses default values for table skeleton', () => {
      render(
        <TestWrapper>
          <StandardSkeleton type="table" />
        </TestWrapper>
      );

      // Default should be 4 columns, 5 rows
      const headerColumns = document.querySelectorAll('.standard-skeleton-table-header .ant-skeleton-input');
      expect(headerColumns).toHaveLength(4);
      
      const bodyRows = document.querySelectorAll('.standard-skeleton-table-row');
      expect(bodyRows).toHaveLength(5);
    });

    it('uses default values for form skeleton', () => {
      render(
        <TestWrapper>
          <StandardSkeleton type="form" />
        </TestWrapper>
      );

      // Default should be 4 fields
      const formFields = document.querySelectorAll('.standard-skeleton-form-field');
      expect(formFields).toHaveLength(4);
    });

    it('uses default values for list skeleton', () => {
      render(
        <TestWrapper>
          <StandardSkeleton type="list" />
        </TestWrapper>
      );

      // Default should be 5 items
      const listItems = document.querySelectorAll('.standard-skeleton-list-item');
      expect(listItems).toHaveLength(5);
    });
  });

  describe('Responsive Behavior', () => {
    it('applies responsive classes', () => {
      render(
        <TestWrapper>
          <StandardSkeleton type="card" />
        </TestWrapper>
      );

      expect(document.querySelector('.standard-skeleton--card')).toBeInTheDocument();
    });
  });

  describe('Props Forwarding', () => {
    it('forwards additional props to underlying skeleton', () => {
      render(
        <TestWrapper>
          <StandardSkeleton 
            type="default"
            title={{ width: '50%' }}
            paragraph={{ rows: 2 }}
          />
        </TestWrapper>
      );

      expect(document.querySelector('.ant-skeleton')).toBeInTheDocument();
    });
  });

  describe('Chart Skeleton Specific', () => {
    it('renders chart bars with different heights', () => {
      render(
        <TestWrapper>
          <StandardSkeleton type="chart" />
        </TestWrapper>
      );

      const chartBars = document.querySelectorAll('.standard-skeleton-chart-bar');
      expect(chartBars).toHaveLength(6);
      
      // Each bar should have a different height (style attribute)
      chartBars.forEach(bar => {
        expect(bar).toHaveStyle('height');
      });
    });

    it('renders chart legend items', () => {
      render(
        <TestWrapper>
          <StandardSkeleton type="chart" />
        </TestWrapper>
      );

      const legendItems = document.querySelectorAll('.standard-skeleton-chart-legend-item');
      expect(legendItems).toHaveLength(3);
      
      legendItems.forEach(item => {
        expect(item.querySelector('.standard-skeleton-chart-legend-color')).toBeInTheDocument();
        expect(item.querySelector('.ant-skeleton-input')).toBeInTheDocument();
      });
    });
  });
});