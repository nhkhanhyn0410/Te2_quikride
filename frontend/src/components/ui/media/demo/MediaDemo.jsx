/**
 * MediaDemo Component
 * Demonstrates responsive media components functionality
 */

import React from 'react';
import { Card, Space, Button } from 'antd';
import { 
  ResponsiveImage, 
  ResponsiveVideo, 
  ResponsiveIcon, 
  MediaGallery 
} from '../index';
import { ResponsiveContainer, ResponsiveText } from '../../responsive';
import { PlayCircleOutlined, HeartOutlined, StarOutlined } from '@ant-design/icons';

const MediaDemo = () => {
  // Sample media items for gallery
  const galleryItems = [
    {
      type: 'image',
      src: 'https://picsum.photos/800/600?random=1',
      alt: 'Sample Image 1',
      thumbnail: 'https://picsum.photos/400/300?random=1',
    },
    {
      type: 'image',
      src: 'https://picsum.photos/800/600?random=2',
      alt: 'Sample Image 2',
      thumbnail: 'https://picsum.photos/400/300?random=2',
    },
    {
      type: 'video',
      src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      poster: 'https://picsum.photos/800/600?random=3',
      thumbnail: 'https://picsum.photos/400/300?random=3',
    },
    {
      type: 'image',
      src: 'https://picsum.photos/800/600?random=4',
      alt: 'Sample Image 3',
      thumbnail: 'https://picsum.photos/400/300?random=4',
    },
    {
      type: 'image',
      src: 'https://picsum.photos/800/600?random=5',
      alt: 'Sample Image 4',
      thumbnail: 'https://picsum.photos/400/300?random=5',
    },
    {
      type: 'image',
      src: 'https://picsum.photos/800/600?random=6',
      alt: 'Sample Image 5',
      thumbnail: 'https://picsum.photos/400/300?random=6',
    },
  ];

  return (
    <ResponsiveContainer size="lg" className="space-y-8">
      <ResponsiveText heading={1} className="mb-6">
        Responsive Media Components Demo
      </ResponsiveText>

      {/* Responsive Image Demo */}
      <Card title="Responsive Images">
        <Space direction="vertical" size="large" className="w-full">
          <div>
            <ResponsiveText heading={3} className="mb-4">
              Different Aspect Ratios
            </ResponsiveText>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <ResponsiveText size="sm" className="mb-2">Square (1:1)</ResponsiveText>
                <ResponsiveImage
                  src="https://picsum.photos/400/400?random=10"
                  alt="Square Image"
                  aspectRatio="square"
                  className="w-full"
                />
              </div>
              <div>
                <ResponsiveText size="sm" className="mb-2">Video (16:9)</ResponsiveText>
                <ResponsiveImage
                  src="https://picsum.photos/800/450?random=11"
                  alt="Video Aspect Image"
                  aspectRatio="video"
                  className="w-full"
                />
              </div>
              <div>
                <ResponsiveText size="sm" className="mb-2">4:3 Ratio</ResponsiveText>
                <ResponsiveImage
                  src="https://picsum.photos/800/600?random=12"
                  alt="4:3 Aspect Image"
                  aspectRatio="4/3"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div>
            <ResponsiveText heading={3} className="mb-4">
              Object Fit Options
            </ResponsiveText>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <ResponsiveText size="sm" className="mb-2">Cover</ResponsiveText>
                <ResponsiveImage
                  src="https://picsum.photos/800/400?random=13"
                  alt="Cover Fit"
                  aspectRatio="square"
                  objectFit="cover"
                  className="w-full"
                />
              </div>
              <div>
                <ResponsiveText size="sm" className="mb-2">Contain</ResponsiveText>
                <ResponsiveImage
                  src="https://picsum.photos/800/400?random=14"
                  alt="Contain Fit"
                  aspectRatio="square"
                  objectFit="contain"
                  className="w-full bg-gray-100"
                />
              </div>
              <div>
                <ResponsiveText size="sm" className="mb-2">With Fallback</ResponsiveText>
                <ResponsiveImage
                  src="invalid-image-url.jpg"
                  alt="Image with Fallback"
                  aspectRatio="square"
                  fallback="https://picsum.photos/400/400?random=15"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </Space>
      </Card>

      {/* Responsive Video Demo */}
      <Card title="Responsive Videos">
        <Space direction="vertical" size="large" className="w-full">
          <div>
            <ResponsiveText heading={3} className="mb-4">
              Video Player with Custom Controls
            </ResponsiveText>
            <div className="max-w-2xl">
              <ResponsiveVideo
                src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
                poster="https://picsum.photos/1280/720?random=20"
                aspectRatio="video"
                controls={true}
                muted={true}
              />
            </div>
          </div>

          <div>
            <ResponsiveText heading={3} className="mb-4">
              Different Aspect Ratios
            </ResponsiveText>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ResponsiveText size="sm" className="mb-2">Square Video</ResponsiveText>
                <ResponsiveVideo
                  src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
                  poster="https://picsum.photos/400/400?random=21"
                  aspectRatio="square"
                  controls={true}
                  muted={true}
                />
              </div>
              <div>
                <ResponsiveText size="sm" className="mb-2">4:3 Video</ResponsiveText>
                <ResponsiveVideo
                  src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
                  poster="https://picsum.photos/800/600?random=22"
                  aspectRatio="4/3"
                  controls={true}
                  muted={true}
                />
              </div>
            </div>
          </div>
        </Space>
      </Card>

      {/* Responsive Icon Demo */}
      <Card title="Responsive Icons">
        <Space direction="vertical" size="large" className="w-full">
          <div>
            <ResponsiveText heading={3} className="mb-4">
              Icon Sizes (Responsive)
            </ResponsiveText>
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-center">
                <ResponsiveIcon icon={PlayCircleOutlined} size="xs" color="primary" />
                <ResponsiveText size="xs" className="mt-1">XS</ResponsiveText>
              </div>
              <div className="text-center">
                <ResponsiveIcon icon={PlayCircleOutlined} size="sm" color="primary" />
                <ResponsiveText size="xs" className="mt-1">SM</ResponsiveText>
              </div>
              <div className="text-center">
                <ResponsiveIcon icon={PlayCircleOutlined} size="base" color="primary" />
                <ResponsiveText size="xs" className="mt-1">Base</ResponsiveText>
              </div>
              <div className="text-center">
                <ResponsiveIcon icon={PlayCircleOutlined} size="lg" color="primary" />
                <ResponsiveText size="xs" className="mt-1">LG</ResponsiveText>
              </div>
              <div className="text-center">
                <ResponsiveIcon icon={PlayCircleOutlined} size="xl" color="primary" />
                <ResponsiveText size="xs" className="mt-1">XL</ResponsiveText>
              </div>
              <div className="text-center">
                <ResponsiveIcon icon={PlayCircleOutlined} size="2xl" color="primary" />
                <ResponsiveText size="xs" className="mt-1">2XL</ResponsiveText>
              </div>
            </div>
          </div>

          <div>
            <ResponsiveText heading={3} className="mb-4">
              Icon Colors
            </ResponsiveText>
            <div className="flex flex-wrap items-center gap-4">
              <ResponsiveIcon icon={HeartOutlined} size="xl" color="primary" />
              <ResponsiveIcon icon={HeartOutlined} size="xl" color="success" />
              <ResponsiveIcon icon={HeartOutlined} size="xl" color="warning" />
              <ResponsiveIcon icon={HeartOutlined} size="xl" color="error" />
              <ResponsiveIcon icon={HeartOutlined} size="xl" color="secondary" />
            </div>
          </div>

          <div>
            <ResponsiveText heading={3} className="mb-4">
              String Icons (Emoji)
            </ResponsiveText>
            <div className="flex flex-wrap items-center gap-4">
              <ResponsiveIcon icon="🚀" size="xl" />
              <ResponsiveIcon icon="⭐" size="xl" />
              <ResponsiveIcon icon="🎯" size="xl" />
              <ResponsiveIcon icon="💎" size="xl" />
              <ResponsiveIcon icon="🔥" size="xl" />
            </div>
          </div>
        </Space>
      </Card>

      {/* Media Gallery Demo */}
      <Card title="Media Gallery">
        <Space direction="vertical" size="large" className="w-full">
          <div>
            <ResponsiveText heading={3} className="mb-4">
              Responsive Gallery with Lightbox
            </ResponsiveText>
            <ResponsiveText className="mb-4" color="neutral-600">
              Click on any image or video to open in lightbox mode. Use arrow keys or buttons to navigate.
            </ResponsiveText>
            <MediaGallery
              items={galleryItems}
              columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
              gap="md"
              aspectRatio="square"
              lightbox={true}
            />
          </div>

          <div>
            <ResponsiveText heading={3} className="mb-4">
              Different Grid Layouts
            </ResponsiveText>
            <div className="space-y-6">
              <div>
                <ResponsiveText size="sm" className="mb-2">2 Columns Max</ResponsiveText>
                <MediaGallery
                  items={galleryItems.slice(0, 4)}
                  columns={{ xs: 1, sm: 2 }}
                  gap="sm"
                  aspectRatio="video"
                  lightbox={false}
                />
              </div>
            </div>
          </div>
        </Space>
      </Card>

      {/* Integration Demo */}
      <Card title="Integration Example">
        <Space direction="vertical" size="large" className="w-full">
          <ResponsiveText heading={3} className="mb-4">
            Media Components in Action
          </ResponsiveText>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <ResponsiveImage
                src="https://picsum.photos/800/600?random=30"
                alt="Featured Content"
                aspectRatio="video"
                className="w-full mb-4"
              >
                <div className="absolute top-4 left-4">
                  <Button 
                    type="primary" 
                    icon={<ResponsiveIcon icon={StarOutlined} size="sm" />}
                    className="touch-target"
                  >
                    Featured
                  </Button>
                </div>
              </ResponsiveImage>
              
              <ResponsiveText heading={4} className="mb-2">
                Beautiful Landscape
              </ResponsiveText>
              <ResponsiveText color="neutral-600">
                This is an example of how responsive media components can be integrated 
                with other UI elements to create rich, interactive experiences.
              </ResponsiveText>
            </div>

            <div>
              <ResponsiveVideo
                src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
                poster="https://picsum.photos/800/600?random=31"
                aspectRatio="video"
                controls={true}
                muted={true}
                className="w-full mb-4"
              />
              
              <ResponsiveText heading={4} className="mb-2">
                Sample Video Content
              </ResponsiveText>
              <ResponsiveText color="neutral-600">
                Videos automatically adapt to different screen sizes while maintaining 
                proper aspect ratios and providing touch-friendly controls.
              </ResponsiveText>
            </div>
          </div>
        </Space>
      </Card>
    </ResponsiveContainer>
  );
};

export default MediaDemo;