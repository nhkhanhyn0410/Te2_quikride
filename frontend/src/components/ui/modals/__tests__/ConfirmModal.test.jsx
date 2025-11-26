/**
 * ConfirmModal Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConfirmModal from '../ConfirmModal';
import { IconProvider } from '../../../../icons/IconProvider';

// Mock icon provider
const mockGetIconByContext = vi.fn((context, type) => <span data-testid={`icon-${context}-${type}`} />);

const MockIconProvider = ({ children }) => (
  <IconProvider value={{ getIconByContext: mockGetIconByContext }}>
    {children}
  </IconProvider>
);

const renderWithIconProvider = (component) => {
  return render(
    <MockIconProvider>
      {component}
    </MockIconProvider>
  );
};

describe('ConfirmModal', () => {
  beforeEach(() => {
    mockGetIconByContext.mockClear();
  });

  it('renders with basic props', () => {
    renderWithIconProvider(
      <ConfirmModal
        open={true}
        onConfirm={() => {}}
        onCancel={() => {}}
        title="Confirm Action"
        content="Are you sure you want to proceed?"
      />
    );

    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
  });

  it('renders default type with question icon', () => {
    renderWithIconProvider(
      <ConfirmModal
        open={true}
        onConfirm={() => {}}
        onCancel={() => {}}
        title="Confirm Action"
        content="Are you sure?"
      />
    );

    expect(mockGetIconByContext).toHaveBeenCalledWith('status', 'question');
    expect(screen.getByTestId('icon-status-question')).toBeInTheDocument();
  });

  it('renders warning type with warning icon', () => {
    renderWithIconProvider(
      <ConfirmModal
        open={true}
        onConfirm={() => {}}
        onCancel={() => {}}
        type="warning"
        title="Warning"
        content="This action cannot be undone"
      />
    );

    expect(mockGetIconByContext).toHaveBeenCalledWith('status', 'warning');
    expect(screen.getByTestId('icon-status-warning')).toBeInTheDocument();
  });

  it('renders danger type with error icon and danger button', () => {
    renderWithIconProvider(
      <ConfirmModal
        open={true}
        onConfirm={() => {}}
        onCancel={() => {}}
        type="danger"
        title="Delete Item"
        content="This will permanently delete the item"
      />
    );

    expect(mockGetIconByContext).toHaveBeenCalledWith('status', 'error');
    expect(screen.getByTestId('icon-status-error')).toBeInTheDocument();
    
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toHaveClass('ant-btn-dangerous');
  });

  it('renders info type with info icon', () => {
    renderWithIconProvider(
      <ConfirmModal
        open={true}
        onConfirm={() => {}}
        onCancel={() => {}}
        type="info"
        title="Information"
        content="Please confirm this information"
      />
    );

    expect(mockGetIconByContext).toHaveBeenCalledWith('status', 'info');
    expect(screen.getByTestId('icon-status-info')).toBeInTheDocument();
  });

  it('renders with custom icon', () => {
    const customIcon = <span data-testid="custom-icon">Custom</span>;
    
    renderWithIconProvider(
      <ConfirmModal
        open={true}
        onConfirm={() => {}}
        onCancel={() => {}}
        icon={customIcon}
        title="Custom Confirm"
        content="Custom confirmation"
      />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders with custom iconContext and iconType', () => {
    renderWithIconProvider(
      <ConfirmModal
        open={true}
        onConfirm={() => {}}
        onCancel={() => {}}
        iconContext="action"
        iconType="delete"
        title="Delete Confirm"
        content="Delete this item?"
      />
    );

    expect(mockGetIconByContext).toHaveBeenCalledWith('action', 'delete');
    expect(screen.getByTestId('icon-action-delete')).toBeInTheDocument();
  });

  it('handles custom button text', () => {
    renderWithIconProvider(
      <ConfirmModal
        open={true}
        onConfirm={() => {}}
        onCancel={() => {}}
        confirmText="Yes, Delete"
        cancelText="No, Keep"
        title="Delete Item"
        content="Are you sure?"
      />
    );

    expect(screen.getByRole('button', { name: /yes, delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /no, keep/i })).toBeInTheDocument();
  });

  it('handles loading state', () => {
    renderWithIconProvider(
      <ConfirmModal
        open={true}
        onConfirm={() => {}}
        onCancel={() => {}}
        loading={true}
        title="Processing"
        content="Please wait..."
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toHaveClass('ant-btn-loading');
  });

  it('handles click events', () => {
    const handleConfirm = vi.fn();
    const handleCancel = vi.fn();

    renderWithIconProvider(
      <ConfirmModal
        open={true}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title="Confirm Action"
        content="Are you sure?"
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    fireEvent.click(confirmButton);
    fireEvent.click(cancelButton);

    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('renders JSX content', () => {
    const jsxContent = (
      <div>
        <p>This is a <strong>complex</strong> confirmation message.</p>
        <ul>
          <li>Item 1 will be deleted</li>
          <li>Item 2 will be deleted</li>
        </ul>
      </div>
    );

    renderWithIconProvider(
      <ConfirmModal
        open={true}
        onConfirm={() => {}}
        onCancel={() => {}}
        title="Bulk Delete"
        content={jsxContent}
      />
    );

    expect(screen.getByText('complex')).toBeInTheDocument();
    expect(screen.getByText('Item 1 will be deleted')).toBeInTheDocument();
    expect(screen.getByText('Item 2 will be deleted')).toBeInTheDocument();
  });

  it('passes through additional props to Modal', () => {
    renderWithIconProvider(
      <ConfirmModal
        open={true}
        onConfirm={() => {}}
        onCancel={() => {}}
        title="Confirm"
        content="Are you sure?"
        maskClosable={false}
        keyboard={false}
        data-testid="confirm-modal"
      />
    );

    // Modal should be rendered with additional props
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('handles different button actions based on type', () => {
    // Test danger type uses delete action
    const { unmount } = renderWithIconProvider(
      <ConfirmModal
        open={true}
        onConfirm={() => {}}
        onCancel={() => {}}
        type="danger"
        title="Delete"
        content="Delete item?"
      />
    );

    let confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toHaveClass('ant-btn-dangerous');
    
    unmount();

    // Test warning type uses approve action
    renderWithIconProvider(
      <ConfirmModal
        open={true}
        onConfirm={() => {}}
        onCancel={() => {}}
        type="warning"
        title="Warning"
        content="Proceed with caution?"
      />
    );

    confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toHaveClass('ant-btn-primary');
  });

  it('prioritizes custom icon over type-based icon', () => {
    const customIcon = <span data-testid="custom-icon">Custom</span>;
    
    renderWithIconProvider(
      <ConfirmModal
        open={true}
        onConfirm={() => {}}
        onCancel={() => {}}
        type="danger"
        icon={customIcon}
        title="Custom Confirm"
        content="Custom confirmation"
      />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-status-error')).not.toBeInTheDocument();
  });
});