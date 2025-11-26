# Component Library Migration Guide

This comprehensive guide helps developers migrate from existing component implementations to the standardized component library.

## Overview

The standardized component library provides:

### Button Components
- **StandardButton**: Enhanced Ant Design Button with consistent styling and icon mapping
- **ActionButton**: Predefined buttons for common actions with built-in icons and text
- **ButtonGroup**: Consistent button grouping and spacing
- **FormSubmitButton**: Form-specific button with loading states

### Modal Components
- **StandardModal**: Enhanced Ant Design Modal with consistent styling and standardized buttons
- **ConfirmModal**: Standardized confirmation modal for common confirmation patterns
- **FormModal**: Modal specifically designed for forms with validation handling
- **InfoModal**: Modal for displaying information with consistent styling

### Card Components
- **StandardCard**: Enhanced Ant Design Card with consistent styling and variants
- **StatCard**: Specialized card for displaying statistics with trends
- **ActionCard**: Card with built-in action buttons and consistent styling
- **InfoCard**: Card for displaying information with status indicators
- **CardGrid**: Responsive grid layout for cards with consistent spacing

## Migration Steps

### 1. Import the New Components

```javascript
// Old imports
import { Button, Modal, Card } from 'antd';

// New imports - Option 1: From main UI index
import { 
  StandardButton, 
  ActionButton, 
  ButtonGroup,
  StandardModal,
  ConfirmModal,
  FormModal,
  InfoModal,
  StandardCard,
  StatCard,
  ActionCard,
  InfoCard,
  CardGrid
} from '../components/ui';

// New imports - Option 2: From specific component folders
import { StandardButton, ActionButton, ButtonGroup } from '../components/ui/buttons';
import { StandardModal, ConfirmModal, FormModal, InfoModal } from '../components/ui/modals';
import { StandardCard, StatCard, ActionCard, InfoCard, CardGrid } from '../components/ui/cards';
```

### 2. Button Migration Examples

#### Basic Button Replacement
```jsx
// Before
import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

<Button type="primary" icon={<EditOutlined />}>
  Edit Item
</Button>

// After - StandardButton
import { StandardButton } from '../components/ui/buttons';

<StandardButton 
  variant="primary" 
  iconContext="action" 
  iconType="edit"
>
  Edit Item
</StandardButton>

// After - ActionButton (Recommended)
import { ActionButton } from '../components/ui/buttons';

<ActionButton action="edit">Edit Item</ActionButton>
```

#### Button Group Migration
```jsx
// Before
import { Button, Space } from 'antd';

<Space>
  <Button>Cancel</Button>
  <Button type="primary">Save</Button>
</Space>

// After
import { ButtonGroup, ActionButton } from '../components/ui/buttons';

<ButtonGroup spacing="middle">
  <ActionButton action="cancel" />
  <ActionButton action="save" />
</ButtonGroup>
```

### 3. Modal Migration Examples

#### Basic Modal Replacement
```jsx
// Before
import { Modal, Button } from 'antd';

<Modal
  title="Confirm Action"
  open={visible}
  onOk={handleOk}
  onCancel={handleCancel}
  okText="Confirm"
  cancelText="Cancel"
>
  <p>Are you sure you want to proceed?</p>
</Modal>

// After
import { StandardModal } from '../components/ui/modals';

<StandardModal
  title="Confirm Action"
  open={visible}
  onOk={handleOk}
  onCancel={handleCancel}
  okText="Confirm"
  cancelText="Cancel"
>
  <p>Are you sure you want to proceed?</p>
</StandardModal>
```

#### Confirmation Modal
```jsx
// Before
import { Modal } from 'antd';

Modal.confirm({
  title: 'Delete Item',
  content: 'This action cannot be undone.',
  onOk: handleDelete,
  onCancel: handleCancel,
});

// After
import { ConfirmModal } from '../components/ui/modals';

<ConfirmModal
  open={confirmVisible}
  type="danger"
  title="Delete Item"
  content="This action cannot be undone."
  onConfirm={handleDelete}
  onCancel={handleCancel}
  confirmText="Yes, Delete"
  cancelText="Keep Item"
/>
```

#### Form Modal
```jsx
// Before
import { Modal, Form, Input, Button } from 'antd';

<Modal
  title="Edit User"
  open={visible}
  onCancel={handleCancel}
  footer={[
    <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
    <Button key="submit" type="primary" onClick={handleSubmit}>Submit</Button>
  ]}
>
  <Form form={form} onFinish={handleFinish}>
    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
  </Form>
</Modal>

// After
import { FormModal } from '../components/ui/modals';
import { Form, Input } from 'antd';

<FormModal
  title="Edit User"
  open={visible}
  onCancel={handleCancel}
  onFinish={handleFinish}
  form={form}
  okText="Submit"
>
  <Form.Item name="name" label="Name" rules={[{ required: true }]}>
    <Input />
  </Form.Item>
</FormModal>
```

### 4. Card Migration Examples

#### Basic Card Replacement
```jsx
// Before
import { Card } from 'antd';

<Card title="User Information">
  <p>User details go here</p>
</Card>

// After
import { StandardCard } from '../components/ui/cards';

<StandardCard title="User Information">
  <p>User details go here</p>
</StandardCard>
```

#### Statistics Card
```jsx
// Before
import { Card, Statistic } from 'antd';
import { UserOutlined } from '@ant-design/icons';

<Card>
  <Statistic
    title="Total Users"
    value={1234}
    prefix={<UserOutlined />}
    valueStyle={{ color: '#3f8600' }}
  />
</Card>

// After
import { StatCard } from '../components/ui/cards';

<StatCard
  title="Total Users"
  value={1234}
  iconContext="user"
  iconType="group"
  color="#3f8600"
/>
```

#### Card with Actions
```jsx
// Before
import { Card, Button, Space } from 'antd';

<Card
  title="Project Settings"
  extra={
    <Space>
      <Button>Edit</Button>
      <Button type="primary">Save</Button>
    </Space>
  }
  actions={[
    <Button key="delete" danger>Delete</Button>
  ]}
>
  <p>Project configuration</p>
</Card>

// After
import { ActionCard } from '../components/ui/cards';

<ActionCard
  title="Project Settings"
  primaryAction={{
    action: 'save',
    onClick: handleSave
  }}
  secondaryActions={[
    {
      action: 'edit',
      onClick: handleEdit
    }
  ]}
  footerActions={[
    {
      action: 'delete',
      onClick: handleDelete
    }
  ]}
>
  <p>Project configuration</p>
</ActionCard>
```

#### Card Grid Layout
```jsx
// Before
import { Row, Col, Card } from 'antd';

<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} md={8} lg={6}>
    <Card title="Card 1">Content 1</Card>
  </Col>
  <Col xs={24} sm={12} md={8} lg={6}>
    <Card title="Card 2">Content 2</Card>
  </Col>
  <Col xs={24} sm={12} md={8} lg={6}>
    <Card title="Card 3">Content 3</Card>
  </Col>
</Row>

// After
import { CardGrid, StandardCard } from '../components/ui/cards';

<CardGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} gutter={[16, 16]}>
  <StandardCard title="Card 1">Content 1</StandardCard>
  <StandardCard title="Card 2">Content 2</StandardCard>
  <StandardCard title="Card 3">Content 3</StandardCard>
</CardGrid>
```

## Component API Reference

### Button Components

#### StandardButton Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'primary' \| 'secondary' \| 'text' \| 'link' \| 'dashed'` | `'default'` | Button variant |
| iconContext | `string` | - | Icon context for standardized icons |
| iconType | `string` | - | Icon type for standardized icons |

#### ActionButton Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| action | `string` | - | Predefined action type (required) |
| variant | `string` | - | Override default variant |

#### ButtonGroup Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| align | `'left' \| 'center' \| 'right' \| 'space-between'` | `'left'` | Button alignment |
| spacing | `'small' \| 'middle' \| 'large' \| number` | `'middle'` | Button spacing |

### Modal Components

#### StandardModal Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| titleIconContext | `string` | - | Icon context for title icon |
| titleIconType | `string` | - | Icon type for title icon |
| size | `'small' \| 'default' \| 'large' \| 'extra-large'` | `'default'` | Modal size |
| footerAlign | `'left' \| 'center' \| 'right' \| 'space-between'` | `'right'` | Footer alignment |

#### ConfirmModal Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | `'default' \| 'warning' \| 'danger' \| 'info'` | `'default'` | Confirmation type |
| onConfirm | `function` | - | Confirm callback (required) |

#### FormModal Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| form | `FormInstance` | - | Ant Design form instance |
| onFinish | `function` | - | Form submit callback |
| submitOnOk | `boolean` | `true` | Submit form on OK button |

### Card Components

#### StandardCard Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'default' \| 'elevated' \| 'outlined' \| 'ghost' \| 'filled'` | `'default'` | Card variant |
| titleIconContext | `string` | - | Icon context for title icon |
| titleIconType | `string` | - | Icon type for title icon |
| padding | `'compact' \| 'default' \| 'comfortable' \| 'spacious'` | `'default'` | Card padding |

#### StatCard Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | `string` | - | Statistic title (required) |
| value | `string \| number` | - | Statistic value (required) |
| trend | `string` | - | Trend description |
| trendType | `'up' \| 'down' \| 'neutral'` | `'up'` | Trend direction |

#### ActionCard Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| primaryAction | `ActionConfig` | - | Primary action configuration |
| secondaryActions | `ActionConfig[]` | `[]` | Secondary actions |
| footerActions | `ActionConfig[]` | `[]` | Footer actions |

#### CardGrid Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| columns | `number \| ResponsiveColumns` | `{ xs: 1, sm: 2, md: 3, lg: 4 }` | Grid columns |
| gutter | `number \| [number, number]` | `[16, 16]` | Grid spacing |

## Available Actions for ActionButton

### CRUD Actions
- `create`, `edit`, `delete`, `save`, `cancel`

### Navigation Actions
- `back`, `forward`, `home`

### Status Actions
- `approve`, `reject`

### Data Actions
- `search`, `filter`, `export`, `import`

### Communication Actions
- `send`, `reply`

### Authentication Actions
- `login`, `logout`, `register`

## Best Practices

### Button Usage
1. **Use ActionButton for common actions** - Provides consistent icons and text
2. **Use ButtonGroup for related buttons** - Ensures consistent spacing and alignment
3. **Prefer semantic variants** - primary for main actions, secondary for supporting actions

### Modal Usage
1. **Use ConfirmModal for confirmations** - Provides consistent confirmation patterns
2. **Use FormModal for forms** - Handles form validation and submission automatically
3. **Use InfoModal for information** - Consistent styling for different message types

### Card Usage
1. **Use StatCard for statistics** - Provides consistent metric display with trends
2. **Use ActionCard for interactive content** - Built-in action button management
3. **Use CardGrid for layouts** - Responsive grid with consistent spacing

### Icon Usage
1. **Use iconContext/iconType over custom icons** - Maintains consistency
2. **Follow icon mapping conventions** - Use appropriate contexts and types
3. **Provide fallbacks** - Handle cases where icons might not load

## Migration Checklist

- [ ] Replace all Button components with StandardButton or ActionButton
- [ ] Update button groups to use ButtonGroup component
- [ ] Replace Modal components with appropriate standardized modals
- [ ] Update Card components to use StandardCard or specialized variants
- [ ] Implement CardGrid for card layouts
- [ ] Update icon usage to use standardized icon mapping
- [ ] Test all interactive functionality
- [ ] Verify responsive behavior
- [ ] Update unit tests to match new component APIs
- [ ] Update documentation and examples

## Troubleshooting

### Icons not showing
- Ensure IconProvider is properly configured
- Check iconContext and iconType values
- Verify icon mapping in IconProvider

### Styling issues
- Import component CSS files if needed
- Check Tailwind CSS configuration
- Verify theme provider setup

### TypeScript errors
- Import proper types from component files
- Check prop types match component interfaces
- Update action prop values to match available actions

### Performance issues
- Use lazy loading for large component sets
- Implement proper memoization for expensive operations
- Monitor bundle size impact