/**
 * Tests for ResponsiveContainer Component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResponsiveContainer from '../ResponsiveContainer';

describe('ResponsiveContainer', () => {
  test('renders children correctly', () => {
    render(
      <ResponsiveContainer>
        <div>Test Content</div>
      </ResponsiveContainer>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('applies default classes', () => {
    const { container } = render(
      <ResponsiveContainer>
        <div>Test Content</div>
      </ResponsiveContainer>
    );
    
    const containerElement = container.firstChild;
    expect(containerElement).toHaveClass('w-full', 'container-responsive', 'p-responsive-md', 'mx-auto');
  });

  test('applies custom size', () => {
    const { container } = render(
      <ResponsiveContainer size="lg">
        <div>Test Content</div>
      </ResponsiveContainer>
    );
    
    const containerElement = container.firstChild;
    expect(containerElement).toHaveClass('p-responsive-lg');
  });

  test('applies custom maxWidth', () => {
    const { container } = render(
      <ResponsiveContainer maxWidth="xl">
        <div>Test Content</div>
      </ResponsiveContainer>
    );
    
    const containerElement = container.firstChild;
    expect(containerElement).toHaveClass('max-w-xl');
  });

  test('applies full maxWidth', () => {
    const { container } = render(
      <ResponsiveContainer maxWidth="full">
        <div>Test Content</div>
      </ResponsiveContainer>
    );
    
    const containerElement = container.firstChild;
    expect(containerElement).toHaveClass('max-w-full');
  });

  test('disables padding when padding=false', () => {
    const { container } = render(
      <ResponsiveContainer padding={false}>
        <div>Test Content</div>
      </ResponsiveContainer>
    );
    
    const containerElement = container.firstChild;
    expect(containerElement).not.toHaveClass('p-responsive-md');
  });

  test('applies custom padding size', () => {
    const { container } = render(
      <ResponsiveContainer padding="sm">
        <div>Test Content</div>
      </ResponsiveContainer>
    );
    
    const containerElement = container.firstChild;
    expect(containerElement).toHaveClass('p-responsive-sm');
  });

  test('applies margin when margin=true', () => {
    const { container } = render(
      <ResponsiveContainer margin={true}>
        <div>Test Content</div>
      </ResponsiveContainer>
    );
    
    const containerElement = container.firstChild;
    expect(containerElement).toHaveClass('m-responsive-md');
  });

  test('applies custom margin size', () => {
    const { container } = render(
      <ResponsiveContainer margin="lg">
        <div>Test Content</div>
      </ResponsiveContainer>
    );
    
    const containerElement = container.firstChild;
    expect(containerElement).toHaveClass('m-responsive-lg');
  });

  test('applies custom className', () => {
    const { container } = render(
      <ResponsiveContainer className="custom-class">
        <div>Test Content</div>
      </ResponsiveContainer>
    );
    
    const containerElement = container.firstChild;
    expect(containerElement).toHaveClass('custom-class');
  });

  test('renders as custom component', () => {
    render(
      <ResponsiveContainer as="section" data-testid="container">
        <div>Test Content</div>
      </ResponsiveContainer>
    );
    
    const containerElement = screen.getByTestId('container');
    expect(containerElement.tagName).toBe('SECTION');
  });

  test('passes through additional props', () => {
    render(
      <ResponsiveContainer data-testid="container" id="test-id">
        <div>Test Content</div>
      </ResponsiveContainer>
    );
    
    const containerElement = screen.getByTestId('container');
    expect(containerElement).toHaveAttribute('id', 'test-id');
  });

  test('handles all size variants', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    
    sizes.forEach(size => {
      const { container } = render(
        <ResponsiveContainer size={size}>
          <div>Test Content</div>
        </ResponsiveContainer>
      );
      
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass(`p-responsive-${size}`);
    });
  });

  test('handles all maxWidth variants', () => {
    const maxWidths = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'];
    
    maxWidths.forEach(maxWidth => {
      const { container } = render(
        <ResponsiveContainer maxWidth={maxWidth}>
          <div>Test Content</div>
        </ResponsiveContainer>
      );
      
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass(`max-w-${maxWidth}`);
    });
  });
});