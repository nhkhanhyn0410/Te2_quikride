import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TripManagerHeader from '../TripManagerHeader';
import IconProvider from '../../../icons/IconProvider';
import ThemeProvider from '../../../theme/ThemeProvider';

// Mock the auth store
const mockAuthStore = {
  user: {
    fullName: 'Trip Manager User',
    email: 'tripmanager@quikride.com',
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

describe('TripManagerHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the header with default title and subtitle', () => {
      render(
        <TestWrapper>
          <TripManagerHeader />
        </TestWrapper>
      );

      expect(screen.getByText('Trip Manager')).toBeInTheDocument();
      expect(screen.getByText('Trip Management Dashboard')).toBeInTheDocument();
    });

    it('renders with custom title and subtitle', () => {
      render(
        <TestWrapper>
          <TripManagerHeader 
            title="Active Trips" 
            subtitle="Monitor ongoing trips" 
          />
        </TestWrapper>
      );

      expect(screen.getByText('Active Trips')).toBeInTheDocument();
      expect(screen.getByText('Monitor ongoing trips')).toBeInTheDocument();
    });

    it('renders user information', () => {
      render(
        <TestWrapper>
          <TripManagerHeader />
        </TestWrapper>
      );

      expect(screen.getByText('Trip Manager User')).toBeInTheDocument();
      expect(screen.getByText('Trip Manager')).toBeInTheDocument();
    });

    it('shows action buttons with counts', () => {
      render(
        <TestWrapper>
          <TripManagerHeader activeTrips={5} emergencyAlerts={2} />
        </TestWrapper>
      );

      const tripStatusButton = screen.getByRole('button', { name: /active trips/i });
      const notificationButton = screen.getByRole('button', { name: /notifications/i });
      const emergencyButton = screen.getByRole('button', { name: /emergency alerts/i });
      
      expect(tripStatusButton).toBeInTheDocument();
      expect(notificationButton).toBeInTheDocument();
      expect(emergencyButton).toBeInTheDocument();
      
      // Check for badge counts
      expect(screen.getByText('5')).toBeInTheDocument(); // Active trips count
      expect(screen.getByText('2')).toBeInTheDocument(); // Emergency alerts count
    });
  });

  describe('User Menu Functionality', () => {
    it('shows user dropdown menu when clicked', async () => {
      render(
        <TestWrapper>
          <TripManagerHeader />
        </TestWrapper>
      );

      const userButton = screen.getByText('Trip Manager User');
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
          <TripManagerHeader />
        </TestWrapper>
      );

      const userButton = screen.getByText('Trip Manager User');
      fireEvent.click(userButton);

      await waitFor(() => {
        const profileButton = screen.getByText('Hồ Sơ');
        fireEvent.click(profileButton);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/trip-manager/profile');
    });

    it('navigates to settings when settings menu item is clicked', async () => {
      render(
        <TestWrapper>
          <TripManagerHeader />
        </TestWrapper>
      );

      const userButton = screen.getByText('Trip Manager User');
      fireEvent.click(userButton);

      await waitFor(() => {
        const settingsButton = screen.getByText('Cài Đặt');
        fireEvent.click(settingsButton);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/trip-manager/settings');
    });

    it('calls logout and navigates when logout is clicked', async () => {
      render(
        <TestWrapper>
          <TripManagerHeader />
        </TestWrapper>
      );

      const userButton = screen.getByText('Trip Manager User');
      fireEvent.click(userButton);

      await waitFor(() => {
        const logoutButton = screen.getByText('Đăng Xuất');
        fireEvent.click(logoutButton);
      });

      expect(mockAuthStore.logout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/trip-manager/login');
    });
  });

  describe('Mobile Menu Toggle', () => {
    it('shows mobile menu button', () => {
      render(
        <TestWrapper>
          <TripManagerHeader />
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
          <TripManagerHeader onMenuToggle={onMenuToggle} />
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
        { title: 'Dashboard', href: '/trip-manager/dashboard' },
        { title: 'Trips', href: '/trip-manager/trips' },
        { title: 'Trip Details' },
      ];

      render(
        <TestWrapper>
          <TripManagerHeader showBreadcrumb={true} breadcrumbItems={breadcrumbItems} />
        </TestWrapper>
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Trips')).toBeInTheDocument();
      expect(screen.getByText('Trip Details')).toBeInTheDocument();
    });

    it('does not show breadcrumb when showBreadcrumb is false', () => {
      const breadcrumbItems = [
        { title: 'Dashboard', href: '/trip-manager/dashboard' },
        { title: 'Trips', href: '/trip-manager/trips' },
      ];

      render(
        <TestWrapper>
          <TripManagerHeader showBreadcrumb={false} breadcrumbItems={breadcrumbItems} />
        </TestWrapper>
      );

      // Should not find breadcrumb items in the breadcrumb section
      const breadcrumbSection = screen.queryByRole('navigation');
      expect(breadcrumbSection).not.toBeInTheDocument();
    });

    it('does not show breadcrumb when no items are provided', () => {
      render(
        <TestWrapper>
          <TripManagerHeader showBreadcrumb={true} breadcrumbItems={[]} />
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
          <TripManagerHeader />
        </TestWrapper>
      );

      // Check that icons are rendered in various places
      const menuButton = screen.getByRole('button', { name: /menu/i });
      const tripStatusButton = screen.getByRole('button', { name: /active trips/i });
      const notificationButton = screen.getByRole('button', { name: /notifications/i });
      const emergencyButton = screen.getByRole('button', { name: /emergency alerts/i });
      
      expect(menuButton.querySelector('svg, [role="img"]')).toBeTruthy();
      expect(tripStatusButton.querySelector('svg, [role="img"]')).toBeTruthy();
      expect(notificationButton.querySelector('svg, [role="img"]')).toBeTruthy();
      expect(emergencyButton.querySelector('svg, [role="img"]')).toBeTruthy();
    });

    it('uses schedule icon in title section', () => {
      render(
        <TestWrapper>
          <TripManagerHeader />
        </TestWrapper>
      );

      const titleSection = screen.getByText('Trip Manager').parentElement;
      expect(titleSection.previousSibling).toBeTruthy();
    });

    it('uses standardized icons in user dropdown', async () => {
      render(
        <TestWrapper>
          <TripManagerHeader />
        </TestWrapper>
      );

      const userButton = screen.getByText('Trip Manager User');
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
    it('hides user details on small screens', () => {
      render(
        <TestWrapper>
          <TripManagerHeader />
        </TestWrapper>
      );

      const userDetails = screen.getByText('Trip Manager').closest('.hidden');
      expect(userDetails).toHaveClass('sm:block');
    });

    it('shows mobile menu button only on mobile', () => {
      render(
        <TestWrapper>
          <TripManagerHeader />
        </TestWrapper>
      );

      const menuButton = screen.getByRole('button', { name: /menu/i });
      expect(menuButton).toHaveClass('md:hidden');
    });
  });

  describe('User Information Display', () => {
    it('shows fallback text when user data is missing', () => {
      mockAuthStore.user = { email: 'tripmanager@example.com' };

      render(
        <TestWrapper>
          <TripManagerHeader />
        </TestWrapper>
      );

      expect(screen.getByText('tripmanager@example.com')).toBeInTheDocument();
      expect(screen.getByText('Trip Manager')).toBeInTheDocument();
    });

    it('shows fallback when no user data at all', () => {
      mockAuthStore.user = null;

      render(
        <TestWrapper>
          <TripManagerHeader />
        </TestWrapper>
      );

      expect(screen.getByText('Trip Manager')).toBeInTheDocument();
    });

    it('displays user avatar with gradient background', () => {
      render(
        <TestWrapper>
          <TripManagerHeader />
        </TestWrapper>
      );

      const avatar = screen.getByRole('img');
      expect(avatar).toHaveClass('bg-gradient-to-br', 'from-orange-600', 'to-red-600');
    });
  });

  describe('Action Button Colors and Interactions', () => {
    it('shows trip status button with blue color and navigation', () => {
      render(
        <TestWrapper>
          <TripManagerHeader activeTrips={3} />
        </TestWrapper>
      );

      const tripStatusButton = screen.getByRole('button', { name: /active trips/i });
      expect(tripStatusButton).toHaveClass('text-blue-600');
      
      fireEvent.click(tripStatusButton);
      expect(mockNavigate).toHaveBeenCalledWith('/trip-manager/trips/active');
    });

    it('shows emergency button with red color and pulse animation when alerts exist', () => {
      render(
        <TestWrapper>
          <TripManagerHeader emergencyAlerts={1} />
        </TestWrapper>
      );

      const emergencyButton = screen.getByRole('button', { name: /emergency alerts/i });
      expect(emergencyButton).toHaveClass('text-red-600', 'animate-pulse');
      
      fireEvent.click(emergencyButton);
      expect(mockNavigate).toHaveBeenCalledWith('/trip-manager/emergency');
    });

    it('navigates to notifications when notification button is clicked', () => {
      render(
        <TestWrapper>
          <TripManagerHeader />
        </TestWrapper>
      );

      const notificationButton = screen.getByRole('button', { name: /notifications/i });
      fireEvent.click(notificationButton);
      expect(mockNavigate).toHaveBeenCalledWith('/trip-manager/notifications');
    });
  });
});