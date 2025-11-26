/**
 * ResponsiveVideo Component
 * Responsive video player with proper aspect ratio and controls
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Spin } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, SoundOutlined, SoundFilled } from '@ant-design/icons';
import classNames from 'classnames';

const ResponsiveVideo = ({
  src,
  poster,
  aspectRatio = 'video',
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  playsInline = true,
  loading = 'lazy',
  className,
  onPlay,
  onPause,
  onEnded,
  onLoadStart,
  onLoadedData,
  onError,
  ...props
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(loading !== 'lazy');
  const videoRef = useRef(null);
  const observerRef = useRef(null);

  // Aspect ratio class mapping
  const aspectRatioClasses = {
    'auto': 'aspect-auto',
    'square': 'aspect-square',
    'video': 'aspect-video',
    '4/3': 'aspect-responsive-4-3',
    '3/2': 'aspect-responsive-3-2',
    '16/9': 'aspect-responsive-16-9',
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'lazy' && videoRef.current) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        },
        {
          rootMargin: '50px',
        }
      );

      observerRef.current.observe(videoRef.current);

      return () => {
        observerRef.current?.disconnect();
      };
    }
  }, [loading]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      onPlay?.();
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLoadStart = (event) => {
    setIsLoading(true);
    onLoadStart?.(event);
  };

  const handleLoadedData = (event) => {
    setIsLoading(false);
    onLoadedData?.(event);
  };

  const handleEnded = (event) => {
    setIsPlaying(false);
    onEnded?.(event);
  };

  const handleError = (event) => {
    setHasError(true);
    setIsLoading(false);
    onError?.(event);
  };

  const containerClassName = classNames(
    'responsive-video-container',
    'relative',
    'overflow-hidden',
    'bg-black',
    'rounded-responsive-md',
    aspectRatioClasses[aspectRatio] || aspectRatio,
    className
  );

  const videoClassName = classNames(
    'responsive-video',
    'w-full',
    'h-full',
    'object-cover'
  );

  const controlsClassName = classNames(
    'absolute',
    'inset-0',
    'flex',
    'items-center',
    'justify-center',
    'bg-black',
    'bg-opacity-30',
    'transition-opacity',
    'duration-300',
    {
      'opacity-0 hover:opacity-100': isPlaying && !isLoading,
      'opacity-100': !isPlaying || isLoading,
    }
  );

  return (
    <div ref={videoRef} className={containerClassName} {...props}>
      {/* Video Element */}
      {isInView && !hasError && (
        <video
          ref={videoRef}
          className={videoClassName}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          controls={!controls} // Hide native controls if we're showing custom ones
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleEnded}
          onLoadStart={handleLoadStart}
          onLoadedData={handleLoadedData}
          onError={handleError}
        >
          <source src={src} />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Custom Controls */}
      {controls && isInView && !hasError && (
        <div className={controlsClassName}>
          <div className="flex items-center gap-4">
            {/* Loading Spinner */}
            {isLoading && (
              <Spin size="large" className="text-white" />
            )}

            {/* Play/Pause Button */}
            {!isLoading && (
              <Button
                type="text"
                size="large"
                className="touch-target-lg text-white hover:text-blue-400 border-0"
                icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                onClick={handleTogglePlay}
                style={{ fontSize: '48px' }}
              />
            )}

            {/* Mute Button */}
            {!isLoading && (
              <Button
                type="text"
                size="large"
                className="touch-target text-white hover:text-blue-400 border-0 absolute bottom-4 right-4"
                icon={isMuted ? <SoundOutlined /> : <SoundFilled />}
                onClick={handleToggleMute}
                style={{ fontSize: '24px' }}
              />
            )}
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">⚠️</div>
            <div>Video could not be loaded</div>
          </div>
        </div>
      )}

      {/* Poster Image for Lazy Loading */}
      {!isInView && poster && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}
    </div>
  );
};

ResponsiveVideo.propTypes = {
  src: PropTypes.string.isRequired,
  poster: PropTypes.string,
  aspectRatio: PropTypes.oneOfType([
    PropTypes.oneOf(['auto', 'square', 'video', '4/3', '3/2', '16/9']),
    PropTypes.string,
  ]),
  autoPlay: PropTypes.bool,
  muted: PropTypes.bool,
  loop: PropTypes.bool,
  controls: PropTypes.bool,
  playsInline: PropTypes.bool,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  className: PropTypes.string,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onEnded: PropTypes.func,
  onLoadStart: PropTypes.func,
  onLoadedData: PropTypes.func,
  onError: PropTypes.func,
};

export default ResponsiveVideo;