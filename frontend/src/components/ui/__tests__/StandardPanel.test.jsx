/**
 * StandardPanel Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConfigProvider } from 'antd';
import StandardPanel from '../StandardPanel';
import { antdTheme } from '../../../theme/themeConfig';

// Test wrapper with Ant Design theme
const TestWrapper = ({ children }) => (
  <ConfigProvider theme={antdTheme}>
    {children}
  </ConfigProvider>
);

describe('StandardPanel', () => {
  it('renders with default props', () => {
    render(
      <TestWrapper>
        <StandardPanel>
          <div>Test content</div>
        </StandardPanel>
      </TestWrapper>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders with all variants', () => {
    const variants = ['default', 'elevated', 'bordered', 'ghost'];
    
    variants.forEach((variant) => {
      const { container } = render(
        <TestWrapper>
          <StandardPanel variant={variant} data-testid={`panel-${variant}`}>
            <div>Content for {variant}</div>
          </StandardPanel>
        </TestWrapper>
      );

      const panel = container.querySelector(`[data-testid="panel-${variant}"]`);
      expect(panel).toBeInTheDocument();
    });
  });

  it('renders with all sizes', () => {
    const sizes = ['small', 'medium', 'large'];
    
    sizes.forEach((size) => {
      const { container } = render(
        <TestWrapper>
          <StandardPanel size={size} data-testid={`panel-${size}`}>
            <div>Content for {size}</div>
          </StandardPanel>
        </TestWrapper>
      );

      const panel = container.querySelector(`[data-testid="panel-${size}"]`);
      expect(panel).toBeInTheDocument();
    });
  });

  it('renders with all padding options', () => {
    const paddings = ['compact', 'comfortable', 'spacious'];
    
    paddings.forEach((padding) => {
      render(
        <TestWrapper>
          <StandardPanel padding={padding} data-testid={`panel-${padding}`}>
            <div>Content for {padding}</div>
          </StandardPanel>
        </TestWrapper>
      );

      expect(screen.getByTestId(`panel-${padding}`)).toBeInTheDocument();
    });
  });

  it('renders with header', () => {
    const header = {
      title: 'Test Panel',
      subtitle: 'Test subtitle',
    };

    render(
      <TestWrapper>
        <StandardPanel header={header}>
          <div>Panel content</div>
        </StandardPanel>
      </TestWrapper>
    );

    expect(screen.getByText('Test Panel')).toBeInTheDocument();
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
  });

  it('renders with footer', () => {
    const footer = {
      actions: [<button key="1">Action 1</button>, <button key="2">Action 2</button>],
    };

    render(
      <TestWrapper>
        <StandardPanel footer={footer}>
          <div>Panel content</div>
        </StandardPanel>
      </TestWrapper>
    );

    expect(screen.getByText('Action 1')).toBeInTheDocument();
    expect(screen.getByText('Action 2')).toBeInTheDocument();
  });

  it('renders with header actions', () => {
    const header = {
      title: 'Test Panel',
      actions: [<button key="1">Header Action</button>],
    };

    render(
      <TestWrapper>
        <StandardPanel header={header}>
          <div>Panel content</div>
        </StandardPanel>
      </TestWrapper>
    );

    expect(screen.getByText('Header Action')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(
      <TestWrapper>
        <StandardPanel loading>
          <div>Panel content</div>
        </StandardPanel>
      </TestWrapper>
    );

    // Ant Design loading spinner should be present
    expect(document.querySelector('.ant-spin')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <StandardPanel className="custom-panel">
          <div>Panel content</div>
        </StandardPanel>
      </TestWrapper>
    );

    expect(container.querySelector('.custom-panel')).toBeInTheDocument();
  });

  it('passes through additional props', () => {
    render(
      <TestWrapper>
        <StandardPanel data-testid="custom-panel" id="test-panel">
          <div>Panel content</div>
        </StandardPanel>
      </TestWrapper>
    );

    expect(screen.getByTestId('custom-panel')).toBeInTheDocument();
    expect(document.getElementById('test-panel')).toBeInTheDocument();
  });

  it('renders empty state when no children', () => {
    render(
      <TestWrapper>
        <StandardPanel />
      </TestWrapper>
    );

    // Should render empty state
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('combines variant and size classes correctly', () => {
    const { container } = render(
      <TestWrapper>
        <StandardPanel variant="elevated" size="large" data-testid="combined-panel">
          <div>Panel content</div>
        </StandardPanel>
      </TestWrapper>
    );

    const panel = container.querySelector('[data-testid="combined-panel"]');
    expect(panel).toHaveClass('text-lg'); // Large size class
  });
});