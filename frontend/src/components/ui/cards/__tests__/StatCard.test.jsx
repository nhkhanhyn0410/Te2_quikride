/**
 * StatCard Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StatCard from '../StatCard';
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

describe('StatCard', () => {
  beforeEach(() => {
    mockGetIconByContext.mockClear();
  });

  it('renders with basic props', () => {
    renderWithIconProvider(
      <StatCard title="Total Users" value={1234} />
    );

    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('renders with icon using iconContext and iconType', () => {
    renderWithIconProvider(
      <StatCard 
        title="Active Users" 
        value={567} 
        iconContext="status" 
        iconType="success"
      />
    );

    expect(mockGetIconByContext).toHaveBeenCalledWith('status', 'success');
    expect(screen.getByTestId('icon-status-success')).toBeInTheDocument();
  });

  it('renders with custom icon', () => {
    const customIcon = <span data-testid="custom-icon">📊</span>;
    
    renderWithIconProvider(
      <StatCard title="Revenue" value={50000} icon={customIcon} />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders with prefix and suffix', () => {
    renderWithIconProvider(
      <StatCard 
        title="Revenue" 
        value={50000} 
        prefix="$" 
        suffix="USD"
      />
    );

    expect(screen.getByText('Total Users')).toBeInTheDocument();
    // Ant Design Statistic handles prefix/suffix rendering
  });

  it('renders with precision', () => {
    renderWithIconProvider(
      <StatCard 
        title="Average Rating" 
        value={4.567} 
        precision={2}
      />
    );

    expect(screen.getByText('Average Rating')).toBeInTheDocument();
  });

  it('renders with custom formatter', () => {
    const formatter = (value) => `${value}%`;
    
    renderWithIconProvider(
      <StatCard 
        title="Success Rate" 
        value={95.5} 
        formatter={formatter}
      />
    );

    expect(screen.getByText('Success Rate')).toBeInTheDocument();
  });

  it('renders with upward trend', () => {
    renderWithIconProvider(
      <StatCard 
        title="Sales" 
        value={1000} 
        trend="vs last month"
        trendValue="+15%"
        trendType="up"
      />
    );

    expect(mockGetIconByContext).toHaveBeenCalledWith('status', 'up');
    expect(screen.getByText('+15% vs last month')).toBeInTheDocument();
  });

  it('renders with downward trend', () => {
    renderWithIconProvider(
      <StatCard 
        title="Errors" 
        value={50} 
        trend="vs last week"
        trendValue="-20%"
        trendType="down"
      />
    );

    expect(mockGetIconByContext).toHaveBeenCalledWith('status', 'down');
    expect(screen.getByText('-20% vs last week')).toBeInTheDocument();
  });

  it('renders with neutral trend', () => {
    renderWithIconProvider(
      <StatCard 
        title="Stable Metric" 
        value={100} 
        trend="no change"
        trendType="neutral"
      />
    );

    expect(screen.getByText('no change')).toBeInTheDocument();
  });

  it('renders with custom color', () => {
    renderWithIconProvider(
      <StatCard 
        title="Custom Color" 
        value={789} 
        color="#52c41a"
        iconContext="status"
        iconType="success"
      />
    );

    expect(screen.getByText('Custom Color')).toBeInTheDocument();
  });

  it('renders with custom value style', () => {
    const valueStyle = { fontSize: '24px', fontWeight: 'bold' };
    
    renderWithIconProvider(
      <StatCard 
        title="Styled Value" 
        value={999} 
        valueStyle={valueStyle}
      />
    );

    expect(screen.getByText('Styled Value')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    renderWithIconProvider(
      <StatCard title="Loading Stat" value={0} loading={true} />
    );

    // Should show loading skeleton
    expect(document.querySelector('.ant-skeleton')).toBeInTheDocument();
  });

  it('renders different variants', () => {
    const variants = ['default', 'elevated', 'outlined', 'ghost', 'filled'];
    
    variants.forEach(variant => {
      const { unmount } = renderWithIconProvider(
        <StatCard 
          title={`${variant} Stat`} 
          value={100} 
          variant={variant}
        />
      );

      expect(screen.getByText(`${variant} Stat`)).toBeInTheDocument();
      
      unmount();
    });
  });

  it('renders different sizes', () => {
    const sizes = ['small', 'default', 'large'];
    
    sizes.forEach(size => {
      const { unmount } = renderWithIconProvider(
        <StatCard 
          title={`${size} Stat`} 
          value={100} 
          size={size}
        />
      );

      expect(screen.getByText(`${size} Stat`)).toBeInTheDocument();
      
      unmount();
    });
  });

  it('renders without trend', () => {
    renderWithIconProvider(
      <StatCard title="No Trend" value={500} />
    );

    expect(screen.getByText('No Trend')).toBeInTheDocument();
    expect(screen.queryByText(/vs/)).not.toBeInTheDocument();
  });

  it('renders without icon', () => {
    renderWithIconProvider(
      <StatCard title="No Icon" value={300} />
    );

    expect(screen.getByText('No Icon')).toBeInTheDocument();
    expect(mockGetIconByContext).not.toHaveBeenCalled();
  });

  it('prioritizes custom icon over iconContext/iconType', () => {
    const customIcon = <span data-testid="custom-icon">📈</span>;
    
    renderWithIconProvider(
      <StatCard 
        title="Priority Test" 
        value={100} 
        icon={customIcon}
        iconContext="status"
        iconType="info"
      />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-status-info')).not.toBeInTheDocument();
    expect(mockGetIconByContext).not.toHaveBeenCalled();
  });

  it('combines color with valueStyle', () => {
    const valueStyle = { fontSize: '20px' };
    
    renderWithIconProvider(
      <StatCard 
        title="Combined Style" 
        value={777} 
        color="#1890ff"
        valueStyle={valueStyle}
      />
    );

    expect(screen.getByText('Combined Style')).toBeInTheDocument();
  });

  it('passes through additional props to StandardCard', () => {
    renderWithIconProvider(
      <StatCard 
        title="Props Test" 
        value={123} 
        className="custom-stat-card"
        data-testid="stat-card"
      />
    );

    const card = screen.getByTestId('stat-card');
    expect(card).toBeInTheDocument();
  });

  it('renders trend with only trendValue', () => {
    renderWithIconProvider(
      <StatCard 
        title="Trend Value Only" 
        value={200} 
        trendValue="+10%"
        trendType="up"
      />
    );

    expect(screen.getByText('+10%')).toBeInTheDocument();
  });

  it('renders trend with only trend text', () => {
    renderWithIconProvider(
      <StatCard 
        title="Trend Text Only" 
        value={300} 
        trend="improving"
        trendType="up"
      />
    );

    expect(screen.getByText('improving')).toBeInTheDocument();
  });
});