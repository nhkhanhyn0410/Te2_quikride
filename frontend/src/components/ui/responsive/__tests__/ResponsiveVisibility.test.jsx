/**
 * Tests for ResponsiveVisibility Component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResponsiveVisibility from '../ResponsiveVisibility';

describe('ResponsiveVisibility', () => {
  test('renders children correctly', () => {
    render(
      <ResponsiveVisibility>
        <div>Visible Content</div>
      </ResponsiveVisibility>
    );
    
    expect(screen.getByText('Visible Content')).toBeInTheDocument();
  });

  test('applies show classes for specific breakpoints', () => {
    const { container } = render(
      <ResponsiveVisibility show={['mobile', 'tablet']}>
        <div>Content</div>
      </ResponsiveVisibility>
    );
    
    const element = container.firstChild;
    expect(element).toHaveClass('show-mobile', 'show-tablet');
  });

  test('applies hide classes for specific breakpoints', () => {
    const { container } = render(
      <ResponsiveVisibility hide={['desktop', 'wide']}>
        <div>Content</div>
      </ResponsiveVisibility>
    );
    
    const element = container.firstChild;
    expect(element).toHaveClass('hide-desktop', 'hide-wide');
  });

  test('applies showUp class', () => {
    const { container } = render(
      <ResponsiveVisibility showUp="md">
        <div>Content</div>
      </ResponsiveVisibility>
    );
    
    const element = container.firstChild;
    expect(element).toHaveClass('show-md-up');
  });

  test('applies hideUp class', () => {
    const { container } = render(
      <ResponsiveVisibility hideUp="lg">
        <div>Content</div>
      </ResponsiveVisibility>
    );
    
    const element = container.firstChild;
    expect(element).toHaveClass('hide-lg-up');
  });

  test('combines multiple visibility rules', () => {
    const { container } = render(
      <ResponsiveVisibility 
        show={['mobile']} 
        hide={['desktop']} 
        showUp="sm"
      >
        <div>Content</div>
      </ResponsiveVisibility>
    );
    
    const element = container.firstChild;
    expect(element).toHaveClass('show-mobile', 'hide-desktop', 'show-sm-up');
  });

  test('applies custom className', () => {
    const { container } = render(
      <ResponsiveVisibility className="custom-visibility">
        <div>Content</div>
      </ResponsiveVisibility>
    );
    
    const element = container.firstChild;
    expect(element).toHaveClass('custom-visibility');
  });

  test('renders as custom component', () => {
    render(
      <ResponsiveVisibility as="section" data-testid="visibility">
        <div>Content</div>
      </ResponsiveVisibility>
    );
    
    const element = screen.getByTestId('visibility');
    expect(element.tagName).toBe('SECTION');
  });

  test('passes through additional props', () => {
    render(
      <ResponsiveVisibility data-testid="visibility" id="test-visibility">
        <div>Content</div>
      </ResponsiveVisibility>
    );
    
    const element = screen.getByTestId('visibility');
    expect(element).toHaveAttribute('id', 'test-visibility');
  });

  test('handles all show breakpoint variants', () => {
    const breakpoints = ['mobile', 'tablet', 'desktop', 'wide'];
    
    breakpoints.forEach(breakpoint => {
      const { container } = render(
        <ResponsiveVisibility show={[breakpoint]}>
          <div>Content</div>
        </ResponsiveVisibility>
      );
      
      const element = container.firstChild;
      expect(element).toHaveClass(`show-${breakpoint}`);
    });
  });

  test('handles all hide breakpoint variants', () => {
    const breakpoints = ['mobile', 'tablet', 'desktop', 'wide'];
    
    breakpoints.forEach(breakpoint => {
      const { container } = render(
        <ResponsiveVisibility hide={[breakpoint]}>
          <div>Content</div>
        </ResponsiveVisibility>
      );
      
      const element = container.firstChild;
      expect(element).toHaveClass(`hide-${breakpoint}`);
    });
  });

  test('handles all showUp breakpoint variants', () => {
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    
    breakpoints.forEach(breakpoint => {
      const { container } = render(
        <ResponsiveVisibility showUp={breakpoint}>
          <div>Content</div>
        </ResponsiveVisibility>
      );
      
      const element = container.firstChild;
      expect(element).toHaveClass(`show-${breakpoint}-up`);
    });
  });

  test('handles all hideUp breakpoint variants', () => {
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    
    breakpoints.forEach(breakpoint => {
      const { container } = render(
        <ResponsiveVisibility hideUp={breakpoint}>
          <div>Content</div>
        </ResponsiveVisibility>
      );
      
      const element = container.firstChild;
      expect(element).toHaveClass(`hide-${breakpoint}-up`);
    });
  });

  test('handles empty arrays gracefully', () => {
    const { container } = render(
      <ResponsiveVisibility show={[]} hide={[]}>
        <div>Content</div>
      </ResponsiveVisibility>
    );
    
    const element = container.firstChild;
    // Should only have default div classes, no visibility classes
    expect(element.className).toBe('');
  });

  test('handles multiple show and hide breakpoints', () => {
    const { container } = render(
      <ResponsiveVisibility 
        show={['mobile', 'desktop']} 
        hide={['tablet', 'wide']}
      >
        <div>Content</div>
      </ResponsiveVisibility>
    );
    
    const element = container.firstChild;
    expect(element).toHaveClass(
      'show-mobile', 
      'show-desktop', 
      'hide-tablet', 
      'hide-wide'
    );
  });
});