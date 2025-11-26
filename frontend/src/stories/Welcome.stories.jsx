import { Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

export default {
  title: 'Welcome/Getting Started',
  parameters: {
    docs: {
      description: {
        component: 'Welcome to the QuikRide UI Component Library. This Storybook contains all standardized components for the application.',
      },
    },
  },
};

export const Welcome = () => (
  <div style={{ padding: '40px', maxWidth: '800px' }}>
    <h1 style={{ color: '#0ea5e9', marginBottom: '24px' }}>
      <InfoCircleOutlined style={{ marginRight: '12px' }} />
      QuikRide UI Component Library
    </h1>
    
    <div style={{ marginBottom: '32px' }}>
      <h2>Overview</h2>
      <p>
        This Storybook contains all the standardized UI components for the QuikRide bus booking system. 
        Each component follows our design system principles and includes:
      </p>
      <ul>
        <li>Consistent styling with Ant Design theme</li>
        <li>Responsive design patterns</li>
        <li>Accessibility compliance</li>
        <li>Standardized icon usage</li>
        <li>Multiple variants and states</li>
      </ul>
    </div>

    <div style={{ marginBottom: '32px' }}>
      <h2>Component Categories</h2>
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h3>Buttons</h3>
          <p>Standardized button components with consistent variants and icon mapping.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h3>Panels</h3>
          <p>Flexible panel components with headers, footers, and content areas.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h3>Forms</h3>
          <p>Form input components with validation states and consistent styling.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h3>Navigation</h3>
          <p>Navigation components for different user roles and responsive layouts.</p>
        </div>
      </div>
    </div>

    <div style={{ marginBottom: '32px' }}>
      <h2>Design Principles</h2>
      <ul>
        <li><strong>Mobile First:</strong> All components are designed with mobile-first responsive patterns</li>
        <li><strong>Accessibility:</strong> Components follow WCAG guidelines for accessibility</li>
        <li><strong>Consistency:</strong> Unified color scheme, typography, and spacing</li>
        <li><strong>Icon Standards:</strong> Ant Design icons for UI actions, React Icons for decorative elements</li>
        <li><strong>Theme Integration:</strong> All components use the centralized theme system</li>
      </ul>
    </div>

    <div>
      <h2>Getting Started</h2>
      <p>
        Browse the component categories in the sidebar to explore individual components. 
        Each component includes interactive examples, documentation, and code snippets.
      </p>
      <Button type="primary" size="large" style={{ marginTop: '16px' }}>
        Explore Components
      </Button>
    </div>
  </div>
);

Welcome.parameters = {
  layout: 'fullscreen',
};