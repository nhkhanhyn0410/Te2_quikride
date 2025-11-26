/**
 * Empty States Components Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConfigProvider } from 'antd';
import { 
  EmptyState, 
  NoDataEmpty, 
  NoResultsEmpty, 
  EmptyTable, 
  EmptyChart, 
  EmptyList, 
  EmptyUser, 
  CustomEmpty 
} from '../EmptyStates';
import { antdTheme } from '../../../theme/themeConfig';

// Test wrapper with Ant Design theme
const TestWrapper = ({ children }) => (
  <ConfigProvider theme={antdTheme}>
    {children}
  </ConfigProvider>
);

describe('EmptyState', () => {
  it('renders with default props', () => {
    render(
      <TestWrapper>
        <EmptyState />
      </TestWrapper>
    );

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders with custom title and description', () => {
    render(
      <TestWrapper>
        <EmptyState 
          title="Custom Title" 
          description="Custom description text" 
        />
      </TestWrapper>
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom description text')).toBeInTheDocument();
  });

  it('renders with action button', () => {
    const action = <button>Custom Action</button>;
    
    render(
      <TestWrapper>
        <EmptyState action={action} />
      </TestWrapper>
    );

    expect(screen.getByText('Custom Action')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <EmptyState className="custom-empty" />
      </TestWrapper>
    );

    expect(container.querySelector('.custom-empty')).toBeInTheDocument();
  });
});

describe('NoDataEmpty', () => {
  it('renders with default props', () => {
    render(
      <TestWrapper>
        <NoDataEmpty />
      </TestWrapper>
    );

    expect(screen.getByText('No data found')).toBeInTheDocument();
    expect(screen.getByText('There is no data to display at the moment.')).toBeInTheDocument();
  });

  it('renders refresh button when onRefresh is provided', () => {
    const mockRefresh = vi.fn();
    
    render(
      <TestWrapper>
        <NoDataEmpty onRefresh={mockRefresh} />
      </TestWrapper>
    );

    const refreshButton = screen.getByText('Refresh');
    expect(refreshButton).toBeInTheDocument();
    
    fireEvent.click(refreshButton);
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it('does not render refresh button when onRefresh is not provided', () => {
    render(
      <TestWrapper>
        <NoDataEmpty />
      </TestWrapper>
    );

    expect(screen.queryByText('Refresh')).not.toBeInTheDocument();
  });
});

describe('NoResultsEmpty', () => {
  it('renders with default props', () => {
    render(
      <TestWrapper>
        <NoResultsEmpty />
      </TestWrapper>
    );

    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search or filter criteria.')).toBeInTheDocument();
  });

  it('renders clear filters button when onClear is provided', () => {
    const mockClear = vi.fn();
    
    render(
      <TestWrapper>
        <NoResultsEmpty onClear={mockClear} />
      </TestWrapper>
    );

    const clearButton = screen.getByText('Clear filters');
    expect(clearButton).toBeInTheDocument();
    
    fireEvent.click(clearButton);
    expect(mockClear).toHaveBeenCalledTimes(1);
  });
});

describe('EmptyTable', () => {
  it('renders with default props', () => {
    render(
      <TestWrapper>
        <EmptyTable />
      </TestWrapper>
    );

    expect(screen.getByText('No records found')).toBeInTheDocument();
    expect(screen.getByText('There are no records to display in this table.')).toBeInTheDocument();
  });

  it('renders create button when onCreate is provided', () => {
    const mockCreate = vi.fn();
    
    render(
      <TestWrapper>
        <EmptyTable onCreate={mockCreate} />
      </TestWrapper>
    );

    const createButton = screen.getByText('Add new record');
    expect(createButton).toBeInTheDocument();
    
    fireEvent.click(createButton);
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('renders both create and refresh buttons', () => {
    const mockCreate = vi.fn();
    const mockRefresh = vi.fn();
    
    render(
      <TestWrapper>
        <EmptyTable onCreate={mockCreate} onRefresh={mockRefresh} />
      </TestWrapper>
    );

    expect(screen.getByText('Add new record')).toBeInTheDocument();
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });
});

describe('EmptyChart', () => {
  it('renders with default props', () => {
    render(
      <TestWrapper>
        <EmptyChart />
      </TestWrapper>
    );

    expect(screen.getByText('No data to display')).toBeInTheDocument();
    expect(screen.getByText('There is no data available for this chart.')).toBeInTheDocument();
  });

  it('renders refresh button when onRefresh is provided', () => {
    const mockRefresh = vi.fn();
    
    render(
      <TestWrapper>
        <EmptyChart onRefresh={mockRefresh} />
      </TestWrapper>
    );

    const refreshButton = screen.getByText('Refresh data');
    expect(refreshButton).toBeInTheDocument();
    
    fireEvent.click(refreshButton);
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});

describe('EmptyList', () => {
  it('renders with default props', () => {
    render(
      <TestWrapper>
        <EmptyList />
      </TestWrapper>
    );

    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('This list is currently empty.')).toBeInTheDocument();
  });

  it('renders create button when onCreate is provided', () => {
    const mockCreate = vi.fn();
    
    render(
      <TestWrapper>
        <EmptyList onCreate={mockCreate} />
      </TestWrapper>
    );

    const createButton = screen.getByText('Add first item');
    expect(createButton).toBeInTheDocument();
    
    fireEvent.click(createButton);
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });
});

describe('EmptyUser', () => {
  it('renders with default props', () => {
    render(
      <TestWrapper>
        <EmptyUser />
      </TestWrapper>
    );

    expect(screen.getByText('No users found')).toBeInTheDocument();
    expect(screen.getByText('There are no users to display.')).toBeInTheDocument();
  });

  it('renders invite button when onInvite is provided', () => {
    const mockInvite = vi.fn();
    
    render(
      <TestWrapper>
        <EmptyUser onInvite={mockInvite} />
      </TestWrapper>
    );

    const inviteButton = screen.getByText('Invite users');
    expect(inviteButton).toBeInTheDocument();
    
    fireEvent.click(inviteButton);
    expect(mockInvite).toHaveBeenCalledTimes(1);
  });
});

describe('CustomEmpty', () => {
  it('renders with minimal props', () => {
    render(
      <TestWrapper>
        <CustomEmpty title="Custom Empty" />
      </TestWrapper>
    );

    expect(screen.getByText('Custom Empty')).toBeInTheDocument();
  });

  it('renders with all props', () => {
    const mockAction1 = vi.fn();
    const mockAction2 = vi.fn();
    const actions = [
      <button key="1" onClick={mockAction1}>Action 1</button>,
      <button key="2" onClick={mockAction2}>Action 2</button>,
    ];
    
    render(
      <TestWrapper>
        <CustomEmpty 
          icon={<div data-testid="custom-icon">Icon</div>}
          title="Custom Title"
          description="Custom description"
          actions={actions}
        />
      </TestWrapper>
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom description')).toBeInTheDocument();
    expect(screen.getByText('Action 1')).toBeInTheDocument();
    expect(screen.getByText('Action 2')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const sizes = ['small', 'default', 'large'];
    
    sizes.forEach((size) => {
      const { container } = render(
        <TestWrapper>
          <CustomEmpty title="Test" size={size} data-testid={`empty-${size}`} />
        </TestWrapper>
      );

      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <CustomEmpty title="Test" className="custom-empty-state" />
      </TestWrapper>
    );

    expect(container.querySelector('.custom-empty-state')).toBeInTheDocument();
  });
});