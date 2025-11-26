/**
 * Tests for ResponsiveIcon Component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResponsiveIcon from '../ResponsiveIcon';

// Mock icon component
const MockIcon = ({ className, ...props }) => (
  <svg className={className} {...props} data-testid="mock-icon">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

describe('ResponsiveIcon', () => {
  test('renders string icon correctly', () => {
    render(<ResponsiveIcon icon="🚀" />);
    
    const icon = screen.getByText('🚀');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('responsive-icon');
  });

  test('renders React element icon correctly', () => {
    const iconElement = <MockIcon data-testid="element-icon" />;
    render(<ResponsiveIcon icon={iconElement} />);
    
    const icon = screen.getByTestId('element-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('responsive-icon');
  });

  test('renders function component icon correctly', () => {
    render(<ResponsiveIcon icon={MockIcon} />);
    
    const icon = screen.getByTestId('mock-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('responsive-icon');
  });

  test('applies responsive size classes by default', () => {
    render(<ResponsiveIcon icon="📱" size="lg" />);
    
    const icon = screen.getByText('📱');
    expect(icon).toHaveClass('text-lg', 'sm:text-xl');
  });

  test('applies fixed size classes when responsive=false', () => {
    render(<ResponsiveIcon icon="📱" size="lg" responsive={false} />);
    
    const icon = screen.getByText('📱');
    expect(icon).toHaveClass('text-lg');
    expect(icon).not.toHaveClass('sm:text-xl');
  });

  test('applies all size variants correctly', () => {
    const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'];
    
    sizes.forEach(size => {
      const { container } = render(<ResponsiveIcon icon="🎯" size={size} />);
      const icon = container.querySelector('.responsive-icon');
      expect(icon).toHaveClass(`text-${size}`);
    });
  });

  test('applies color classes correctly', () => {
    const colors = ['primary', 'secondary', 'success', 'warning', 'error', 'white', 'black'];
    
    colors.forEach(color => {
      const { container } = render(<ResponsiveIcon icon="🎨" color={color} />);
      const icon = container.querySelector('.responsive-icon');
      
      if (color === 'currentColor') {
        expect(icon).not.toHaveClass(`text-${color}`);
      } else {
        expect(icon).toHaveClass(`text-${color}-500`);
      }
    });
  });

  test('applies custom color class', () => {
    render(<ResponsiveIcon icon="🌈" color="text-purple-600" />);
    
    const icon = screen.getByText('🌈');
    expect(icon).toHaveClass('text-purple-600');
  });

  test('applies custom className', () => {
    render(<ResponsiveIcon icon="⭐" className="custom-icon-class" />);
    
    const icon = screen.getByText('⭐');
    expect(icon).toHaveClass('custom-icon-class');
  });

  test('applies touch manipulation for responsive icons', () => {
    render(<ResponsiveIcon icon="👆" responsive={true} />);
    
    const icon = screen.getByText('👆');
    expect(icon).toHaveClass('touch-manipulation');
  });

  test('does not apply touch manipulation for non-responsive icons', () => {
    render(<ResponsiveIcon icon="👆" responsive={false} />);
    
    const icon = screen.getByText('👆');
    expect(icon).not.toHaveClass('touch-manipulation');
  });

  test('passes through additional props', () => {
    render(
      <ResponsiveIcon 
        icon="🔧" 
        data-testid="icon-with-props" 
        title="Tool Icon"
      />
    );
    
    const icon = screen.getByTestId('icon-with-props');
    expect(icon).toHaveAttribute('title', 'Tool Icon');
  });

  test('handles React element with existing className', () => {
    const iconWithClass = <MockIcon className="existing-class" />;
    render(<ResponsiveIcon icon={iconWithClass} className="additional-class" />);
    
    const icon = screen.getByTestId('mock-icon');
    expect(icon).toHaveClass('existing-class', 'responsive-icon', 'additional-class');
  });

  test('applies default props correctly', () => {
    render(<ResponsiveIcon icon="🎯" />);
    
    const icon = screen.getByText('🎯');
    expect(icon).toHaveClass(
      'responsive-icon',
      'inline-block',
      'transition-responsive',
      'text-base',
      'sm:text-lg',
      'touch-manipulation'
    );
  });

  test('handles all responsive size combinations', () => {
    const responsiveSizes = {
      xs: ['text-xs', 'sm:text-sm'],
      sm: ['text-sm', 'sm:text-base'],
      base: ['text-base', 'sm:text-lg'],
      lg: ['text-lg', 'sm:text-xl'],
      xl: ['text-xl', 'sm:text-2xl'],
      '2xl': ['text-2xl', 'sm:text-3xl'],
      '3xl': ['text-3xl', 'sm:text-4xl'],
      '4xl': ['text-4xl', 'sm:text-5xl'],
    };

    Object.entries(responsiveSizes).forEach(([size, expectedClasses]) => {
      const { container } = render(<ResponsiveIcon icon="📏" size={size} />);
      const icon = container.querySelector('.responsive-icon');
      
      expectedClasses.forEach(expectedClass => {
        expect(icon).toHaveClass(expectedClass);
      });
    });
  });

  test('handles currentColor correctly', () => {
    render(<ResponsiveIcon icon="🎨" color="currentColor" />);
    
    const icon = screen.getByText('🎨');
    expect(icon).not.toHaveClass('text-currentColor');
    // Should not have any specific color class when using currentColor
    expect(icon.className).not.toMatch(/text-\w+-\d+/);
  });
});