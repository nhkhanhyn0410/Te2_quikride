import { FormInput } from '../../components/ui/forms/FormInput';
import { FormSelect } from '../../components/ui/forms/FormSelect';
import { FormTextArea } from '../../components/ui/forms/FormTextArea';
import { FormDatePicker } from '../../components/ui/forms/FormDatePicker';
import { StandardButton } from '../../components/ui/buttons/StandardButton';
import { Form } from 'antd';

export default {
  title: 'UI Components/Forms/Form Components',
  parameters: {
    docs: {
      description: {
        component: 'Standardized form components with consistent styling, validation, and error states.',
      },
    },
  },
};

// Form Input variations
export const FormInputs = () => (
  <Form layout="vertical" style={{ maxWidth: '400px' }}>
    <Form.Item label="Default Input" name="default">
      <FormInput placeholder="Enter text..." />
    </Form.Item>
    
    <Form.Item label="Required Input" name="required" rules={[{ required: true, message: 'This field is required' }]}>
      <FormInput placeholder="Required field" />
    </Form.Item>
    
    <Form.Item label="Disabled Input" name="disabled">
      <FormInput placeholder="Disabled input" disabled />
    </Form.Item>
    
    <Form.Item label="Input with Error" name="error" validateStatus="error" help="This field has an error">
      <FormInput placeholder="Input with error" />
    </Form.Item>
    
    <Form.Item label="Input with Success" name="success" validateStatus="success" help="This field is valid">
      <FormInput placeholder="Valid input" />
    </Form.Item>
  </Form>
);

// Form Select variations
export const FormSelects = () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' },
  ];

  return (
    <Form layout="vertical" style={{ maxWidth: '400px' }}>
      <Form.Item label="Default Select" name="defaultSelect">
        <FormSelect placeholder="Select an option..." options={options} />
      </Form.Item>
      
      <Form.Item label="Multiple Select" name="multipleSelect">
        <FormSelect 
          placeholder="Select multiple options..." 
          options={options} 
          mode="multiple"
        />
      </Form.Item>
      
      <Form.Item label="Searchable Select" name="searchableSelect">
        <FormSelect 
          placeholder="Search and select..." 
          options={options} 
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>
      
      <Form.Item label="Disabled Select" name="disabledSelect">
        <FormSelect placeholder="Disabled select" options={options} disabled />
      </Form.Item>
    </Form>
  );
};

// Form TextArea variations
export const FormTextAreas = () => (
  <Form layout="vertical" style={{ maxWidth: '400px' }}>
    <Form.Item label="Default TextArea" name="defaultTextArea">
      <FormTextArea placeholder="Enter your message..." rows={4} />
    </Form.Item>
    
    <Form.Item label="Auto-resize TextArea" name="autoResize">
      <FormTextArea 
        placeholder="This textarea auto-resizes..." 
        autoSize={{ minRows: 2, maxRows: 6 }}
      />
    </Form.Item>
    
    <Form.Item label="Character Count TextArea" name="withCount">
      <FormTextArea 
        placeholder="Max 200 characters..." 
        maxLength={200}
        showCount
        rows={4}
      />
    </Form.Item>
    
    <Form.Item label="Disabled TextArea" name="disabledTextArea">
      <FormTextArea placeholder="Disabled textarea" rows={3} disabled />
    </Form.Item>
  </Form>
);

// Form DatePicker variations
export const FormDatePickers = () => (
  <Form layout="vertical" style={{ maxWidth: '400px' }}>
    <Form.Item label="Date Picker" name="datePicker">
      <FormDatePicker placeholder="Select date" />
    </Form.Item>
    
    <Form.Item label="Date Range Picker" name="dateRangePicker">
      <FormDatePicker.RangePicker placeholder={['Start date', 'End date']} />
    </Form.Item>
    
    <Form.Item label="DateTime Picker" name="dateTimePicker">
      <FormDatePicker 
        placeholder="Select date and time" 
        showTime={{ format: 'HH:mm' }}
        format="YYYY-MM-DD HH:mm"
      />
    </Form.Item>
    
    <Form.Item label="Disabled Date Picker" name="disabledDatePicker">
      <FormDatePicker placeholder="Disabled date picker" disabled />
    </Form.Item>
  </Form>
);

// Complete form example
export const CompleteForm = () => {
  const [form] = Form.useForm();
  
  const onFinish = (values) => {
    console.log('Form values:', values);
  };

  const userTypeOptions = [
    { value: 'customer', label: 'Customer' },
    { value: 'operator', label: 'Operator' },
    { value: 'admin', label: 'Administrator' },
  ];

  return (
    <div style={{ maxWidth: '500px' }}>
      <h3>User Registration Form</h3>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
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

        <Form.Item>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <StandardButton variant="secondary" onClick={() => form.resetFields()}>
              Reset
            </StandardButton>
            <StandardButton variant="primary" htmlType="submit">
              Register
            </StandardButton>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

// Form validation states
export const ValidationStates = () => (
  <Form layout="vertical" style={{ maxWidth: '400px' }}>
    <Form.Item 
      label="Success State" 
      name="success" 
      validateStatus="success" 
      help="This field is valid"
    >
      <FormInput placeholder="Valid input" />
    </Form.Item>
    
    <Form.Item 
      label="Warning State" 
      name="warning" 
      validateStatus="warning" 
      help="This field has a warning"
    >
      <FormInput placeholder="Input with warning" />
    </Form.Item>
    
    <Form.Item 
      label="Error State" 
      name="error" 
      validateStatus="error" 
      help="This field has an error"
    >
      <FormInput placeholder="Input with error" />
    </Form.Item>
    
    <Form.Item 
      label="Validating State" 
      name="validating" 
      validateStatus="validating" 
      help="Validating..."
    >
      <FormInput placeholder="Validating input" />
    </Form.Item>
  </Form>
);