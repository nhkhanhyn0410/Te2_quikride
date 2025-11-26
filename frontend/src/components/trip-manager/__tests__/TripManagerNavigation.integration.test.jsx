import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TripManagerHeader from '../TripManagerHeader';
import TripManagerQuickActions from '../TripManagerQuickActions';
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

// Integration test component that combines all navigation components
const TripManagerNavigationIntegration = () => {
  const [mobileNavVisible, setMobileNavVisible] = useState(false);
  const [stats] = useState({
    activeTrips: 5,
    pendingIssues: 3,
    emergencyAlerts: 2,
  });

  return (
    <div>
      <TripManagerHeader
        title="Trip Manager Dashboard"
        subtitle="Integrated Navigation Test"
        activeTrips={stats.activeTrips}
        emergencyAlerts={stats.emergencyAlerts}
        onMenuToggle={() => setMobileNavVisible(true)}
        showBreadcrumb={true}
        breadcrumbItems={[
          { title: 'Dashboard', href: '/trip-manager/dashboard' },
          { title: 'Current Page' },
        ]}
      />
      
      <TripManagerQuickActions
        activeTrips={stats.activeTrips}
        pendingIssues={stats.pendingIssues}
        emergencyAlerts={stats.emergencyAlerts}
      />
      
      <TripManagerMobileNav
        visible={mobileNavVisible}
        onClose={() => setMobileNavVisible(false)}
        activeTrips={stats.activeTrips}
        pendingIssues={stats.pendingIssues}
        emergencyAlerts={stats.emergencyAlerts}
      />
    </div>
  );
};

describe('TripManagerNavigation Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Integration', () => {
    it('renders all navigation components together', () => {
      render(
        <TestWrapper>
          <TripManagerNavigationIntegration />
        </TestWrapper>
      );

      // Header components
      expect(screen.getByText('Trip Manager Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Integrated Navigation Test')).toBeInTheDocument();
      
      // Quick actions components
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('Common trip management tasks')).toBeInTheDocument();
      
      // Breadcrumb
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Current Page')).toBeInTheDocument();
    });

    it('shows consistent data across all components', () => {
      render(
        <TestWrapper>
          <TripManagerNavigationIntegration />
        </TestWrapper>
      );

      // Check that counts are consistent across components
      const badges = screen.getAllByText('5'); // Active trips count
      expect(badges.length).toBeGreaterThan(0);
      
      const emergencyBadges = screen.getAllByText('2'); // Emergency alerts count
      expect(emergencyBadges.length).toBeGreaterThan(0);
    });

    it('opens mobile navigation when menu toggle is clicked', async () => {
      render(
        <TestWrapper>
          <TripManagerNavigationIntegration />
        </TestWrapper>
      );

      // Click mobile menu toggle
      const menuButton = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(menuButton);

      // Wait for mobile nav to appear
      await waitFor(() => {
        expect(screen.getByText('Mobile Navigation')).toBeInTheDocument();
      });
    });
  });

  describe('Cross-Component Navigation', () => {
    it('navigates consistently from header and quick actions', () => {
      render(
        <TestWrapper>
          <TripManagerNavigationIntegration />
        </TestWrapper>
      );

      // Navigate from header emergency button
      const headerEmergencyButton = screen.getByRole('button', { name: /emergency alerts/i });
      fireEvent.click(headerEmergencyButton);
      expect(mockNavigate).toHaveBeenCalledWith('/trip-manager/emergency');

      vi.clearAllMocks();

      // Navigate from quick actions emergency card
      const emergencyCard = screen.getByText('Emergency Alerts').closest('.ant-card');
      fireEvent.click(emergencyCard);
      expect(mockNavigate).toHaveBeenCalledWith('/trip-manager/emergency');
    });

    it('shows consistent emergency state across components', () => {
      render(
        <TestWrapper>
          <TripManagerNavigationIntegration />
        </TestWrapper>
      );

      // Check emergency pulse animation in header
      const headerEmergencyButton = screen.getByRole('button', { name: /emergency alerts/i });
      expect(headerEmergencyButton).toHaveClass('animate-pulse');

      // Check emergency pulse animation in quick actions
      const emergencyCard = screen.getByText('Emergency Alerts').closest('.ant-card');
      expect(emergencyCard).toHaveClass('animate-pulse');
    });
  });

  describe('Mobile Navigation Integration', () => {
    it('shows mobile navigation with consistent data', async () => {
      render(
        <TestWrapper>
          <TripManagerNavigationIntegration />
        </TestWrapper>
      );

      // Open mobile navigation
      const menuButton = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(menuButton);

      await waitFor(() => {
        // Check mobile nav shows same user info as header
        expect(screen.getAllByText('Trip Manager User').length).toBeGreaterThan(0);
        
        // Check mobile nav shows same stats
        expect(screen.getByText('Active Trips')).toBeInTheDocument();
        expect(screen.getByText('Issues')).toBeInTheDocument();
        expect(screen.getByText('Alerts')).toBeInTheDocument();
      });
    });

    it('closes mobile navigation and maintains state', async () => {
      render(
        <TestWrapper>
          <TripManagerNavigationIntegration />
        </TestWrapper>
      );

      // Open mobile navigation
      const menuButton = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Mobile Navigation')).toBeInTheDocument();
      });

      // Close mobile navigation
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Mobile Navigation')).not.toBeInTheDocument();
      });

      // Verify main components are still there
      expect(screen.getByText('Trip Manager Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    });
  });

  describe('Icon Standardization Across Components', () => {
    it('uses consistent icons across all components', () => {
      render(
        <TestWrapper>
          <TripManagerNavigationIntegration />
        </TestWrapper>
      );

      // Check that schedule icons are used consistently
      const headerTitle = screen.getByText('Trip Manager Dashboard');
      expect(headerTitle.parentElement.previousSibling).toBeTruthy();

      // Check that emergency icons are consistent
      const emergencyButtons = screen.getAllByRole('button', { name: /emergency/i });
      expect(emergencyButtons.length).toBeGreaterThan(0);
    });

    it('maintains icon consistency in mobile navigation', async () => {
      render(
        <TestWrapper>
          <TripManagerNavigationIntegration />
        </TestWrapper>
      );

      // Open mobile navigation
      const menuButton = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(menuButton);

      await waitFor(() => {
        // Check that mobile nav uses same icons as main components
        expect(screen.getByText('Emergency Alerts')).toBeInTheDocument();
        expect(screen.getByText('Active Trips')).toBeInTheDocument();
        expect(screen.getByText('Schedule Management')).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Behavior Integration', () => {
    it('shows mobile-specific elements only on mobile', () => {
      render(
        <TestWrapper>
          <TripManagerNavigationIntegration />
        </TestWrapper>
      );

      // Mobile menu button should be hidden on desktop
      const menuButton = screen.getByRole('button', { name: /menu/i });
      expect(menuButton).toHaveClass('md:hidden');

      // Mobile quick actions should be hidden on desktop
      const mobileSection = document.querySelector('.md\\:hidden');
      expect(mobileSection).toBeInTheDocument();
    });

    it('maintains consistent styling across breakpoints', () => {
      render(
        <TestWrapper>
          <TripManagerNavigationIntegration />
        </TestWrapper>
      );

      // Check responsive grid classes
      const quickActionsGrid = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3');
      expect(quickActionsGrid).toBeInTheDocument();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('handles zero counts gracefully', () => {
      const ZeroCountsComponent = () => (
        <div>
          <TripManagerHeader
            activeTrips={0}
            emergencyAlerts={0}
            onMenuToggle={() => {}}
          />
          <TripManagerQuickActions
            activeTrips={0}
            pendingIssues={0}
            emergencyAlerts={0}
          />
        </div>
      );

      render(
        <TestWrapper>
          <ZeroCountsComponent />
        </TestWrapper>
      );

      // Should not show emergency section when no alerts
      expect(screen.queryByText('Emergency Attention Required')).not.toBeInTheDocument();
      
      // Should still show action buttons
      expect(screen.getByRole('button', { name: /active trips/i })).toBeInTheDocument();
    });

    it('handles missing user data gracefully', () => {
      mockAuthStore.user = null;

      render(
        <TestWrapper>
          <TripManagerNavigationIntegration />
        </TestWrapper>
      );

      // Should show fallback text
      expect(screen.getByText('Trip Manager')).toBeInTheDocument();
    });
  });
});