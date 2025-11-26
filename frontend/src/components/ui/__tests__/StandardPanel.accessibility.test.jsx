/**
 * StandardPanel Accessibility Tests
 * Tests accessibility compliance for the StandardPanel component and related components
 */

import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ConfigProvider } from 'antd';
import { antdTheme } from '../../../theme/themeConfig';
import { StandardPanel } from '../StandardPanel';
import { PanelHeader } from '../PanelHeader';
import { PanelFooter } from '../PanelFooter';
import { PanelContent } from '../PanelContent';
import { StandardButton } from '../buttons/StandardButton';
import { InfoCircleOutlined, SettingOutlined } from '@ant-design/icons';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Test wrapper with theme
const TestWrapper = ({ children }) => (
  <ConfigProvider theme={antdTheme}>
    {children}
  </ConfigProvider>
);

describe('StandardPanel Accessibility Tests', () => {
  it('should not have accessibility violations - basic panel', async () => {
    const { container } = render(
      <TestWrapper>
        <StandardPanel>
          <h3>Basic Panel</h3>
          <p>This is a basic panel with content.</p>
        </StandardPanel>
      </TestWrapper>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations - all variants', async () => {
    const { container } = render(
      <TestWrapper>
        <div>
          <StandardPanel variant="default">
            <h4>Default Panel</h4>
            <p>Default panel content.</p>
          </StandardPanel>
          
          <StandardPanel variant="elevated">
            <h4>Elevated Panel</h4>
            <p>Elevated panel content.</p>
          </StandardPanel>
          
          <StandardPanel variant="bordered">
            <h4>Bordered Panel</h4>
            <p>Bordered panel content.</p>
          </StandardPanel>
          
          <StandardPanel variant="ghost">
            <h4>Ghost Panel</h4>
            <p>Ghost panel content.</p>
          </StandardPanel>
        </div>
      </TestWrapper>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations - with header and footer', async () => {
    const { container } = render(
      <TestWrapper>
        <StandardPanel variant="elevated">
          <PanelHeader
            title="Panel with Header & Footer"
            subtitle="This panel demonstrates header and footer usage"
            icon={<InfoCircleOutlined />}
            actions={[
              <StandardButton key="settings" variant="ghost" size="small" icon={<SettingOutlined />} />,
            ]}
          />
          <PanelContent>
            <p>This is the main content area of the panel.</p>
            <p>The content area automatically handles proper spacing and overflow behavior.</p>
          </PanelContent>
          <PanelFooter>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <StandardButton variant="secondary">Cancel</StandardButton>
              <StandardButton variant="primary">Save Changes</StandardButton>
            </div>
          </PanelFooter>
        </StandardPanel>
      </TestWrapper>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations - loading state', async () => {
    const { container } = render(
      <TestWrapper>
        <StandardPanel loading>
          <h3>Loading Panel</h3>
          <p>This panel is in loading state.</p>
        </StandardPanel>
      </TestWrapper>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations - empty state', async () => {
    const { container } = render(
      <TestWrapper>
        <StandardPanel>
          <PanelContent empty emptyDescription="No data available" />
        </StandardPanel>
      </TestWrapper>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper heading hierarchy', async () => {
    const { container } = render(
      <TestWrapper>
        <div>
          <h1>Main Title</h1>
          <StandardPanel>
            <PanelHeader title="Panel Title" subtitle="Panel subtitle" />
            <PanelContent>
              <h3>Section Title</h3>
              <p>Section content</p>
              <h4>Subsection Title</h4>
              <p>Subsection content</p>
            </PanelContent>
          </StandardPanel>
        </div>
      </TestWrapper>
    );
    
    // Test heading hierarchy
    const results = await axe(container, {
      rules: {
        'heading-order': { enabled: true }
      }
    });
    expect(results).toHaveNoViolations();
  });

  it('should have proper landmark structure', async () => {
    const { container } = render(
      <TestWrapper>
        <main>
          <StandardPanel>
            <PanelHeader title="Main Content Panel" />
            <PanelContent>
              <section>
                <h3>Content Section</h3>
                <p>This is the main content section.</p>
              </section>
            </PanelContent>
          </StandardPanel>
        </main>
      </TestWrapper>
    );
    
    // Test landmark structure
    const results = await axe(container, {
      rules: {
        'landmark-one-main': { enabled: true },
        'region': { enabled: true }
      }
    });
    expect(results).toHaveNoViolations();
  });

  it('should support keyboard navigation for interactive elements', async () => {
    const { container } = render(
      <TestWrapper>
        <StandardPanel>
          <PanelHeader
            title="Interactive Panel"
            actions={[
              <StandardButton key="action1" variant="ghost" size="small">Action 1</StandardButton>,
              <StandardButton key="action2" variant="ghost" size="small">Action 2</StandardButton>,
            ]}
          />
          <PanelContent>
            <p>Panel with interactive elements</p>
            <StandardButton variant="primary">Primary Action</StandardButton>
          </PanelContent>
          <PanelFooter>
            <StandardButton variant="secondary">Cancel</StandardButton>
            <StandardButton variant="primary">Submit</StandardButton>
          </PanelFooter>
        </StandardPanel>
      </TestWrapper>
    );
    
    // Test keyboard navigation
    const results = await axe(container, {
      rules: {
        'keyboard': { enabled: true },
        'focus-order-semantics': { enabled: true }
      }
    });
    expect(results).toHaveNoViolations();
  });

  it('should have sufficient color contrast in all variants', async () => {
    const { container } = render(
      <TestWrapper>
        <div>
          <StandardPanel variant="default">
            <PanelHeader title="Default Panel" />
            <PanelContent>Default content with text</PanelContent>
          </StandardPanel>
          
          <StandardPanel variant="elevated">
            <PanelHeader title="Elevated Panel" />
            <PanelContent>Elevated content with text</PanelContent>
          </StandardPanel>
          
          <StandardPanel variant="bordered">
            <PanelHeader title="Bordered Panel" />
            <PanelContent>Bordered content with text</PanelContent>
          </StandardPanel>
        </div>
      </TestWrapper>
    );
    
    // Test color contrast
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
    expect(results).toHaveNoViolations();
  });

  it('should handle responsive behavior without accessibility issues', async () => {
    const { container } = render(
      <TestWrapper>
        <div style={{ width: '320px' }}> {/* Mobile viewport simulation */}
          <StandardPanel size="small">
            <PanelHeader title="Mobile Panel" />
            <PanelContent>
              <p>This panel should work well on mobile devices.</p>
              <StandardButton variant="primary" block>Full Width Button</StandardButton>
            </PanelContent>
          </StandardPanel>
        </div>
      </TestWrapper>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should provide proper ARIA labels and descriptions', async () => {
    const { getByRole, getByText } = render(
      <TestWrapper>
        <StandardPanel>
          <PanelHeader 
            title="Accessible Panel" 
            subtitle="This panel has proper ARIA attributes"
          />
          <PanelContent>
            <p>Content with proper semantic structure</p>
          </PanelContent>
        </StandardPanel>
      </TestWrapper>
    );
    
    // Check that title is properly structured
    const title = getByText('Accessible Panel');
    expect(title).toBeInTheDocument();
    
    const subtitle = getByText('This panel has proper ARIA attributes');
    expect(subtitle).toBeInTheDocument();
    
    const results = await axe(getByRole('article') || getByRole('region'));
    expect(results).toHaveNoViolations();
  });
});