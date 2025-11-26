/**
 * Button Components Demo
 * Comprehensive demonstration of all standardized button components
 */

import React, { useState } from 'react';
import { Card, Space, Divider, Typography, Row, Col, message } from 'antd';
import { StandardButton, ButtonGroup, ActionButton } from '../index';
import { IconProvider } from '../../../../icons/IconProvider';

const { Title, Paragraph, Text } = Typography;

const ButtonDemo = () => {
  const [loading, setLoading] = useState({});
  const [disabled, setDisabled] = useState({});

  const handleClick = (buttonName) => {
    message.success(`${buttonName} clicked!`);
  };

  const handleLoadingToggle = (buttonName) => {
    setLoading(prev => ({
      ...prev,
      [buttonName]: !prev[buttonName]
    }));
  };

  const handleDisabledToggle = (buttonName) => {
    setDisabled(prev => ({
      ...prev,
      [buttonName]: !prev[buttonName]
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Title level={1}>Button Components Demo</Title>
      <Paragraph>
        Comprehensive demonstration of standardized button components with consistent styling and icon mapping.
      </Paragraph>

      {/* StandardButton Demo */}
      <Card title="StandardButton Component" className="mb-6">
        <Title level={3}>Button Variants</Title>
        <Space wrap>
          <StandardButton variant="primary" onClick={() => handleClick('Primary')}>
            Primary
          </StandardButton>
          <StandardButton variant="secondary" onClick={() => handleClick('Secondary')}>
            Secondary
          </StandardButton>
          <StandardButton variant="text" onClick={() => handleClick('Text')}>
            Text
          </StandardButton>
          <StandardButton variant="link" onClick={() => handleClick('Link')}>
            Link
          </StandardButton>
          <StandardButton variant="dashed" onClick={() => handleClick('Dashed')}>
            Dashed
          </StandardButton>
        </Space>

        <Divider />

        <Title level={3}>Button Sizes</Title>
        <Space wrap>
          <StandardButton size="small" variant="primary">Small</StandardButton>
          <StandardButton size="middle" variant="primary">Middle</StandardButton>
          <StandardButton size="large" variant="primary">Large</StandardButton>
        </Space>

        <Divider />

        <Title level={3}>Button States</Title>
        <Space wrap>
          <StandardButton 
            variant="primary" 
            loading={loading.standard}
            onClick={() => handleLoadingToggle('standard')}
          >
            {loading.standard ? 'Loading...' : 'Toggle Loading'}
          </StandardButton>
          <StandardButton 
            variant="secondary" 
            disabled={disabled.standard}
            onClick={() => handleDisabledToggle('standard')}
          >
            {disabled.standard ? 'Disabled' : 'Toggle Disabled'}
          </StandardButton>
          <StandardButton variant="primary" danger>
            Danger
          </StandardButton>
          <StandardButton variant="primary" ghost>
            Ghost
          </StandardButton>
          <StandardButton variant="primary" block>
            Block Button
          </StandardButton>
        </Space>

        <Divider />

        <Title level={3}>Buttons with Icons</Title>
        <Space wrap>
          <StandardButton 
            variant="primary" 
            iconContext="action" 
            iconType="add"
            onClick={() => handleClick('Add')}
          >
            Add Item
          </StandardButton>
          <StandardButton 
            variant="secondary" 
            iconContext="action" 
            iconType="edit"
            onClick={() => handleClick('Edit')}
          >
            Edit
          </StandardButton>
          <StandardButton 
            variant="secondary" 
            iconContext="action" 
            iconType="delete"
            danger
            onClick={() => handleClick('Delete')}
          >
            Delete
          </StandardButton>
          <StandardButton 
            variant="text" 
            iconContext="navigation" 
            iconType="back"
            onClick={() => handleClick('Back')}
          >
            Back
          </StandardButton>
        </Space>
      </Card>

      {/* ActionButton Demo */}
      <Card title="ActionButton Component" className="mb-6">
        <Title level={3}>CRUD Actions</Title>
        <Space wrap>
          <ActionButton action="create" onClick={() => handleClick('Create')} />
          <ActionButton action="edit" onClick={() => handleClick('Edit')} />
          <ActionButton action="delete" onClick={() => handleClick('Delete')} />
          <ActionButton action="save" onClick={() => handleClick('Save')} />
          <ActionButton action="cancel" onClick={() => handleClick('Cancel')} />
        </Space>

        <Divider />

        <Title level={3}>Navigation Actions</Title>
        <Space wrap>
          <ActionButton action="back" onClick={() => handleClick('Back')} />
          <ActionButton action="forward" onClick={() => handleClick('Forward')} />
          <ActionButton action="home" onClick={() => handleClick('Home')} />
        </Space>

        <Divider />

        <Title level={3}>Status Actions</Title>
        <Space wrap>
          <ActionButton action="approve" onClick={() => handleClick('Approve')} />
          <ActionButton action="reject" onClick={() => handleClick('Reject')} />
        </Space>

        <Divider />

        <Title level={3}>Data Actions</Title>
        <Space wrap>
          <ActionButton action="search" onClick={() => handleClick('Search')} />
          <ActionButton action="filter" onClick={() => handleClick('Filter')} />
          <ActionButton action="export" onClick={() => handleClick('Export')} />
          <ActionButton action="import" onClick={() => handleClick('Import')} />
        </Space>

        <Divider />

        <Title level={3}>Communication Actions</Title>
        <Space wrap>
          <ActionButton action="send" onClick={() => handleClick('Send')} />
          <ActionButton action="reply" onClick={() => handleClick('Reply')} />
        </Space>

        <Divider />

        <Title level={3}>Authentication Actions</Title>
        <Space wrap>
          <ActionButton action="login" onClick={() => handleClick('Login')} />
          <ActionButton action="logout" onClick={() => handleClick('Logout')} />
          <ActionButton action="register" onClick={() => handleClick('Register')} />
        </Space>

        <Divider />

        <Title level={3}>Custom Action Buttons</Title>
        <Space wrap>
          <ActionButton 
            action="create" 
            variant="secondary"
            onClick={() => handleClick('Custom Create')}
          >
            Custom Create Text
          </ActionButton>
          <ActionButton 
            action="save" 
            size="large"
            loading={loading.actionSave}
            onClick={() => handleLoadingToggle('actionSave')}
          >
            {loading.actionSave ? 'Saving...' : 'Save Large'}
          </ActionButton>
          <ActionButton 
            action="delete" 
            size="small"
            disabled={disabled.actionDelete}
            onClick={() => handleDisabledToggle('actionDelete')}
          />
        </Space>
      </Card>

      {/* ButtonGroup Demo */}
      <Card title="ButtonGroup Component" className="mb-6">
        <Title level={3}>Button Group Alignments</Title>
        
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Text strong>Left Aligned (Default)</Text>
            <ButtonGroup align="left" spacing="middle">
              <ActionButton action="create" />
              <ActionButton action="edit" />
              <ActionButton action="delete" />
            </ButtonGroup>
          </Col>
          
          <Col span={24}>
            <Text strong>Center Aligned</Text>
            <ButtonGroup align="center" spacing="middle">
              <ActionButton action="back" />
              <ActionButton action="save" />
              <ActionButton action="forward" />
            </ButtonGroup>
          </Col>
          
          <Col span={24}>
            <Text strong>Right Aligned</Text>
            <ButtonGroup align="right" spacing="middle">
              <ActionButton action="cancel" />
              <ActionButton action="save" />
            </ButtonGroup>
          </Col>
          
          <Col span={24}>
            <Text strong>Space Between</Text>
            <ButtonGroup align="space-between" spacing="middle">
              <ActionButton action="back" />
              <div>
                <ActionButton action="cancel" />
                <ActionButton action="save" />
              </div>
            </ButtonGroup>
          </Col>
        </Row>

        <Divider />

        <Title level={3}>Button Group Spacing</Title>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Text strong>Small Spacing</Text>
            <ButtonGroup spacing="small">
              <StandardButton variant="primary">Button 1</StandardButton>
              <StandardButton variant="secondary">Button 2</StandardButton>
              <StandardButton variant="text">Button 3</StandardButton>
            </ButtonGroup>
          </Col>
          
          <Col span={24}>
            <Text strong>Middle Spacing (Default)</Text>
            <ButtonGroup spacing="middle">
              <StandardButton variant="primary">Button 1</StandardButton>
              <StandardButton variant="secondary">Button 2</StandardButton>
              <StandardButton variant="text">Button 3</StandardButton>
            </ButtonGroup>
          </Col>
          
          <Col span={24}>
            <Text strong>Large Spacing</Text>
            <ButtonGroup spacing="large">
              <StandardButton variant="primary">Button 1</StandardButton>
              <StandardButton variant="secondary">Button 2</StandardButton>
              <StandardButton variant="text">Button 3</StandardButton>
            </ButtonGroup>
          </Col>
        </Row>

        <Divider />

        <Title level={3}>Vertical Button Groups</Title>
        <ButtonGroup direction="vertical" spacing="middle">
          <ActionButton action="create" block />
          <ActionButton action="search" block />
          <ActionButton action="filter" block />
          <ActionButton action="export" block />
        </ButtonGroup>

        <Divider />

        <Title level={3}>Wrapping Button Groups</Title>
        <ButtonGroup wrap spacing="small">
          <ActionButton action="create" />
          <ActionButton action="edit" />
          <ActionButton action="delete" />
          <ActionButton action="search" />
          <ActionButton action="filter" />
          <ActionButton action="export" />
          <ActionButton action="import" />
          <ActionButton action="approve" />
          <ActionButton action="reject" />
        </ButtonGroup>
      </Card>

      {/* Common UI Patterns */}
      <Card title="Common UI Patterns" className="mb-6">
        <Title level={3}>CRUD Toolbar</Title>
        <div className="flex justify-between items-center mb-4">
          <ButtonGroup spacing="middle">
            <ActionButton action="create" />
            <ActionButton action="search" />
            <ActionButton action="filter" />
          </ButtonGroup>
          
          <ButtonGroup spacing="small">
            <ActionButton action="edit" disabled />
            <ActionButton action="delete" disabled />
          </ButtonGroup>
        </div>

        <Divider />

        <Title level={3}>Modal Footer</Title>
        <div className="bg-gray-50 p-4 rounded">
          <ButtonGroup align="right" spacing="middle">
            <StandardButton onClick={() => handleClick('Modal Cancel')}>
              Cancel
            </StandardButton>
            <ActionButton 
              action="save" 
              onClick={() => handleClick('Modal Submit')}
            >
              Submit
            </ActionButton>
          </ButtonGroup>
        </div>

        <Divider />

        <Title level={3}>Form Actions</Title>
        <div className="bg-gray-50 p-4 rounded">
          <ButtonGroup align="right" spacing="middle">
            <ActionButton action="cancel" variant="secondary" />
            <StandardButton 
              variant="secondary"
              onClick={() => handleClick('Save Draft')}
            >
              Save Draft
            </StandardButton>
            <ActionButton 
              action="save" 
              loading={loading.formSave}
              onClick={() => handleLoadingToggle('formSave')}
            >
              {loading.formSave ? 'Publishing...' : 'Publish'}
            </ActionButton>
          </ButtonGroup>
        </div>

        <Divider />

        <Title level={3}>Navigation Breadcrumb</Title>
        <ButtonGroup spacing="small">
          <StandardButton 
            variant="text" 
            iconContext="navigation" 
            iconType="home"
            onClick={() => handleClick('Home')}
          >
            Home
          </StandardButton>
          <StandardButton 
            variant="text"
            onClick={() => handleClick('Category')}
          >
            Category
          </StandardButton>
          <StandardButton 
            variant="text"
            onClick={() => handleClick('Subcategory')}
          >
            Subcategory
          </StandardButton>
          <StandardButton variant="text" disabled>
            Current Page
          </StandardButton>
        </ButtonGroup>
      </Card>
    </div>
  );
};

export default ButtonDemo;