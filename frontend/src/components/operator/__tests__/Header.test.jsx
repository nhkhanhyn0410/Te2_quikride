import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Header from '../Header';
import IconProvider from '../../../icons/IconProvider';
import ThemeProvider from '../../../theme/ThemeProvider';

// Mock the auth store
const mockAuthStore = {
  user: {
    companyName: 'Test Company',
    email: 'test@company.com',
  },
  logout: vi.fn(),
};

vi.mock('../../../store/authStore', () => ({
  default: () => mockAuthStore,
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Test wrapper component
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider>
      <IconProvider>
        {children}
      </IconProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe('OperatorHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the header with user information', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      expect(screen.getByText('Test Company')).toBeInTheDocument();
      expect(screen.getByText('test@company.com')).toBeInTheDocument();
    });

    it('renders with custom title', () => {
      render(
        <TestWrapper>
          <Header title="Dashboard" />
        </TestWrapper>
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('shows notification button', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const notificationButton = screen.getByRole('button', { name: /thông báo/i });
      expect(notificationButton).toBeInTheDocument();
    });
  });

  describe('User Menu Functionality', () => {
    it('shows user dropdown menu when clicked', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const userButton = screen.getByText('Test Company');
      fireEvent.click(userButton);

      await waitFor(() => {
        expect(screen.getByText('Hồ Sơ')).toBeInTheDocument();
        expect(screen.getByText('Cài Đặt')).toBeInTheDocument();
        expect(screen.getByText('Đăng Xuất')).toBeInTheDocument();
      });
    });

    it('navigates to profile when profile menu item is clicked', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const userButton = screen.getByText('Test Company');
      fireEvent.click(userButton);

      await waitFor(() => {
        const profileButton = screen.getByText('Hồ Sơ');
        fireEvent.click(profileButton);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/operator/profile');
    });

    it('navigates to settings when settings menu item is clicked', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const userButton = screen.getByText('Test Company');
      fireEvent.click(userButton);

      await waitFor(() => {
        const settingsButton = screen.getByText('Cài Đặt');
        fireEvent.click(settingsButton);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/operator/settings');
    });

    it('calls logout and navigates when logout is clicked', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const userButton = screen.getByText('Test Company');
      fireEvent.click(userButton);

      await waitFor(() => {
        const logoutButton = screen.getByText('Đăng Xuất');
        fireEvent.click(logoutButton);
      });

      expect(mockAuthStore.logout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/operator/login');
    });
  });

  describe('Mobile Menu Toggle', () => {
    it('shows mobile menu button', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const menuButton = screen.getByRole('button', { name: /menu/i });
      expect(menuButton).toBeInTheDocument();
      expect(menuButton).toHaveClass('md:hidden');
    });

    it('calls onMenuToggle when mobile menu button is clicked', () => {
      const onMenuToggle = vi.fn();
      render(
        <TestWrapper>
          <Header onMenuToggle={onMenuToggle} />
        </TestWrapper>
      );

      const menuButton = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(menuButton);

      expect(onMenuToggle).toHaveBeenCalled();
    });
  });

  describe('Breadcrumb Navigation', () => {
    it('shows breadcrumb when showBreadcrumb is true and items are provided', () => {
      const breadcrumbItems = [
        { title: 'Dashboard', href: '/operator/dashboard' },
        { title: 'Routes', href: '/operator/routes' },
        { title: 'Current Route' },
      ];

      render(
        <TestWrapper>
          <Header showBreadcrumb={true} breadcrumbItems={breadcrumbItems} />
        </TestWrapper>
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Routes')).toBeInTheDocument();
      expect(screen.getByText('Current Route')).toBeInTheDocument();
    });

    it('does not show breadcrumb when showBreadcrumb is false', () => {
      const breadcrumbItems = [
        { title: 'Dashboard', href: '/operator/dashboard' },
        { title: 'Routes', href: '/operator/routes' },
      ];

      render(
        <TestWrapper>
          <Header showBreadcrumb={false} breadcrumbItems={breadcrumbItems} />
        </TestWrapper>
      );

      // Should not find breadcrumb items in the breadcrumb section
      const breadcrumbSection = screen.queryByRole('navigation');
      expect(breadcrumbSection).not.toBeInTheDocument();
    });

    it('does not show breadcrumb when no items are provided', () => {
      render(
        <TestWrapper>
          <Header showBreadcrumb={true} breadcrumbItems={[]} />
        </TestWrapper>
      );

      const breadcrumbSection = screen.queryByRole('navigation');
      expect(breadcrumbSection).not.toBeInTheDocument();
    });
  });

  describe('Icon Standardization', () => {
    it('uses standardized icons from IconProvider', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      // Check that icons are rendered in various places
      const menuButton = screen.getByRole('button', { name: /menu/i });
      const notificationButton = screen.getByRole('button', { name: /thông báo/i });
      
      expect(menuButton.querySelector('svg, [role="img"]')).toBeTruthy();
      expect(notificationButton.querySelector('svg, [role="img"]')).toBeTruthy();
    });

    it('uses standardized icons in user dropdown', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const userButton = screen.getByText('Test Company');
      fireEvent.click(userButton);

      await waitFor(() => {
        const profileItem = screen.getByText('Hồ Sơ');
        const settingsItem = screen.getByText('Cài Đặt');
        const logoutItem = screen.getByText('Đăng Xuất');

        expect(profileItem.previousSibling).toBeTruthy();
        expect(settingsItem.previousSibling).toBeTruthy();
        expect(logoutItem.previousSibling).toBeTruthy();
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('hides user email on small screens', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const userInfo = screen.getByText('test@company.com').parentElement;
      expect(userInfo).toHaveClass('hidden', 'sm:block');
    });

    it('shows mobile menu button only on mobile', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const menuButton = screen.getByRole('button', { name: /menu/i });
      expect(menuButton).toHaveClass('md:hidden');
    });
  });

  describe('User Information Display', () => {
    it('shows fallback text when user data is missing', () => {
      mockAuthStore.user = { email: 'test@example.com' };

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      expect(screen.getByText('Operator')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('displays user avatar with profile icon', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const avatar = screen.getByRole('img');
      expect(avatar).toHaveClass('bg-blue-600');
    });
  });
});