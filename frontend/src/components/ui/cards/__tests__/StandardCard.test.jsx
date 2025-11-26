/**
 * StandardCard Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StandardCard from '../StandardCard';
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

describe('StandardCard', () => {
  beforeEach(() => {
    mockGetIconByContext.mockClear();
  });

  it('renders with basic props', () => {
    renderWithIconProvider(
      <StandardCard title="Test Card">
        <div>Card content</div>
      </StandardCard>
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders title with icon using iconContext and iconType', () => {
    renderWithIconProvider(
      <StandardCard 
        title="Test Card" 
        titleIconContext="status" 
        titleIconType="info"
      >
        <div>Card content</div>
      </StandardCard>
    );

    expect(mockGetIconByContext).toHaveBeenCalledWith('status', 'info');
    expect(screen.getByTestId('icon-status-info')).toBeInTheDocument();
  });

  it('renders with custom title icon', () => {
    const customIcon = <span data-testid="custom-icon">Custom</span>;
    
    renderWithIconProvider(
      <StandardCard title="Test Card" titleIcon={customIcon}>
        <div>Card content</div>
      </StandardCard>
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders title with subtitle', () => {
    renderWithIconProvider(
      <StandardCard title="Main Title" subtitle="This is a subtitle">
        <div>Card content</div>
      </StandardCard>
    );

    expect(screen.getByText('Main Title')).toBeInTheDocument();
    expect(screen.getByText('This is a subtitle')).toBeInTheDocument();
  });

  it('renders different variants', () => {
    const variants = ['default', 'elevated', 'outlined', 'ghost', 'filled'];
    
    variants.forEach(variant => {
      const { unmount } = renderWithIconProvider(
        <StandardCard title={`${variant} Card`} variant={variant}>
          <div>Content</div>
        </StandardCard>
      );

      expect(screen.getByText(`${variant} Card`)).toBeInTheDocument();
      
      unmount();
    });
  });

  it('renders different sizes', () => {
    const sizes = ['small', 'default', 'large'];
    
    sizes.forEach(size => {
      const { unmount } = renderWithIconProvider(
        <StandardCard title={`${size} Card`} size={size}>
          <div>Content</div>
        </StandardCard>
      );

      expect(screen.getByText(`${size} Card`)).toBeInTheDocument();
      
      unmount();
    });
  });

  it('handles loading state', () => {
    renderWithIconProvider(
      <StandardCard title="Loading Card" loading={true}>
        <div>Content</div>
      </StandardCard>
    );

    // Ant Design Card shows loading skeleton
    expect(document.querySelector('.ant-skeleton')).toBeInTheDocument();
  });

  it('handles hoverable prop', () => {
    renderWithIconProvider(
      <StandardCard title="Hoverable Card" hoverable={true}>
        <div>Content</div>
      </StandardCard>
    );

    const card = document.querySelector('.ant-card');
    expect(card).toHaveClass('ant-card-hoverable');
  });

  it('renders with actions', () => {
    const actions = [
      <button key="action1">Action 1</button>,
      <button key="action2">Action 2</button>,
    ];

    renderWithIconProvider(
      <StandardCard title="Card with Actions" actions={actions}>
        <div>Content</div>
      </StandardCard>
    );

    expect(screen.getByRole('button', { name: /action 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /action 2/i })).toBeInTheDocument();
  });

  it('renders with extra content', () => {
    const extra = <button>Extra Button</button>;

    renderWithIconProvider(
      <StandardCard title="Card with Extra" extra={extra}>
        <div>Content</div>
      </StandardCard>
    );

    expect(screen.getByRole('button', { name: /extra button/i })).toBeInTheDocument();
  });

  it('renders with cover image', () => {
    const cover = <img alt="cover" src="test-image.jpg" data-testid="cover-image" />;

    renderWithIconProvider(
      <StandardCard title="Card with Cover" cover={cover}>
        <div>Content</div>
      </StandardCard>
    );

    expect(screen.getByTestId('cover-image')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    renderWithIconProvider(
      <StandardCard title="Custom Class Card" className="custom-card-class">
        <div>Content</div>
      </StandardCard>
    );

    const card = document.querySelector('.custom-card-class');
    expect(card).toBeInTheDocument();
  });

  it('handles different padding options', () => {
    const paddingOptions = ['compact', 'default', 'comfortable', 'spacious'];
    
    paddingOptions.forEach(padding => {
      const { unmount } = renderWithIconProvider(
        <StandardCard title={`${padding} Padding`} padding={padding}>
          <div>Content</div>
        </StandardCard>
      );

      expect(screen.getByText(`${padding} Padding`)).toBeInTheDocument();
      
      unmount();
    });
  });

  it('handles different shadow options', () => {
    const shadowOptions = ['none', 'small', 'default', 'medium', 'large'];
    
    shadowOptions.forEach(shadow => {
      const { unmount } = renderWithIconProvider(
        <StandardCard title={`${shadow} Shadow`} shadow={shadow}>
          <div>Content</div>
        </StandardCard>
      );

      expect(screen.getByText(`${shadow} Shadow`)).toBeInTheDocument();
      
      unmount();
    });
  });

  it('handles bordered prop', () => {
    renderWithIconProvider(
      <StandardCard title="Bordered Card" bordered={false}>
        <div>Content</div>
      </StandardCard>
    );

    const card = document.querySelector('.ant-card');
    expect(card).not.toHaveClass('ant-card-bordered');
  });

  it('passes through additional props to Ant Design Card', () => {
    renderWithIconProvider(
      <StandardCard 
        title="Props Card" 
        data-testid="test-card"
        style={{ backgroundColor: 'red' }}
      >
        <div>Content</div>
      </StandardCard>
    );

    const card = screen.getByTestId('test-card');
    expect(card).toBeInTheDocument();
  });

  it('prioritizes custom icon over iconContext/iconType', () => {
    const customIcon = <span data-testid="custom-icon">Custom</span>;
    
    renderWithIconProvider(
      <StandardCard 
        title="Test Card" 
        titleIcon={customIcon}
        titleIconContext="status" 
        titleIconType="info"
      >
        <div>Content</div>
      </StandardCard>
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-status-info')).not.toBeInTheDocument();
    expect(mockGetIconByContext).not.toHaveBeenCalled();
  });

  it('renders without title', () => {
    renderWithIconProvider(
      <StandardCard>
        <div>Content without title</div>
      </StandardCard>
    );

    expect(screen.getByText('Content without title')).toBeInTheDocument();
  });

  it('handles empty actions array', () => {
    renderWithIconProvider(
      <StandardCard title="No Actions Card" actions={[]}>
        <div>Content</div>
      </StandardCard>
    );

    expect(screen.getByText('No Actions Card')).toBeInTheDocument();
    expect(document.querySelector('.ant-card-actions')).not.toBeInTheDocument();
  });

  it('applies variant-specific CSS classes', () => {
    renderWithIconProvider(
      <StandardCard title="Elevated Card" variant="elevated">
        <div>Content</div>
      </StandardCard>
    );

    const card = document.querySelector('.standard-card--elevated');
    expect(card).toBeInTheDocument();
  });

  it('applies size-specific CSS classes', () => {
    renderWithIconProvider(
      <StandardCard title="Small Card" size="small">
        <div>Content</div>
      </StandardCard>
    );

    const card = document.querySelector('.standard-card--small');
    expect(card).toBeInTheDocument();
  });
});