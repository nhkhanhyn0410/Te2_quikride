/**
 * Tests for ResponsiveText Component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResponsiveText from '../ResponsiveText';

// Mock the responsive utilities
jest.mock('../../../../utils/responsive', () => ({
  getResponsiveTextSize: jest.fn((size) => `text-responsive-${size}`),
  getResponsiveHeading: jest.fn((level) => `heading-responsive-h${level}`),
}));

describe('ResponsiveText', () => {
  test('renders children correctly', () => {
    render(
      <ResponsiveText>
        Test Text Content
      </ResponsiveText>
    );
    
    expect(screen.getByText('Test Text Content')).toBeInTheDocument();
  });

  test('applies default text classes', () => {
    const { container } = render(
      <ResponsiveText>
        Test Text
      </ResponsiveText>
    );
    
    const textElement = container.firstChild;
    expect(textElement).toHaveClass('text-responsive-base', 'font-normal', 'text-neutral-900', 'text-left');
    expect(textElement.tagName).toBe('P');
  });

  test('applies custom size', () => {
    const { container } = render(
      <ResponsiveText size="lg">
        Test Text
      </ResponsiveText>
    );
    
    const textElement = container.firstChild;
    expect(textElement).toHaveClass('text-responsive-lg');
  });

  test('applies heading styles', () => {
    const { container } = render(
      <ResponsiveText heading={2} as="h2">
        Heading Text
      </ResponsiveText>
    );
    
    const textElement = container.firstChild;
    expect(textElement).toHaveClass('heading-responsive-h2');
    expect(textElement.tagName).toBe('H2');
  });

  test('applies custom weight', () => {
    const { container } = render(
      <ResponsiveText weight="bold">
        Bold Text
      </ResponsiveText>
    );
    
    const textElement = container.firstChild;
    expect(textElement).toHaveClass('font-bold');
  });

  test('applies custom color with dash', () => {
    const { container } = render(
      <ResponsiveText color="primary-500">
        Colored Text
      </ResponsiveText>
    );
    
    const textElement = container.firstChild;
    expect(textElement).toHaveClass('text-primary-500');
  });

  test('applies neutral color without dash', () => {
    const { container } = render(
      <ResponsiveText color="600">
        Neutral Text
      </ResponsiveText>
    );
    
    const textElement = container.firstChild;
    expect(textElement).toHaveClass('text-neutral-600');
  });

  test('applies custom alignment', () => {
    const { container } = render(
      <ResponsiveText align="center">
        Centered Text
      </ResponsiveText>
    );
    
    const textElement = container.firstChild;
    expect(textElement).toHaveClass('text-center');
  });

  test('applies custom className', () => {
    const { container } = render(
      <ResponsiveText className="custom-text">
        Custom Text
      </ResponsiveText>
    );
    
    const textElement = container.firstChild;
    expect(textElement).toHaveClass('custom-text');
  });

  test('renders as custom component', () => {
    render(
      <ResponsiveText as="span" data-testid="text">
        Span Text
      </ResponsiveText>
    );
    
    const textElement = screen.getByTestId('text');
    expect(textElement.tagName).toBe('SPAN');
  });

  test('passes through additional props', () => {
    render(
      <ResponsiveText data-testid="text" id="test-text">
        Test Text
      </ResponsiveText>
    );
    
    const textElement = screen.getByTestId('text');
    expect(textElement).toHaveAttribute('id', 'test-text');
  });

  test('handles all size variants', () => {
    const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'];
    
    sizes.forEach(size => {
      const { container } = render(
        <ResponsiveText size={size}>
          Test Text
        </ResponsiveText>
      );
      
      const textElement = container.firstChild;
      expect(textElement).toHaveClass(`text-responsive-${size}`);
    });
  });

  test('handles all weight variants', () => {
    const weights = [
      'thin', 'extralight', 'light', 'normal', 'medium',
      'semibold', 'bold', 'extrabold', 'black'
    ];
    
    weights.forEach(weight => {
      const { container } = render(
        <ResponsiveText weight={weight}>
          Test Text
        </ResponsiveText>
      );
      
      const textElement = container.firstChild;
      expect(textElement).toHaveClass(`font-${weight}`);
    });
  });

  test('handles all alignment variants', () => {
    const alignments = ['left', 'center', 'right', 'justify'];
    
    alignments.forEach(align => {
      const { container } = render(
        <ResponsiveText align={align}>
          Test Text
        </ResponsiveText>
      );
      
      const textElement = container.firstChild;
      expect(textElement).toHaveClass(`text-${align}`);
    });
  });

  test('handles all heading levels', () => {
    const levels = [1, 2, 3, 4, 5, 6];
    
    levels.forEach(level => {
      const { container } = render(
        <ResponsiveText heading={level} as={`h${level}`}>
          Heading Text
        </ResponsiveText>
      );
      
      const textElement = container.firstChild;
      expect(textElement).toHaveClass(`heading-responsive-h${level}`);
      expect(textElement.tagName).toBe(`H${level}`);
    });
  });

  test('prioritizes heading over size when both provided', () => {
    const { container } = render(
      <ResponsiveText heading={1} size="lg">
        Heading Text
      </ResponsiveText>
    );
    
    const textElement = container.firstChild;
    expect(textElement).toHaveClass('heading-responsive-h1');
    expect(textElement).not.toHaveClass('text-responsive-lg');
  });
});