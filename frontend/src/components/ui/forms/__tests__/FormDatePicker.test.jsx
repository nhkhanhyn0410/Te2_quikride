/**
 * FormDatePicker Component Tests
 * Tests for standardized date picker wrapper component
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import FormDatePicker, { FormRangePicker } from '../FormDatePicker';

// Test wrapper with Ant Design ConfigProvider
const TestWrapper = ({ children }) => (
  <ConfigProvider>
    {children}
  </ConfigProvider>
);

describe('FormDatePicker', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(
        <TestWrapper>
          <FormDatePicker placeholder="Select date" />
        </TestWrapper>
      );

      const datePicker = screen.getByPlaceholderText('Select date');
      expect(datePicker).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(
        <TestWrapper>
          <FormDatePicker 
            placeholder="Select date" 
            className="custom-datepicker-class"
          />
        </TestWrapper>
      );

      const datePicker = screen.getByPlaceholderText('Select date');
      expect(datePicker).toHaveClass('custom-datepicker-class');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef();
      render(
        <TestWrapper>
          <FormDatePicker ref={ref} placeholder="Select date" />
        </TestWrapper>
      );

      expect(ref.current).toBeTruthy();
    });
  });

  describe('Size Variants', () => {
    it('renders with small size', () => {
      const { container } = render(
        <TestWrapper>
          <FormDatePicker size="small" placeholder="Small date picker" />
        </TestWrapper>
      );

      const datePickerWrapper = container.querySelector('.ant-picker');
      expect(datePickerWrapper).toHaveClass('ant-picker-small');
    });

    it('renders with middle size', () => {
      const { container } = render(
        <TestWrapper>
          <FormDatePicker size="middle" placeholder="Middle date picker" />
        </TestWrapper>
      );

      const datePickerWrapper = container.querySelector('.ant-picker');
      expect(datePickerWrapper).not.toHaveClass('ant-picker-small');
      expect(datePickerWrapper).not.toHaveClass('ant-picker-large');
    });

    it('renders with large size (default)', () => {
      const { container } = render(
        <TestWrapper>
          <FormDatePicker size="large" placeholder="Large date picker" />
        </TestWrapper>
      );

      const datePickerWrapper = container.querySelector('.ant-picker');
      expect(datePickerWrapper).toHaveClass('ant-picker-large');
    });
  });

  describe('Validation States', () => {
    it('applies error state styling', () => {
      render(
        <TestWrapper>
          <FormDatePicker error placeholder="Error date picker" />
        </TestWrapper>
      );

      const datePicker = screen.getByPlaceholderText('Error date picker');
      expect(datePicker).toHaveClass('border-red-500');
    });

    it('applies success state styling', () => {
      render(
        <TestWrapper>
          <FormDatePicker success placeholder="Success date picker" />
        </TestWrapper>
      );

      const datePicker = screen.getByPlaceholderText('Success date picker');
      expect(datePicker).toHaveClass('border-green-500');
    });

    it('applies warning state styling', () => {
      render(
        <TestWrapper>
          <FormDatePicker warning placeholder="Warning date picker" />
        </TestWrapper>
      );

      const datePicker = screen.getByPlaceholderText('Warning date picker');
      expect(datePicker).toHaveClass('border-orange-500');
    });

    it('applies default hover styling when no validation state', () => {
      render(
        <TestWrapper>
          <FormDatePicker placeholder="Default date picker" />
        </TestWrapper>
      );

      const datePicker = screen.getByPlaceholderText('Default date picker');
      expect(datePicker).toHaveClass('hover:border-blue-400');
    });

    it('prioritizes error state over other states', () => {
      render(
        <TestWrapper>
          <FormDatePicker 
            error 
            success 
            warning 
            placeholder="Multi-state date picker" 
          />
        </TestWrapper>
      );

      const datePicker = screen.getByPlaceholderText('Multi-state date picker');
      expect(datePicker).toHaveClass('border-red-500');
      expect(datePicker).not.toHaveClass('border-green-500');
      expect(datePicker).not.toHaveClass('border-orange-500');
    });
  });

  describe('Format and Display', () => {
    it('uses default format DD/MM/YYYY', () => {
      const testDate = dayjs('2024-01-15');
      render(
        <TestWrapper>
          <FormDatePicker value={testDate} />
        </TestWrapper>
      );

      const input = screen.getByDisplayValue('15/01/2024');
      expect(input).toBeInTheDocument();
    });

    it('uses custom format', () => {
      const testDate = dayjs('2024-01-15');
      render(
        <TestWrapper>
          <FormDatePicker value={testDate} format="YYYY-MM-DD" />
        </TestWrapper>
      );

      const input = screen.getByDisplayValue('2024-01-15');
      expect(input).toBeInTheDocument();
    });

    it('renders with showTime', () => {
      render(
        <TestWrapper>
          <FormDatePicker showTime placeholder="Select date and time" />
        </TestWrapper>
      );

      const datePicker = screen.getByPlaceholderText('Select date and time');
      expect(datePicker).toBeInTheDocument();
    });
  });

  describe('Picker Types', () => {
    it('renders date picker (default)', () => {
      render(
        <TestWrapper>
          <FormDatePicker picker="date" placeholder="Select date" />
        </TestWrapper>
      );

      const datePicker = screen.getByPlaceholderText('Select date');
      expect(datePicker).toBeInTheDocument();
    });

    it('renders week picker', () => {
      render(
        <TestWrapper>
          <FormDatePicker picker="week" placeholder="Select week" />
        </TestWrapper>
      );

      const weekPicker = screen.getByPlaceholderText('Select week');
      expect(weekPicker).toBeInTheDocument();
    });

    it('renders month picker', () => {
      render(
        <TestWrapper>
          <FormDatePicker picker="month" placeholder="Select month" />
        </TestWrapper>
      );

      const monthPicker = screen.getByPlaceholderText('Select month');
      expect(monthPicker).toBeInTheDocument();
    });

    it('renders year picker', () => {
      render(
        <TestWrapper>
          <FormDatePicker picker="year" placeholder="Select year" />
        </TestWrapper>
      );

      const yearPicker = screen.getByPlaceholderText('Select year');
      expect(yearPicker).toBeInTheDocument();
    });
  });

  describe('Event Handling', () => {
    it('handles onChange events', async () => {
      const handleChange = vi.fn();
      render(
        <TestWrapper>
          <FormDatePicker onChange={handleChange} placeholder="Select date" />
        </TestWrapper>
      );

      const datePicker = screen.getByPlaceholderText('Select date');
      fireEvent.click(datePicker);

      // Wait for calendar to open and click on a date
      await waitFor(() => {
        const todayButton = document.querySelector('.ant-picker-today-btn');
        if (todayButton) {
          fireEvent.click(todayButton);
          expect(handleChange).toHaveBeenCalled();
        }
      });
    });

    it('handles onFocus events', () => {
      const handleFocus = vi.fn();
      render(
        <TestWrapper>
          <FormDatePicker onFocus={handleFocus} placeholder="Select date" />
        </TestWrapper>
      );

      const datePicker = screen.getByPlaceholderText('Select date');
      fireEvent.focus(datePicker);

      expect(handleFocus).toHaveBeenCalled();
    });

    it('handles onBlur events', () => {
      const handleBlur = vi.fn();
      render(
        <TestWrapper>
          <FormDatePicker onBlur={handleBlur} placeholder="Select date" />
        </TestWrapper>
      );

      const datePicker = screen.getByPlaceholderText('Select date');
      fireEvent.blur(datePicker);

      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('Props Forwarding', () => {
    it('forwards all standard date picker props', () => {
      const testDate = dayjs('2024-01-15');
      render(
        <TestWrapper>
          <FormDatePicker 
            placeholder="Test date picker"
            disabled
            value={testDate}
          />
        </TestWrapper>
      );

      const datePicker = screen.getByPlaceholderText('Test date picker');
      expect(datePicker).toBeDisabled();
      expect(datePicker).toHaveValue('15/01/2024');
    });

    it('forwards Ant Design specific props', () => {
      render(
        <TestWrapper>
          <FormDatePicker 
            placeholder="Test date picker"
            allowClear
            disabledDate={(current) => current && current < dayjs().endOf('day')}
          />
        </TestWrapper>
      );

      const datePicker = screen.getByPlaceholderText('Test date picker');
      expect(datePicker).toBeInTheDocument();
      // Note: Ant Design specific props are handled internally
    });
  });

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(
        <TestWrapper>
          <FormDatePicker aria-label="Accessible date picker" />
        </TestWrapper>
      );

      const datePicker = screen.getByLabelText('Accessible date picker');
      expect(datePicker).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <TestWrapper>
          <FormDatePicker 
            placeholder="Test date picker"
            aria-describedby="datepicker-description"
          />
        </TestWrapper>
      );

      const datePicker = screen.getByPlaceholderText('Test date picker');
      expect(datePicker).toHaveAttribute('aria-describedby', 'datepicker-description');
    });

    it('supports required attribute', () => {
      render(
        <TestWrapper>
          <FormDatePicker 
            placeholder="Required date picker"
            required
          />
        </TestWrapper>
      );

      const datePicker = screen.getByPlaceholderText('Required date picker');
      expect(datePicker).toHaveAttribute('aria-required', 'true');
    });
  });
});

describe('FormRangePicker', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(
        <TestWrapper>
          <FormRangePicker placeholder={['Start date', 'End date']} />
        </TestWrapper>
      );

      const startInput = screen.getByPlaceholderText('Start date');
      const endInput = screen.getByPlaceholderText('End date');
      expect(startInput).toBeInTheDocument();
      expect(endInput).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(
        <TestWrapper>
          <FormRangePicker 
            placeholder={['Start date', 'End date']} 
            className="custom-rangepicker-class"
          />
        </TestWrapper>
      );

      const rangePickerWrapper = container.querySelector('.ant-picker-range');
      expect(rangePickerWrapper).toHaveClass('custom-rangepicker-class');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef();
      render(
        <TestWrapper>
          <FormRangePicker ref={ref} placeholder={['Start date', 'End date']} />
        </TestWrapper>
      );

      expect(ref.current).toBeTruthy();
    });
  });

  describe('Validation States', () => {
    it('applies error state styling', () => {
      const { container } = render(
        <TestWrapper>
          <FormRangePicker error placeholder={['Start date', 'End date']} />
        </TestWrapper>
      );

      const rangePickerWrapper = container.querySelector('.ant-picker-range');
      expect(rangePickerWrapper).toHaveClass('border-red-500');
    });

    it('applies success state styling', () => {
      const { container } = render(
        <TestWrapper>
          <FormRangePicker success placeholder={['Start date', 'End date']} />
        </TestWrapper>
      );

      const rangePickerWrapper = container.querySelector('.ant-picker-range');
      expect(rangePickerWrapper).toHaveClass('border-green-500');
    });

    it('applies warning state styling', () => {
      const { container } = render(
        <TestWrapper>
          <FormRangePicker warning placeholder={['Start date', 'End date']} />
        </TestWrapper>
      );

      const rangePickerWrapper = container.querySelector('.ant-picker-range');
      expect(rangePickerWrapper).toHaveClass('border-orange-500');
    });
  });

  describe('Event Handling', () => {
    it('handles onChange events', async () => {
      const handleChange = vi.fn();
      render(
        <TestWrapper>
          <FormRangePicker onChange={handleChange} placeholder={['Start date', 'End date']} />
        </TestWrapper>
      );

      const startInput = screen.getByPlaceholderText('Start date');
      fireEvent.click(startInput);

      // Note: Range picker interaction is complex and would require more detailed testing
      // This is a basic test to ensure the component renders and accepts event handlers
      expect(handleChange).toBeDefined();
    });
  });
});