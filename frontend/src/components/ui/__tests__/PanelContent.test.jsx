/**
 * PanelContent Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConfigProvider } from 'antd';
import PanelContent from '../PanelContent';
import { antdTheme } from '../../../theme/themeConfig';

// Test wrapper with Ant Design theme
const TestWrapper = ({ children }) => (
  <ConfigProvider theme={antdTheme}>
    {children}
  </ConfigProvider>
);

describe('PanelContent', () => {
  it('renders children content', () => {
    render(
      <TestWrapper>
        <PanelContent>
          <div>Test content</div>
        </PanelContent>
      </TestWrapper>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(
      <TestWrapper>
        <PanelContent loading>
          <div>Content should not be visible</div>
        </PanelContent>
      </TestWrapper>
    );

    // Should show loading spinner
    expect(document.querySelector('.ant-spin')).toBeInTheDocument();
    // Content should not be visible
    expect(screen.queryByText('Content should not be visible')).not.toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(
      <TestWrapper>
        <PanelContent empty>
          <div>Content should not be visible</div>
        </PanelContent>
      </TestWrapper>
    );

    // Should show empty state
    expect(screen.getByText('No data available')).toBeInTheDocument();
    // Content should not be visible
    expect(screen.queryByText('Content should not be visible')).not.toBeInTheDocument();
  });

  it('renders empty state with custom description', () => {
    render(
      <TestWrapper>
        <PanelContent empty emptyDescription="Custom empty message">
          <div>Content</div>
        </PanelContent>
      </TestWrapper>
    );

    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
  });

  it('renders empty state with custom image', () => {
    const customImage = <div data-testid="custom-empty-image">Custom Image</div>;
    
    render(
      <TestWrapper>
        <PanelContent empty emptyImage={customImage}>
          <div>Content</div>
        </PanelContent>
      </TestWrapper>
    );

    expect(screen.getByTestId('custom-empty-image')).toBeInTheDocument();
  });

  it('applies scrollable class when scrollable is true', () => {
    const { container } = render(
      <TestWrapper>
        <PanelContent scrollable>
          <div>Scrollable content</div>
        </PanelContent>
      </TestWrapper>
    );

    const content = container.querySelector('.panel-content');
    expect(content).toHaveClass('overflow-auto');
    expect(content).not.toHaveClass('overflow-hidden');
  });

  it('applies overflow-hidden class when scrollable is false', () => {
    const { container } = render(
      <TestWrapper>
        <PanelContent scrollable={false}>
          <div>Non-scrollable content</div>
        </PanelContent>
      </TestWrapper>
    );

    const content = container.querySelector('.panel-content');
    expect(content).toHaveClass('overflow-hidden');
    expect(content).not.toHaveClass('overflow-auto');
  });

  it('applies maxHeight style when provided', () => {
    const { container } = render(
      <TestWrapper>
        <PanelContent maxHeight="300px">
          <div>Content with max height</div>
        </PanelContent>
      </TestWrapper>
    );

    const content = container.querySelector('.panel-content');
    expect(content).toHaveStyle({ maxHeight: '300px' });
  });

  it('applies maxHeight as number', () => {
    const { container } = render(
      <TestWrapper>
        <PanelContent maxHeight={400}>
          <div>Content with numeric max height</div>
        </PanelContent>
      </TestWrapper>
    );

    const content = container.querySelector('.panel-content');
    expect(content).toHaveStyle({ maxHeight: 400 });
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <PanelContent className="custom-content">
          <div>Custom content</div>
        </PanelContent>
      </TestWrapper>
    );

    expect(container.querySelector('.custom-content')).toBeInTheDocument();
  });

  it('passes through additional props', () => {
    render(
      <TestWrapper>
        <PanelContent data-testid="custom-content" id="test-content">
          <div>Content with props</div>
        </PanelContent>
      </TestWrapper>
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(document.getElementById('test-content')).toBeInTheDocument();
  });

  it('loading state takes precedence over empty state', () => {
    render(
      <TestWrapper>
        <PanelContent loading empty>
          <div>Content</div>
        </PanelContent>
      </TestWrapper>
    );

    // Should show loading, not empty state
    expect(document.querySelector('.ant-spin')).toBeInTheDocument();
    expect(screen.queryByText('No data available')).not.toBeInTheDocument();
  });

  it('applies custom style along with maxHeight', () => {
    const customStyle = { backgroundColor: 'red', padding: '10px' };
    const { container } = render(
      <TestWrapper>
        <PanelContent maxHeight="200px" style={customStyle}>
          <div>Styled content</div>
        </PanelContent>
      </TestWrapper>
    );

    const content = container.querySelector('.panel-content');
    expect(content).toHaveStyle({ 
      maxHeight: '200px',
      backgroundColor: 'red',
      padding: '10px'
    });
  });

  it('renders normal content when not loading and not empty', () => {
    render(
      <TestWrapper>
        <PanelContent loading={false} empty={false}>
          <div>Normal content</div>
        </PanelContent>
      </TestWrapper>
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
    expect(document.querySelector('.ant-spin')).not.toBeInTheDocument();
    expect(screen.queryByText('No data available')).not.toBeInTheDocument();
  });

  it('applies different padding options', () => {
    const paddingOptions = ['none', 'compact', 'default', 'comfortable'];
    
    paddingOptions.forEach((padding) => {
      const { container } = render(
        <TestWrapper>
          <PanelContent padding={padding}>
            <div>Content with {padding} padding</div>
          </PanelContent>
        </TestWrapper>
      );

      const content = container.querySelector('.panel-content');
      expect(content).toBeInTheDocument();
      
      // Check padding classes
      if (padding === 'none') {
        expect(content).not.toHaveClass('p-3', 'p-6', 'p-8');
      } else if (padding === 'compact') {
        expect(content).toHaveClass('p-3');
      } else if (padding === 'default') {
        expect(content).toHaveClass('p-6');
      } else if (padding === 'comfortable') {
        expect(content).toHaveClass('p-8');
      }
    });
  });
});