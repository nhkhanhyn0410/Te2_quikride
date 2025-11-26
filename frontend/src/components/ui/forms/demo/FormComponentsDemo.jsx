/**
 * Form Components Demo
 * Comprehensive demonstration of all standardized form components
 */

import React, { useState } from 'react';
import { Form, Button, Space, Card, Tabs } from 'antd';
import {
  // Input Components
  FormInput,
  FormSelect,
  FormTextArea,
  FormDatePicker,
  FormRangePicker,
  
  // Validation Components
  FormFieldError,
  FormFieldSuccess,
  FormFieldWarning,
  FormFieldHelp,
  ValidationStateIndicator,
  FormErrorSummary,
  FormSuccessSummary,
  
  // Loading Components
  FormSubmitButton,
  FormLoadingOverlay,
  FormFieldSpinner,
  FormProgressIndicator,
  FormSavingIndicator,
  
  // Layout Components
  FormSection,
  FormActions,
  FormGrid,
  FormField,
  FormContainer,
  
  // Multi-Step Components
  MultiStepForm,
  StepContent,
} from '../index';

const { TabPane } = Tabs;

const FormComponentsDemo = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState('idle');
  const [showErrors, setShowErrors] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
  ];

  const mockErrors = [
    'Email is required',
    'Password must be at least 8 characters',
    { field: 'phone', message: 'Invalid phone number format' },
  ];

  const multiStepFormSteps = [
    {
      title: 'Personal Information',
      description: 'Enter your basic details',
      content: (
        <StepContent title="Personal Details" description="Please provide your personal information">
          <FormGrid columns={{ xs: 1, md: 2 }}>
            <FormField label="First Name" required>
              <FormInput placeholder="Enter first name" />
            </FormField>
            <FormField label="Last Name" required>
              <FormInput placeholder="Enter last name" />
            </FormField>
            <FormField label="Email" required error="Please enter a valid email">
              <FormInput placeholder="Enter email" error />
            </FormField>
            <FormField label="Phone" success="Phone number is valid">
              <FormInput placeholder="Enter phone number" success />
            </FormField>
          </FormGrid>
        </StepContent>
      ),
    },
    {
      title: 'Address Information',
      description: 'Provide your address details',
      content: (
        <StepContent title="Address Details" description="Please provide your address information">
          <FormGrid columns={{ xs: 1, md: 1 }}>
            <FormField label="Street Address" required>
              <FormInput placeholder="Enter street address" />
            </FormField>
            <FormGrid columns={{ xs: 1, md: 3 }}>
              <FormField label="City" required>
                <FormInput placeholder="Enter city" />
              </FormField>
              <FormField label="State" required>
                <FormSelect placeholder="Select state" options={selectOptions} />
              </FormField>
              <FormField label="ZIP Code" required>
                <FormInput placeholder="Enter ZIP code" />
              </FormField>
            </FormGrid>
          </FormGrid>
        </StepContent>
      ),
    },
    {
      title: 'Review & Submit',
      description: 'Review your information',
      content: (
        <StepContent title="Review Information" description="Please review your information before submitting">
          <div className="space-y-4">
            <Card size="small">
              <h4 className="font-medium mb-2">Personal Information</h4>
              <p className="text-sm text-gray-600">John Doe • john@example.com • (555) 123-4567</p>
            </Card>
            <Card size="small">
              <h4 className="font-medium mb-2">Address Information</h4>
              <p className="text-sm text-gray-600">123 Main St, Anytown, CA 12345</p>
            </Card>
          </div>
        </StepContent>
      ),
    },
  ];

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  const handleAutoSave = () => {
    setSavingStatus('saving');
    setTimeout(() => {
      setSavingStatus('saved');
      setTimeout(() => setSavingStatus('idle'), 2000);
    }, 1000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Form Components Demo</h1>
      
      <Tabs defaultActiveKey="1" size="large">
        <TabPane tab="Input Components" key="1">
          <FormContainer maxWidth="lg">
            <FormSection title="Form Input Components" subtitle="Standardized input components with consistent styling">
              <FormGrid columns={{ xs: 1, md: 2 }}>
                <FormField label="Standard Input" help="Enter any text">
                  <FormInput placeholder="Standard input" />
                </FormField>
                
                <FormField label="Error State Input" error="This field is required">
                  <FormInput placeholder="Error input" error />
                </FormField>
                
                <FormField label="Success State Input" success="Input is valid">
                  <FormInput placeholder="Success input" success />
                </FormField>
                
                <FormField label="Warning State Input" warning="Check this field">
                  <FormInput placeholder="Warning input" warning />
                </FormField>
                
                <FormField label="Select Dropdown" required>
                  <FormSelect placeholder="Choose an option" options={selectOptions} />
                </FormField>
                
                <FormField label="Date Picker">
                  <FormDatePicker placeholder="Select date" />
                </FormField>
              </FormGrid>
              
              <FormField label="Text Area" help="Enter detailed information">
                <FormTextArea 
                  placeholder="Enter detailed text here..." 
                  rows={4}
                  maxLength={500}
                  showCount
                />
              </FormField>
              
              <FormField label="Date Range Picker">
                <FormRangePicker placeholder={['Start date', 'End date']} />
              </FormField>
            </FormSection>
          </FormContainer>
        </TabPane>

        <TabPane tab="Validation & Feedback" key="2">
          <FormContainer maxWidth="lg">
            <FormSection title="Validation Components" subtitle="Error handling and feedback components">
              <Space direction="vertical" size="large" className="w-full">
                <div>
                  <Button onClick={() => setShowErrors(!showErrors)}>
                    Toggle Error Summary
                  </Button>
                  <FormErrorSummary 
                    errors={mockErrors} 
                    visible={showErrors}
                    title="Please fix the following issues:"
                  />
                </div>
                
                <div>
                  <Button onClick={() => setShowSuccess(!showSuccess)}>
                    Toggle Success Message
                  </Button>
                  <FormSuccessSummary 
                    message="Form submitted successfully!" 
                    visible={showSuccess}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Field-level Feedback</h4>
                    <Space direction="vertical" className="w-full">
                      <FormFieldError message="This field is required" />
                      <FormFieldSuccess message="Email is valid" />
                      <FormFieldWarning message="Password is weak" />
                      <FormFieldHelp message="Enter 8-20 characters" />
                    </Space>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Validation State Indicators</h4>
                    <Space>
                      <ValidationStateIndicator state="error" />
                      <ValidationStateIndicator state="success" />
                      <ValidationStateIndicator state="warning" />
                      <ValidationStateIndicator state="info" />
                    </Space>
                  </div>
                </div>
              </Space>
            </FormSection>
          </FormContainer>
        </TabPane>

        <TabPane tab="Loading States" key="3">
          <FormContainer maxWidth="lg">
            <FormSection title="Loading State Components" subtitle="Loading indicators and progress components">
              <Space direction="vertical" size="large" className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Submit Buttons</h4>
                    <Space direction="vertical">
                      <FormSubmitButton>Normal Submit</FormSubmitButton>
                      <FormSubmitButton loading>Loading Submit</FormSubmitButton>
                      <FormSubmitButton disabled>Disabled Submit</FormSubmitButton>
                    </Space>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Field Spinners</h4>
                    <Space>
                      <FormFieldSpinner loading size="small" />
                      <FormFieldSpinner loading size="default" />
                      <FormFieldSpinner loading size="large" />
                    </Space>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Progress Indicator</h4>
                  <FormProgressIndicator current={2} total={5} />
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Auto-save Indicator</h4>
                  <Space>
                    <Button onClick={handleAutoSave}>Trigger Auto-save</Button>
                    <FormSavingIndicator status={savingStatus} />
                  </Space>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Loading Overlay</h4>
                  <FormLoadingOverlay loading={loading} message="Submitting form...">
                    <div className="p-8 bg-gray-50 rounded-lg">
                      <p>This content will be overlaid when loading.</p>
                      <Button onClick={handleSubmit}>Submit Form</Button>
                    </div>
                  </FormLoadingOverlay>
                </div>
              </Space>
            </FormSection>
          </FormContainer>
        </TabPane>

        <TabPane tab="Layout Components" key="4">
          <FormContainer maxWidth="xl">
            <FormSection 
              title="Form Layout Components" 
              subtitle="Layout patterns and section components"
              divider
            >
              <FormGrid columns={{ xs: 1, md: 3 }}>
                <FormField label="Field 1" required>
                  <FormInput placeholder="Input 1" />
                </FormField>
                <FormField label="Field 2">
                  <FormInput placeholder="Input 2" />
                </FormField>
                <FormField label="Field 3">
                  <FormSelect placeholder="Select option" options={selectOptions} />
                </FormField>
              </FormGrid>
            </FormSection>
            
            <FormSection 
              title="Collapsible Section" 
              subtitle="This section can be collapsed"
              collapsible
            >
              <FormGrid columns={{ xs: 1, md: 2 }}>
                <FormField label="Collapsible Field 1">
                  <FormInput placeholder="Input in collapsible section" />
                </FormField>
                <FormField label="Collapsible Field 2">
                  <FormTextArea placeholder="Textarea in collapsible section" />
                </FormField>
              </FormGrid>
            </FormSection>
            
            <FormActions align="right">
              <Button>Cancel</Button>
              <FormSubmitButton type="primary">Save Changes</FormSubmitButton>
            </FormActions>
          </FormContainer>
        </TabPane>

        <TabPane tab="Multi-Step Form" key="5">
          <FormContainer maxWidth="xl">
            <MultiStepForm 
              steps={multiStepFormSteps}
              onStepChange={(step, prevStep) => console.log('Step changed:', step, prevStep)}
              onComplete={(step) => console.log('Form completed at step:', step)}
            />
          </FormContainer>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default FormComponentsDemo;