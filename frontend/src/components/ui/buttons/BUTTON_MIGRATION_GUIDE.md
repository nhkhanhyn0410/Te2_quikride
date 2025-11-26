# Button Components Migration Guide

This guide helps developers migrate from existing button implementations to the standardized button components.

## Overview

The standardized button system provides:
- **StandardButton**: Enhanced Ant Design Button with consistent styling and icon mapping
- **ActionButton**: Predefined buttons for common actions with built-in icons and text
- **ButtonGroup**: Consistent button grouping and spacing
- **FormSubmitButton**: Form-specific button with loading states (already exists)

## Migration Steps

### 1. Import the New Components

```javascript
// Old imports
import { Button } from 'antd';

// New imports
import { StandardButton, ActionButton, ButtonGroup } from '../components/ui';
// OR
import { StandardButton, ActionButton, ButtonGroup } from '../components/ui/buttons';
```

### 2. Replace Basic Button Usage

#### Before (Ant Design Button)
```jsx
import { Button } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

<Button type="primary" icon={<PlusOutlined />}>
  Create New
</Button>

<Button icon={<EditOutlined />}>
  Edit
</Button>

<Button danger icon={<DeleteOutlined />}>
  Delete
</Button>
```

#### After (StandardButton)
```jsx
import { StandardButton } from '../components/ui/buttons';

<StandardButton 
  variant="primary" 
  iconContext="action" 
  iconType="add"
>
  Create New
</StandardButton>

<StandardButton 
  iconContext="action" 
  iconType="edit"
>
  Edit
</StandardButton>

<StandardButton 
  danger 
  iconContext="action" 
  iconType="delete"
>
  Delete
</StandardButton>
```

#### After (ActionButton - Recommended)
```jsx
import { ActionButton } from '../components/ui/buttons';

<ActionButton action="create">Create New</ActionButton>
<ActionButton action="edit" />
<ActionButton action="delete" />
```

### 3. Replace Button Groups

#### Before (Manual Spacing)
```jsx
import { Button, Space } from 'antd';

<Space>
  <Button>Cancel</Button>
  <Button type="primary">Save</Button>
</Space>

<div className="flex justify-end gap-4">
  <Button>Cancel</Button>
  <Button type="primary">Save</Button>
</div>
```

#### After (ButtonGroup)
```jsx
import { ButtonGroup, ActionButton } from '../components/ui/buttons';

<ButtonGroup spacing="middle">
  <ActionButton action="cancel" />
  <ActionButton action="save" />
</ButtonGroup>

<ButtonGroup align="right" spacing="large">
  <ActionButton action="cancel" />
  <ActionButton action="save" />
</ButtonGroup>
```

### 4. Common Migration Patterns

#### Modal Footer Buttons
```jsx
// Before
<div className="flex justify-end gap-3">
  <Button onClick={onCancel}>Cancel</Button>
  <Button type="primary" loading={loading} onClick={onSubmit}>
    Submit
  </Button>
</div>

// After
<ButtonGroup align="right">
  <ActionButton action="cancel" onClick={onCancel} />
  <ActionButton action="save" loading={loading} onClick={onSubmit}>
    Submit
  </ActionButton>
</ButtonGroup>
```

#### CRUD Action Toolbar
```jsx
// Before
<div className="flex justify-between">
  <Space>
    <Button type="primary" icon={<PlusOutlined />}>Create</Button>
    <Button icon={<SearchOutlined />}>Search</Button>
  </Space>
  <Space>
    <Button icon={<EditOutlined />} disabled>Edit</Button>
    <Button danger icon={<DeleteOutlined />} disabled>Delete</Button>
  </Space>
</div>

// After
<div className="flex justify-between">
  <ButtonGroup>
    <ActionButton action="create" />
    <ActionButton action="search" />
  </ButtonGroup>
  <ButtonGroup>
    <ActionButton action="edit" disabled />
    <ActionButton action="delete" disabled />
  </ButtonGroup>
</div>
```

#### Navigation Buttons
```jsx
// Before
<Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
  Back
</Button>

// After
<ActionButton action="back" onClick={() => navigate(-1)} />
```

#### Form Action Buttons
```jsx
// Before
<div className="flex justify-end gap-3">
  <Button>Cancel</Button>
  <Button>Save Draft</Button>
  <Button type="primary" htmlType="submit" loading={submitting}>
    Publish
  </Button>
</div>

// After
<ButtonGroup align="right">
  <ActionButton action="cancel" />
  <StandardButton variant="secondary">Save Draft</StandardButton>
  <ActionButton action="save" loading={submitting}>
    Publish
  </ActionButton>
</ButtonGroup>
```

## Component API Reference

### StandardButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'primary' \| 'secondary' \| 'text' \| 'link' \| 'dashed'` | `'default'` | Button variant |
| size | `'small' \| 'middle' \| 'large'` | `'middle'` | Button size |
| icon | `ReactNode` | - | Custom icon |
| iconContext | `string` | - | Icon context for standardized icons |
| iconType | `string` | - | Icon type for standardized icons |
| loading | `boolean` | `false` | Loading state |
| disabled | `boolean` | `false` | Disabled state |
| block | `boolean` | `false` | Full width button |
| danger | `boolean` | `false` | Danger styling |
| ghost | `boolean` | `false` | Ghost styling |

### ActionButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| action | `string` | - | Predefined action type (required) |
| variant | `'primary' \| 'secondary' \| 'text' \| 'link' \| 'dashed'` | - | Override default variant |
| size | `'small' \| 'middle' \| 'large'` | `'middle'` | Button size |
| loading | `boolean` | `false` | Loading state |
| disabled | `boolean` | `false` | Disabled state |
| children | `ReactNode` | - | Override default text |

### ButtonGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| align | `'left' \| 'center' \| 'right' \| 'space-between'` | `'left'` | Button alignment |
| spacing | `'small' \| 'middle' \| 'large' \| number` | `'middle'` | Button spacing |
| direction | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction |
| wrap | `boolean` | `false` | Allow wrapping |

## Available Actions for ActionButton

### CRUD Actions
- `create` - Create new item
- `edit` - Edit existing item
- `delete` - Delete item
- `save` - Save changes
- `cancel` - Cancel action

### Navigation Actions
- `back` - Go back
- `forward` - Go forward
- `home` - Go to home

### Status Actions
- `approve` - Approve item
- `reject` - Reject item

### Data Actions
- `search` - Search data
- `filter` - Filter data
- `export` - Export data
- `import` - Import data

### Communication Actions
- `send` - Send message
- `reply` - Reply to message

### Authentication Actions
- `login` - Login
- `logout` - Logout
- `register` - Register

## Icon Mapping

The standardized button components use the IconProvider for consistent icon mapping:

- **action** context: add, edit, delete, save, search, filter, export, import
- **navigation** context: back, forward, home, up, down
- **status** context: success, error, warning, info
- **communication** context: send, reply, message
- **authentication** context: login, logout, register

## Best Practices

1. **Use ActionButton for common actions** - It provides consistent icons and text
2. **Use ButtonGroup for related buttons** - Ensures consistent spacing and alignment
3. **Prefer iconContext/iconType over custom icons** - Maintains icon consistency
4. **Use semantic variants** - primary for main actions, secondary for supporting actions
5. **Group related actions together** - Use ButtonGroup to visually group related functionality
6. **Consider mobile responsiveness** - Use block buttons or vertical groups for mobile layouts

## Testing

When migrating buttons, ensure to update tests:

```javascript
// Before
const button = screen.getByRole('button', { name: /create/i });

// After (same approach works)
const button = screen.getByRole('button', { name: /create/i });
// or for ActionButton with default text
const button = screen.getByRole('button', { name: /tạo mới/i });
```

## Troubleshooting

### Icons not showing
- Ensure IconProvider is properly configured
- Check that iconContext and iconType are valid
- Verify icon mapping in IconProvider

### Styling issues
- Check that Ant Design theme is properly configured
- Ensure Tailwind CSS classes are not conflicting
- Verify component is wrapped in theme provider

### TypeScript errors
- Import types from the component files
- Ensure action prop matches available actions
- Check prop types match component interfaces