/**
 * Comprehensive Component Library Tests
 * Tests all standardized UI components together to ensure they work as a cohesive system
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { antdTheme } from '../../../theme/themeConfig';

// Import all standardized components
import { StandardPanel } from '../StandardPanel';
import { PanelHeader } from '../PanelHeader';
import { PanelContent } from '../PanelContent';
import { PanelFooter } from '../PanelFooter';
import { StandardButton } from '../buttons/StandardButton';
import { ActionButton } from '../buttons/ActionButton';
import { ButtonGroup } from '../buttons/ButtonGroup';
import { FormInput } from '../forms/FormInput';
import { FormSelect } from '../forms/FormSelect';
import { FormTextArea } from '../forms/FormTextArea';
import { FormDatePicker } from '../forms/FormDatePicker';
import { FormLayout } from '../forms/FormLayout';
import { MultiStepForm } from '../forms/MultiStepForm';
import { StandardTable } from '../data-display/StandardTable';
import { StandardChart } from '../data-display/StandardChart';
import { ChartContainer } from '../data-display/ChartContainer';
import { StandardSkeleton } from '../data-display/StandardSkeleton';
import { ErrorState } from '../data-display/ErrorState';
import { StandardCard } from '../cards/StandardCard';
import { StatCard } from '../cards/StatCard';
import { InfoCard } from '../cards/InfoCard';
import { ActionCard } from '../cards/ActionCard';
import { StandardModal } from '../modals/StandardModal';
import { ConfirmModal } from '../modals/ConfirmModal';
import { FormModal } from '../modals/FormModal';
import { InfoModal } from '../modals/InfoModal';
import { ResponsiveContainer } from '../responsive/ResponsiveContainer';
import { ResponsiveGrid } from '../responsive/ResponsiveGrid';
import { ResponsiveText } from '../responsive/ResponsiveText';
import { ResponsiveVisibility } from '../responsive/ResponsiveVisibility';
import { ResponsiveImage } from '../media/ResponsiveImage';
import { ResponsiveIcon } from '../media/ResponsiveIcon';
import { ResponsiveVideo } from '../media/ResponsiveVideo';
import { MediaGallery } from '../media/MediaGallery';
import { LoadingSpinner, PanelSkeleton } from '../LoadingStates';
import { EmptyState } from '../EmptyStates';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Test wrapper with all providers
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <ConfigProvider theme={antdTheme}>
      {children}
    </ConfigProvider>
  </BrowserRouter>
);

// Mock data for comprehensive testing
const mockTableData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'Active', createdAt: '2023-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Operator', status: 'Active', createdAt: '2023-02-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Admin', status: 'Inactive', createdAt: '2023-03-10' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Customer', status: 'Pending', createdAt: '2023-04-05' },
];

const mockTableColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name', sorter: true },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Role', dataIndex: 'role', key: 'role', filters: [
    { text: 'Customer', value: 'Customer' },
    { text: 'Operator', value: 'Operator' },
    { text: 'Admin', value: 'Admin' }
  ]},
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Created', dataIndex: 'createdAt', key: 'createdAt', sorter: true },
];

const mockChartData = [
  { name: 'Jan', value: 400, growth: 24 },
  { name: 'Feb', value: 300, growth: 13 },
  { name: 'Mar', value: 200, growth: -12 },
  { name: 'Apr', value: 278, growth: 39 },
  { name: 'May', value: 189, growth: -8 },
  { name: 'Jun', value: 239, growth: 26 },
];

describe('Comprehensive Component Library Tests', () => {
  describe('Component Integration and Interoperability', () => {
    it('should render a complete dashboard layout with all component types', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <ResponsiveContainer>
            <ResponsiveGrid cols={{ xs: 1, sm: 2, lg: 3 }} gap={4}>
              {/* Statistics Cards */}
              <StatCard
                title="Total Users"
                value={1234}
                change={12.5}
                trend="up"
                icon="user"
              />
              <StatCard
                title="Active Sessions"
                value={89}
                change={-3.2}
                trend="down"
                icon="activity"
              />
              <StatCard
                title="Revenue"
                value="$45,678"
                change={8.7}
                trend="up"
                icon="dollar"
              />
              
              {/* Chart Panel */}
              <StandardPanel variant="elevated" className="col-span-full">
                <PanelHeader title="Performance Overview" />
                <PanelContent>
                  <ChartContainer>
                    <StandardChart
                      type="line"
                      data={mockChartData}
                      xKey="name"
                      yKey="value"
                      height={300}
                    />
                  </ChartContainer>
                </PanelContent>
              </StandardPanel>
              
              {/* Data Table Panel */}
              <StandardPanel variant="default" className="col-span-full">
                <PanelHeader 
                  title="User Management"
                  actions={[
                    <StandardButton key="add" type="primary" size="small">
                      Add User
                    </StandardButton>
                  ]}
                />
                <PanelContent>
                  <StandardTable
                    columns={mockTableColumns}
                    dataSource={mockTableData}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: 800 }}
                  />
                </PanelContent>
              </StandardPanel>
              
              {/* Form Panel */}
              <StandardPanel variant="bordered" className="col-span-full lg:col-span-1">
                <PanelHeader title="Quick Actions" />
                <PanelContent>
                  <FormLayout>
                    <FormInput
                      label="Search Users"
                      name="search"
                      placeholder="Enter name or email"
                    />
                    <FormSelect
                      label="Filter by Role"
                      name="role"
                      options={[
                        { value: 'all', label: 'All Roles' },
                        { value: 'customer', label: 'Customer' },
                        { value: 'operator', label: 'Operator' },
                        { value: 'admin', label: 'Admin' }
                      ]}
                      defaultValue="all"
                    />
                    <ButtonGroup>
                      <StandardButton type="default">Reset</StandardButton>
                      <StandardButton type="primary">Apply</StandardButton>
                    </ButtonGroup>
                  </FormLayout>
                </PanelContent>
              </StandardPanel>
            </ResponsiveGrid>
          </ResponsiveContainer>
        </TestWrapper>
      );

      // Verify all major components are rendered
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('1234')).toBeInTheDocument();
      expect(screen.getByText('Performance Overview')).toBeInTheDocument();
      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      
      // Verify table data
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      
      // Test form interactions
      const searchInput = screen.getByLabelText('Search Users');
      await user.type(searchInput, 'john');
      expect(searchInput.value).toBe('john');
      
      // Test button interactions
      const addButton = screen.getByRole('button', { name: 'Add User' });
      await user.click(addButton);
      
      const applyButton = screen.getByRole('button', { name: 'Apply' });
      await user.click(applyButton);
    });

    it('should handle complex form workflows with validation', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      
      render(
        <TestWrapper>
          <StandardPanel variant="elevated">
            <PanelHeader title="User Registration Form" />
            <PanelContent>
              <MultiStepForm
                steps={[
                  {
                    title: 'Personal Information',
                    content: (
                      <FormLayout>
                        <FormInput
                          label="Full Name"
                          name="fullName"
                          required
                          rules={[{ required: true, message: 'Name is required' }]}
                        />
                        <FormInput
                          label="Email"
                          name="email"
                          type="email"
                          required
                          rules={[
                            { required: true, message: 'Email is required' },
                            { type: 'email', message: 'Invalid email format' }
                          ]}
                        />
                        <FormDatePicker
                          label="Date of Birth"
                          name="dateOfBirth"
                          required
                        />
                      </FormLayout>
                    )
                  },
                  {
                    title: 'Account Details',
                    content: (
                      <FormLayout>
                        <FormSelect
                          label="Role"
                          name="role"
                          required
                          options={[
                            { value: 'customer', label: 'Customer' },
                            { value: 'operator', label: 'Operator' }
                          ]}
                        />
                        <FormTextArea
                          label="Notes"
                          name="notes"
                          rows={4}
                          placeholder="Additional information"
                        />
                      </FormLayout>
                    )
                  }
                ]}
                onFinish={onSubmit}
              />
            </PanelContent>
          </StandardPanel>
        </TestWrapper>
      );

      // Verify form steps are rendered
      expect(screen.getByText('User Registration Form')).toBeInTheDocument();
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
      
      // Fill out first step
      const nameInput = screen.getByLabelText('Full Name');
      const emailInput = screen.getByLabelText('Email');
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john.doe@example.com');
      
      // Proceed to next step
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);
      
      // Verify second step
      await waitFor(() => {
        expect(screen.getByText('Account Details')).toBeInTheDocument();
      });
      
      // Fill out second step
      const roleSelect = screen.getByLabelText('Role');
      await user.click(roleSelect);
      
      const customerOption = screen.getByText('Customer');
      await user.click(customerOption);
      
      const notesTextarea = screen.getByLabelText('Notes');
      await user.type(notesTextarea, 'Test user account');
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          role: 'customer',
          notes: 'Test user account'
        }));
      });
    });

    it('should handle modal workflows and interactions', async () => {
      const user = userEvent.setup();
      const onConfirm = jest.fn();
      const onCancel = jest.fn();
      
      const ModalTestComponent = () => {
        const [showConfirm, setShowConfirm] = React.useState(false);
        const [showForm, setShowForm] = React.useState(false);
        const [showInfo, setShowInfo] = React.useState(false);
        
        return (
          <TestWrapper>
            <StandardPanel>
              <PanelContent>
                <ButtonGroup>
                  <StandardButton onClick={() => setShowConfirm(true)}>
                    Show Confirm Modal
                  </StandardButton>
                  <StandardButton onClick={() => setShowForm(true)}>
                    Show Form Modal
                  </StandardButton>
                  <StandardButton onClick={() => setShowInfo(true)}>
                    Show Info Modal
                  </StandardButton>
                </ButtonGroup>
                
                <ConfirmModal
                  open={showConfirm}
                  title="Delete User"
                  content="Are you sure you want to delete this user? This action cannot be undone."
                  onConfirm={() => {
                    onConfirm();
                    setShowConfirm(false);
                  }}
                  onCancel={() => {
                    onCancel();
                    setShowConfirm(false);
                  }}
                />
                
                <FormModal
                  open={showForm}
                  title="Edit User"
                  onCancel={() => setShowForm(false)}
                  onOk={() => setShowForm(false)}
                >
                  <FormLayout>
                    <FormInput label="Name" name="name" defaultValue="John Doe" />
                    <FormInput label="Email" name="email" defaultValue="john@example.com" />
                  </FormLayout>
                </FormModal>
                
                <InfoModal
                  open={showInfo}
                  title="User Information"
                  content="This user has been active for 6 months and has completed 25 trips."
                  onOk={() => setShowInfo(false)}
                />
              </PanelContent>
            </StandardPanel>
          </TestWrapper>
        );
      };
      
      render(<ModalTestComponent />);
      
      // Test confirm modal
      const confirmButton = screen.getByRole('button', { name: 'Show Confirm Modal' });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByText('Delete User')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to delete this user? This action cannot be undone.')).toBeInTheDocument();
      });
      
      const deleteButton = screen.getByRole('button', { name: /confirm|delete|ok/i });
      await user.click(deleteButton);
      
      expect(onConfirm).toHaveBeenCalled();
      
      // Test form modal
      const formButton = screen.getByRole('button', { name: 'Show Form Modal' });
      await user.click(formButton);
      
      await waitFor(() => {
        expect(screen.getByText('Edit User')).toBeInTheDocument();
        expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      });
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      
      // Test info modal
      const infoButton = screen.getByRole('button', { name: 'Show Info Modal' });
      await user.click(infoButton);
      
      await waitFor(() => {
        expect(screen.getByText('User Information')).toBeInTheDocument();
        expect(screen.getByText('This user has been active for 6 months and has completed 25 trips.')).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Behavior Testing', () => {
    it('should adapt layout correctly across different screen sizes', () => {
      // Mock window.matchMedia for responsive testing
      const mockMatchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      });

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      const { rerender } = render(
        <TestWrapper>
          <ResponsiveContainer>
            <ResponsiveGrid cols={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
              <StandardCard title="Card 1">Content 1</StandardCard>
              <StandardCard title="Card 2">Content 2</StandardCard>
              <StandardCard title="Card 3">Content 3</StandardCard>
              <StandardCard title="Card 4">Content 4</StandardCard>
            </ResponsiveGrid>
            
            <ResponsiveVisibility hideOn={['xs', 'sm']}>
              <StandardPanel>
                <PanelContent>Desktop only content</PanelContent>
              </StandardPanel>
            </ResponsiveVisibility>
            
            <ResponsiveVisibility showOn={['xs', 'sm']}>
              <StandardPanel>
                <PanelContent>Mobile only content</PanelContent>
              </StandardPanel>
            </ResponsiveVisibility>
          </ResponsiveContainer>
        </TestWrapper>
      );

      // Verify cards are rendered
      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
      expect(screen.getByText('Card 3')).toBeInTheDocument();
      expect(screen.getByText('Card 4')).toBeInTheDocument();

      // Test mobile viewport
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query.includes('768px'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      rerender(
        <TestWrapper>
          <ResponsiveContainer>
            <ResponsiveGrid cols={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
              <StandardCard title="Card 1">Content 1</StandardCard>
              <StandardCard title="Card 2">Content 2</StandardCard>
              <StandardCard title="Card 3">Content 3</StandardCard>
              <StandardCard title="Card 4">Content 4</StandardCard>
            </ResponsiveGrid>
          </ResponsiveContainer>
        </TestWrapper>
      );

      // Cards should still be rendered in mobile layout
      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
    });

    it('should handle responsive text and media correctly', () => {
      render(
        <TestWrapper>
          <ResponsiveContainer>
            <ResponsiveText
              sizes={{
                xs: 'text-sm',
                sm: 'text-base',
                md: 'text-lg',
                lg: 'text-xl'
              }}
            >
              Responsive text content
            </ResponsiveText>
            
            <ResponsiveImage
              src="/test-image.jpg"
              alt="Test image"
              sizes={{
                xs: '100vw',
                sm: '50vw',
                md: '33vw',
                lg: '25vw'
              }}
            />
            
            <ResponsiveVideo
              src="/test-video.mp4"
              poster="/test-poster.jpg"
              controls
              responsive
            />
          </ResponsiveContainer>
        </TestWrapper>
      );

      expect(screen.getByText('Responsive text content')).toBeInTheDocument();
      expect(screen.getByAltText('Test image')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle loading states gracefully', async () => {
      const LoadingTestComponent = () => {
        const [loading, setLoading] = React.useState(true);
        
        React.useEffect(() => {
          const timer = setTimeout(() => setLoading(false), 1000);
          return () => clearTimeout(timer);
        }, []);
        
        return (
          <TestWrapper>
            <StandardPanel>
              <PanelHeader title="Data Loading Test" />
              <PanelContent>
                {loading ? (
                  <StandardSkeleton active paragraph={{ rows: 4 }} />
                ) : (
                  <StandardTable
                    columns={mockTableColumns}
                    dataSource={mockTableData}
                    rowKey="id"
                  />
                )}
              </PanelContent>
            </StandardPanel>
          </TestWrapper>
        );
      };
      
      render(<LoadingTestComponent />);
      
      // Initially should show loading skeleton
      expect(screen.getByText('Data Loading Test')).toBeInTheDocument();
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should handle error states appropriately', () => {
      render(
        <TestWrapper>
          <StandardPanel>
            <PanelHeader title="Error Handling Test" />
            <PanelContent>
              <ErrorState
                title="Failed to load data"
                description="An error occurred while fetching the data. Please try again."
                action={
                  <StandardButton type="primary">
                    Retry
                  </StandardButton>
                }
              />
            </PanelContent>
          </StandardPanel>
        </TestWrapper>
      );

      expect(screen.getByText('Error Handling Test')).toBeInTheDocument();
      expect(screen.getByText('Failed to load data')).toBeInTheDocument();
      expect(screen.getByText('An error occurred while fetching the data. Please try again.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });

    it('should handle empty states correctly', () => {
      render(
        <TestWrapper>
          <StandardPanel>
            <PanelHeader title="Empty State Test" />
            <PanelContent>
              <EmptyState
                title="No data available"
                description="There are no items to display at this time."
                action={
                  <StandardButton type="primary">
                    Add Item
                  </StandardButton>
                }
              />
            </PanelContent>
          </StandardPanel>
        </TestWrapper>
      );

      expect(screen.getByText('Empty State Test')).toBeInTheDocument();
      expect(screen.getByText('No data available')).toBeInTheDocument();
      expect(screen.getByText('There are no items to display at this time.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add Item' })).toBeInTheDocument();
    });
  });

  describe('Accessibility Compliance', () => {
    it('should maintain accessibility standards across complex layouts', async () => {
      const { container } = render(
        <TestWrapper>
          <main>
            <h1>Dashboard</h1>
            <ResponsiveGrid cols={{ xs: 1, md: 2 }} gap={4}>
              <StandardPanel>
                <PanelHeader title="Statistics" />
                <PanelContent>
                  <StatCard
                    title="Total Users"
                    value={1234}
                    change={12.5}
                    trend="up"
                  />
                </PanelContent>
              </StandardPanel>
              
              <StandardPanel>
                <PanelHeader title="User Form" />
                <PanelContent>
                  <FormLayout>
                    <FormInput
                      label="Name"
                      name="name"
                      required
                      aria-describedby="name-help"
                    />
                    <div id="name-help">Enter your full name</div>
                    
                    <FormSelect
                      label="Role"
                      name="role"
                      options={[
                        { value: 'customer', label: 'Customer' },
                        { value: 'operator', label: 'Operator' }
                      ]}
                      aria-describedby="role-help"
                    />
                    <div id="role-help">Select your role</div>
                  </FormLayout>
                </PanelContent>
                <PanelFooter>
                  <StandardButton type="primary">Submit</StandardButton>
                </PanelFooter>
              </StandardPanel>
            </ResponsiveGrid>
          </main>
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Performance and Memory Management', () => {
    it('should not cause memory leaks with frequent re-renders', () => {
      const TestComponent = () => {
        const [count, setCount] = React.useState(0);
        
        return (
          <TestWrapper>
            <StandardPanel>
              <PanelHeader title={`Render Count: ${count}`} />
              <PanelContent>
                <StandardButton onClick={() => setCount(c => c + 1)}>
                  Re-render
                </StandardButton>
              </PanelContent>
            </StandardPanel>
          </TestWrapper>
        );
      };
      
      const { rerender } = render(<TestComponent />);
      
      // Simulate multiple re-renders
      for (let i = 0; i < 50; i++) {
        rerender(<TestComponent />);
      }
      
      // Component should still be functional
      expect(screen.getByText(/Render Count:/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Re-render' })).toBeInTheDocument();
    });

    it('should handle large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: ['Customer', 'Operator', 'Admin'][i % 3],
        status: ['Active', 'Inactive', 'Pending'][i % 3],
        createdAt: new Date(2023, i % 12, (i % 28) + 1).toISOString().split('T')[0]
      }));

      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <StandardPanel>
            <PanelHeader title="Large Dataset Test" />
            <PanelContent>
              <StandardTable
                columns={mockTableColumns}
                dataSource={largeDataset}
                rowKey="id"
                pagination={{ pageSize: 50 }}
                virtual
                scroll={{ y: 400 }}
              />
            </PanelContent>
          </StandardPanel>
        </TestWrapper>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render large dataset within reasonable time (2 seconds)
      expect(renderTime).toBeLessThan(2000);
      expect(screen.getByText('Large Dataset Test')).toBeInTheDocument();
      expect(screen.getByText('User 1')).toBeInTheDocument();
    });
  });
});