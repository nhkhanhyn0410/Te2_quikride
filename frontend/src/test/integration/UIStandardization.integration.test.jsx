/**
 * UI Standardization Integration Tests
 * Tests the integration of all standardized UI components working together
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { antdTheme } from '../../theme/themeConfig';

// Import all standardized components
import { StandardButton } from '../../components/ui/buttons/StandardButton';
import { StandardPanel } from '../../components/ui/StandardPanel';
import { PanelHeader } from '../../components/ui/PanelHeader';
import { PanelContent } from '../../components/ui/PanelContent';
import { PanelFooter } from '../../components/ui/PanelFooter';
import { FormInput } from '../../components/ui/forms/FormInput';
import { FormSelect } from '../../components/ui/forms/FormSelect';
import { FormTextArea } from '../../components/ui/forms/FormTextArea';
import { StandardTable } from '../../components/ui/data-display/StandardTable';
import { StandardSkeleton } from '../../components/ui/data-display/StandardSkeleton';
import { ErrorState } from '../../components/ui/data-display/ErrorState';

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

// Mock data for integration tests
const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Operator', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Admin', status: 'Inactive' },
];

const mockTableColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name', sorter: true },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
];

describe('UI Standardization Integration Tests', () => {
    describe('Panel and Form Integration', () => {
        it('should render a complete form panel with all standardized components', async () => {
            const handleSubmit = jest.fn();

            render(
                <TestWrapper>
                    <StandardPanel variant="default" size="medium">
                        <PanelHeader
                            title="User Registration Form"
                            subtitle="Create a new user account"
                        />
                        <PanelContent>
                            <form onSubmit={handleSubmit}>
                                <FormInput
                                    label="Full Name"
                                    name="name"
                                    placeholder="Enter full name"
                                    required
                                />
                                <FormInput
                                    label="Email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter email address"
                                    required
                                />
                                <FormSelect
                                    label="Role"
                                    name="role"
                                    placeholder="Select user role"
                                    options={[
                                        { value: 'customer', label: 'Customer' },
                                        { value: 'operator', label: 'Operator' },
                                        { value: 'admin', label: 'Admin' }
                                    ]}
                                    required
                                />
                                <FormTextArea
                                    label="Notes"
                                    name="notes"
                                    placeholder="Additional notes"
                                    rows={4}
                                />
                            </form>
                        </PanelContent>
                        <PanelFooter>
                            <StandardButton type="default">Cancel</StandardButton>
                            <StandardButton type="primary" onClick={handleSubmit}>
                                Create User
                            </StandardButton>
                        </PanelFooter>
                    </StandardPanel>
                </TestWrapper>
            );

            // Verify panel structure
            expect(screen.getByText('User Registration Form')).toBeInTheDocument();
            expect(screen.getByText('Create a new user account')).toBeInTheDocument();

            // Verify form inputs
            expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
            expect(screen.getByLabelText('Email')).toBeInTheDocument();
            expect(screen.getByLabelText('Role')).toBeInTheDocument();
            expect(screen.getByLabelText('Notes')).toBeInTheDocument();

            // Verify buttons
            expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Create User' })).toBeInTheDocument();
        });

        it('should handle form interactions correctly', async () => {
            const handleSubmit = jest.fn();

            render(
                <TestWrapper>
                    <StandardPanel variant="default">
                        <PanelContent>
                            <FormInput
                                label="Test Input"
                                name="test"
                                placeholder="Enter test value"
                            />
                            <StandardButton type="primary" onClick={handleSubmit}>
                                Submit
                            </StandardButton>
                        </PanelContent>
                    </StandardPanel>
                </TestWrapper>
            );

            const input = screen.getByLabelText('Test Input');
            const button = screen.getByRole('button', { name: 'Submit' });

            // Test input interaction
            fireEvent.change(input, { target: { value: 'test value' } });
            expect(input.value).toBe('test value');

            // Test button interaction
            fireEvent.click(button);
            expect(handleSubmit).toHaveBeenCalledTimes(1);
        });
    });

    describe('Data Display Integration', () => {
        it('should render table with loading and error states', async () => {
            const { rerender } = render(
                <TestWrapper>
                    <StandardPanel variant="default">
                        <PanelHeader title="User Management" />
                        <PanelContent>
                            <StandardSkeleton active paragraph={{ rows: 4 }} />
                        </PanelContent>
                    </StandardPanel>
                </TestWrapper>
            );

            // Verify loading state
            expect(screen.getByText('User Management')).toBeInTheDocument();

            // Switch to table with data
            rerender(
                <TestWrapper>
                    <StandardPanel variant="default">
                        <PanelHeader title="User Management" />
                        <PanelContent>
                            <StandardTable
                                columns={mockTableColumns}
                                dataSource={mockUsers}
                                rowKey="id"
                                pagination={{ pageSize: 10 }}
                            />
                        </PanelContent>
                    </StandardPanel>
                </TestWrapper>
            );

            // Verify table data
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('jane@example.com')).toBeInTheDocument();
            expect(screen.getByText('Admin')).toBeInTheDocument();

            // Switch to error state
            rerender(
                <TestWrapper>
                    <StandardPanel variant="default">
                        <PanelHeader title="User Management" />
                        <PanelContent>
                            <ErrorState
                                title="Failed to load users"
                                description="Unable to fetch user data. Please try again."
                                action={<StandardButton type="primary">Retry</StandardButton>}
                            />
                        </PanelContent>
                    </StandardPanel>
                </TestWrapper>
            );

            // Verify error state
            expect(screen.getByText('Failed to load users')).toBeInTheDocument();
            expect(screen.getByText('Unable to fetch user data. Please try again.')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
        });
    });

    describe('Panel Variants Integration', () => {
        it('should render all panel variants correctly', () => {
            render(
                <TestWrapper>
                    <div>
                        <StandardPanel variant="default" data-testid="default-panel">
                            <PanelContent>Default Panel Content</PanelContent>
                        </StandardPanel>

                        <StandardPanel variant="elevated" data-testid="elevated-panel">
                            <PanelContent>Elevated Panel Content</PanelContent>
                        </StandardPanel>

                        <StandardPanel variant="bordered" data-testid="bordered-panel">
                            <PanelContent>Bordered Panel Content</PanelContent>
                        </StandardPanel>

                        <StandardPanel variant="ghost" data-testid="ghost-panel">
                            <PanelContent>Ghost Panel Content</PanelContent>
                        </StandardPanel>
                    </div>
                </TestWrapper>
            );

            // Verify all panel variants are rendered
            expect(screen.getByTestId('default-panel')).toBeInTheDocument();
            expect(screen.getByTestId('elevated-panel')).toBeInTheDocument();
            expect(screen.getByTestId('bordered-panel')).toBeInTheDocument();
            expect(screen.getByTestId('ghost-panel')).toBeInTheDocument();

            // Verify content is rendered
            expect(screen.getByText('Default Panel Content')).toBeInTheDocument();
            expect(screen.getByText('Elevated Panel Content')).toBeInTheDocument();
            expect(screen.getByText('Bordered Panel Content')).toBeInTheDocument();
            expect(screen.getByText('Ghost Panel Content')).toBeInTheDocument();
        });
    });

    describe('Responsive Behavior Integration', () => {
        it('should handle responsive panel layouts', () => {
            // Mock window.matchMedia for responsive testing
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: jest.fn().mockImplementation(query => ({
                    matches: query.includes('768px'), // Simulate mobile viewport
                    media: query,
                    onchange: null,
                    addListener: jest.fn(),
                    removeListener: jest.fn(),
                    addEventListener: jest.fn(),
                    removeEventListener: jest.fn(),
                    dispatchEvent: jest.fn(),
                })),
            });

            render(
                <TestWrapper>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <StandardPanel variant="default">
                            <PanelHeader title="Panel 1" />
                            <PanelContent>Content 1</PanelContent>
                        </StandardPanel>
                        <StandardPanel variant="elevated">
                            <PanelHeader title="Panel 2" />
                            <PanelContent>Content 2</PanelContent>
                        </StandardPanel>
                        <StandardPanel variant="bordered">
                            <PanelHeader title="Panel 3" />
                            <PanelContent>Content 3</PanelContent>
                        </StandardPanel>
                    </div>
                </TestWrapper>
            );

            // Verify panels are rendered
            expect(screen.getByText('Panel 1')).toBeInTheDocument();
            expect(screen.getByText('Panel 2')).toBeInTheDocument();
            expect(screen.getByText('Panel 3')).toBeInTheDocument();
        });
    });

    describe('Accessibility Integration', () => {
        it('should maintain accessibility standards across integrated components', async () => {
            const { container } = render(
                <TestWrapper>
                    <StandardPanel variant="default">
                        <PanelHeader title="Accessible Form Panel" />
                        <PanelContent>
                            <form>
                                <FormInput
                                    label="Name"
                                    name="name"
                                    required
                                    aria-describedby="name-help"
                                />
                                <div id="name-help">Enter your full name</div>

                                <FormSelect
                                    label="Country"
                                    name="country"
                                    options={[
                                        { value: 'us', label: 'United States' },
                                        { value: 'ca', label: 'Canada' }
                                    ]}
                                    aria-describedby="country-help"
                                />
                                <div id="country-help">Select your country</div>
                            </form>
                        </PanelContent>
                        <PanelFooter>
                            <StandardButton type="primary" aria-describedby="submit-help">
                                Submit Form
                            </StandardButton>
                            <div id="submit-help">Click to submit the form</div>
                        </PanelFooter>
                    </StandardPanel>
                </TestWrapper>
            );

            // Run accessibility tests
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe('Theme Integration', () => {
        it('should apply consistent theming across all components', () => {
            render(
                <TestWrapper>
                    <StandardPanel variant="default">
                        <PanelHeader title="Themed Components" />
                        <PanelContent>
                            <StandardButton type="primary">Primary Button</StandardButton>
                            <StandardButton type="default">Default Button</StandardButton>
                            <FormInput label="Themed Input" name="input" />
                            <StandardTable
                                columns={[{ title: 'Name', dataIndex: 'name' }]}
                                dataSource={[{ name: 'Test' }]}
                                size="small"
                            />
                        </PanelContent>
                    </StandardPanel>
                </TestWrapper>
            );

            // Verify components are rendered with theme
            expect(screen.getByText('Themed Components')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Primary Button' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Default Button' })).toBeInTheDocument();
            expect(screen.getByLabelText('Themed Input')).toBeInTheDocument();
            expect(screen.getByText('Name')).toBeInTheDocument();
        });
    });

    describe('Error Handling Integration', () => {
        it('should handle component errors gracefully', () => {
            // Mock console.error to prevent error output in tests
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

            render(
                <TestWrapper>
                    <StandardPanel variant="default">
                        <PanelContent>
                            <ErrorState
                                title="Component Error"
                                description="An error occurred while loading this component"
                                action={
                                    <StandardButton type="primary">
                                        Reload Component
                                    </StandardButton>
                                }
                            />
                        </PanelContent>
                    </StandardPanel>
                </TestWrapper>
            );

            expect(screen.getByText('Component Error')).toBeInTheDocument();
            expect(screen.getByText('An error occurred while loading this component')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Reload Component' })).toBeInTheDocument();

            consoleSpy.mockRestore();
        });
    });
});