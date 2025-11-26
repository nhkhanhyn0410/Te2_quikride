/**
 * StandardModal Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StandardModal from '../StandardModal';
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

describe('StandardModal', () => {
  beforeEach(() => {
    mockGetIconByContext.mockClear();
  });

  it('renders with basic props', () => {
    renderWithIconProvider(
      <StandardModal
        title="Test Modal"
        open={true}
        onCancel={() => {}}
        onOk={() => {}}
      >
        <div>Modal content</div>
      </StandardModal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('renders title with icon using iconContext and iconType', () => {
    renderWithIconProvider(
      <StandardModal
        title="Test Modal"
        titleIconContext="status"
        titleIconType="info"
        open={true}
        onCancel={() => {}}
        onOk={() => {}}
      >
        <div>Modal content</div>
      </StandardModal>
    );

    expect(mockGetIconByContext).toHaveBeenCalledWith('status', 'info');
    expect(screen.getByTestId('icon-status-info')).toBeInTheDocument();
  });

  it('renders with custom title icon', () => {
    const customIcon = <span data-testid="custom-icon">Custom</span>;
    
    renderWithIconProvider(
      <StandardModal
        title="Test Modal"
        titleIcon={customIcon}
        open={true}
        onCancel={() => {}}
        onOk={() => {}}
      >
        <div>Modal content</div>
      </StandardModal>
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders default footer with OK and Cancel buttons', () => {
    renderWithIconProvider(
      <StandardModal
        title="Test Modal"
        open={true}
        onCancel={() => {}}
        onOk={() => {}}
      >
        <div>Modal content</div>
      </StandardModal>
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
  });

  it('handles custom button text', () => {
    renderWithIconProvider(
      <StandardModal
        title="Test Modal"
        open={true}
        onCancel={() => {}}
        onOk={() => {}}
        okText="Save"
        cancelText="Close"
      >
        <div>Modal content</div>
      </StandardModal>
    );

    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('handles custom footer', () => {
    const customFooter = (
      <div data-testid="custom-footer">
        <button>Custom Button</button>
      </div>
    );

    renderWithIconProvider(
      <StandardModal
        title="Test Modal"
        open={true}
        onCancel={() => {}}
        onOk={() => {}}
        customFooter={customFooter}
      >
        <div>Modal content</div>
      </StandardModal>
    );

    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /custom button/i })).toBeInTheDocument();
  });

  it('handles no footer when customFooter is null', () => {
    renderWithIconProvider(
      <StandardModal
        title="Test Modal"
        open={true}
        onCancel={() => {}}
        onOk={() => {}}
        customFooter={null}
      >
        <div>Modal content</div>
      </StandardModal>
    );

    // Should not have default OK/Cancel buttons
    expect(screen.queryByRole('button', { name: /ok/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });

  it('handles showOkButton and showCancelButton props', () => {
    renderWithIconProvider(
      <StandardModal
        title="Test Modal"
        open={true}
        onCancel={() => {}}
        onOk={() => {}}
        showOkButton={false}
        showCancelButton={true}
      >
        <div>Modal content</div>
      </StandardModal>
    );

    expect(screen.queryByRole('button', { name: /ok/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('handles different sizes', () => {
    const sizes = ['small', 'default', 'large', 'extra-large'];
    
    sizes.forEach(size => {
      const { unmount } = renderWithIconProvider(
        <StandardModal
          title={`${size} Modal`}
          open={true}
          onCancel={() => {}}
          onOk={() => {}}
          size={size}
        >
          <div>Modal content</div>
        </StandardModal>
      );

      // Check that modal is rendered (specific width testing would require more complex setup)
      expect(screen.getByText(`${size} Modal`)).toBeInTheDocument();
      
      unmount();
    });
  });

  it('handles loading state', () => {
    renderWithIconProvider(
      <StandardModal
        title="Test Modal"
        open={true}
        onCancel={() => {}}
        onOk={() => {}}
        loading={true}
      >
        <div>Modal content</div>
      </StandardModal>
    );

    const okButton = screen.getByRole('button', { name: /ok/i });
    expect(okButton).toHaveClass('ant-btn-loading');
  });

  it('handles danger state', () => {
    renderWithIconProvider(
      <StandardModal
        title="Test Modal"
        open={true}
        onCancel={() => {}}
        onOk={() => {}}
        danger={true}
      >
        <div>Modal content</div>
      </StandardModal>
    );

    const okButton = screen.getByRole('button', { name: /ok/i });
    expect(okButton).toHaveClass('ant-btn-dangerous');
  });

  it('handles click events', () => {
    const handleOk = vi.fn();
    const handleCancel = vi.fn();

    renderWithIconProvider(
      <StandardModal
        title="Test Modal"
        open={true}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <div>Modal content</div>
      </StandardModal>
    );

    const okButton = screen.getByRole('button', { name: /ok/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    fireEvent.click(okButton);
    fireEvent.click(cancelButton);

    expect(handleOk).toHaveBeenCalledTimes(1);
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    renderWithIconProvider(
      <StandardModal
        title="Test Modal"
        open={true}
        onCancel={() => {}}
        onOk={() => {}}
        className="custom-modal-class"
      >
        <div>Modal content</div>
      </StandardModal>
    );

    // Check that the modal wrapper has the custom class
    const modal = document.querySelector('.custom-modal-class');
    expect(modal).toBeInTheDocument();
  });

  it('handles different footer alignments', () => {
    const alignments = ['left', 'center', 'right', 'space-between'];
    
    alignments.forEach(align => {
      const { unmount } = renderWithIconProvider(
        <StandardModal
          title="Test Modal"
          open={true}
          onCancel={() => {}}
          onOk={() => {}}
          footerAlign={align}
        >
          <div>Modal content</div>
        </StandardModal>
      );

      // Buttons should still be rendered regardless of alignment
      expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      
      unmount();
    });
  });

  it('handles custom action types', () => {
    renderWithIconProvider(
      <StandardModal
        title="Test Modal"
        open={true}
        onCancel={() => {}}
        onOk={() => {}}
        okAction="create"
        cancelAction="back"
      >
        <div>Modal content</div>
      </StandardModal>
    );

    // Should render buttons with action-specific styling
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('passes through additional props to Ant Design Modal', () => {
    renderWithIconProvider(
      <StandardModal
        title="Test Modal"
        open={true}
        onCancel={() => {}}
        onOk={() => {}}
        maskClosable={true}
        keyboard={false}
        data-testid="test-modal"
      >
        <div>Modal content</div>
      </StandardModal>
    );

    // Modal should be rendered with additional props
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });
});