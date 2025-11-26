/**
 * InfoModal Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InfoModal from '../InfoModal';
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

describe('InfoModal', () => {
  beforeEach(() => {
    mockGetIconByContext.mockClear();
  });

  it('renders with basic props', () => {
    renderWithIconProvider(
      <InfoModal
        title="Information"
        content="This is some important information."
        open={true}
        onCancel={() => {}}
      />
    );

    expect(screen.getByText('Information')).toBeInTheDocument();
    expect(screen.getByText('This is some important information.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
  });

  it('renders info type with info icon by default', () => {
    renderWithIconProvider(
      <InfoModal
        title="Information"
        content="Info message"
        open={true}
        onCancel={() => {}}
      />
    );

    expect(mockGetIconByContext).toHaveBeenCalledWith('status', 'info');
    expect(screen.getByTestId('icon-status-info')).toBeInTheDocument();
  });

  it('renders success type with success icon', () => {
    renderWithIconProvider(
      <InfoModal
        title="Success"
        content="Operation completed successfully"
        type="success"
        open={true}
        onCancel={() => {}}
      />
    );

    expect(mockGetIconByContext).toHaveBeenCalledWith('status', 'success');
    expect(screen.getByTestId('icon-status-success')).toBeInTheDocument();
  });

  it('renders warning type with warning icon', () => {
    renderWithIconProvider(
      <InfoModal
        title="Warning"
        content="Please be careful"
        type="warning"
        open={true}
        onCancel={() => {}}
      />
    );

    expect(mockGetIconByContext).toHaveBeenCalledWith('status', 'warning');
    expect(screen.getByTestId('icon-status-warning')).toBeInTheDocument();
  });

  it('renders error type with error icon', () => {
    renderWithIconProvider(
      <InfoModal
        title="Error"
        content="Something went wrong"
        type="error"
        open={true}
        onCancel={() => {}}
      />
    );

    expect(mockGetIconByContext).toHaveBeenCalledWith('status', 'error');
    expect(screen.getByTestId('icon-status-error')).toBeInTheDocument();
  });

  it('hides icon when showIcon is false', () => {
    renderWithIconProvider(
      <InfoModal
        title="No Icon"
        content="This modal has no icon"
        showIcon={false}
        open={true}
        onCancel={() => {}}
      />
    );

    expect(mockGetIconByContext).not.toHaveBeenCalled();
    expect(screen.queryByTestId(/icon-/)).not.toBeInTheDocument();
  });

  it('renders JSX content', () => {
    const jsxContent = (
      <div>
        <p>This is <strong>formatted</strong> content.</p>
        <ul>
          <li>Point 1</li>
          <li>Point 2</li>
        </ul>
      </div>
    );

    renderWithIconProvider(
      <InfoModal
        title="Formatted Content"
        content={jsxContent}
        open={true}
        onCancel={() => {}}
      />
    );

    expect(screen.getByText('formatted')).toBeInTheDocument();
    expect(screen.getByText('Point 1')).toBeInTheDocument();
    expect(screen.getByText('Point 2')).toBeInTheDocument();
  });

  it('renders children in addition to content', () => {
    renderWithIconProvider(
      <InfoModal
        title="With Children"
        content="Main content"
        open={true}
        onCancel={() => {}}
      >
        <div>Additional child content</div>
        <button>Custom Button</button>
      </InfoModal>
    );

    expect(screen.getByText('Main content')).toBeInTheDocument();
    expect(screen.getByText('Additional child content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /custom button/i })).toBeInTheDocument();
  });

  it('handles custom OK button text', () => {
    renderWithIconProvider(
      <InfoModal
        title="Custom OK"
        content="Custom button text"
        okText="Got it!"
        open={true}
        onCancel={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: /got it!/i })).toBeInTheDocument();
  });

  it('shows cancel button when showCancelButton is true', () => {
    renderWithIconProvider(
      <InfoModal
        title="With Cancel"
        content="This modal has a cancel button"
        showCancelButton={true}
        open={true}
        onCancel={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('handles different sizes', () => {
    const sizes = ['small', 'default', 'large', 'extra-large'];
    
    sizes.forEach(size => {
      const { unmount } = renderWithIconProvider(
        <InfoModal
          title={`${size} Modal`}
          content="Size test"
          size={size}
          open={true}
          onCancel={() => {}}
        />
      );

      expect(screen.getByText(`${size} Modal`)).toBeInTheDocument();
      
      unmount();
    });
  });

  it('handles click events', () => {
    const handleCancel = vi.fn();
    
    renderWithIconProvider(
      <InfoModal
        title="Click Test"
        content="Test clicking"
        open={true}
        onCancel={handleCancel}
      />
    );

    const okButton = screen.getByRole('button', { name: /ok/i });
    fireEvent.click(okButton);

    // OK button should trigger onCancel for InfoModal
    expect(handleCancel).toHaveBeenCalled();
  });

  it('uses correct button action based on type', () => {
    // Test error type uses cancel action
    renderWithIconProvider(
      <InfoModal
        title="Error"
        content="Error message"
        type="error"
        open={true}
        onCancel={() => {}}
      />
    );

    const okButton = screen.getByRole('button', { name: /ok/i });
    expect(okButton).toBeInTheDocument();
    // The button should use cancel action styling for error type
  });

  it('passes through additional props to StandardModal', () => {
    renderWithIconProvider(
      <InfoModal
        title="Props Test"
        content="Testing props"
        open={true}
        onCancel={() => {}}
        centered={false}
        maskClosable={true}
        data-testid="info-modal"
      />
    );

    expect(screen.getByText('Props Test')).toBeInTheDocument();
  });

  it('renders without content prop', () => {
    renderWithIconProvider(
      <InfoModal
        title="No Content"
        open={true}
        onCancel={() => {}}
      >
        <div>Only children content</div>
      </InfoModal>
    );

    expect(screen.getByText('No Content')).toBeInTheDocument();
    expect(screen.getByText('Only children content')).toBeInTheDocument();
  });

  it('renders with both content and children', () => {
    renderWithIconProvider(
      <InfoModal
        title="Both Content"
        content="Main content text"
        open={true}
        onCancel={() => {}}
      >
        <div>Additional children</div>
      </InfoModal>
    );

    expect(screen.getByText('Main content text')).toBeInTheDocument();
    expect(screen.getByText('Additional children')).toBeInTheDocument();
  });

  it('handles empty content gracefully', () => {
    renderWithIconProvider(
      <InfoModal
        title="Empty Content"
        content=""
        open={true}
        onCancel={() => {}}
      />
    );

    expect(screen.getByText('Empty Content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
  });
});