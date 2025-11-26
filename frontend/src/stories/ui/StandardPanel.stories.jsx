import { StandardPanel } from '../../components/ui/StandardPanel';
import { PanelHeader } from '../../components/ui/PanelHeader';
import { PanelFooter } from '../../components/ui/PanelFooter';
import { PanelContent } from '../../components/ui/PanelContent';
import { StandardButton } from '../../components/ui/buttons/StandardButton';
import { SettingOutlined, InfoCircleOutlined } from '@ant-design/icons';

export default {
  title: 'UI Components/Panels/StandardPanel',
  component: StandardPanel,
  parameters: {
    docs: {
      description: {
        component: 'Standardized panel component with consistent styling, variants, and responsive behavior.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'bordered', 'ghost'],
      description: 'Panel variant style',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Panel size',
    },
    padding: {
      control: { type: 'select' },
      options: ['compact', 'comfortable', 'spacious'],
      description: 'Panel padding style',
    },
  },
};

// Default story
export const Default = {
  args: {
    variant: 'default',
    size: 'medium',
    padding: 'comfortable',
    children: (
      <div>
        <h3>Default Panel</h3>
        <p>This is a default panel with standard styling.</p>
      </div>
    ),
  },
};

// All variants
export const AllVariants = () => (
  <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
    <StandardPanel variant="default">
      <h4>Default Panel</h4>
      <p>Standard white background with subtle shadow.</p>
    </StandardPanel>
    
    <StandardPanel variant="elevated">
      <h4>Elevated Panel</h4>
      <p>Enhanced shadow for important content.</p>
    </StandardPanel>
    
    <StandardPanel variant="bordered">
      <h4>Bordered Panel</h4>
      <p>Clear border definition for content separation.</p>
    </StandardPanel>
    
    <StandardPanel variant="ghost">
      <h4>Ghost Panel</h4>
      <p>Minimal styling for secondary content.</p>
    </StandardPanel>
  </div>
);

// With header and footer
export const WithHeaderAndFooter = () => (
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
      <p>This is the main content area of the panel. It can contain any type of content including text, forms, tables, or other components.</p>
      <p>The content area automatically handles proper spacing and overflow behavior.</p>
    </PanelContent>
    <PanelFooter>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <StandardButton variant="secondary">Cancel</StandardButton>
        <StandardButton variant="primary">Save Changes</StandardButton>
      </div>
    </PanelFooter>
  </StandardPanel>
);

// Interactive example
export const Interactive = {
  args: {
    variant: 'default',
    size: 'medium',
    padding: 'comfortable',
    children: (
      <div>
        <h3>Interactive Panel</h3>
        <p>Use the controls to test different panel configurations.</p>
        <StandardButton variant="primary">Action Button</StandardButton>
      </div>
    ),
  },
};