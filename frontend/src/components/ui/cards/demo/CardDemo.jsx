/**
 * Card Components Demo
 * Comprehensive demonstration of all standardized card components
 */

import React, { useState } from 'react';
import { Typography, Space, Button, message, Avatar, Tag } from 'antd';
import { 
  StandardCard, 
  StatCard, 
  ActionCard, 
  InfoCard, 
  CardGrid 
} from '../index';
import { ActionButton } from '../../buttons';

const { Title, Paragraph, Text } = Typography;

const CardDemo = () => {
  const [loading, setLoading] = useState({});

  const handleAction = (actionName) => {
    message.success(`${actionName} action triggered!`);
  };

  const handleLoadingAction = (cardName, actionName) => {
    setLoading(prev => ({ ...prev, [cardName]: true }));
    setTimeout(() => {
      setLoading(prev => ({ ...prev, [cardName]: false }));
      message.success(`${actionName} completed!`);
    }, 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Title level={1}>Card Components Demo</Title>
      <Paragraph>
        Comprehensive demonstration of standardized card components with consistent styling and behavior.
      </Paragraph>

      {/* StandardCard Demo */}
      <div className="mb-8">
        <Title level={2}>StandardCard Component</Title>
        
        <Title level={3}>Basic Cards</Title>
        <CardGrid columns={{ xs: 1, sm: 2, lg: 3 }} gutter={[16, 16]} className="mb-6">
          <StandardCard title="Basic Card">
            <Paragraph>
              This is a basic StandardCard with default styling. It provides
              consistent spacing, typography, and visual hierarchy.
            </Paragraph>
          </StandardCard>

          <StandardCard 
            title="Card with Icon" 
            titleIconContext="status" 
            titleIconType="info"
          >
            <Paragraph>
              This card includes an icon in the title using the standardized
              icon mapping system.
            </Paragraph>
          </StandardCard>

          <StandardCard 
            title="Card with Subtitle" 
            subtitle="This is a helpful subtitle"
          >
            <Paragraph>
              Cards can include subtitles to provide additional context
              or categorization information.
            </Paragraph>
          </StandardCard>
        </CardGrid>

        <Title level={3}>Card Variants</Title>
        <CardGrid columns={{ xs: 1, sm: 2, lg: 4 }} gutter={[16, 16]} className="mb-6">
          <StandardCard title="Default" variant="default">
            <Text>Standard card styling with subtle shadow.</Text>
          </StandardCard>

          <StandardCard title="Elevated" variant="elevated">
            <Text>Enhanced shadow for important content.</Text>
          </StandardCard>

          <StandardCard title="Outlined" variant="outlined">
            <Text>Clear border definition for content separation.</Text>
          </StandardCard>

          <StandardCard title="Ghost" variant="ghost">
            <Text>Minimal styling with dashed border.</Text>
          </StandardCard>
        </CardGrid>

        <Title level={3}>Card Sizes and Padding</Title>
        <CardGrid columns={{ xs: 1, lg: 3 }} gutter={[16, 16]} className="mb-6">
          <StandardCard title="Small Card" size="small" padding="compact">
            <Text>Compact card with minimal padding for dense layouts.</Text>
          </StandardCard>

          <StandardCard title="Default Card" size="default" padding="comfortable">
            <Text>Standard card size with comfortable padding for most use cases.</Text>
          </StandardCard>

          <StandardCard title="Large Card" size="large" padding="spacious">
            <Text>Large card with spacious padding for detailed content and better readability.</Text>
          </StandardCard>
        </CardGrid>

        <Title level={3}>Interactive Cards</Title>
        <CardGrid columns={{ xs: 1, sm: 2 }} gutter={[16, 16]} className="mb-6">
          <StandardCard 
            title="Hoverable Card" 
            hoverable={true}
            titleIconContext="action"
            titleIconType="edit"
          >
            <Paragraph>
              This card has hover effects enabled. Try hovering over it
              to see the interactive animation.
            </Paragraph>
          </StandardCard>

          <StandardCard 
            title="Card with Actions"
            actions={[
              <ActionButton key="edit" action="edit" onClick={() => handleAction('Edit')} />,
              <ActionButton key="delete" action="delete" onClick={() => handleAction('Delete')} />,
            ]}
          >
            <Paragraph>
              Cards can include footer actions for common operations
              like edit, delete, or other contextual actions.
            </Paragraph>
          </StandardCard>
        </CardGrid>
      </div>

      {/* StatCard Demo */}
      <div className="mb-8">
        <Title level={2}>StatCard Component</Title>
        
        <Title level={3}>Basic Statistics</Title>
        <CardGrid columns={{ xs: 2, sm: 4 }} gutter={[16, 16]} className="mb-6">
          <StatCard
            title="Total Users"
            value={12345}
            iconContext="user"
            iconType="group"
            color="#1890ff"
          />

          <StatCard
            title="Revenue"
            value={98765}
            prefix="$"
            iconContext="business"
            iconType="money"
            color="#52c41a"
          />

          <StatCard
            title="Success Rate"
            value={95.8}
            suffix="%"
            precision={1}
            iconContext="status"
            iconType="success"
            color="#faad14"
          />

          <StatCard
            title="Active Sessions"
            value={1234}
            iconContext="status"
            iconType="active"
            color="#722ed1"
          />
        </CardGrid>

        <Title level={3}>Statistics with Trends</Title>
        <CardGrid columns={{ xs: 1, sm: 2, lg: 4 }} gutter={[16, 16]} className="mb-6">
          <StatCard
            title="Sales Growth"
            value={15420}
            prefix="$"
            trend="vs last month"
            trendValue="+12.5%"
            trendType="up"
            iconContext="business"
            iconType="growth"
            color="#52c41a"
          />

          <StatCard
            title="Error Rate"
            value={2.3}
            suffix="%"
            precision={1}
            trend="vs last week"
            trendValue="-0.8%"
            trendType="down"
            iconContext="status"
            iconType="error"
            color="#f5222d"
          />

          <StatCard
            title="Page Views"
            value={45678}
            trend="steady performance"
            trendType="neutral"
            iconContext="analytics"
            iconType="views"
            color="#1890ff"
          />

          <StatCard
            title="Conversion Rate"
            value={8.7}
            suffix="%"
            precision={1}
            trend="vs last quarter"
            trendValue="+2.1%"
            trendType="up"
            iconContext="business"
            iconType="conversion"
            color="#13c2c2"
          />
        </CardGrid>
      </div>

      {/* ActionCard Demo */}
      <div className="mb-8">
        <Title level={2}>ActionCard Component</Title>
        
        <Title level={3}>Cards with Header Actions</Title>
        <CardGrid columns={{ xs: 1, lg: 2 }} gutter={[16, 16]} className="mb-6">
          <ActionCard
            title="User Management"
            titleIconContext="user"
            titleIconType="manage"
            subtitle="Manage system users and permissions"
            primaryAction={{
              action: 'create',
              onClick: () => handleAction('Create User'),
              children: 'Add User'
            }}
            secondaryActions={[
              {
                action: 'search',
                onClick: () => handleAction('Search Users')
              },
              {
                action: 'filter',
                onClick: () => handleAction('Filter Users')
              }
            ]}
          >
            <Paragraph>
              This card demonstrates header actions with a primary action button
              and secondary action buttons for common operations.
            </Paragraph>
            <ul>
              <li>Create new users</li>
              <li>Search existing users</li>
              <li>Filter user lists</li>
              <li>Manage permissions</li>
            </ul>
          </ActionCard>

          <ActionCard
            title="Data Export"
            titleIconContext="action"
            titleIconType="export"
            subtitle="Export data in various formats"
            primaryAction={{
              action: 'export',
              onClick: () => handleLoadingAction('export', 'Export'),
              loading: loading.export,
              children: 'Export Data'
            }}
            loading={loading.export}
          >
            <Paragraph>
              This card shows a loading state when the primary action is triggered.
              The entire card can show loading state during operations.
            </Paragraph>
            <Space direction="vertical">
              <Text>Available formats:</Text>
              <div>
                <Tag>CSV</Tag>
                <Tag>JSON</Tag>
                <Tag>Excel</Tag>
                <Tag>PDF</Tag>
              </div>
            </Space>
          </ActionCard>
        </CardGrid>

        <Title level={3}>Cards with Footer Actions</Title>
        <CardGrid columns={{ xs: 1, lg: 2 }} gutter={[16, 16]} className="mb-6">
          <ActionCard
            title="Project Settings"
            titleIconContext="action"
            titleIconType="settings"
            footerActions={[
              {
                action: 'cancel',
                onClick: () => handleAction('Cancel')
              },
              {
                action: 'save',
                onClick: () => handleAction('Save Settings')
              }
            ]}
          >
            <Paragraph>
              This card demonstrates footer actions, commonly used for
              form-like interfaces or confirmation dialogs.
            </Paragraph>
            <Space direction="vertical" className="w-full">
              <div>
                <Text strong>Project Name:</Text>
                <Text className="ml-2">QuikRide Platform</Text>
              </div>
              <div>
                <Text strong>Environment:</Text>
                <Text className="ml-2">Production</Text>
              </div>
              <div>
                <Text strong>Last Updated:</Text>
                <Text className="ml-2">2 hours ago</Text>
              </div>
            </Space>
          </ActionCard>

          <ActionCard
            title="Team Collaboration"
            titleIconContext="user"
            titleIconType="team"
            primaryAction={{
              action: 'create',
              onClick: () => handleAction('Invite Member'),
              children: 'Invite'
            }}
            footerActions={[
              {
                action: 'edit',
                onClick: () => handleAction('Edit Team')
              },
              {
                action: 'delete',
                onClick: () => handleAction('Delete Team')
              }
            ]}
          >
            <Paragraph>
              Cards can have both header and footer actions for comprehensive
              interaction patterns.
            </Paragraph>
            <div className="flex items-center gap-2 mt-3">
              <Avatar.Group maxCount={4}>
                <Avatar>A</Avatar>
                <Avatar>B</Avatar>
                <Avatar>C</Avatar>
                <Avatar>D</Avatar>
                <Avatar>+2</Avatar>
              </Avatar.Group>
              <Text type="secondary">6 team members</Text>
            </div>
          </ActionCard>
        </CardGrid>
      </div>

      {/* InfoCard Demo */}
      <div className="mb-8">
        <Title level={2}>InfoCard Component</Title>
        
        <Title level={3}>Information Cards with Status</Title>
        <CardGrid columns={{ xs: 1, sm: 2 }} gutter={[16, 16]} className="mb-6">
          <InfoCard
            title="System Status"
            subtitle="All systems operational"
            description="All services are running normally with no reported issues."
            status="operational"
            statusType="success"
            iconContext="status"
            iconType="success"
            metadata={[
              { label: 'Uptime', value: '99.9%' },
              { label: 'Response Time', value: '45ms' },
              { label: 'Last Check', value: '2 minutes ago' }
            ]}
            tags={[
              { text: 'Production', color: 'green' },
              { text: 'Monitored', color: 'blue' }
            ]}
          />

          <InfoCard
            title="Maintenance Notice"
            subtitle="Scheduled maintenance window"
            description="System maintenance is scheduled for tonight from 2:00 AM to 4:00 AM EST. Some services may be temporarily unavailable."
            status="maintenance"
            statusType="warning"
            iconContext="status"
            iconType="warning"
            metadata={[
              { label: 'Start Time', value: '2:00 AM EST' },
              { label: 'Duration', value: '2 hours' },
              { label: 'Affected Services', value: 'API, Dashboard' }
            ]}
            tags={[
              { text: 'Scheduled', color: 'orange' },
              { text: 'Low Impact', color: 'blue' }
            ]}
          />
        </CardGrid>

        <Title level={3}>Error and Information Cards</Title>
        <CardGrid columns={{ xs: 1, sm: 2 }} gutter={[16, 16]} className="mb-6">
          <InfoCard
            title="Service Error"
            subtitle="Payment processing unavailable"
            description="The payment processing service is currently experiencing issues. Our team is working to resolve this as quickly as possible."
            status="error"
            statusType="error"
            iconContext="status"
            iconType="error"
            metadata={[
              { label: 'Error Code', value: 'PAY_001' },
              { label: 'Started', value: '15 minutes ago' },
              { label: 'Affected Users', value: '~150' }
            ]}
            tags={[
              { text: 'Critical', color: 'red' },
              { text: 'Investigating', color: 'orange' }
            ]}
          />

          <InfoCard
            title="Feature Update"
            subtitle="New dashboard features available"
            description="We've released new analytics features in the dashboard. Check out the improved charts and reporting capabilities."
            status="new"
            statusType="info"
            iconContext="status"
            iconType="info"
            metadata={[
              { label: 'Version', value: 'v2.1.0' },
              { label: 'Released', value: 'Today' },
              { label: 'Features', value: '5 new' }
            ]}
            tags={[
              { text: 'New', color: 'blue' },
              { text: 'Analytics', color: 'purple' },
              { text: 'Dashboard', color: 'cyan' }
            ]}
          />
        </CardGrid>
      </div>

      {/* CardGrid Demo */}
      <div className="mb-8">
        <Title level={2}>CardGrid Component</Title>
        
        <Title level={3}>Responsive Grid Layouts</Title>
        <Paragraph>
          CardGrid provides responsive layouts that adapt to different screen sizes.
        </Paragraph>

        <Title level={4}>Auto-fit Grid (4 columns on large screens)</Title>
        <CardGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} gutter={[16, 16]} className="mb-6">
          {Array.from({ length: 8 }, (_, i) => (
            <StandardCard key={i} title={`Card ${i + 1}`} size="small">
              <Text>Responsive card in auto-fit grid layout.</Text>
            </StandardCard>
          ))}
        </CardGrid>

        <Title level={4}>Fixed 3-Column Grid</Title>
        <CardGrid columns={3} gutter={[24, 24]} className="mb-6">
          <StatCard
            title="Metric A"
            value={1234}
            color="#1890ff"
            iconContext="analytics"
            iconType="chart"
          />
          <StatCard
            title="Metric B"
            value={5678}
            color="#52c41a"
            iconContext="analytics"
            iconType="growth"
          />
          <StatCard
            title="Metric C"
            value={9012}
            color="#faad14"
            iconContext="analytics"
            iconType="trend"
          />
        </CardGrid>

        <Title level={4}>Mixed Card Types in Grid</Title>
        <CardGrid columns={{ xs: 1, lg: 2 }} gutter={[20, 20]}>
          <ActionCard
            title="Quick Actions"
            titleIconContext="action"
            titleIconType="quick"
            primaryAction={{
              action: 'create',
              onClick: () => handleAction('Quick Create')
            }}
            footerActions={[
              { action: 'search', onClick: () => handleAction('Search') },
              { action: 'filter', onClick: () => handleAction('Filter') }
            ]}
          >
            <Paragraph>
              Mixed card types work seamlessly in grid layouts,
              maintaining consistent spacing and alignment.
            </Paragraph>
          </ActionCard>

          <InfoCard
            title="System Information"
            description="Current system status and important notifications for administrators."
            status="active"
            statusType="success"
            iconContext="system"
            iconType="info"
            metadata={[
              { label: 'Version', value: '1.0.0' },
              { label: 'Environment', value: 'Production' }
            ]}
            tags={[
              { text: 'Stable', color: 'green' },
              { text: 'Monitored', color: 'blue' }
            ]}
          />
        </CardGrid>
      </div>
    </div>
  );
};

export default CardDemo;