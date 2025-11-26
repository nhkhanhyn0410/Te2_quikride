/**
 * Panel Components Demo
 * Demonstrates the usage of StandardPanel and related components
 */

import React from 'react';
import { Button, Space } from 'antd';
import { UserOutlined, SettingOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import StandardPanel from '../StandardPanel';

const PanelDemo = () => {
  return (
    <div className="p-6 space-y-6 bg-neutral-50 min-h-screen">
      <h1 className="text-2xl font-bold text-neutral-800 mb-8">StandardPanel Component Demo</h1>
      
      {/* Default Panel */}
      <StandardPanel
        variant="default"
        size="medium"
        header={{
          title: "Default Panel",
          subtitle: "This is a default panel with header and footer",
          icon: <UserOutlined />,
          actions: [
            <Button key="settings" type="text" icon={<SettingOutlined />} />,
          ],
        }}
        footer={{
          actions: [
            <Button key="cancel" type="default">Cancel</Button>,
            <Button key="save" type="primary" icon={<SaveOutlined />}>Save</Button>,
          ],
        }}
      >
        <div className="space-y-4">
          <p>This is the content of a default panel. It has a clean white background with a subtle border.</p>
          <p>The panel includes a header with title, subtitle, icon, and actions, plus a footer with action buttons.</p>
        </div>
      </StandardPanel>

      {/* Elevated Panel */}
      <StandardPanel
        variant="elevated"
        size="large"
        padding="spacious"
        header={{
          title: "Elevated Panel",
          subtitle: "This panel has enhanced shadow for prominence",
          icon: <SettingOutlined />,
        }}
      >
        <div className="space-y-4">
          <p>This is an elevated panel with enhanced shadow styling. It's great for important content that needs to stand out.</p>
          <p>This panel uses large size and spacious padding for a more prominent appearance.</p>
        </div>
      </StandardPanel>

      {/* Bordered Panel */}
      <StandardPanel
        variant="bordered"
        size="small"
        padding="compact"
        header={{
          title: "Bordered Panel",
          subtitle: "Clear border definition",
        }}
        footer={{
          actions: [
            <Button key="close" type="default" icon={<CloseOutlined />}>Close</Button>,
          ],
          align: "left",
        }}
      >
        <div>
          <p>This is a bordered panel with clear border definition. It uses small size and compact padding.</p>
        </div>
      </StandardPanel>

      {/* Ghost Panel */}
      <StandardPanel
        variant="ghost"
        size="medium"
        header={{
          title: "Ghost Panel",
          subtitle: "Minimal styling for secondary content",
        }}
      >
        <div>
          <p>This is a ghost panel with minimal styling. It's perfect for secondary content that doesn't need strong visual separation.</p>
        </div>
      </StandardPanel>

      {/* Loading Panel */}
      <StandardPanel
        variant="default"
        loading
        header={{
          title: "Loading Panel",
          subtitle: "Demonstrates loading state",
        }}
      >
        <div>
          <p>This content won't be visible while loading.</p>
        </div>
      </StandardPanel>

      {/* Empty Panel */}
      <StandardPanel
        variant="default"
        header={{
          title: "Empty Panel",
          subtitle: "Demonstrates empty state",
        }}
      >
        {/* No content to trigger empty state */}
      </StandardPanel>

      {/* Panel with Scrollable Content */}
      <StandardPanel
        variant="default"
        header={{
          title: "Scrollable Panel",
          subtitle: "Content with max height and scrolling",
        }}
      >
        <div className="space-y-4" style={{ height: '400px' }}>
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i}>
              This is line {i + 1} of scrollable content. The panel content area will show a scrollbar when content exceeds the available space.
            </p>
          ))}
        </div>
      </StandardPanel>
    </div>
  );
};

export default PanelDemo;