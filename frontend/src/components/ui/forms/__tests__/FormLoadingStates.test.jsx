/**
 * FormLoadingStates Components Tests
 * Tests for form loading state components
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import {
  FormSubmitButton,
  FormLoadingOverlay,
  FormFieldSpinner,
  FormProgressIndicator,
  FormSavingIndicator,
} from '../FormLoadingStates';

// Test wrapper with Ant Design ConfigProvider
const TestWrapper = ({ children }) => (
  <ConfigProvider>
    {children}
  </ConfigProvider>
);

describe('FormSubmitButton', () => {
  it('renders with default props', () => {
    render(
      <TestWrapper>
        <FormSubmitButton />
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('shows loading state', () => {
    render(
      <TestWrapper>
        <FormSubmitButton loading />
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: 'Submitting...' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('shows custom loading text', () => {
    render(
      <TestWrapper>
        <FormSubmitButton loading loadingText="Processing..." />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: 'Processing...' })).toBeInTheDocument();
  });

  it('shows custom children text', () => {
    render(
      <TestWrapper>
        <FormSubmitButton>Save Changes</FormSubmitButton>
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(
      <TestWrapper>
        <FormSubmitButton disabled />
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toBeDisabled();
  });

  it('handles click events when not loading', () => {
    const handleClick = vi.fn();
    render(
      <TestWrapper>
        <FormSubmitButton onClick={handleClick} />
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalled();
  });

  it('applies different button types', () => {
    const { rerender } = render(
      <TestWrapper>
        <FormSubmitButton type="default" />
      </TestWrapper>
    );

    let button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <FormSubmitButton type="primary" />
      </TestWrapper>
    );

    button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toHaveClass('ant-btn-primary');
  });

  it('applies different sizes', () => {
    render(
      <TestWrapper>
        <FormSubmitButton size="small" />
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toHaveClass('ant-btn-sm');
  });
});

describe('FormLoadingOverlay', () => {
  it('renders children without overlay when not loading', () => {
    render(
      <TestWrapper>
        <FormLoadingOverlay>
          <div>Form content</div>
        </FormLoadingOverlay>
      </TestWrapper>
    );

    expect(screen.getByText('Form content')).toBeInTheDocument();
    expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
  });

  it('shows overlay when loading', () => {
    render(
      <TestWrapper>
        <FormLoadingOverlay loading>
          <div>Form content</div>
        </FormLoadingOverlay>
      </TestWrapper>
    );

    expect(screen.getByText('Form content')).toBeInTheDocument();
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('shows custom loading message', () => {
    render(
      <TestWrapper>
        <FormLoadingOverlay loading message="Saving data...">
          <div>Form content</div>
        </FormLoadingOverlay>
      </TestWrapper>
    );

    expect(screen.getByText('Saving data...')).toBeInTheDocument();
  });

  it('hides message when message is empty', () => {
    render(
      <TestWrapper>
        <FormLoadingOverlay loading message="">
          <div>Form content</div>
        </FormLoadingOverlay>
      </TestWrapper>
    );

    expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <FormLoadingOverlay className="custom-overlay">
          <div>Form content</div>
        </FormLoadingOverlay>
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('custom-overlay');
  });
});

describe('FormFieldSpinner', () => {
  it('does not render when not loading', () => {
    const { container } = render(
      <TestWrapper>
        <FormFieldSpinner />
      </TestWrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders when loading', () => {
    const { container } = render(
      <TestWrapper>
        <FormFieldSpinner loading />
      </TestWrapper>
    );

    expect(container.firstChild).toBeInTheDocument();
    expect(document.querySelector('.anticon-loading')).toBeInTheDocument();
  });

  it('applies different sizes', () => {
    const { rerender, container } = render(
      <TestWrapper>
        <FormFieldSpinner loading size="small" />
      </TestWrapper>
    );

    expect(container.firstChild).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <FormFieldSpinner loading size="large" />
      </TestWrapper>
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <FormFieldSpinner loading className="custom-spinner" />
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('custom-spinner');
  });
});

describe('FormProgressIndicator', () => {
  it('renders with default props', () => {
    render(
      <TestWrapper>
        <FormProgressIndicator />
      </TestWrapper>
    );

    expect(screen.getByText('Step 0 of 1')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('calculates percentage correctly', () => {
    render(
      <TestWrapper>
        <FormProgressIndicator current={2} total={4} />
      </TestWrapper>
    );

    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('hides steps when showSteps is false', () => {
    render(
      <TestWrapper>
        <FormProgressIndicator current={1} total={3} showSteps={false} />
      </TestWrapper>
    );

    expect(screen.queryByText('Step 1 of 3')).not.toBeInTheDocument();
  });

  it('hides percentage when showPercentage is false', () => {
    render(
      <TestWrapper>
        <FormProgressIndicator current={1} total={2} showPercentage={false} />
      </TestWrapper>
    );

    expect(screen.getByText('Step 1 of 2')).toBeInTheDocument();
    expect(screen.queryByText('50%')).not.toBeInTheDocument();
  });

  it('applies progress bar width correctly', () => {
    const { container } = render(
      <TestWrapper>
        <FormProgressIndicator current={3} total={4} />
      </TestWrapper>
    );

    const progressBar = container.querySelector('.bg-blue-500');
    expect(progressBar).toHaveStyle({ width: '75%' });
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <FormProgressIndicator className="custom-progress" />
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('custom-progress');
  });
});

describe('FormSavingIndicator', () => {
  it('does not render when status is idle', () => {
    const { container } = render(
      <TestWrapper>
        <FormSavingIndicator status="idle" />
      </TestWrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders saving state', () => {
    render(
      <TestWrapper>
        <FormSavingIndicator status="saving" />
      </TestWrapper>
    );

    expect(screen.getByText('Saving...')).toBeInTheDocument();
    expect(document.querySelector('.anticon-loading')).toBeInTheDocument();
  });

  it('renders saved state', () => {
    render(
      <TestWrapper>
        <FormSavingIndicator status="saved" />
      </TestWrapper>
    );

    expect(screen.getByText('Saved')).toBeInTheDocument();
    // Check for green indicator dot
    const indicator = document.querySelector('.bg-green-500');
    expect(indicator).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(
      <TestWrapper>
        <FormSavingIndicator status="error" />
      </TestWrapper>
    );

    expect(screen.getByText('Save failed')).toBeInTheDocument();
    // Check for red indicator dot
    const indicator = document.querySelector('.bg-red-500');
    expect(indicator).toBeInTheDocument();
  });

  it('uses custom text props', () => {
    render(
      <TestWrapper>
        <FormSavingIndicator 
          status="saving" 
          savingText="Auto-saving..."
        />
      </TestWrapper>
    );

    expect(screen.getByText('Auto-saving...')).toBeInTheDocument();
  });

  it('applies correct styling for each status', () => {
    const { rerender, container } = render(
      <TestWrapper>
        <FormSavingIndicator status="saving" />
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('text-gray-500');

    rerender(
      <TestWrapper>
        <FormSavingIndicator status="saved" />
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('text-green-600');

    rerender(
      <TestWrapper>
        <FormSavingIndicator status="error" />
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('text-red-600');
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <FormSavingIndicator status="saved" className="custom-indicator" />
      </TestWrapper>
    );

    expect(container.firstChild).toHaveClass('custom-indicator');
  });
});