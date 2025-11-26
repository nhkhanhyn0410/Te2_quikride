/**
 * Button Components Integration Tests
 * Tests the interaction between StandardButton, ButtonGroup, and ActionButton
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StandardButton, ButtonGroup, ActionButton } from '../index';
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

describe('Button Components Integration', () => {
  beforeEach(() => {
    mockGetIconByContext.mockClear();
  });

  describe('ButtonGroup with StandardButton', () => {
    it('renders multiple StandardButtons in a group with consistent spacing', () => {
      renderWithIconProvider(
        <ButtonGroup spacing="large" align="center">
          <StandardButton variant="primary">Primary</StandardButton>
          <StandardButton variant="secondary">Secondary</StandardButton>
          <StandardButton variant="text">Text</StandardButton>
        </ButtonGroup>
      );

      expect(screen.getByRole('button', { name: /primary/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /secondary/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /text/i })).toBeInTheDocument();
    });

    it('handles mixed button sizes in a group', () => {
      renderWithIconProvider(
        <ButtonGroup>
          <StandardButton size="small">Small</StandardButton>
          <StandardButton size="middle">Middle</StandardButton>
          <StandardButton size="large">Large</StandardButton>
        </ButtonGroup>
      );

      const smallButton = screen.getByRole('button', { name: /small/i });
      const middleButton = screen.getByRole('button', { name: /middle/i });
      const largeButton = screen.getByRole('button', { name: /large/i });

      expect(smallButton).toHaveClass('ant-btn-sm');
      expect(middleButton).toHaveClass('ant-btn');
      expect(largeButton).toHaveClass('ant-btn-lg');
    });
  });

  describe('ButtonGroup with ActionButton', () => {
    it('renders action buttons in a group with proper alignment', () => {
      renderWithIconProvider(
        <ButtonGroup align="right" spacing="middle">
          <ActionButton action="cancel" />
          <ActionButton action="save" />
        </ButtonGroup>
      );

      expect(screen.getByRole('button', { name: /hủy/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /lưu/i })).toBeInTheDocument();
      
      expect(mockGetIconByContext).toHaveBeenCalledWith('action', 'close');
      expect(mockGetIconByContext).toHaveBeenCalledWith('action', 'save');
    });

    it('creates a typical form action group', () => {
      const handleCancel = vi.fn();
      const handleSave = vi.fn();

      renderWithIconProvider(
        <ButtonGroup align="right">
          <ActionButton action="cancel" onClick={handleCancel} />
          <ActionButton action="save" onClick={handleSave} loading={false} />
        </ButtonGroup>
      );

      const cancelButton = screen.getByRole('button', { name: /hủy/i });
      const saveButton = screen.getByRole('button', { name: /lưu/i });

      fireEvent.click(cancelButton);
      fireEvent.click(saveButton);

      expect(handleCancel).toHaveBeenCalledTimes(1);
      expect(handleSave).toHaveBeenCalledTimes(1);
    });
  });

  describe('Mixed Button Types in Group', () => {
    it('renders StandardButton and ActionButton together', () => {
      renderWithIconProvider(
        <ButtonGroup align="space-between">
          <StandardButton variant="text" iconContext="navigation" iconType="back">
            Back to List
          </StandardButton>
          <div>
            <ActionButton action="edit" size="middle" />
            <ActionButton action="delete" size="middle" />
          </div>
        </ButtonGroup>
      );

      expect(screen.getByRole('button', { name: /back to list/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /chỉnh sửa/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /xóa/i })).toBeInTheDocument();

      expect(mockGetIconByContext).toHaveBeenCalledWith('navigation', 'back');
      expect(mockGetIconByContext).toHaveBeenCalledWith('action', 'edit');
      expect(mockGetIconByContext).toHaveBeenCalledWith('action', 'delete');
    });
  });

  describe('Responsive Button Groups', () => {
    it('handles vertical layout for mobile', () => {
      renderWithIconProvider(
        <ButtonGroup direction="vertical" spacing="small">
          <ActionButton action="create" block />
          <ActionButton action="search" block />
          <ActionButton action="filter" block />
        </ButtonGroup>
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('ant-btn-block');
      });
    });

    it('handles wrapping button groups', () => {
      renderWithIconProvider(
        <ButtonGroup wrap spacing="small">
          <ActionButton action="create" />
          <ActionButton action="edit" />
          <ActionButton action="delete" />
          <ActionButton action="search" />
          <ActionButton action="filter" />
          <ActionButton action="export" />
        </ButtonGroup>
      );

      // All buttons should be rendered
      expect(screen.getByRole('button', { name: /tạo mới/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /chỉnh sửa/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /xóa/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /tìm kiếm/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /lọc/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /xuất dữ liệu/i })).toBeInTheDocument();
    });
  });

  describe('Common UI Patterns', () => {
    it('creates a typical CRUD action toolbar', () => {
      const handleCreate = vi.fn();
      const handleEdit = vi.fn();
      const handleDelete = vi.fn();

      renderWithIconProvider(
        <div>
          <ButtonGroup align="left" spacing="middle">
            <ActionButton action="create" onClick={handleCreate} />
            <ActionButton action="search" />
            <ActionButton action="filter" />
          </ButtonGroup>
          
          <ButtonGroup align="right" spacing="small">
            <ActionButton action="edit" onClick={handleEdit} disabled />
            <ActionButton action="delete" onClick={handleDelete} disabled />
          </ButtonGroup>
        </div>
      );

      const createButton = screen.getByRole('button', { name: /tạo mới/i });
      const editButton = screen.getByRole('button', { name: /chỉnh sửa/i });
      const deleteButton = screen.getByRole('button', { name: /xóa/i });

      expect(createButton).not.toBeDisabled();
      expect(editButton).toBeDisabled();
      expect(deleteButton).toBeDisabled();

      fireEvent.click(createButton);
      expect(handleCreate).toHaveBeenCalledTimes(1);
    });

    it('creates a typical modal footer', () => {
      const handleCancel = vi.fn();
      const handleSubmit = vi.fn();

      renderWithIconProvider(
        <ButtonGroup align="right" spacing="middle">
          <StandardButton onClick={handleCancel}>
            Cancel
          </StandardButton>
          <ActionButton action="save" onClick={handleSubmit} loading={false}>
            Submit
          </ActionButton>
        </ButtonGroup>
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      const submitButton = screen.getByRole('button', { name: /submit/i });

      expect(cancelButton).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveClass('ant-btn-primary');
    });

    it('creates a navigation breadcrumb with buttons', () => {
      renderWithIconProvider(
        <ButtonGroup align="left" spacing="small">
          <StandardButton variant="text" iconContext="navigation" iconType="home">
            Home
          </StandardButton>
          <StandardButton variant="text">
            Category
          </StandardButton>
          <StandardButton variant="text" disabled>
            Current Page
          </StandardButton>
        </ButtonGroup>
      );

      const homeButton = screen.getByRole('button', { name: /home/i });
      const categoryButton = screen.getByRole('button', { name: /category/i });
      const currentButton = screen.getByRole('button', { name: /current page/i });

      expect(homeButton).not.toBeDisabled();
      expect(categoryButton).not.toBeDisabled();
      expect(currentButton).toBeDisabled();
    });
  });

  describe('Accessibility Integration', () => {
    it('maintains proper focus order in button groups', () => {
      renderWithIconProvider(
        <ButtonGroup>
          <ActionButton action="back" />
          <ActionButton action="save" />
          <ActionButton action="forward" />
        </ButtonGroup>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
      
      // All buttons should be focusable
      buttons.forEach(button => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('handles disabled state properly in groups', () => {
      renderWithIconProvider(
        <ButtonGroup>
          <ActionButton action="edit" disabled />
          <ActionButton action="delete" disabled />
          <ActionButton action="save" />
        </ButtonGroup>
      );

      const editButton = screen.getByRole('button', { name: /chỉnh sửa/i });
      const deleteButton = screen.getByRole('button', { name: /xóa/i });
      const saveButton = screen.getByRole('button', { name: /lưu/i });

      expect(editButton).toBeDisabled();
      expect(deleteButton).toBeDisabled();
      expect(saveButton).not.toBeDisabled();
    });
  });

  describe('Performance Considerations', () => {
    it('handles large numbers of buttons efficiently', () => {
      const buttons = Array.from({ length: 20 }, (_, i) => (
        <StandardButton key={i} variant={i % 2 === 0 ? 'primary' : 'secondary'}>
          Button {i + 1}
        </StandardButton>
      ));

      renderWithIconProvider(
        <ButtonGroup wrap spacing="small">
          {buttons}
        </ButtonGroup>
      );

      const renderedButtons = screen.getAllByRole('button');
      expect(renderedButtons).toHaveLength(20);
    });
  });
});