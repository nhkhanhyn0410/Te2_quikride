/**
 * ResponsiveDemo Component
 * Demonstrates responsive utility system functionality
 */

import React from 'react';
import { 
  ResponsiveContainer, 
  ResponsiveGrid, 
  ResponsiveText, 
  ResponsiveVisibility 
} from '../index';
import { Card, Button, Space } from 'antd';
import { useCurrentBreakpoint, useIsMobile } from '../../../../utils/responsive';

const ResponsiveDemo = () => {
  const currentBreakpoint = useCurrentBreakpoint();
  const isMobile = useIsMobile();

  return (
    <div className="p-6 space-y-8">
      <ResponsiveText heading={1} className="mb-6">
        Responsive Utility System Demo
      </ResponsiveText>

      {/* Breakpoint Information */}
      <Card title="Current Breakpoint Information">
        <Space direction="vertical">
          <ResponsiveText>
            Current Breakpoint: <strong>{currentBreakpoint}</strong>
          </ResponsiveText>
          <ResponsiveText>
            Is Mobile: <strong>{isMobile ? 'Yes' : 'No'}</strong>
          </ResponsiveText>
        </Space>
      </Card>

      {/* Responsive Container Demo */}
      <Card title="Responsive Container">
        <ResponsiveContainer size="lg" className="bg-blue-50 border-2 border-blue-200 rounded-lg">
          <ResponsiveText>
            This container has responsive padding that scales with screen size.
            It uses the 'lg' size variant for consistent spacing.
          </ResponsiveText>
        </ResponsiveContainer>
      </Card>

      {/* Responsive Grid Demo */}
      <Card title="Responsive Grid">
        <ResponsiveGrid 
          columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 6 }}
          gap="md"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <Card key={i} size="small" className="text-center">
              <ResponsiveText size="sm">Item {i + 1}</ResponsiveText>
            </Card>
          ))}
        </ResponsiveGrid>
      </Card>

      {/* Responsive Typography Demo */}
      <Card title="Responsive Typography">
        <Space direction="vertical" size="large" className="w-full">
          <ResponsiveText heading={1}>Responsive Heading 1</ResponsiveText>
          <ResponsiveText heading={2}>Responsive Heading 2</ResponsiveText>
          <ResponsiveText heading={3}>Responsive Heading 3</ResponsiveText>
          <ResponsiveText size="lg">Large responsive text</ResponsiveText>
          <ResponsiveText size="base">Base responsive text</ResponsiveText>
          <ResponsiveText size="sm">Small responsive text</ResponsiveText>
        </Space>
      </Card>

      {/* Responsive Visibility Demo */}
      <Card title="Responsive Visibility">
        <Space direction="vertical" size="large" className="w-full">
          <ResponsiveVisibility show={['mobile']}>
            <Card className="bg-green-50 border-green-200">
              <ResponsiveText color="green-700">
                📱 This content is only visible on mobile devices
              </ResponsiveText>
            </Card>
          </ResponsiveVisibility>

          <ResponsiveVisibility show={['tablet']}>
            <Card className="bg-blue-50 border-blue-200">
              <ResponsiveText color="blue-700">
                📱 This content is only visible on tablet devices
              </ResponsiveText>
            </Card>
          </ResponsiveVisibility>

          <ResponsiveVisibility show={['desktop']}>
            <Card className="bg-purple-50 border-purple-200">
              <ResponsiveText color="purple-700">
                🖥️ This content is only visible on desktop devices
              </ResponsiveText>
            </Card>
          </ResponsiveVisibility>

          <ResponsiveVisibility showUp="md">
            <Card className="bg-orange-50 border-orange-200">
              <ResponsiveText color="orange-700">
                📺 This content is visible from medium breakpoint and up
              </ResponsiveText>
            </Card>
          </ResponsiveVisibility>

          <ResponsiveVisibility hideUp="lg">
            <Card className="bg-red-50 border-red-200">
              <ResponsiveText color="red-700">
                📱 This content is hidden from large breakpoint and up
              </ResponsiveText>
            </Card>
          </ResponsiveVisibility>
        </Space>
      </Card>

      {/* Responsive Utility Classes Demo */}
      <Card title="Responsive Utility Classes">
        <Space direction="vertical" size="large" className="w-full">
          <div className="p-responsive-md bg-gray-100 rounded">
            <ResponsiveText>
              This div uses responsive padding (p-responsive-md)
            </ResponsiveText>
          </div>

          <div className="m-responsive-sm bg-gray-100 rounded p-4">
            <ResponsiveText>
              This div uses responsive margin (m-responsive-sm)
            </ResponsiveText>
          </div>

          <div className="gap-responsive-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card size="small">Responsive Gap Item 1</Card>
            <Card size="small">Responsive Gap Item 2</Card>
            <Card size="small">Responsive Gap Item 3</Card>
          </div>
        </Space>
      </Card>

      {/* Touch Target Demo */}
      <Card title="Touch-Friendly Targets">
        <Space wrap>
          <Button className="touch-target">Touch Target</Button>
          <Button className="touch-target-sm" size="small">Small Touch Target</Button>
          <Button className="touch-target-lg" size="large">Large Touch Target</Button>
        </Space>
      </Card>

      {/* Responsive Shadows and Borders */}
      <Card title="Responsive Visual Effects">
        <Space direction="vertical" size="large" className="w-full">
          <div className="shadow-responsive-md p-4 bg-white rounded-responsive-md">
            <ResponsiveText>Responsive shadow and border radius</ResponsiveText>
          </div>
          
          <div className="border-responsive rounded-responsive-lg p-4">
            <ResponsiveText>Responsive border width and radius</ResponsiveText>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default ResponsiveDemo;