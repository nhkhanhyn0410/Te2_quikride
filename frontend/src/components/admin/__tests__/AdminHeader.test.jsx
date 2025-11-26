import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminHeader from '../AdminHeader';
import IconProvider from '../../../icons/IconProvider';
import ThemeProvider from '../../../theme/ThemeProvider';

// Mock the auth store
const mockAuthStore = {
  user: {
    fullName: 'Admin User',
    email: 'admin@quikride.com',
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

describe('AdminHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the header with default title and subtitle', () => {
      render(
        <TestWrapper>
          <AdminHeader />
        </TestWrapper>
      );

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.getByText('System Administration Portal')).toBeInTheDocument();
    });

    it('renders with custom title and subtitle', () => {
      render(
        <TestWrapper>
          <AdminHeader 
            title="User Management" 
            subtitle="Manage system users and permissions" 
          />
        </TestWrapper>
      );

      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByText('Manage system users and permissions')).toBeInTheDocument();
    });

    it('renders user information', () => {
      render(
        <TestWrapper>
          <AdminHeader />
        </TestWrapper>
      );

      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('Administrator')).toBeInTheDocument();
    });

    it('shows system health and notification buttons', () => {
      render(
        <TestWrapper>
          <AdminHeader />
        </TestWrapper>
      );

      const healthButton = screen.getByRole('button', { name: /system health/i });
      const notificationButton = screen.getByRole('button', { name: /notifications/i });
      
      expect(healthButton).toBeInTheDocument();
      expect(notificationButton).toBeInTheDocument();
    });
  });

  describe('User Menu Functionality', () => {
    it('shows user dropdown menu when clicked', async () => {
      render(
        <TestWrapper>
          <AdminHeader />
        </TestWrapper>
      );

      const userButton = screen.getByText('Admin User');
      fireEvent.click(userButton);

      await waitFor(() => {
        expect(screen.getByText('Hồ Sơ')).toBeInTheDocument();
        expect(screen.getByText('Cài Đặt Hệ Thống')).toBeInTheDocument();
        expect(screen.getByText('Đăng Xuất')).toBeInTheDocument();
      });
    });

    it('navigates to profile when profile menu item is clicked', async () => {
      render(
        <TestWrapper>
          <AdminHeader />
        </TestWrapper>
      );

      const userButton = screen.getByText('Admin User');
      fireEvent.click(userButton);

      await waitFor(() => {
        const profileButton = screen.getByText('Hồ Sơ');
        fireEvent.click(profileButton);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/admin/profile');
    });

    it('navigates to settings when settings menu item is clicked', async () => {
      render(
        <TestWrapper>
          <AdminHeader />
        </TestWrapper>
      );

      const userButton = screen.getByText('Admin User');
      fireEvent.click(userButton);

      await waitFor(() => {
        const settingsButton = screen.getByText('Cài Đặt Hệ Thống');
        fireEvent.click(settingsButton);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/admin/settings');
    });

    it('calls logout and navigates when logout is clicked', async () => {
      render(
        <TestWrapper>
          <AdminHeader />
        </TestWrapper>
      );

      const userButton = screen.getByText('Admin User');
      fireEvent.click(userButton);

      await waitFor(() => {
        const logoutButton = screen.getByText('Đăng Xuất');
        fireEvent.click(logoutButton);
      });

      expect(mockAuthStore.logout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/admin/login');
    });
  });

  describe('Mobile Menu Toggle', () => {
    it('shows mobile menu button', () => {
      render(
        <TestWrapper>
          <AdminHeader />
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
          <AdminHeader onMenuToggle={onMenuToggle} />
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
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Users', href: '/admin/users' },
        { title: 'User Details' },
      ];

      render(
        <TestWrapper>
          <AdminHeader showBreadcrumb={true} breadcrumbItems={breadcrumbItems} />
        </TestWrapper>
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByText('User Details')).toBeInTheDocument();
    });

    it('does not show breadcrumb when showBreadcrumb is false', () => {
      const breadcrumbItems = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Users', href: '/admin/users' },
      ];

      render(
        <TestWrapper>
          <AdminHeader showBreadcrumb={false} breadcrumbItems={breadcrumbItems} />
        </TestWrapper>
      );

      // Should not find breadcrumb items in the breadcrumb section
      const breadcrumbSection = screen.queryByRole('navigation');
      expect(breadcrumbSection).not.toBeInTheDocument();
    });

    it('does not show breadcrumb when no items are provided', () => {
      render(
        <TestWrapper>
          <AdminHeader showBreadcrumb={true} breadcrumbItems={[]} />
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
          <AdminHeader />
        </TestWrapper>
      );

      // Check that icons are rendered in various places
      const menuButton = screen.getByRole('button', { name: /menu/i });
      const healthButton = screen.getByRole('button', { name: /system health/i });
      const notificationButton = screen.getByRole('button', { name: /notifications/i });
      
      expect(menuButton.querySelector('svg, [role="img"]')).toBeTruthy();
      expect(healthButton.querySelector('svg, [role="img"]')).toBeTruthy();
      expect(notificationButton.querySelector('svg, [role="img"]')).toBeTruthy();
    });

    it('uses admin icon in title section', () => {
      render(
        <TestWrapper>
          <AdminHeader />
        </TestWrapper>
      );

      const titleSection = screen.getByText('Admin Dashboard').parentElement;
      expect(titleSection.previousSibling).toBeTruthy();
    });

    it('uses standardized icons in user dropdown', async () => {
      render(
        <TestWrapper>
          <AdminHeader />
        </TestWrapper>
      );

      const userButton = screen.getByText('Admin User');
      fireEvent.click(userButton);

      await waitFor(() => {
        const profileItem = screen.getByText('Hồ Sơ');
        const settingsItem = screen.getByText('Cài Đặt Hệ Thống');
        const logoutItem = screen.getByText('Đăng Xuất');

        expect(profileItem.previousSibling).toBeTruthy();
        expect(settingsItem.previousSibling).toBeTruthy();
        expect(logoutItem.previousSibling).toBeTruthy();
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('hides user details on small screens', () => {
      render(
        <TestWrapper>
          <AdminHeader />
        </TestWrapper>
      );

      const userDetails = screen.getByText('Administrator').closest('.hidden');
      expect(userDetails).toHaveClass('sm:block');
    });

    it('shows mobile menu button only on mobile', () => {
      render(
        <TestWrapper>
          <AdminHeader />
        </TestWrapper>
      );

      const menuButton = screen.getByRole('button', { name: /menu/i });
      expect(menuButton).toHaveClass('md:hidden');
    });
  });

  describe('User Information Display', () => {
    it('shows fallback text when user data is missing', () => {
      mockAuthStore.user = { email: 'admin@example.com' };

      render(
        <TestWrapper>
          <AdminHeader />
        </TestWrapper>
      );

      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
      expect(screen.getByText('Administrator')).toBeInTheDocument();
    });

    it('shows fallback when no user data at all', () => {
      mockAuthStore.user = null;

      render(
        <TestWrapper>
          <AdminHeader />
        </TestWrapper>
      );

      expect(screen.getByText('Admin')).toBeInTheDocument();
      expect(screen.getByText('Administrator')).toBeInTheDocument();
    });

    it('displays user avatar with gradient background', () => {
      render(
        <TestWrapper>
          <AdminHeader />
        </TestWrapper>
      );

      const avatar = screen.getByRole('img');
      expect(avatar).toHaveClass('bg-gradient-to-br', 'from-purple-600', 'to-indigo-600');
    });
  });

  describe('System Status Indicators', () => {
    it('shows system health button with success color', () => {
      render(
        <TestWrapper>
          <AdminHeader />
        </TestWrapper>
      );

      const healthButton = screen.getByRole('button', { name: /system health/i });
      expect(healthButton).toHaveClass('text-green-600');
    });

    it('shows notification badge without count by default', () => {
      render(
        <TestWrapper>
          <AdminHeader />
        </TestWrapper>
      );

      // Badge should be present but not showing count
      const notificationButton = screen.getByRole('button', { name: /notifications/i });
      expect(notificationButton).toBeInTheDocument();
    });
  });
});