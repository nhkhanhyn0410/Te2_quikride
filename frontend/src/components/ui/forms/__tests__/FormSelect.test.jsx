/**
 * FormSelect Component Tests
 * Tests for standardized select wrapper component
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import FormSelect, { Option } from '../FormSelect';

// Test wrapper with Ant Design ConfigProvider
const TestWrapper = ({ children }) => (
  <ConfigProvider>
    {children}
  </ConfigProvider>
);

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3', disabled: true },
];

describe('FormSelect', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(
        <TestWrapper>
          <FormSelect placeholder="Select option" options={mockOptions} />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(
        <TestWrapper>
          <FormSelect 
            placeholder="Select option" 
            options={mockOptions}
            className="custom-select-class"
          />
        </TestWrapper>
      );

      const selectWrapper = container.querySelector('.ant-select');
      expect(selectWrapper).toHaveClass('custom-select-class');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef();
      render(
        <TestWrapper>
          <FormSelect ref={ref} placeholder="Select option" options={mockOptions} />
        </TestWrapper>
      );

      expect(ref.current).toBeTruthy();
    });
  });

  describe('Options Rendering', () => {
    it('renders options from options prop', async () => {
      render(
        <TestWrapper>
          <FormSelect placeholder="Select option" options={mockOptions} />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      fireEvent.mouseDown(select);

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
      });
    });

    it('handles disabled options', async () => {
      render(
        <TestWrapper>
          <FormSelect placeholder="Select option" options={mockOptions} />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      fireEvent.mouseDown(select);

      await waitFor(() => {
        const disabledOption = screen.getByText('Option 3');
        expect(disabledOption.closest('.ant-select-item')).toHaveClass('ant-select-item-option-disabled');
      });
    });

    it('renders empty options array', () => {
      render(
        <TestWrapper>
          <FormSelect placeholder="Select option" options={[]} />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('renders with small size', () => {
      const { container } = render(
        <TestWrapper>
          <FormSelect size="small" placeholder="Small select" options={mockOptions} />
        </TestWrapper>
      );

      const selectWrapper = container.querySelector('.ant-select');
      expect(selectWrapper).toHaveClass('ant-select-sm');
    });

    it('renders with middle size', () => {
      const { container } = render(
        <TestWrapper>
          <FormSelect size="middle" placeholder="Middle select" options={mockOptions} />
        </TestWrapper>
      );

      const selectWrapper = container.querySelector('.ant-select');
      expect(selectWrapper).not.toHaveClass('ant-select-sm');
      expect(selectWrapper).not.toHaveClass('ant-select-lg');
    });

    it('renders with large size (default)', () => {
      const { container } = render(
        <TestWrapper>
          <FormSelect size="large" placeholder="Large select" options={mockOptions} />
        </TestWrapper>
      );

      const selectWrapper = container.querySelector('.ant-select');
      expect(selectWrapper).toHaveClass('ant-select-lg');
    });
  });

  describe('Validation States', () => {
    it('applies error state styling', () => {
      const { container } = render(
        <TestWrapper>
          <FormSelect error placeholder="Error select" options={mockOptions} />
        </TestWrapper>
      );

      const selectWrapper = container.querySelector('.ant-select');
      expect(selectWrapper).toHaveClass('border-red-500');
    });

    it('applies success state styling', () => {
      const { container } = render(
        <TestWrapper>
          <FormSelect success placeholder="Success select" options={mockOptions} />
        </TestWrapper>
      );

      const selectWrapper = container.querySelector('.ant-select');
      expect(selectWrapper).toHaveClass('border-green-500');
    });

    it('applies warning state styling', () => {
      const { container } = render(
        <TestWrapper>
          <FormSelect warning placeholder="Warning select" options={mockOptions} />
        </TestWrapper>
      );

      const selectWrapper = container.querySelector('.ant-select');
      expect(selectWrapper).toHaveClass('border-orange-500');
    });

    it('applies default hover styling when no validation state', () => {
      const { container } = render(
        <TestWrapper>
          <FormSelect placeholder="Default select" options={mockOptions} />
        </TestWrapper>
      );

      const selectWrapper = container.querySelector('.ant-select');
      expect(selectWrapper).toHaveClass('hover:border-blue-400');
    });

    it('prioritizes error state over other states', () => {
      const { container } = render(
        <TestWrapper>
          <FormSelect 
            error 
            success 
            warning 
            placeholder="Multi-state select" 
            options={mockOptions} 
          />
        </TestWrapper>
      );

      const selectWrapper = container.querySelector('.ant-select');
      expect(selectWrapper).toHaveClass('border-red-500');
      expect(selectWrapper).not.toHaveClass('border-green-500');
      expect(selectWrapper).not.toHaveClass('border-orange-500');
    });
  });

  describe('Event Handling', () => {
    it('handles onChange events', async () => {
      const handleChange = vi.fn();
      render(
        <TestWrapper>
          <FormSelect onChange={handleChange} placeholder="Select option" options={mockOptions} />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      fireEvent.mouseDown(select);

      await waitFor(() => {
        const option = screen.getByText('Option 1');
        fireEvent.click(option);
      });

      expect(handleChange).toHaveBeenCalledWith('option1', expect.any(Object));
    });

    it('handles onFocus events', () => {
      const handleFocus = vi.fn();
      render(
        <TestWrapper>
          <FormSelect onFocus={handleFocus} placeholder="Select option" options={mockOptions} />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      fireEvent.focus(select);

      expect(handleFocus).toHaveBeenCalled();
    });

    it('handles onBlur events', () => {
      const handleBlur = vi.fn();
      render(
        <TestWrapper>
          <FormSelect onBlur={handleBlur} placeholder="Select option" options={mockOptions} />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      fireEvent.blur(select);

      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('Props Forwarding', () => {
    it('forwards all standard select props', () => {
      render(
        <TestWrapper>
          <FormSelect 
            placeholder="Test select"
            disabled
            value="option1"
            options={mockOptions}
          />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-disabled', 'true');
    });

    it('forwards Ant Design specific props', () => {
      render(
        <TestWrapper>
          <FormSelect 
            placeholder="Test select"
            allowClear
            showSearch
            options={mockOptions}
          />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      // Note: Ant Design specific props are handled internally
    });
  });

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(
        <TestWrapper>
          <FormSelect aria-label="Accessible select" options={mockOptions} />
        </TestWrapper>
      );

      const select = screen.getByLabelText('Accessible select');
      expect(select).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <TestWrapper>
          <FormSelect 
            placeholder="Test select"
            aria-describedby="select-description"
            options={mockOptions}
          />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-describedby', 'select-description');
    });

    it('supports required attribute', () => {
      render(
        <TestWrapper>
          <FormSelect 
            placeholder="Required select"
            required
            options={mockOptions}
          />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Dropdown Styling', () => {
    it('applies custom dropdown className', async () => {
      render(
        <TestWrapper>
          <FormSelect 
            placeholder="Select option" 
            options={mockOptions}
            error
          />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      fireEvent.mouseDown(select);

      await waitFor(() => {
        const dropdown = document.querySelector('.ant-select-dropdown');
        expect(dropdown).toHaveClass('rounded-lg', 'shadow-lg', 'border-0');
      });
    });
  });
});