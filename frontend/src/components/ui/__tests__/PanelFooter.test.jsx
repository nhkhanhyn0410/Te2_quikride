/**
 * PanelFooter Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConfigProvider } from 'antd';
import PanelFooter from '../PanelFooter';
import { antdTheme } from '../../../theme/themeConfig';

// Test wrapper with Ant Design theme
const TestWrapper = ({ children }) => (
  <ConfigProvider theme={antdTheme}>
    {children}
  </ConfigProvider>
);

describe('PanelFooter', () => {
  it('renders nothing when no actions provided', () => {
    const { container } = render(
      <TestWrapper>
        <PanelFooter />
      </TestWrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when empty actions array provided', () => {
    const { container } = render(
      <TestWrapper>
        <PanelFooter actions={[]} />
      </TestWrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders with actions', () => {
    const actions = [
      <button key="1">Save</button>,
      <button key="2">Cancel</button>,
    ];

    render(
      <TestWrapper>
        <PanelFooter actions={actions} />
      </TestWrapper>
    );

    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders with all alignment options', () => {
    const alignments = ['left', 'center', 'right'];
    const actions = [<button key="1">Action</button>];
    
    alignments.forEach((align) => {
      const { container } = render(
        <TestWrapper>
          <PanelFooter actions={actions} align={align} data-testid={`footer-${align}`} />
        </TestWrapper>
      );

      const footer = container.querySelector('.panel-footer');
      expect(footer).toBeInTheDocument();
      
      // Check alignment classes
      if (align === 'left') {
        expect(footer).toHaveClass('justify-start');
      } else if (align === 'center') {
        expect(footer).toHaveClass('justify-center');
      } else if (align === 'right') {
        expect(footer).toHaveClass('justify-end');
      }
    });
  });

  it('renders with all sizes', () => {
    const sizes = ['small', 'medium', 'large'];
    const actions = [<button key="1">Action</button>];
    
    sizes.forEach((size) => {
      const { container } = render(
        <TestWrapper>
          <PanelFooter actions={actions} size={size} />
        </TestWrapper>
      );

      const footer = container.querySelector('.panel-footer');
      expect(footer).toBeInTheDocument();
    });
  });

  it('renders divider by default', () => {
    const actions = [<button key="1">Action</button>];
    const { container } = render(
      <TestWrapper>
        <PanelFooter actions={actions} />
      </TestWrapper>
    );

    expect(container.querySelector('.ant-divider')).toBeInTheDocument();
  });

  it('hides divider when showDivider is false', () => {
    const actions = [<button key="1">Action</button>];
    const { container } = render(
      <TestWrapper>
        <PanelFooter actions={actions} showDivider={false} />
      </TestWrapper>
    );

    expect(container.querySelector('.ant-divider')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const actions = [<button key="1">Action</button>];
    const { container } = render(
      <TestWrapper>
        <PanelFooter actions={actions} className="custom-footer" />
      </TestWrapper>
    );

    expect(container.querySelector('.custom-footer')).toBeInTheDocument();
  });

  it('renders multiple actions with proper spacing', () => {
    const actions = [
      <button key="1">Action 1</button>,
      <button key="2">Action 2</button>,
      <button key="3">Action 3</button>,
    ];

    render(
      <TestWrapper>
        <PanelFooter actions={actions} />
      </TestWrapper>
    );

    expect(screen.getByText('Action 1')).toBeInTheDocument();
    expect(screen.getByText('Action 2')).toBeInTheDocument();
    expect(screen.getByText('Action 3')).toBeInTheDocument();
  });

  it('passes through additional props', () => {
    const actions = [<button key="1">Action</button>];
    
    render(
      <TestWrapper>
        <PanelFooter actions={actions} data-testid="custom-footer" />
      </TestWrapper>
    );

    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
  });

  it('defaults to right alignment', () => {
    const actions = [<button key="1">Action</button>];
    const { container } = render(
      <TestWrapper>
        <PanelFooter actions={actions} />
      </TestWrapper>
    );

    const footer = container.querySelector('.panel-footer');
    expect(footer).toHaveClass('justify-end');
  });

  it('defaults to medium size', () => {
    const actions = [<button key="1">Action</button>];
    const { container } = render(
      <TestWrapper>
        <PanelFooter actions={actions} />
      </TestWrapper>
    );

    const footer = container.querySelector('.panel-footer');
    expect(footer).toBeInTheDocument();
    // Medium size should have px-6 py-4 classes
    expect(footer).toHaveClass('px-6', 'py-4');
  });
});