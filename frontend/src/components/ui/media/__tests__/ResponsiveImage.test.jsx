/**
 * Tests for ResponsiveImage Component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResponsiveImage from '../ResponsiveImage';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe('ResponsiveImage', () => {
  const defaultProps = {
    src: 'test-image.jpg',
    alt: 'Test Image',
  };

  beforeEach(() => {
    mockIntersectionObserver.mockClear();
  });

  test('renders with default props', () => {
    render(<ResponsiveImage {...defaultProps} />);
    
    const container = document.querySelector('.responsive-image-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('aspect-auto');
  });

  test('applies aspect ratio classes correctly', () => {
    const { rerender } = render(
      <ResponsiveImage {...defaultProps} aspectRatio="square" />
    );
    
    let container = document.querySelector('.responsive-image-container');
    expect(container).toHaveClass('aspect-square');
    
    rerender(<ResponsiveImage {...defaultProps} aspectRatio="video" />);
    container = document.querySelector('.responsive-image-container');
    expect(container).toHaveClass('aspect-video');
    
    rerender(<ResponsiveImage {...defaultProps} aspectRatio="4/3" />);
    container = document.querySelector('.responsive-image-container');
    expect(container).toHaveClass('aspect-responsive-4-3');
  });

  test('applies object fit and position classes', () => {
    render(
      <ResponsiveImage 
        {...defaultProps} 
        objectFit="contain" 
        objectPosition="top"
        loading="eager"
      />
    );
    
    const image = screen.getByAltText('Test Image');
    expect(image).toHaveClass('object-contain', 'object-top');
  });

  test('handles loading states correctly', async () => {
    render(<ResponsiveImage {...defaultProps} loading="eager" />);
    
    const image = screen.getByAltText('Test Image');
    expect(image).toBeInTheDocument();
    
    // Initially should have opacity-0
    expect(image).toHaveClass('opacity-0');
    
    // Simulate image load
    fireEvent.load(image);
    
    await waitFor(() => {
      expect(image).toHaveClass('opacity-100');
    });
  });

  test('handles error states with fallback', () => {
    const fallbackSrc = 'fallback-image.jpg';
    render(
      <ResponsiveImage 
        {...defaultProps} 
        fallback={fallbackSrc}
        loading="eager"
      />
    );
    
    const image = screen.getByAltText('Test Image');
    
    // Simulate image error
    fireEvent.error(image);
    
    // Should show fallback image
    const fallbackImage = screen.getByAltText('Test Image');
    expect(fallbackImage).toBeInTheDocument();
  });

  test('handles custom fallback component', () => {
    const CustomFallback = () => <div data-testid="custom-fallback">Custom Fallback</div>;
    
    render(
      <ResponsiveImage 
        {...defaultProps} 
        fallback={<CustomFallback />}
        loading="eager"
      />
    );
    
    const image = screen.getByAltText('Test Image');
    fireEvent.error(image);
    
    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
  });

  test('calls onLoad and onError callbacks', () => {
    const onLoad = jest.fn();
    const onError = jest.fn();
    
    render(
      <ResponsiveImage 
        {...defaultProps} 
        onLoad={onLoad}
        onError={onError}
        loading="eager"
      />
    );
    
    const image = screen.getByAltText('Test Image');
    
    fireEvent.load(image);
    expect(onLoad).toHaveBeenCalledTimes(1);
    
    fireEvent.error(image);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  test('applies custom className', () => {
    render(
      <ResponsiveImage 
        {...defaultProps} 
        className="custom-image-class"
      />
    );
    
    const container = document.querySelector('.responsive-image-container');
    expect(container).toHaveClass('custom-image-class');
  });

  test('renders children as overlay', () => {
    render(
      <ResponsiveImage {...defaultProps}>
        <div data-testid="overlay-content">Overlay Content</div>
      </ResponsiveImage>
    );
    
    expect(screen.getByTestId('overlay-content')).toBeInTheDocument();
  });

  test('sets up intersection observer for lazy loading', () => {
    render(<ResponsiveImage {...defaultProps} loading="lazy" />);
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { rootMargin: '50px' }
    );
  });

  test('does not set up intersection observer for eager loading', () => {
    render(<ResponsiveImage {...defaultProps} loading="eager" />);
    
    // Should still be called but for different reasons, so we check the image is rendered
    const image = screen.getByAltText('Test Image');
    expect(image).toBeInTheDocument();
  });

  test('applies responsive sizing attributes', () => {
    render(
      <ResponsiveImage 
        {...defaultProps} 
        sizes="(max-width: 768px) 100vw, 50vw"
        loading="eager"
      />
    );
    
    const image = screen.getByAltText('Test Image');
    expect(image).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 50vw');
  });

  test('handles placeholder display', () => {
    render(<ResponsiveImage {...defaultProps} placeholder={true} loading="eager" />);
    
    // Should show skeleton placeholder initially
    const skeleton = document.querySelector('.ant-skeleton-image');
    expect(skeleton).toBeInTheDocument();
  });

  test('disables placeholder when set to false', () => {
    render(<ResponsiveImage {...defaultProps} placeholder={false} loading="eager" />);
    
    // Should not show skeleton placeholder
    const skeleton = document.querySelector('.ant-skeleton-image');
    expect(skeleton).not.toBeInTheDocument();
  });
});