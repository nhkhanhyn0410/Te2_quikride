/**
 * Panel Content Components Integration Tests
 * Tests the interaction between PanelHeader, PanelFooter, and PanelContent
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConfigProvider, Button } from 'antd';
import { UserOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import PanelHeader from '../PanelHeader';
import PanelFooter from '../PanelFooter';
import PanelContent from '../PanelContent';
import { antdTheme } from '../../../theme/themeConfig';

// Test wrapper with Ant Design theme
const TestWrapper = ({ children }) => (
  <ConfigProvider theme={antdTheme}>
    {children}
  </ConfigProvider>
);

describe('Panel Content Components Integration', () => {
  it('renders complete panel with header, content, and footer', () => {
    const mockSave = vi.fn();
    const mockCancel = vi.fn();

    const headerActions = [
      <Button key="refresh" size="small">Refresh</Button>
    ];

    const footerActions = [
      <Button key="save" type="primary" icon={<SaveOutlined />} onClick={mockSave}>
        Save
      </Button>,
      <Button key="cancel" icon={<CloseOutlined />} onClick={mockCancel}>
        Cancel
      </Button>
    ];

    render(
      <TestWrapper>
        <div className="panel-container">
          <PanelHeader
            title="User Profile"
            subtitle="Edit user information"
            icon={<UserOutlined />}
            actions={headerActions}
          />
          <PanelContent>
            <div className="p-6">
              <h3>User Details</h3>
              <p>This is the main content area.</p>
            </div>
          </PanelContent>
          <PanelFooter actions={footerActions} />
        </div>
      </TestWrapper>
    );

    // Check header elements
    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText('Edit user information')).toBeInTheDocument();
    expect(screen.getByText('Refresh')).toBeInTheDocument();

    // Check content
    expect(screen.getByText('User Details')).toBeInTheDocument();
    expect(screen.getByText('This is the main content area.')).toBeInTheDocument();

    // Check footer actions
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();

    // Test footer interactions
    fireEvent.click(screen.getByText('Save'));
    expect(mockSave).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  it('renders panel with loading content', () => {
    const headerActions = [
      <Button key="stop" size="small">Stop Loading</Button>
    ];

    render(
      <TestWrapper>
        <div className="panel-container">
          <PanelHeader
            title="Loading Panel"
            actions={headerActions}
          />
          <PanelContent loading loadingType="spinner">
            <div>This content should not be visible</div>
          </PanelContent>
        </div>
      </TestWrapper>
    );

    expect(screen.getByText('Loading Panel')).toBeInTheDocument();
    expect(screen.getByText('Stop Loading')).toBeInTheDocument();
    
    // Loading spinner should be visible
    expect(document.querySelector('.ant-spin')).toBeInTheDocument();
    
    // Content should not be visible
    expect(screen.queryByText('This content should not be visible')).not.toBeInTheDocument();
  });

  it('renders panel with skeleton loading', () => {
    render(
      <TestWrapper>
        <div className="panel-container">
          <PanelHeader title="Skeleton Loading Panel" />
          <PanelContent loading loadingType="skeleton">
            <div>Hidden content</div>
          </PanelContent>
        </div>
      </TestWrapper>
    );

    expect(screen.getByText('Skeleton Loading Panel')).toBeInTheDocument();
    
    // Skeleton should be visible
    expect(document.querySelector('.ant-skeleton')).toBeInTheDocument();
    
    // Content should not be visible
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('renders panel with empty state', () => {
    const mockRefresh = vi.fn();

    render(
      <TestWrapper>
        <div className="panel-container">
          <PanelHeader title="Empty Panel" />
          <PanelContent 
            empty 
            emptyDescription="No data to display"
            emptyAction={
              <Button onClick={mockRefresh}>Refresh Data</Button>
            }
          >
            <div>Hidden content</div>
          </PanelContent>
        </div>
      </TestWrapper>
    );

    expect(screen.getByText('Empty Panel')).toBeInTheDocument();
    expect(screen.getByText('No data to display')).toBeInTheDocument();
    expect(screen.getByText('Refresh Data')).toBeInTheDocument();
    
    // Test empty state action
    fireEvent.click(screen.getByText('Refresh Data'));
    expect(mockRefresh).toHaveBeenCalledTimes(1);
    
    // Content should not be visible
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('renders scrollable content with max height', () => {
    const { container } = render(
      <TestWrapper>
        <div className="panel-container">
          <PanelHeader title="Scrollable Panel" />
          <PanelContent scrollable maxHeight="200px">
            <div style={{ height: '400px' }}>
              <p>This is tall content that should be scrollable</p>
              <p>More content...</p>
              <p>Even more content...</p>
            </div>
          </PanelContent>
        </div>
      </TestWrapper>
    );

    const content = container.querySelector('.panel-content');
    expect(content).toHaveClass('overflow-auto');
    expect(content).toHaveStyle({ maxHeight: '200px' });
  });

  it('handles different panel sizes consistently', () => {
    const sizes = ['small', 'medium', 'large'];
    
    sizes.forEach((size) => {
      const { container } = render(
        <TestWrapper>
          <div className="panel-container">
            <PanelHeader 
              title={`${size} Panel`} 
              size={size}
            />
            <PanelContent>
              <div>Content for {size} panel</div>
            </PanelContent>
            <PanelFooter 
              size={size}
              actions={[<Button key="action">Action</Button>]}
            />
          </div>
        </TestWrapper>
      );

      expect(screen.getByText(`${size} Panel`)).toBeInTheDocument();
      expect(screen.getByText(`Content for ${size} panel`)).toBeInTheDocument();
      
      // Check that size classes are applied
      const header = container.querySelector('.panel-header');
      const footer = container.querySelector('.panel-footer');
      expect(header).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
    });
  });

  it('handles panel without footer when no actions provided', () => {
    render(
      <TestWrapper>
        <div className="panel-container">
          <PanelHeader title="Panel Without Footer" />
          <PanelContent>
            <div>Content without footer</div>
          </PanelContent>
          <PanelFooter actions={[]} />
        </div>
      </TestWrapper>
    );

    expect(screen.getByText('Panel Without Footer')).toBeInTheDocument();
    expect(screen.getByText('Content without footer')).toBeInTheDocument();
    
    // Footer should not render when no actions
    expect(document.querySelector('.panel-footer')).not.toBeInTheDocument();
  });

  it('handles panel state transitions', () => {
    const TestComponent = () => {
      const [loading, setLoading] = React.useState(false);
      const [empty, setEmpty] = React.useState(false);

      return (
        <div className="panel-container">
          <PanelHeader 
            title="State Transition Panel"
            actions={[
              <Button key="loading" onClick={() => setLoading(!loading)}>
                Toggle Loading
              </Button>,
              <Button key="empty" onClick={() => setEmpty(!empty)}>
                Toggle Empty
              </Button>
            ]}
          />
          <PanelContent loading={loading} empty={empty && !loading}>
            <div>Normal content state</div>
          </PanelContent>
        </div>
      );
    };

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // Initial state - normal content
    expect(screen.getByText('Normal content state')).toBeInTheDocument();

    // Toggle loading
    fireEvent.click(screen.getByText('Toggle Loading'));
    expect(document.querySelector('.ant-spin')).toBeInTheDocument();
    expect(screen.queryByText('Normal content state')).not.toBeInTheDocument();

    // Toggle loading off
    fireEvent.click(screen.getByText('Toggle Loading'));
    expect(screen.getByText('Normal content state')).toBeInTheDocument();

    // Toggle empty
    fireEvent.click(screen.getByText('Toggle Empty'));
    expect(screen.getByText('No data available')).toBeInTheDocument();
    expect(screen.queryByText('Normal content state')).not.toBeInTheDocument();
  });

  it('applies custom styling and classes correctly', () => {
    const { container } = render(
      <TestWrapper>
        <div className="panel-container">
          <PanelHeader 
            title="Custom Styled Panel"
            className="custom-header"
            data-testid="custom-header"
          />
          <PanelContent 
            className="custom-content"
            style={{ backgroundColor: 'lightblue' }}
          >
            <div>Custom styled content</div>
          </PanelContent>
          <PanelFooter 
            className="custom-footer"
            actions={[<Button key="action">Action</Button>]}
          />
        </div>
      </TestWrapper>
    );

    expect(container.querySelector('.custom-header')).toBeInTheDocument();
    expect(container.querySelector('.custom-content')).toBeInTheDocument();
    expect(container.querySelector('.custom-footer')).toBeInTheDocument();
    
    const content = container.querySelector('.custom-content');
    expect(content).toHaveStyle({ backgroundColor: 'lightblue' });
  });
});