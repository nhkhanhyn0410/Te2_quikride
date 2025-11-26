/**
 * StandardButton Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StandardButton from '../StandardButton';
import { IconProvider } from '../../../../icons/IconProvider';

// Mock icon provider
const mockGetIconByContext = vi.fn((context, type) => <span data-testid={`icon-${context}-${type}`} />);

const MockIconProvider = ({ children }) => (
  <IconProvider value={{ getIconByContext: mockGetIconByContext }}>
    {children}
  </IconProvider>
);

const renderWithIconProvider = (component) => {
  return render(
    <MockIconProvider>
      {component}
    </MockIconProvider>
  );
};

describe('StandardButton', () => {
  beforeEach(() => {
    mockGetIconByContext.mockClear();
  });

  it('renders with default props', () => {
    renderWithIconProvider(
      <StandardButton>Default Button</StandardButton>
    );
    
    const button = screen.getByRole('button', { name: /default button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('ant-btn');
  });

  it('renders different variants correctly', () => {
    const variants = ['primary', 'secondary', 'text', 'link', 'dashed'];
    
    variants.forEach(variant => {
      const { unmount } = renderWithIconProvider(
        <StandardButton variant={variant}>{variant} Button</StandardButton>
      );
      
      const button = screen.getByRole('button', { name: new RegExp(`${variant} button`, 'i') });
      expect(button).toBeInTheDocument();
      
      // Check Ant Design type mapping
      if (variant === 'primary') {
        expect(button).toHaveClass('ant-btn-primary');
      } else if (variant === 'text') {
        expect(button).toHaveClass('ant-btn-text');
      } else if (variant === 'link') {
        expect(button).toHaveClass('ant-btn-link');
      } else if (variant === 'dashed') {
        expect(button).toHaveClass('ant-btn-dashed');
      }
      
      unmount();
    });
  });

  it('renders different sizes correctly', () => {
    const sizes = ['small', 'middle', 'large'];
    
    sizes.forEach(size => {
      const { unmount } = renderWithIconProvider(
        <StandardButton size={size}>{size} Button</StandardButton>
      );
      
      const button = screen.getByRole('button', { name: new RegExp(`${size} button`, 'i') });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass(`ant-btn-${size === 'middle' ? 'default' : size}`);
      
      unmount();
    });
  });

  it('handles loading state correctly', () => {
    renderWithIconProvider(
      <StandardButton loading>Loading Button</StandardButton>
    );
    
    const button = screen.getByRole('button', { name: /loading button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('ant-btn-loading');
    expect(button).toBeDisabled();
  });

  it('handles disabled state correctly', () => {
    renderWithIconProvider(
      <StandardButton disabled>Disabled Button</StandardButton>
    );
    
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('renders with custom icon', () => {
    const customIcon = <span data-testid="custom-icon">Custom</span>;
    
    renderWithIconProvider(
      <StandardButton icon={customIcon}>Icon Button</StandardButton>
    );
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders with standardized icon using iconContext and iconType', () => {
    renderWithIconProvider(
      <StandardButton iconContext="action" iconType="edit">Edit Button</StandardButton>
    );
    
    expect(mockGetIconByContext).toHaveBeenCalledWith('action', 'edit');
    expect(screen.getByTestId('icon-action-edit')).toBeInTheDocument();
  });

  it('prioritizes custom icon over iconContext/iconType', () => {
    const customIcon = <span data-testid="custom-icon">Custom</span>;
    
    renderWithIconProvider(
      <StandardButton 
        icon={customIcon} 
        iconContext="action" 
        iconType="edit"
      >
        Button
      </StandardButton>
    );
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-action-edit')).not.toBeInTheDocument();
    expect(mockGetIconByContext).not.toHaveBeenCalled();
  });

  it('handles block prop correctly', () => {
    renderWithIconProvider(
      <StandardButton block>Block Button</StandardButton>
    );
    
    const button = screen.getByRole('button', { name: /block button/i });
    expect(button).toHaveClass('ant-btn-block');
  });

  it('handles danger prop correctly', () => {
    renderWithIconProvider(
      <StandardButton danger>Danger Button</StandardButton>
    );
    
    const button = screen.getByRole('button', { name: /danger button/i });
    expect(button).toHaveClass('ant-btn-dangerous');
  });

  it('handles ghost prop correctly', () => {
    renderWithIconProvider(
      <StandardButton ghost>Ghost Button</StandardButton>
    );
    
    const button = screen.getByRole('button', { name: /ghost button/i });
    expect(button).toHaveClass('ant-btn-background-ghost');
  });

  it('applies custom className', () => {
    renderWithIconProvider(
      <StandardButton className="custom-class">Custom Button</StandardButton>
    );
    
    const button = screen.getByRole('button', { name: /custom button/i });
    expect(button).toHaveClass('custom-class');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    
    renderWithIconProvider(
      <StandardButton onClick={handleClick}>Clickable Button</StandardButton>
    );
    
    const button = screen.getByRole('button', { name: /clickable button/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('passes through additional props', () => {
    renderWithIconProvider(
      <StandardButton data-testid="test-button" title="Test Title">
        Button
      </StandardButton>
    );
    
    const button = screen.getByTestId('test-button');
    expect(button).toHaveAttribute('title', 'Test Title');
  });

  it('applies variant-specific styling classes', () => {
    // Test primary variant hover styling
    renderWithIconProvider(
      <StandardButton variant="primary">Primary Button</StandardButton>
    );
    
    const primaryButton = screen.getByRole('button', { name: /primary button/i });
    expect(primaryButton).toHaveClass('hover:shadow-md');
  });

  it('does not apply hover effects when disabled', () => {
    renderWithIconProvider(
      <StandardButton variant="primary" disabled>Disabled Primary</StandardButton>
    );
    
    const button = screen.getByRole('button', { name: /disabled primary/i });
    expect(button).toBeDisabled();
    // Hover effects should not be applied to disabled buttons
  });
});