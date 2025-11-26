/**
 * MediaGallery Component
 * Responsive media gallery with lazy loading and lightbox functionality
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import { LeftOutlined, RightOutlined, CloseOutlined } from '@ant-design/icons';
import ResponsiveImage from './ResponsiveImage';
import ResponsiveVideo from './ResponsiveVideo';
import { ResponsiveGrid } from '../responsive';
import classNames from 'classnames';

const MediaGallery = ({
  items = [],
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 'md',
  aspectRatio = 'square',
  lightbox = true,
  className,
  ...props
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index) => {
    if (lightbox) {
      setCurrentIndex(index);
      setLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      goToPrevious();
    } else if (event.key === 'ArrowRight') {
      goToNext();
    } else if (event.key === 'Escape') {
      closeLightbox();
    }
  };

  const galleryClassName = classNames(
    'media-gallery',
    className
  );

  const currentItem = items[currentIndex];

  const renderMediaItem = (item, index) => {
    const { type, src, alt, poster, thumbnail, ...itemProps } = item;

    const itemClassName = classNames(
      'media-gallery-item',
      'cursor-pointer',
      'transition-transform',
      'duration-200',
      'hover:scale-105',
      'rounded-responsive-md',
      'overflow-hidden'
    );

    const handleClick = () => {
      openLightbox(index);
    };

    if (type === 'video') {
      return (
        <div key={index} className={itemClassName} onClick={handleClick}>
          <ResponsiveVideo
            src={src}
            poster={poster || thumbnail}
            aspectRatio={aspectRatio}
            controls={false}
            autoPlay={false}
            muted={true}
            {...itemProps}
          />
        </div>
      );
    }

    return (
      <div key={index} className={itemClassName} onClick={handleClick}>
        <ResponsiveImage
          src={thumbnail || src}
          alt={alt || `Media item ${index + 1}`}
          aspectRatio={aspectRatio}
          objectFit="cover"
          loading="lazy"
          {...itemProps}
        />
      </div>
    );
  };

  const renderLightboxContent = () => {
    if (!currentItem) return null;

    const { type, src, alt, poster } = currentItem;

    if (type === 'video') {
      return (
        <ResponsiveVideo
          src={src}
          poster={poster}
          aspectRatio="auto"
          controls={true}
          autoPlay={true}
          className="max-w-full max-h-[80vh]"
        />
      );
    }

    return (
      <ResponsiveImage
        src={src}
        alt={alt || `Media item ${currentIndex + 1}`}
        aspectRatio="auto"
        objectFit="contain"
        className="max-w-full max-h-[80vh]"
        loading="eager"
      />
    );
  };

  return (
    <>
      <div className={galleryClassName} {...props}>
        <ResponsiveGrid columns={columns} gap={gap}>
          {items.map(renderMediaItem)}
        </ResponsiveGrid>
      </div>

      {/* Lightbox Modal */}
      {lightbox && (
        <Modal
          open={lightboxOpen}
          onCancel={closeLightbox}
          footer={null}
          width="90vw"
          style={{ top: 20 }}
          className="media-lightbox"
          closeIcon={
            <Button
              type="text"
              icon={<CloseOutlined />}
              className="touch-target text-white hover:text-gray-300"
              style={{ fontSize: '24px' }}
            />
          }
          onKeyDown={handleKeyDown}
        >
          <div className="relative flex items-center justify-center min-h-[60vh]">
            {/* Previous Button */}
            {items.length > 1 && (
              <Button
                type="text"
                icon={<LeftOutlined />}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 touch-target-lg text-white hover:text-gray-300"
                onClick={goToPrevious}
                style={{ fontSize: '32px' }}
              />
            )}

            {/* Media Content */}
            <div className="flex items-center justify-center w-full">
              {renderLightboxContent()}
            </div>

            {/* Next Button */}
            {items.length > 1 && (
              <Button
                type="text"
                icon={<RightOutlined />}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 touch-target-lg text-white hover:text-gray-300"
                onClick={goToNext}
                style={{ fontSize: '32px' }}
              />
            )}

            {/* Counter */}
            {items.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {items.length}
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

MediaGallery.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['image', 'video']),
      src: PropTypes.string.isRequired,
      alt: PropTypes.string,
      poster: PropTypes.string, // For videos
      thumbnail: PropTypes.string, // Thumbnail for gallery view
    })
  ).isRequired,
  columns: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object, // { xs: 1, sm: 2, md: 3, lg: 4 }
  ]),
  gap: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  aspectRatio: PropTypes.oneOfType([
    PropTypes.oneOf(['auto', 'square', 'video', '4/3', '3/2', '16/9']),
    PropTypes.string,
  ]),
  lightbox: PropTypes.bool,
  className: PropTypes.string,
};

export default MediaGallery;