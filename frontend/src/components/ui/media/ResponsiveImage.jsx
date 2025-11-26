/**
 * ResponsiveImage Component
 * Responsive image with proper aspect ratio handling and lazy loading
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Skeleton } from 'antd';
import classNames from 'classnames';

const ResponsiveImage = ({
  src,
  alt,
  aspectRatio = 'auto',
  sizes = '100vw',
  loading = 'lazy',
  placeholder = true,
  fallback,
  className,
  objectFit = 'cover',
  objectPosition = 'center',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(loading !== 'lazy');
  const imgRef = useRef(null);
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

  // Object fit class mapping
  const objectFitClasses = {
    'contain': 'object-contain',
    'cover': 'object-cover',
    'fill': 'object-fill',
    'none': 'object-none',
    'scale-down': 'object-scale-down',
  };

  // Object position class mapping
  const objectPositionClasses = {
    'center': 'object-center',
    'top': 'object-top',
    'bottom': 'object-bottom',
    'left': 'object-left',
    'right': 'object-right',
    'left-top': 'object-left-top',
    'left-bottom': 'object-left-bottom',
    'right-top': 'object-right-top',
    'right-bottom': 'object-right-bottom',
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'lazy' && imgRef.current) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        },
        {
          rootMargin: '50px', // Start loading 50px before image comes into view
        }
      );

      observerRef.current.observe(imgRef.current);

      return () => {
        observerRef.current?.disconnect();
      };
    }
  }, [loading]);

  const handleLoad = (event) => {
    setIsLoaded(true);
    onLoad?.(event);
  };

  const handleError = (event) => {
    setHasError(true);
    onError?.(event);
  };

  const containerClassName = classNames(
    'responsive-image-container',
    'relative',
    'overflow-hidden',
    'bg-gray-100',
    aspectRatioClasses[aspectRatio] || aspectRatio,
    className
  );

  const imageClassName = classNames(
    'responsive-image',
    'w-full',
    'h-full',
    'transition-opacity',
    'duration-300',
    objectFitClasses[objectFit],
    objectPositionClasses[objectPosition],
    {
      'opacity-0': !isLoaded && !hasError,
      'opacity-100': isLoaded || hasError,
    }
  );

  const shouldShowPlaceholder = placeholder && !isLoaded && !hasError && isInView;
  const shouldShowFallback = hasError && fallback;
  const shouldShowImage = isInView && !hasError;

  return (
    <div ref={imgRef} className={containerClassName} {...props}>
      {/* Loading Placeholder */}
      {shouldShowPlaceholder && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton.Image 
            active 
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}

      {/* Error Fallback */}
      {shouldShowFallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          {typeof fallback === 'string' ? (
            <img
              src={fallback}
              alt={alt}
              className={imageClassName}
              onLoad={handleLoad}
            />
          ) : (
            fallback
          )}
        </div>
      )}

      {/* Main Image */}
      {shouldShowImage && (
        <img
          src={src}
          alt={alt}
          className={imageClassName}
          sizes={sizes}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          decoding="async"
        />
      )}

      {/* Overlay for additional content */}
      {props.children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {props.children}
        </div>
      )}
    </div>
  );
};

ResponsiveImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  aspectRatio: PropTypes.oneOfType([
    PropTypes.oneOf(['auto', 'square', 'video', '4/3', '3/2', '16/9']),
    PropTypes.string, // Custom aspect ratio class
  ]),
  sizes: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  placeholder: PropTypes.bool,
  fallback: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  className: PropTypes.string,
  objectFit: PropTypes.oneOf(['contain', 'cover', 'fill', 'none', 'scale-down']),
  objectPosition: PropTypes.oneOf([
    'center', 'top', 'bottom', 'left', 'right',
    'left-top', 'left-bottom', 'right-top', 'right-bottom'
  ]),
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  children: PropTypes.node,
};

export default ResponsiveImage;