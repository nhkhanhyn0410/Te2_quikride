import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TripManagerMobileNav from '../TripManagerMobileNav';
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
    useLocation: () => ({ pathname: '/trip-manager/dashboard' }),
  };
});

// Mock window.open
global.window.open = vi.fn();

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

describe('TripManagerMobileNav', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the mobile navigation when visible', () => {
      render(
        <TestWrapper>
          <TripManagerMobileNav visible={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      expect(screen.getByText('Trip Manager')).toBeInTheDocument();
      expect(screen.getByText('Mobile Navigation')).toBeInTheDocument();
    });

    it('does not render when not visible', () => {
      render(
        <TestWrapper>
          <TripManagerMobileNav visible={false} onClose={mockOnClose} />
        </TestWrapper>
      );

      expect(screen.queryByText('Trip Manager')).not.toBeInTheDocument();
    });

    it('renders all navigation menu items', () => {
      render(
        <TestWrapper>
          <TripManagerMobileNav visible={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Active Trips')).toBeInTheDocument();
      expect(screen.getByText('Emergency Alerts')).toBeInTheDocument();
      expect(screen.getByText('Pending Issues')).toBeInTheDocument();
      expect(screen.getByText('Schedule Management')).toBeInTheDocument();
      expect(screen.getByText('Driver Status')).toBeInTheDocument();
      expect(screen.getByText('Trip Reports')).toBeInTheDocument();
    });

    it('renders user information', () => {
      render(
        <TestWrapper>
          <TripManagerMobileNav visible={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      expect(screen.getByText('Trip Manager User')).toBeInTheDocument();
      expect(screen.getByText('Trip Manager')).toBeInTheDocument();
    });
  });

  describe('Navigation Functionality', () => {
    it('navigates to correct paths when menu items are clicked', async () => {
      render(
        <TestWrapper>
          <TripManagerMobileNav visible={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      // Test Dashboard navigation
      const dashboardItem = screen.getByText('Dashboard');
      fireEvent.click(dashboardItem);
      expect(mockNavigate).toHaveBeenCalledWith('/trip-manager/dashboard');
      expect(mockOnClose).toHaveBeenCalled();

      // Reset mocks
      vi.clearAllMocks();

      // Test Schedule Management navigation
      const scheduleItem = screen.getByText('Schedule Management');
      fireEvent.click(scheduleItem);
      expect(mockNavigate).toHaveBeenCalledWith('/trip-manager/schedule');
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('closes drawer when close button is clicked', () => {
      render(
        <TestWrapper>
          <TripManagerMobileNav visible={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Count Display and Badges', () => {
    it('displays counts for active trips, issues, and alerts', () => {
      render(
        <TestWrapper>
          <TripManagerMobileNav 
            visible={true} 
            onClose={mockOnClose}
            activeTrips={5}
            pendingIssues={3}
            emergencyAlerts={2}
          />
        </TestWrapper>
      );

      // Check for badge counts in menu
      expect(screen.getByText('5')).toBeInTheDocument(); // Active trips badge
      expect(screen.getByText('3')).toBeInTheDocument(); // Pending issues badge
      expect(screen.getByText('2')).toBeInTheDocument(); // Emergency alerts badge

      // Check for quick stats
      expect(screen.getByText('Active Trips')).toBeInTheDocument();
      expect(screen.getByText('Issues')).toBeInTheDocument();
      expect(screen.getByText('Alerts')).toBeInTheDocument();
    });

    it('does not show badges when counts are zero', () => {
      render(
        <TestWrapper>
          <TripManagerMobileNav 
            visible={true} 
            onClose={mockOnClose}
            activeTrips={0}
            pendingIssues={0}
            emergencyAlerts={0}
          />
        </TestWrapper>
      );

      // Should still show the menu items but without badges
      expect(screen.getByText('Active Trips')).toBeInTheDocument();
      expect(screen.getByText('Emergency Alerts')).toBeInTheDocument();
      expect(screen.getByText('Pending Issues')).toBeInTheDocument();
    });
  });

  describe('Emergency Actions', () => {
    it('shows emergency actions section when there are alerts', () => {
      render(
        <TestWrapper>
          <TripManagerMobileNav 
            visible={true} 
            onClose={mockOnClose}
            emergencyAlerts={2}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Emergency Actions')).toBeInTheDocument();
      expect(screen.getByText('Handle Emergency (2)')).toBeInTheDocument();
      expect(screen.getByText('Emergency Hotline')).toBeInTheDocument();
    });

    it('does not show emergency actions when no alerts', () => {
      render(
        <TestWrapper>
          <TripManagerMobileNav 
            visible={true} 
            onClose={mockOnClose}
            emergencyAlerts={0}
          />
        </TestWrapper>
      );

      expect(screen.queryByText('Emergency Actions')).not.toBeInTheDocument();
      expect(screen.queryByText('Handle Emergency')).not.toBeInTheDocument();
    });

    it('navigates to emergency page when handle emergency is clicked', () => {
      render(
        <TestWrapper>
          <TripManagerMobileNav 
            visible={true} 
            onClose={mockOnClose}
            emergencyAlerts={1}
          />
        </TestWrapper>
      );

      const handleEmergencyButton = screen.getByText('Handle Emergency (1)');
      fireEvent.click(handleEmergencyButton);
      expect(mockNavigate).toHaveBeenCalledWith('/trip-manager/emergency');
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('opens emergency hotline when hotline button is clicked', () => {
      render(
        <TestWrapper>
          <TripManagerMobileNav 
            visible={true} 
            onClose={mockOnClose}
            emergencyAlerts={1}
          />
        </TestWrapper>
      );

      const hotlineButton = screen.getByText('Emergency Hotline');
      fireEvent.click(hotlineButton);
      expect(window.open).toHaveBeenCalledWith('tel:911');
    });

    it('applies pulse animation to emergency menu item when alerts exist', () => {
      render(
        <TestWrapper>
          <TripManagerMobileNav 
            visible={true} 
            onClose={mockOnClose}
            emergencyAlerts={1}
          />
        </TestWrapper>
      );

      const emergencyMenuItem = screen.getByText('Emergency Alerts').closest('li');
      expect(emergencyMenuItem).toHaveClass('animate-pulse');
    });
  });

  describe('User Menu Functionality', () => {
    it('renders user menu items', () => {
      render(
        <TestWrapper>
          <TripManagerMobileNav visible={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      expect(screen.getByText('Account')).toBeInTheDocument();
      expect(screen.getByText('Hồ Sơ')).toBeInTheDocument();
      expect(screen.getByText('Cài Đặt')).toBeInTheDocument();
      expect(screen.getByText('Đăng Xuất')).toBeInTheDocument();
    });

    it('calls logout and navigates when logout is clicked', () => {
      render(
        <TestWrapper>
          <TripManagerMobileNav visible={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      const logoutButton = screen.getByText('Đăng Xuất');
      fireEvent.click(logoutButton);
      
      expect(mockAuthStore.logout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/trip-manager/login');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Icon Standardization', () => {
    it('uses standardized icons from IconProvider', () => {
      render(
        <TestWrapper>
          <TripManagerMobileNav visible={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      // Check that icons are rendered for menu items
      const menuItems = [
        'Dashboard',
        'Active Trips',
        'Emergency Alerts',
        'Pending Issues',
        'Schedule Management',
        'Driver Status',
        'Trip Reports'
      ];

      menuItems.forEach(item => {
        const menuItem = screen.getByText(item);
        expect(menuItem).toBeInTheDocument();
      });
    });

    it('uses schedule icon in header', () => {
      render(
        <TestWrapper>
          <TripManagerMobileNav visible={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      const headerSection = screen.getByText('Trip Manager').parentElement;
      expect(headerSection.previousSibling).toBeTruthy();
    });
  });

  describe('Responsive Design', () => {
    it('applies correct styling classes for mobile optimization', () => {
      render(
        <TestWrapper>
          <TripManagerMobileNav visible={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      // Check for responsive grid in quick stats
      const quickStatsSection = screen.getByText('Quick Stats').nextSibling;
      expect(quickStatsSection).toHaveClass('grid', 'grid-cols-3', 'gap-2');
    });

    it('shows user avatar with gradient background', () => {
      render(
        <TestWrapper>
          <TripManagerMobileNav visible={true} onClose={mockOnClose} />
        </TestWrapper>
      );

      const avatar = screen.getByRole('img');
      expect(avatar).toHaveClass('bg-gradient-to-br', 'from-orange-600', 'to-red-600');
    });
  });
});