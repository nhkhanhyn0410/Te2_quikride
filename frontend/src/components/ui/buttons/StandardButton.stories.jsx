import { StandardButton } from './StandardButton';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';

export default {
  title: 'UI Components/Buttons/StandardButton',
  component: StandardButton,
  parameters: {
    docs: {
      description: {
        component: 'Standardized button component that extends Ant Design Button with consistent styling and icon mapping.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'ghost', 'link'],
      description: 'Button variant style',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Button size',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled state',
    },
    block: {
      control: { type: 'boolean' },
      description: 'Full width button',
    },
    children: {
      control: { type: 'text' },
      description: 'Button content',
    },
  },
};

// Default story
export const Default = {
  args: {
    children: 'Default Button',
    variant: 'primary',
    size: 'medium',
  },
};

// All variants
export const AllVariants = () => (
  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
    <StandardButton variant="primary">Primary</StandardButton>
    <StandardButton variant="secondary">Secondary</StandardButton>
    <StandardButton variant="success">Success</StandardButton>
    <StandardButton variant="warning">Warning</StandardButton>
    <StandardButton variant="danger">Danger</StandardButton>
    <StandardButton variant="ghost">Ghost</StandardButton>
    <StandardButton variant="link">Link</StandardButton>
  </div>
);

// All sizes
export const AllSizes = () => (
  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
    <StandardButton size="small">Small</StandardButton>
    <StandardButton size="medium">Medium</StandardButton>
    <StandardButton size="large">Large</StandardButton>
  </div>
);

// With icons
export const WithIcons = () => (
  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
    <StandardButton variant="primary" icon={<PlusOutlined />}>
      Add Item
    </StandardButton>
    <StandardButton variant="secondary" icon={<EditOutlined />}>
      Edit
    </StandardButton>
    <StandardButton variant="danger" icon={<DeleteOutlined />}>
      Delete
    </StandardButton>
    <StandardButton variant="success" icon={<SaveOutlined />}>
      Save
    </StandardButton>
  </div>
);

// Loading states
export const LoadingStates = () => (
  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
    <StandardButton variant="primary" loading>
      Loading Primary
    </StandardButton>
    <StandardButton variant="secondary" loading>
      Loading Secondary
    </StandardButton>
    <StandardButton variant="success" loading icon={<SaveOutlined />}>
      Saving...
    </StandardButton>
  </div>
);

// Disabled states
export const DisabledStates = () => (
  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
    <StandardButton variant="primary" disabled>
      Disabled Primary
    </StandardButton>
    <StandardButton variant="secondary" disabled>
      Disabled Secondary
    </StandardButton>
    <StandardButton variant="danger" disabled icon={<DeleteOutlined />}>
      Disabled with Icon
    </StandardButton>
  </div>
);

// Block buttons
export const BlockButtons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px' }}>
    <StandardButton variant="primary" block>
      Full Width Primary
    </StandardButton>
    <StandardButton variant="secondary" block>
      Full Width Secondary
    </StandardButton>
    <StandardButton variant="success" block icon={<SaveOutlined />}>
      Full Width with Icon
    </StandardButton>
  </div>
);

// Interactive example
export const Interactive = {
  args: {
    children: 'Click me!',
    variant: 'primary',
    size: 'medium',
    loading: false,
    disabled: false,
    block: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example where you can test different props combinations.',
      },
    },
  },
};