/**
 * PanelHeader Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConfigProvider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import PanelHeader from '../PanelHeader';
import { antdTheme } from '../../../theme/themeConfig';

// Test wrapper with Ant Design theme
const TestWrapper = ({ children }) => (
  <ConfigProvider theme={antdTheme}>
    {children}
  </ConfigProvider>
);

describe('PanelHeader', () => {
  it('renders with required title prop', () => {
    render(
      <TestWrapper>
        <PanelHeader title="Test Header" />
      </TestWrapper>
    );

    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  it('renders with title and subtitle', () => {
    render(
      <TestWrapper>
        <PanelHeader title="Test Header" subtitle="Test subtitle" />
      </TestWrapper>
    );

    expect(screen.getByText('Test Header')).toBeInTheDocument();
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(
      <TestWrapper>
        <PanelHeader title="Test Header" icon={<UserOutlined data-testid="header-icon" />} />
      </TestWrapper>
    );

    expect(screen.getByTestId('header-icon')).toBeInTheDocument();
  });

  it('renders with actions', () => {
    const actions = [
      <button key="1">Action 1</button>,
      <button key="2">Action 2</button>,
    ];

    render(
      <TestWrapper>
        <PanelHeader title="Test Header" actions={actions} />
      </TestWrapper>
    );

    expect(screen.getByText('Action 1')).toBeInTheDocument();
    expect(screen.getByText('Action 2')).toBeInTheDocument();
  });

  it('renders with all sizes', () => {
    const sizes = ['small', 'medium', 'large'];
    
    sizes.forEach((size) => {
      const { container } = render(
        <TestWrapper>
          <PanelHeader title={`${size} Header`} size={size} />
        </TestWrapper>
      );

      expect(screen.getByText(`${size} Header`)).toBeInTheDocument();
      
      // Check if appropriate size classes are applied
      const header = container.querySelector('.panel-header');
      expect(header).toBeInTheDocument();
    });
  });

  it('renders divider by default', () => {
    const { container } = render(
      <TestWrapper>
        <PanelHeader title="Test Header" />
      </TestWrapper>
    );

    expect(container.querySelector('.ant-divider')).toBeInTheDocument();
  });

  it('hides divider when showDivider is false', () => {
    const { container } = render(
      <TestWrapper>
        <PanelHeader title="Test Header" showDivider={false} />
      </TestWrapper>
    );

    expect(container.querySelector('.ant-divider')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <PanelHeader title="Test Header" className="custom-header" />
      </TestWrapper>
    );

    expect(container.querySelector('.custom-header')).toBeInTheDocument();
  });

  it('handles long title with ellipsis', () => {
    const longTitle = 'This is a very long title that should be truncated with ellipsis when it exceeds the available space';
    
    render(
      <TestWrapper>
        <PanelHeader title={longTitle} />
      </TestWrapper>
    );

    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it('handles long subtitle with ellipsis', () => {
    const longSubtitle = 'This is a very long subtitle that should be truncated with ellipsis when it exceeds the available space';
    
    render(
      <TestWrapper>
        <PanelHeader title="Test Header" subtitle={longSubtitle} />
      </TestWrapper>
    );

    expect(screen.getByText(longSubtitle)).toBeInTheDocument();
  });

  it('renders with icon, title, subtitle, and actions together', () => {
    const actions = [<button key="1">Action</button>];
    
    render(
      <TestWrapper>
        <PanelHeader 
          title="Complete Header" 
          subtitle="With all props"
          icon={<UserOutlined data-testid="complete-icon" />}
          actions={actions}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Complete Header')).toBeInTheDocument();
    expect(screen.getByText('With all props')).toBeInTheDocument();
    expect(screen.getByTestId('complete-icon')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('passes through additional props', () => {
    render(
      <TestWrapper>
        <PanelHeader title="Test Header" data-testid="custom-header" />
      </TestWrapper>
    );

    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
  });
});