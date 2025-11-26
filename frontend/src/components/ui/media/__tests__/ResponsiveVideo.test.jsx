/**
 * Tests for ResponsiveVideo Component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResponsiveVideo from '../ResponsiveVideo';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock HTMLMediaElement methods
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: jest.fn().mockImplementation(() => Promise.resolve()),
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: jest.fn(),
});

describe('ResponsiveVideo', () => {
  const defaultProps = {
    src: 'test-video.mp4',
  };

  beforeEach(() => {
    mockIntersectionObserver.mockClear();
    HTMLMediaElement.prototype.play.mockClear();
    HTMLMediaElement.prototype.pause.mockClear();
  });

  test('renders with default props', () => {
    render(<ResponsiveVideo {...defaultProps} />);
    
    const container = document.querySelector('.responsive-video-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('aspect-video');
  });

  test('applies aspect ratio classes correctly', () => {
    const { rerender } = render(
      <ResponsiveVideo {...defaultProps} aspectRatio="square" />
    );
    
    let container = document.querySelector('.responsive-video-container');
    expect(container).toHaveClass('aspect-square');
    
    rerender(<ResponsiveVideo {...defaultProps} aspectRatio="4/3" />);
    container = document.querySelector('.responsive-video-container');
    expect(container).toHaveClass('aspect-responsive-4-3');
  });

  test('renders video element with correct attributes', () => {
    render(
      <ResponsiveVideo 
        {...defaultProps} 
        poster="poster.jpg"
        autoPlay={true}
        muted={true}
        loop={true}
        playsInline={true}
        loading="eager"
      />
    );
    
    const video = screen.getByRole('application'); // video elements have application role
    expect(video).toHaveAttribute('poster', 'poster.jpg');
    expect(video).toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('muted');
    expect(video).toHaveAttribute('loop');
    expect(video).toHaveAttribute('playsinline');
  });

  test('handles play/pause functionality', async () => {
    render(<ResponsiveVideo {...defaultProps} loading="eager" />);
    
    const playButton = screen.getByRole('button');
    
    // Initially should show play button
    expect(playButton.querySelector('.anticon-play-circle')).toBeInTheDocument();
    
    // Click play button
    fireEvent.click(playButton);
    
    await waitFor(() => {
      expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    });
  });

  test('handles mute/unmute functionality', () => {
    render(<ResponsiveVideo {...defaultProps} loading="eager" />);
    
    const muteButton = screen.getAllByRole('button')[1]; // Second button is mute
    
    // Click mute button
    fireEvent.click(muteButton);
    
    // Should toggle mute state
    expect(muteButton.querySelector('.anticon-sound')).toBeInTheDocument();
  });

  test('calls event callbacks correctly', () => {
    const onPlay = jest.fn();
    const onPause = jest.fn();
    const onEnded = jest.fn();
    const onLoadStart = jest.fn();
    const onLoadedData = jest.fn();
    const onError = jest.fn();
    
    render(
      <ResponsiveVideo 
        {...defaultProps} 
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onLoadStart={onLoadStart}
        onLoadedData={onLoadedData}
        onError={onError}
        loading="eager"
      />
    );
    
    const video = screen.getByRole('application');
    
    fireEvent.loadStart(video);
    expect(onLoadStart).toHaveBeenCalledTimes(1);
    
    fireEvent.loadedData(video);
    expect(onLoadedData).toHaveBeenCalledTimes(1);
    
    fireEvent.ended(video);
    expect(onEnded).toHaveBeenCalledTimes(1);
    
    fireEvent.error(video);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  test('shows loading spinner during load', () => {
    render(<ResponsiveVideo {...defaultProps} loading="eager" />);
    
    const video = screen.getByRole('application');
    
    // Trigger loading state
    fireEvent.loadStart(video);
    
    const spinner = document.querySelector('.ant-spin');
    expect(spinner).toBeInTheDocument();
  });

  test('shows error state on video error', () => {
    render(<ResponsiveVideo {...defaultProps} loading="eager" />);
    
    const video = screen.getByRole('application');
    
    // Trigger error state
    fireEvent.error(video);
    
    expect(screen.getByText('Video could not be loaded')).toBeInTheDocument();
  });

  test('hides custom controls when controls=false', () => {
    render(<ResponsiveVideo {...defaultProps} controls={false} loading="eager" />);
    
    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });

  test('sets up intersection observer for lazy loading', () => {
    render(<ResponsiveVideo {...defaultProps} loading="lazy" />);
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { rootMargin: '50px' }
    );
  });

  test('shows poster image for lazy loading', () => {
    const { container } = render(
      <ResponsiveVideo 
        {...defaultProps} 
        poster="poster.jpg" 
        loading="lazy" 
      />
    );
    
    const posterDiv = container.querySelector('[style*="background-image"]');
    expect(posterDiv).toBeInTheDocument();
    expect(posterDiv).toHaveStyle('background-image: url(poster.jpg)');
  });

  test('applies custom className', () => {
    render(
      <ResponsiveVideo 
        {...defaultProps} 
        className="custom-video-class"
      />
    );
    
    const container = document.querySelector('.responsive-video-container');
    expect(container).toHaveClass('custom-video-class');
  });

  test('handles touch-friendly button sizes', () => {
    render(<ResponsiveVideo {...defaultProps} loading="eager" />);
    
    const buttons = screen.getAllByRole('button');
    
    // Play button should have large touch target
    expect(buttons[0]).toHaveClass('touch-target-lg');
    
    // Mute button should have default touch target
    expect(buttons[1]).toHaveClass('touch-target');
  });
});