/**
 * FormLayout Components Tests
 * Tests for form layout pattern components
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import {
  FormSection,
  FormActions,
  FormGrid,
  FormField,
  FormContainer,
} from '../FormLayout';

// Test wrapper with Ant Design ConfigProvider
const TestWrapper = ({ children }) => (
  <ConfigProvider>
    {children}
  </ConfigProvider>
);

describe('FormSection', () => {
  it('renders with title and children', () => {
    render(
      <TestWrapper>
        <FormSection title="Personal Information">
          <div>Form fields here</div>
        </FormSection>
      </TestWrapper>
    );

    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Form fields here')).toBeInTheDocument();
  });

  it('renders with title and subtitle', () => {
    render(
      <TestWrapper>
        <FormSection 
          title="Contact Details" 
          subtitle="Please provide your contact information"
        >
          <div>Form fields here</div>
        </FormSection>
      </TestWrapper>
    );

    expect(screen.getByText('Contact Details')).toBeInTheDocument();
    expect(screen.getByText('Please provide your contact information')).toBeInTheDocument();
  });

  it('renders without header when no title or subtitle', () => {
    render(
      <TestWrapper>
        <FormSection>
          <div>Form fields here</div>
        </FormSection>
      </TestWrapper>
    );

    expect(screen.getByText('Form fields here')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders with divider when divider prop is true', () => {
    const { container } = render(
      <TestWrapper>
        <FormSection title="Section 1" divider>
          <div>Content</div>
        </FormSection>
      </TestWrapper>
    );

    expect(container.querySelector('.ant-divider')).toBeInTheDocument();
  });

  it('handles collapsible functionality', () => {
    render(
      <TestWrapper>
        <FormSection title="Collapsible Section" collapsible>
          <div>Collapsible content</div>
        </FormSection>
      </TestWrapper>
    );

    const title = screen.getByText('Collapsible Section');
    expect(screen.getByText('Collapsible content')).toBeInTheDocument();
    expect(screen.getByText('▼')).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(title);
    expect(screen.getByText('▶')).toBeInTheDocument();
  });

  it('starts collapsed when defaultCollapsed is true', () => {
    render(
      <TestWrapper>
        <FormSection title="Collapsed Section" collapsible defaultCollapsed>
          <div>Hidden content</div>
        </FormSection>
      </TestWrapper>
    );

    expect(screen.getByText('▶')).toBeInTheDocument();
    // Content should be hidden
    const content = screen.getByText('Hidden content');
    expect(content.parentElement).toHaveClass('hidden');
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <FormSection className="custom-section">
          <div>Content</div>
        </FormSection>
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('custom-section');
  });
});

describe('FormActions', () => {
  it('renders children with default left alignment', () => {
    render(
      <TestWrapper>
        <FormActions>
          <button>Submit</button>
          <button>Cancel</button>
        </FormActions>
      </TestWrapper>
    );

    const actions = screen.getByRole('button', { name: 'Submit' }).parentElement;
    expect(actions).toHaveClass('justify-start');
  });

  it('applies different alignments', () => {
    const { rerender, container } = render(
      <TestWrapper>
        <FormActions align="center">
          <button>Submit</button>
        </FormActions>
      </TestWrapper>
    );

    expect(container.querySelector('.form-actions')).toHaveClass('justify-center');

    rerender(
      <TestWrapper>
        <FormActions align="right">
          <button>Submit</button>
        </FormActions>
      </TestWrapper>
    );

    expect(container.querySelector('.form-actions')).toHaveClass('justify-end');

    rerender(
      <TestWrapper>
        <FormActions align="between">
          <button>Submit</button>
        </FormActions>
      </TestWrapper>
    );

    expect(container.querySelector('.form-actions')).toHaveClass('justify-between');
  });

  it('applies sticky styling when sticky prop is true', () => {
    const { container } = render(
      <TestWrapper>
        <FormActions sticky>
          <button>Submit</button>
        </FormActions>
      </TestWrapper>
    );

    const actions = container.querySelector('.form-actions');
    expect(actions).toHaveClass('sticky', 'bottom-0', 'bg-white', 'z-10', 'shadow-lg');
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <FormActions className="custom-actions">
          <button>Submit</button>
        </FormActions>
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('custom-actions');
  });
});

describe('FormGrid', () => {
  it('renders children in grid layout', () => {
    render(
      <TestWrapper>
        <FormGrid>
          <div>Field 1</div>
          <div>Field 2</div>
          <div>Field 3</div>
        </FormGrid>
      </TestWrapper>
    );

    expect(screen.getByText('Field 1')).toBeInTheDocument();
    expect(screen.getByText('Field 2')).toBeInTheDocument();
    expect(screen.getByText('Field 3')).toBeInTheDocument();
  });

  it('applies custom column configuration', () => {
    const { container } = render(
      <TestWrapper>
        <FormGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}>
          <div>Field 1</div>
          <div>Field 2</div>
        </FormGrid>
      </TestWrapper>
    );

    const cols = container.querySelectorAll('.ant-col');
    expect(cols).toHaveLength(2);
  });

  it('applies custom gutter', () => {
    const { container } = render(
      <TestWrapper>
        <FormGrid gutter={[24, 24]}>
          <div>Field 1</div>
          <div>Field 2</div>
        </FormGrid>
      </TestWrapper>
    );

    const row = container.querySelector('.ant-row');
    expect(row).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <FormGrid className="custom-grid">
          <div>Field 1</div>
        </FormGrid>
      </TestWrapper>
    );

    expect(container.querySelector('.form-grid')).toHaveClass('custom-grid');
  });
});

describe('FormField', () => {
  it('renders with label and children', () => {
    render(
      <TestWrapper>
        <FormField label="Email Address">
          <input type="email" />
        </FormField>
      </TestWrapper>
    );

    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows required indicator when required is true', () => {
    render(
      <TestWrapper>
        <FormField label="Required Field" required>
          <input type="text" />
        </FormField>
      </TestWrapper>
    );

    const label = screen.getByText('Required Field');
    expect(label).toHaveClass('after:content-["*"]');
  });

  it('displays error message', () => {
    render(
      <TestWrapper>
        <FormField label="Email" error="Invalid email format">
          <input type="email" />
        </FormField>
      </TestWrapper>
    );

    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    expect(screen.getByText('Invalid email format')).toHaveClass('text-red-600');
  });

  it('displays success message', () => {
    render(
      <TestWrapper>
        <FormField label="Email" success="Email is valid">
          <input type="email" />
        </FormField>
      </TestWrapper>
    );

    expect(screen.getByText('Email is valid')).toBeInTheDocument();
    expect(screen.getByText('Email is valid')).toHaveClass('text-green-600');
  });

  it('displays warning message', () => {
    render(
      <TestWrapper>
        <FormField label="Password" warning="Password is weak">
          <input type="password" />
        </FormField>
      </TestWrapper>
    );

    expect(screen.getByText('Password is weak')).toBeInTheDocument();
    expect(screen.getByText('Password is weak')).toHaveClass('text-orange-600');
  });

  it('displays help text', () => {
    render(
      <TestWrapper>
        <FormField label="Username" help="Must be 3-20 characters">
          <input type="text" />
        </FormField>
      </TestWrapper>
    );

    expect(screen.getByText('Must be 3-20 characters')).toBeInTheDocument();
    expect(screen.getByText('Must be 3-20 characters')).toHaveClass('text-gray-500');
  });

  it('prioritizes error over other feedback types', () => {
    render(
      <TestWrapper>
        <FormField 
          label="Field" 
          error="Error message"
          success="Success message"
          warning="Warning message"
          help="Help text"
        >
          <input type="text" />
        </FormField>
      </TestWrapper>
    );

    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    expect(screen.queryByText('Warning message')).not.toBeInTheDocument();
    expect(screen.queryByText('Help text')).not.toBeInTheDocument();
  });

  it('renders without label when label is not provided', () => {
    render(
      <TestWrapper>
        <FormField>
          <input type="text" />
        </FormField>
      </TestWrapper>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <FormField className="custom-field">
          <input type="text" />
        </FormField>
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('custom-field');
  });
});

describe('FormContainer', () => {
  it('renders with default props', () => {
    const { container } = render(
      <TestWrapper>
        <FormContainer>
          <div>Form content</div>
        </FormContainer>
      </TestWrapper>
    );

    expect(screen.getByText('Form content')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('max-w-2xl', 'p-6');
  });

  it('applies different max widths', () => {
    const { rerender, container } = render(
      <TestWrapper>
        <FormContainer maxWidth="sm">
          <div>Content</div>
        </FormContainer>
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('max-w-sm');

    rerender(
      <TestWrapper>
        <FormContainer maxWidth="xl">
          <div>Content</div>
        </FormContainer>
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('max-w-4xl');

    rerender(
      <TestWrapper>
        <FormContainer maxWidth="full">
          <div>Content</div>
        </FormContainer>
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('max-w-full');
  });

  it('applies different padding sizes', () => {
    const { rerender, container } = render(
      <TestWrapper>
        <FormContainer padding="none">
          <div>Content</div>
        </FormContainer>
      </TestWrapper>
    );

    expect(container.firstChild).not.toHaveClass('p-6');

    rerender(
      <TestWrapper>
        <FormContainer padding="sm">
          <div>Content</div>
        </FormContainer>
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('p-4');

    rerender(
      <TestWrapper>
        <FormContainer padding="lg">
          <div>Content</div>
        </FormContainer>
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('p-8');
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <FormContainer className="custom-container">
          <div>Content</div>
        </FormContainer>
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('custom-container');
  });
});