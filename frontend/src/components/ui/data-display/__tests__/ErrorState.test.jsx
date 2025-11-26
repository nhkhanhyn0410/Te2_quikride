import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import ErrorState from '../ErrorState';
import { antdTheme } from '../../../../theme/themeConfig';

const TestWrapper = ({ children }) => (
  <ConfigProvider theme={antdTheme}>
    {children}
  </ConfigProvider>
);

describe('ErrorState Component', () => {
  const mockHandlers = {
    onRetry: jest.fn(),
    onHome: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders default error state', () => {
      render(
        <TestWrapper>
          <ErrorState />
        </TestWrapper>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
      expect(screen.getByText('Please try again or contact support if the problem persists.')).toBeInTheDocument();
    });

    it('renders with custom title and description', () => {
      render(
        <TestWrapper>
          <ErrorState
            title="Custom Error"
            subtitle="Custom Subtitle"
            description="Custom description text"
          />
        </TestWrapper>
      );

      expect(screen.getByText('Custom Error')).toBeInTheDocument();
      expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
      expect(screen.getByText('Custom description text')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <TestWrapper>
          <ErrorState className="custom-error-class" />
        </TestWrapper>
      );

      expect(document.querySelector('.custom-error-class')).toBeInTheDocument();
    });
  });

  describe('Error Types', () => {
    it('renders warning error type', () => {
      render(
        <TestWrapper>
          <ErrorState type="warning" />
        </TestWrapper>
      );

      expect(screen.getByText('Warning')).toBeInTheDocument();
      expect(screen.getByText('Please check your input')).toBeInTheDocument();
    });

    it('renders network error type', () => {
      render(
        <TestWrapper>
          <ErrorState type="network" />
        </TestWrapper>
      );

      expect(screen.getByText('Connection Error')).toBeInTheDocument();
      expect(screen.getByText('Unable to connect to server')).toBeInTheDocument();
    });

    it('renders not found error type', () => {
      render(
        <TestWrapper>
          <ErrorState type="notFound" />
        </TestWrapper>
      );

      expect(screen.getByText('Page Not Found')).toBeInTheDocument();
      expect(screen.getByText('The page you are looking for does not exist')).toBeInTheDocument();
    });

    it('renders forbidden error type', () => {
      render(
        <TestWrapper>
          <ErrorState type="forbidden" />
        </TestWrapper>
      );

      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.getByText('You do not have permission to access this resource')).toBeInTheDocument();
    });

    it('renders server error type', () => {
      render(
        <TestWrapper>
          <ErrorState type="serverError" />
        </TestWrapper>
      );

      expect(screen.getByText('Server Error')).toBeInTheDocument();
      expect(screen.getByText('Internal server error occurred')).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('renders retry button when showRetry is true and onRetry is provided', () => {
      render(
        <TestWrapper>
          <ErrorState
            showRetry={true}
            onRetry={mockHandlers.onRetry}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('calls onRetry when retry button is clicked', () => {
      render(
        <TestWrapper>
          <ErrorState
            showRetry={true}
            onRetry={mockHandlers.onRetry}
          />
        </TestWrapper>
      );

      const retryButton = screen.getByText('Try Again');
      fireEvent.click(retryButton);

      expect(mockHandlers.onRetry).toHaveBeenCalledTimes(1);
    });

    it('renders home button when showHome is true and onHome is provided', () => {
      render(
        <TestWrapper>
          <ErrorState
            showHome={true}
            onHome={mockHandlers.onHome}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Go Home')).toBeInTheDocument();
    });

    it('calls onHome when home button is clicked', () => {
      render(
        <TestWrapper>
          <ErrorState
            showHome={true}
            onHome={mockHandlers.onHome}
          />
        </TestWrapper>
      );

      const homeButton = screen.getByText('Go Home');
      fireEvent.click(homeButton);

      expect(mockHandlers.onHome).toHaveBeenCalledTimes(1);
    });

    it('does not render retry button when showRetry is false', () => {
      render(
        <TestWrapper>
          <ErrorState
            showRetry={false}
            onRetry={mockHandlers.onRetry}
          />
        </TestWrapper>
      );

      expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
    });

    it('does not render retry button when onRetry is not provided', () => {
      render(
        <TestWrapper>
          <ErrorState showRetry={true} />
        </TestWrapper>
      );

      expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
    });

    it('renders both retry and home buttons', () => {
      render(
        <TestWrapper>
          <ErrorState
            showRetry={true}
            onRetry={mockHandlers.onRetry}
            showHome={true}
            onHome={mockHandlers.onHome}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByText('Go Home')).toBeInTheDocument();
    });
  });

  describe('Custom Actions', () => {
    it('renders custom actions', () => {
      const customActions = [
        <button key="custom1" data-testid="custom-action-1">Custom Action 1</button>,
        <button key="custom2" data-testid="custom-action-2">Custom Action 2</button>,
      ];

      render(
        <TestWrapper>
          <ErrorState customActions={customActions} />
        </TestWrapper>
      );

      expect(screen.getByTestId('custom-action-1')).toBeInTheDocument();
      expect(screen.getByTestId('custom-action-2')).toBeInTheDocument();
    });

    it('renders custom actions along with standard actions', () => {
      const customActions = [
        <button key="custom" data-testid="custom-action">Custom Action</button>,
      ];

      render(
        <TestWrapper>
          <ErrorState
            showRetry={true}
            onRetry={mockHandlers.onRetry}
            customActions={customActions}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByTestId('custom-action')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains proper structure for screen readers', () => {
      render(
        <TestWrapper>
          <ErrorState
            title="Accessible Error"
            showRetry={true}
            onRetry={mockHandlers.onRetry}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Accessible Error')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    it('provides proper button labels', () => {
      render(
        <TestWrapper>
          <ErrorState
            showRetry={true}
            onRetry={mockHandlers.onRetry}
            showHome={true}
            onHome={mockHandlers.onHome}
          />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /go home/i })).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('falls back to default error type for unknown types', () => {
      render(
        <TestWrapper>
          <ErrorState type="unknownType" />
        </TestWrapper>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('applies responsive classes', () => {
      render(
        <TestWrapper>
          <ErrorState />
        </TestWrapper>
      );

      expect(document.querySelector('.error-state')).toBeInTheDocument();
    });
  });
});