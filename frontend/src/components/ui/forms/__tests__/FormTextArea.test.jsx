/**
 * FormTextArea Component Tests
 * Tests for standardized textarea wrapper component
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import FormTextArea from '../FormTextArea';

// Test wrapper with Ant Design ConfigProvider
const TestWrapper = ({ children }) => (
  <ConfigProvider>
    {children}
  </ConfigProvider>
);

describe('FormTextArea', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(
        <TestWrapper>
          <FormTextArea placeholder="Test textarea" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Test textarea');
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('renders with custom className', () => {
      render(
        <TestWrapper>
          <FormTextArea 
            placeholder="Test textarea" 
            className="custom-textarea-class"
          />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Test textarea');
      expect(textarea).toHaveClass('custom-textarea-class');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef();
      render(
        <TestWrapper>
          <FormTextArea ref={ref} placeholder="Test textarea" />
        </TestWrapper>
      );

      expect(ref.current).toBeTruthy();
      expect(ref.current.resizableTextArea.textArea).toBeInstanceOf(HTMLTextAreaElement);
    });
  });

  describe('Size Variants', () => {
    it('renders with small size', () => {
      render(
        <TestWrapper>
          <FormTextArea size="small" placeholder="Small textarea" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Small textarea');
      expect(textarea).toBeInTheDocument();
    });

    it('renders with middle size', () => {
      render(
        <TestWrapper>
          <FormTextArea size="middle" placeholder="Middle textarea" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Middle textarea');
      expect(textarea).toBeInTheDocument();
    });

    it('renders with large size (default)', () => {
      render(
        <TestWrapper>
          <FormTextArea size="large" placeholder="Large textarea" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Large textarea');
      expect(textarea).toBeInTheDocument();
    });
  });

  describe('Resize Behavior', () => {
    it('applies resize none styling', () => {
      render(
        <TestWrapper>
          <FormTextArea resize="none" placeholder="No resize textarea" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('No resize textarea');
      expect(textarea).toHaveClass('resize-none');
      expect(textarea).toHaveStyle({ resize: 'none' });
    });

    it('applies resize vertical styling (default)', () => {
      render(
        <TestWrapper>
          <FormTextArea resize="vertical" placeholder="Vertical resize textarea" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Vertical resize textarea');
      expect(textarea).toHaveClass('resize-y');
      expect(textarea).toHaveStyle({ resize: 'vertical' });
    });

    it('applies resize horizontal styling', () => {
      render(
        <TestWrapper>
          <FormTextArea resize="horizontal" placeholder="Horizontal resize textarea" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Horizontal resize textarea');
      expect(textarea).toHaveClass('resize-x');
      expect(textarea).toHaveStyle({ resize: 'horizontal' });
    });

    it('applies resize both styling', () => {
      render(
        <TestWrapper>
          <FormTextArea resize="both" placeholder="Both resize textarea" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Both resize textarea');
      expect(textarea).toHaveClass('resize');
      expect(textarea).toHaveStyle({ resize: 'both' });
    });
  });

  describe('Validation States', () => {
    it('applies error state styling', () => {
      render(
        <TestWrapper>
          <FormTextArea error placeholder="Error textarea" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Error textarea');
      expect(textarea).toHaveClass('border-red-500');
    });

    it('applies success state styling', () => {
      render(
        <TestWrapper>
          <FormTextArea success placeholder="Success textarea" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Success textarea');
      expect(textarea).toHaveClass('border-green-500');
    });

    it('applies warning state styling', () => {
      render(
        <TestWrapper>
          <FormTextArea warning placeholder="Warning textarea" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Warning textarea');
      expect(textarea).toHaveClass('border-orange-500');
    });

    it('applies default hover styling when no validation state', () => {
      render(
        <TestWrapper>
          <FormTextArea placeholder="Default textarea" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Default textarea');
      expect(textarea).toHaveClass('hover:border-blue-400');
    });

    it('prioritizes error state over other states', () => {
      render(
        <TestWrapper>
          <FormTextArea error success warning placeholder="Multi-state textarea" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Multi-state textarea');
      expect(textarea).toHaveClass('border-red-500');
      expect(textarea).not.toHaveClass('border-green-500');
      expect(textarea).not.toHaveClass('border-orange-500');
    });
  });

  describe('Rows and Character Count', () => {
    it('renders with custom rows', () => {
      render(
        <TestWrapper>
          <FormTextArea rows={6} placeholder="Custom rows textarea" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Custom rows textarea');
      expect(textarea).toHaveAttribute('rows', '6');
    });

    it('renders with default rows (4)', () => {
      render(
        <TestWrapper>
          <FormTextArea placeholder="Default rows textarea" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Default rows textarea');
      expect(textarea).toHaveAttribute('rows', '4');
    });

    it('renders with maxLength and showCount', () => {
      render(
        <TestWrapper>
          <FormTextArea 
            maxLength={100} 
            showCount 
            placeholder="Counted textarea" 
          />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Counted textarea');
      expect(textarea).toHaveAttribute('maxlength', '100');
      
      // Character count should be visible
      const countElement = screen.getByText('0 / 100');
      expect(countElement).toBeInTheDocument();
    });

    it('updates character count on input', () => {
      render(
        <TestWrapper>
          <FormTextArea 
            maxLength={100} 
            showCount 
            placeholder="Counted textarea" 
          />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Counted textarea');
      fireEvent.change(textarea, { target: { value: 'Hello World' } });

      const countElement = screen.getByText('11 / 100');
      expect(countElement).toBeInTheDocument();
    });
  });

  describe('Event Handling', () => {
    it('handles onChange events', () => {
      const handleChange = vi.fn();
      render(
        <TestWrapper>
          <FormTextArea onChange={handleChange} placeholder="Test textarea" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Test textarea');
      fireEvent.change(textarea, { target: { value: 'test value' } });

      expect(handleChange).toHaveBeenCalled();
    });

    it('handles onFocus events', () => {
      const handleFocus = vi.fn();
      render(
        <TestWrapper>
          <FormTextArea onFocus={handleFocus} placeholder="Test textarea" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Test textarea');
      fireEvent.focus(textarea);

      expect(handleFocus).toHaveBeenCalled();
    });

    it('handles onBlur events', () => {
      const handleBlur = vi.fn();
      render(
        <TestWrapper>
          <FormTextArea onBlur={handleBlur} placeholder="Test textarea" />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Test textarea');
      fireEvent.blur(textarea);

      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('Props Forwarding', () => {
    it('forwards all standard textarea props', () => {
      render(
        <TestWrapper>
          <FormTextArea 
            placeholder="Test textarea"
            disabled
            readOnly
            value="test content"
          />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Test textarea');
      expect(textarea).toBeDisabled();
      expect(textarea).toHaveAttribute('readonly');
      expect(textarea).toHaveValue('test content');
    });

    it('forwards Ant Design specific props', () => {
      render(
        <TestWrapper>
          <FormTextArea 
            placeholder="Test textarea"
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Test textarea');
      expect(textarea).toBeInTheDocument();
      // Note: Ant Design specific props are handled internally
    });
  });

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(
        <TestWrapper>
          <FormTextArea aria-label="Accessible textarea" />
        </TestWrapper>
      );

      const textarea = screen.getByLabelText('Accessible textarea');
      expect(textarea).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <TestWrapper>
          <FormTextArea 
            placeholder="Test textarea"
            aria-describedby="textarea-description"
          />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Test textarea');
      expect(textarea).toHaveAttribute('aria-describedby', 'textarea-description');
    });

    it('supports required attribute', () => {
      render(
        <TestWrapper>
          <FormTextArea 
            placeholder="Required textarea"
            required
          />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText('Required textarea');
      expect(textarea).toBeRequired();
    });
  });
});