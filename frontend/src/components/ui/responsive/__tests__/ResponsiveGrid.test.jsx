/**
 * Tests for ResponsiveGrid Component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResponsiveGrid from '../ResponsiveGrid';

// Mock the responsive utility
jest.mock('../../../../utils/responsive', () => ({
  generateResponsiveClasses: jest.fn((config, prefix) => {
    // Simple mock implementation
    const classes = [];
    Object.entries(config).forEach(([breakpoint, value]) => {
      const breakpointPrefix = breakpoint === 'xs' ? '' : `${breakpoint}:`;
      classes.push(`${breakpointPrefix}${prefix}${value}`);
    });
    return classes.join(' ');
  }),
}));

describe('ResponsiveGrid', () => {
  test('renders children correctly', () => {
    render(
      <ResponsiveGrid>
        <div>Grid Item 1</div>
        <div>Grid Item 2</div>
      </ResponsiveGrid>
    );
    
    expect(screen.getByText('Grid Item 1')).toBeInTheDocument();
    expect(screen.getByText('Grid Item 2')).toBeInTheDocument();
  });

  test('applies default grid classes', () => {
    const { container } = render(
      <ResponsiveGrid>
        <div>Grid Item</div>
      </ResponsiveGrid>
    );
    
    const gridElement = container.firstChild;
    expect(gridElement).toHaveClass('grid');
    expect(gridElement).toHaveClass('gap-responsive-md');
  });

  test('applies custom columns configuration', () => {
    const columns = { xs: 1, sm: 2, md: 3 };
    
    const { container } = render(
      <ResponsiveGrid columns={columns}>
        <div>Grid Item</div>
      </ResponsiveGrid>
    );
    
    const gridElement = container.firstChild;
    expect(gridElement).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'md:grid-cols-3');
  });

  test('applies custom gap size', () => {
    const { container } = render(
      <ResponsiveGrid gap="lg">
        <div>Grid Item</div>
      </ResponsiveGrid>
    );
    
    const gridElement = container.firstChild;
    expect(gridElement).toHaveClass('gap-responsive-lg');
  });

  test('applies responsive gap configuration', () => {
    const gap = { xs: 2, sm: 4, md: 6 };
    
    const { container } = render(
      <ResponsiveGrid gap={gap}>
        <div>Grid Item</div>
      </ResponsiveGrid>
    );
    
    const gridElement = container.firstChild;
    expect(gridElement).toHaveClass('gap-2', 'sm:gap-4', 'md:gap-6');
  });

  test('applies custom className', () => {
    const { container } = render(
      <ResponsiveGrid className="custom-grid">
        <div>Grid Item</div>
      </ResponsiveGrid>
    );
    
    const gridElement = container.firstChild;
    expect(gridElement).toHaveClass('custom-grid');
  });

  test('renders as custom component', () => {
    render(
      <ResponsiveGrid as="section" data-testid="grid">
        <div>Grid Item</div>
      </ResponsiveGrid>
    );
    
    const gridElement = screen.getByTestId('grid');
    expect(gridElement.tagName).toBe('SECTION');
  });

  test('passes through additional props', () => {
    render(
      <ResponsiveGrid data-testid="grid" id="test-grid">
        <div>Grid Item</div>
      </ResponsiveGrid>
    );
    
    const gridElement = screen.getByTestId('grid');
    expect(gridElement).toHaveAttribute('id', 'test-grid');
  });

  test('handles number columns configuration', () => {
    const { container } = render(
      <ResponsiveGrid columns={4}>
        <div>Grid Item</div>
      </ResponsiveGrid>
    );
    
    const gridElement = container.firstChild;
    expect(gridElement).toHaveClass('grid');
  });

  test('handles all gap size variants', () => {
    const gapSizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    
    gapSizes.forEach(gap => {
      const { container } = render(
        <ResponsiveGrid gap={gap}>
          <div>Grid Item</div>
        </ResponsiveGrid>
      );
      
      const gridElement = container.firstChild;
      expect(gridElement).toHaveClass(`gap-responsive-${gap}`);
    });
  });

  test('handles complex responsive columns', () => {
    const columns = { 
      xs: 1, 
      sm: 2, 
      md: 3, 
      lg: 4, 
      xl: 6 
    };
    
    const { container } = render(
      <ResponsiveGrid columns={columns}>
        <div>Grid Item</div>
      </ResponsiveGrid>
    );
    
    const gridElement = container.firstChild;
    expect(gridElement).toHaveClass(
      'grid-cols-1',
      'sm:grid-cols-2',
      'md:grid-cols-3',
      'lg:grid-cols-4',
      'xl:grid-cols-6'
    );
  });
});