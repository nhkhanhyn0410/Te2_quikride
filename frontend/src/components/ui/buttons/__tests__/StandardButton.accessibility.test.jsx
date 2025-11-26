/**
 * StandardButton Accessibility Tests
 * Tests accessibility compliance for the StandardButton component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ConfigProvider } from 'antd';
import { antdTheme } from '../../../../theme/themeConfig';
import { StandardButton } from '../StandardButton';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Test wrapper with theme
const TestWrapper = ({ children }) => (
  <ConfigProvider theme={antdTheme}>
    {children}
  </ConfigProvider>
);

describe('StandardButton Accessibility Tests', () => {
  it('should not have accessibility violations - default button', async () => {
    const { container } = render(
      <TestWrapper>
        <StandardButton>Default Button</StandardButton>
      </TestWrapper>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations - all variants', async () => {
    const { container } = render(
      <TestWrapper>
        <div>
          <StandardButton variant="primary">Primary</StandardButton>
          <StandardButton variant="secondary">Secondary</StandardButton>
          <StandardButton variant="success">Success</StandardButton>
          <StandardButton variant="warning">Warning</StandardButton>
          <StandardButton variant="danger">Danger</StandardButton>
          <StandardButton variant="ghost">Ghost</StandardButton>
          <StandardButton variant="link">Link</StandardButton>
        </div>
      </TestWrapper>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations - with icons', async () => {
    const { container } = render(
      <TestWrapper>
        <div>
          <StandardButton variant="primary" icon={<PlusOutlined />}>
            Add Item
          </StandardButton>
          <StandardButton variant="secondary" icon={<EditOutlined />}>
            Edit
          </StandardButton>
          <StandardButton variant="danger" icon={<DeleteOutlined />}>
            Delete
          </StandardButton>
        </div>
      </TestWrapper>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations - disabled states', async () => {
    const { container } = render(
      <TestWrapper>
        <div>
          <StandardButton variant="primary" disabled>
            Disabled Primary
          </StandardButton>
          <StandardButton variant="secondary" disabled>
            Disabled Secondary
          </StandardButton>
          <StandardButton variant="danger" disabled icon={<DeleteOutlined />}>
            Disabled with Icon
          </StandardButton>
        </div>
      </TestWrapper>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations - loading states', async () => {
    const { container } = render(
      <TestWrapper>
        <div>
          <StandardButton variant="primary" loading>
            Loading Primary
          </StandardButton>
          <StandardButton variant="secondary" loading>
            Loading Secondary
          </StandardButton>
        </div>
      </TestWrapper>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations - different sizes', async () => {
    const { container } = render(
      <TestWrapper>
        <div>
          <StandardButton size="small">Small</StandardButton>
          <StandardButton size="medium">Medium</StandardButton>
          <StandardButton size="large">Large</StandardButton>
        </div>
      </TestWrapper>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes for loading state', async () => {
    const { getByRole } = render(
      <TestWrapper>
        <StandardButton variant="primary" loading>
          Loading Button
        </StandardButton>
      </TestWrapper>
    );
    
    const button = getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('should have proper ARIA attributes for disabled state', async () => {
    const { getByRole } = render(
      <TestWrapper>
        <StandardButton variant="primary" disabled>
          Disabled Button
        </StandardButton>
      </TestWrapper>
    );
    
    const button = getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should maintain focus visibility', async () => {
    const { getByRole } = render(
      <TestWrapper>
        <StandardButton variant="primary">
          Focusable Button
        </StandardButton>
      </TestWrapper>
    );
    
    const button = getByRole('button');
    button.focus();
    
    // Check that the button can receive focus
    expect(button).toHaveFocus();
    
    // Run accessibility check on focused element
    const results = await axe(button);
    expect(results).toHaveNoViolations();
  });

  it('should have sufficient color contrast', async () => {
    const { container } = render(
      <TestWrapper>
        <div>
          <StandardButton variant="primary">Primary Button</StandardButton>
          <StandardButton variant="secondary">Secondary Button</StandardButton>
          <StandardButton variant="success">Success Button</StandardButton>
          <StandardButton variant="warning">Warning Button</StandardButton>
          <StandardButton variant="danger">Danger Button</StandardButton>
        </div>
      </TestWrapper>
    );
    
    // Test color contrast compliance
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
    expect(results).toHaveNoViolations();
  });

  it('should support keyboard navigation', async () => {
    const { container } = render(
      <TestWrapper>
        <div>
          <StandardButton variant="primary">Button 1</StandardButton>
          <StandardButton variant="secondary">Button 2</StandardButton>
          <StandardButton variant="success">Button 3</StandardButton>
        </div>
      </TestWrapper>
    );
    
    // Test keyboard navigation accessibility
    const results = await axe(container, {
      rules: {
        'keyboard': { enabled: true },
        'focus-order-semantics': { enabled: true }
      }
    });
    expect(results).toHaveNoViolations();
  });
});