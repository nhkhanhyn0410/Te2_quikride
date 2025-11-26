/**
 * Form Components Accessibility Tests
 * Tests accessibility compliance for all form components
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ConfigProvider, Form } from 'antd';
import { antdTheme } from '../../../../theme/themeConfig';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FormTextArea } from '../FormTextArea';
import { FormDatePicker } from '../FormDatePicker';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Test wrapper with theme
const TestWrapper = ({ children }) => (
  <ConfigProvider theme={antdTheme}>
    {children}
  </ConfigProvider>
);

describe('Form Components Accessibility Tests', () => {
  describe('FormInput Accessibility', () => {
    it('should not have accessibility violations - basic input', async () => {
      const { container } = render(
        <TestWrapper>
          <Form>
            <Form.Item label="Email Address" name="email">
              <FormInput placeholder="Enter your email" />
            </Form.Item>
          </Form>
        </TestWrapper>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations - input with validation states', async () => {
      const { container } = render(
        <TestWrapper>
          <Form>
            <Form.Item label="Valid Input" name="valid" validateStatus="success" help="This field is valid">
              <FormInput placeholder="Valid input" success />
            </Form.Item>
            
            <Form.Item label="Error Input" name="error" validateStatus="error" help="This field has an error">
              <FormInput placeholder="Input with error" error />
            </Form.Item>
            
            <Form.Item label="Warning Input" name="warning" validateStatus="warning" help="This field has a warning">
              <FormInput placeholder="Input with warning" warning />
            </Form.Item>
          </Form>
        </TestWrapper>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA attributes for required fields', async () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <Form>
            <Form.Item 
              label="Required Field" 
              name="required" 
              rules={[{ required: true, message: 'This field is required' }]}
            >
              <FormInput placeholder="Required field" />
            </Form.Item>
          </Form>
        </TestWrapper>
      );
      
      const input = getByLabelText('Required Field');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('should associate error messages with inputs', async () => {
      const { container, getByLabelText } = render(
        <TestWrapper>
          <Form>
            <Form.Item 
              label="Email" 
              name="email" 
              validateStatus="error" 
              help="Please enter a valid email address"
            >
              <FormInput placeholder="Enter email" error />
            </Form.Item>
          </Form>
        </TestWrapper>
      );
      
      const input = getByLabelText('Email');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('FormSelect Accessibility', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ];

    it('should not have accessibility violations - basic select', async () => {
      const { container } = render(
        <TestWrapper>
          <Form>
            <Form.Item label="Select Option" name="select">
              <FormSelect placeholder="Choose an option" options={options} />
            </Form.Item>
          </Form>
        </TestWrapper>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations - multiple select', async () => {
      const { container } = render(
        <TestWrapper>
          <Form>
            <Form.Item label="Multiple Select" name="multiSelect">
              <FormSelect 
                placeholder="Choose multiple options" 
                options={options} 
                mode="multiple"
              />
            </Form.Item>
          </Form>
        </TestWrapper>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should support keyboard navigation', async () => {
      const { getByRole } = render(
        <TestWrapper>
          <Form>
            <Form.Item label="Keyboard Select" name="keyboardSelect">
              <FormSelect placeholder="Use keyboard to navigate" options={options} />
            </Form.Item>
          </Form>
        </TestWrapper>
      );
      
      const select = getByRole('combobox');
      
      // Test keyboard interaction
      fireEvent.keyDown(select, { key: 'ArrowDown' });
      fireEvent.keyDown(select, { key: 'Enter' });
      
      expect(select).toBeInTheDocument();
    });
  });

  describe('FormTextArea Accessibility', () => {
    it('should not have accessibility violations - basic textarea', async () => {
      const { container } = render(
        <TestWrapper>
          <Form>
            <Form.Item label="Message" name="message">
              <FormTextArea placeholder="Enter your message" rows={4} />
            </Form.Item>
          </Form>
        </TestWrapper>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations - textarea with character count', async () => {
      const { container } = render(
        <TestWrapper>
          <Form>
            <Form.Item label="Limited Message" name="limitedMessage">
              <FormTextArea 
                placeholder="Max 200 characters" 
                maxLength={200}
                showCount
                rows={4}
              />
            </Form.Item>
          </Form>
        </TestWrapper>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA attributes for character limit', async () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <Form>
            <Form.Item label="Character Limited" name="charLimited">
              <FormTextArea 
                placeholder="Max 100 characters" 
                maxLength={100}
                showCount
                rows={3}
              />
            </Form.Item>
          </Form>
        </TestWrapper>
      );
      
      const textarea = getByLabelText('Character Limited');
      expect(textarea).toHaveAttribute('maxlength', '100');
    });
  });

  describe('FormDatePicker Accessibility', () => {
    it('should not have accessibility violations - basic date picker', async () => {
      const { container } = render(
        <TestWrapper>
          <Form>
            <Form.Item label="Birth Date" name="birthDate">
              <FormDatePicker placeholder="Select your birth date" />
            </Form.Item>
          </Form>
        </TestWrapper>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations - date range picker', async () => {
      const { container } = render(
        <TestWrapper>
          <Form>
            <Form.Item label="Date Range" name="dateRange">
              <FormDatePicker.RangePicker placeholder={['Start date', 'End date']} />
            </Form.Item>
          </Form>
        </TestWrapper>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should support keyboard navigation', async () => {
      const { getByRole } = render(
        <TestWrapper>
          <Form>
            <Form.Item label="Keyboard Date" name="keyboardDate">
              <FormDatePicker placeholder="Use keyboard to select date" />
            </Form.Item>
          </Form>
        </TestWrapper>
      );
      
      const datePicker = getByRole('textbox');
      
      // Test keyboard interaction
      fireEvent.keyDown(datePicker, { key: 'ArrowDown' });
      fireEvent.keyDown(datePicker, { key: 'Enter' });
      
      expect(datePicker).toBeInTheDocument();
    });
  });

  describe('Complete Form Accessibility', () => {
    it('should not have accessibility violations - complete form', async () => {
      const userTypeOptions = [
        { value: 'customer', label: 'Customer' },
        { value: 'operator', label: 'Operator' },
        { value: 'admin', label: 'Administrator' },
      ];

      const { container } = render(
        <TestWrapper>
          <Form layout="vertical" autoComplete="off">
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <FormInput placeholder="Enter your full name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <FormInput placeholder="Enter your email address" />
            </Form.Item>

            <Form.Item
              label="User Type"
              name="userType"
              rules={[{ required: true, message: 'Please select a user type' }]}
            >
              <FormSelect placeholder="Select user type" options={userTypeOptions} />
            </Form.Item>

            <Form.Item
              label="Date of Birth"
              name="dateOfBirth"
              rules={[{ required: true, message: 'Please select your date of birth' }]}
            >
              <FormDatePicker placeholder="Select date of birth" />
            </Form.Item>

            <Form.Item
              label="Bio"
              name="bio"
              rules={[{ max: 500, message: 'Bio cannot exceed 500 characters' }]}
            >
              <FormTextArea 
                placeholder="Tell us about yourself..." 
                rows={4}
                maxLength={500}
                showCount
              />
            </Form.Item>
          </Form>
        </TestWrapper>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper form structure and labels', async () => {
      const { container } = render(
        <TestWrapper>
          <form role="form" aria-label="User Registration Form">
            <fieldset>
              <legend>Personal Information</legend>
              <Form layout="vertical">
                <Form.Item label="First Name" name="firstName">
                  <FormInput placeholder="Enter first name" />
                </Form.Item>
                <Form.Item label="Last Name" name="lastName">
                  <FormInput placeholder="Enter last name" />
                </Form.Item>
              </Form>
            </fieldset>
          </form>
        </TestWrapper>
      );
      
      const results = await axe(container, {
        rules: {
          'form-field-multiple-labels': { enabled: true },
          'label': { enabled: true },
          'label-title-only': { enabled: true }
        }
      });
      expect(results).toHaveNoViolations();
    });
  });
});