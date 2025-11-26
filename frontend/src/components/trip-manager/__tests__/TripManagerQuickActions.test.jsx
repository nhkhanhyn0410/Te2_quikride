import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TripManagerQuickActions from '../TripManagerQuickActions';
import IconProvider from '../../../icons/IconProvider';
import ThemeProvider from '../../../theme/ThemeProvider';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
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

describe('TripManagerQuickActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the quick actions panel with header', () => {
      render(
        <TestWrapper>
          <TripManagerQuickActions />
        </TestWrapper>
      );

      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('Common trip management tasks')).toBeInTheDocument();
    });

    it('renders all quick action cards', () => {
      render(
        <TestWrapper>
          <TripManagerQuickActions />
        </TestWrapper>
      );

      expect(screen.getByText('Active Trips')).toBeInTheDocument();
      expect(screen.getByText('Emergency Alerts')).toBeInTheDocument();
      expect(screen.getByText('Pending Issues')).toBeInTheDocument();
      expect(screen.getByText('Schedule Management')).toBeInTheDocument();
      expect(screen.getByText('Driver Status')).toBeInTheDocument();
      expect(screen.getByText('Trip Reports')).toBeInTheDocument();
    });

    it('shows action descriptions', () => {
      render(
        <TestWrapper>
          <TripManagerQuickActions />
        </TestWrapper>
      );

      expect(screen.getByText('Monitor ongoing trips')).toBeInTheDocument();
      expect(screen.getByText('Handle emergency situations')).toBeInTheDocument();
      expect(screen.getByText('Resolve trip issues')).toBeInTheDocument();
      expect(screen.getByText('Manage trip schedules')).toBeInTheDocument();
      expect(screen.getByText('Monitor driver availability')).toBeInTheDocument();
      expect(screen.getByText('View trip analytics')).toBeInTheDocument();
    });
  });

  describe('Count Display', () => {
    it('displays counts for countable actions', () => {
      render(
        <TestWrapper>
          <TripManagerQuickActions 
            activeTrips={5}
            pendingIssues={3}
            emergencyAlerts={1}
          />
        </TestWrapper>
      );

      // Check for badge elements with counts
      const badges = screen.getAllByText(/[0-9]+/);
      expect(badges.length).toBeGreaterThan(0);
    });

    it('shows zero counts when no data provided', () => {
      render(
        <TestWrapper>
          <TripManagerQuickActions />
        </TestWrapper>
      );

      // Should show 0 badges for countable items
      const badges = screen.getAllByText('0');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe('Navigation Functionality', () => {
    it('navigates to correct paths when action cards are clicked', () => {
      render(
        <TestWrapper>
          <TripManagerQuickActions />
        </TestWrapper>
      );

      // Test Active Trips navigation
      const activeTripsCard = screen.getByText('Active Trips').closest('.ant-card');
      fireEvent.click(activeTripsCard);
      expect(mockNavigate).toHaveBeenCalledWith('/trip-manager/trips/active');

      // Test Emergency Alerts navigation
      const emergencyCard = screen.getByText('Emergency Alerts').closest('.ant-card');
      fireEvent.click(emergencyCard);
      expect(mockNavigate).toHaveBeenCalledWith('/trip-manager/emergency');

      // Test Pending Issues navigation
      const issuesCard = screen.getByText('Pending Issues').closest('.ant-card');
      fireEvent.click(issuesCard);
      expect(mockNavigate).toHaveBeenCalledWith('/trip-manager/issues');

      // Test Schedule Management navigation
      const scheduleCard = screen.getByText('Schedule Management').closest('.ant-card');
      fireEvent.click(scheduleCard);
      expect(mockNavigate).toHaveBeenCalledWith('/trip-manager/schedule');

      // Test Driver Status navigation
      const driversCard = screen.getByText('Driver Status').closest('.ant-card');
      fireEvent.click(driversCard);
      expect(mockNavigate).toHaveBeenCalledWith('/trip-manager/drivers');

      // Test Trip Reports navigation
      const reportsCard = screen.getByText('Trip Reports').closest('.ant-card');
      fireEvent.click(reportsCard);
      expect(mockNavigate).toHaveBeenCalledWith('/trip-manager/reports');
    });
  });

  describe('Emergency Alert Handling', () => {
    it('shows emergency section when there are emergency alerts', () => {
      render(
        <TestWrapper>
          <TripManagerQuickActions emergencyAlerts={2} />
        </TestWrapper>
      );

      expect(screen.getByText('Emergency Attention Required')).toBeInTheDocument();
      expect(screen.getByText('2 active emergency alerts')).toBeInTheDocument();
      expect(screen.getByText('Handle Now')).toBeInTheDocument();
    });

    it('does not show emergency section when no alerts', () => {
      render(
        <TestWrapper>
          <TripManagerQuickActions emergencyAlerts={0} />
        </TestWrapper>
      );

      expect(screen.queryByText('Emergency Attention Required')).not.toBeInTheDocument();
      expect(screen.queryByText('Handle Now')).not.toBeInTheDocument();
    });

    it('navigates to emergency page when Handle Now is clicked', () => {
      render(
        <TestWrapper>
          <TripManagerQuickActions emergencyAlerts={1} />
        </TestWrapper>
      );

      const handleNowButton = screen.getByText('Handle Now');
      fireEvent.click(handleNowButton);
      expect(mockNavigate).toHaveBeenCalledWith('/trip-manager/emergency');
    });

    it('shows singular text for single emergency alert', () => {
      render(
        <TestWrapper>
          <TripManagerQuickActions emergencyAlerts={1} />
        </TestWrapper>
      );

      expect(screen.getByText('1 active emergency alert')).toBeInTheDocument();
    });

    it('applies pulse animation to emergency card when urgent', () => {
      render(
        <TestWrapper>
          <TripManagerQuickActions emergencyAlerts={1} />
        </TestWrapper>
      );

      const emergencyCard = screen.getByText('Emergency Alerts').closest('.ant-card');
      expect(emergencyCard).toHaveClass('animate-pulse');
    });
  });

  describe('Mobile Optimized Actions', () => {
    it('shows mobile emergency and quick update buttons', () => {
      render(
        <TestWrapper>
          <TripManagerQuickActions />
        </TestWrapper>
      );

      expect(screen.getByText('Emergency')).toBeInTheDocument();
      expect(screen.getByText('Quick Update')).toBeInTheDocument();
    });

    it('shows mobile quick stats', () => {
      render(
        <TestWrapper>
          <TripManagerQuickActions 
            activeTrips={5}
            pendingIssues={3}
            emergencyAlerts={1}
          />
        </TestWrapper>
      );

      // Check for mobile stats display
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Issues')).toBeInTheDocument();
      expect(screen.getByText('Alerts')).toBeInTheDocument();
    });

    it('opens emergency hotline when emergency button is clicked', () => {
      render(
        <TestWrapper>
          <TripManagerQuickActions />
        </TestWrapper>
      );

      const emergencyButton = screen.getByText('Emergency');
      fireEvent.click(emergencyButton);
      expect(window.open).toHaveBeenCalledWith('tel:911');
    });

    it('navigates to quick update when quick update button is clicked', () => {
      render(
        <TestWrapper>
          <TripManagerQuickActions />
        </TestWrapper>
      );

      const quickUpdateButton = screen.getByText('Quick Update');
      fireEvent.click(quickUpdateButton);
      expect(mockNavigate).toHaveBeenCalledWith('/trip-manager/quick-update');
    });
  });

  describe('Color Coding', () => {
    it('applies correct color classes to action cards', () => {
      render(
        <TestWrapper>
          <TripManagerQuickActions />
        </TestWrapper>
      );

      const activeTripsCard = screen.getByText('Active Trips').closest('.ant-card');
      expect(activeTripsCard).toHaveClass('border-l-blue-500', 'hover:bg-blue-50');

      const emergencyCard = screen.getByText('Emergency Alerts').closest('.ant-card');
      expect(emergencyCard).toHaveClass('border-l-red-500', 'hover:bg-red-50');

      const issuesCard = screen.getByText('Pending Issues').closest('.ant-card');
      expect(issuesCard).toHaveClass('border-l-orange-500', 'hover:bg-orange-50');

      const scheduleCard = screen.getByText('Schedule Management').closest('.ant-card');
      expect(scheduleCard).toHaveClass('border-l-green-500', 'hover:bg-green-50');

      const driversCard = screen.getByText('Driver Status').closest('.ant-card');
      expect(driversCard).toHaveClass('border-l-purple-500', 'hover:bg-purple-50');

      const reportsCard = screen.getByText('Trip Reports').closest('.ant-card');
      expect(reportsCard).toHaveClass('border-l-indigo-500', 'hover:bg-indigo-50');
    });
  });

  describe('Icon Standardization', () => {
    it('uses standardized icons from IconProvider', () => {
      render(
        <TestWrapper>
          <TripManagerQuickActions />
        </TestWrapper>
      );

      // Check that icons are rendered for each action card
      const actionCards = [
        'Active Trips',
        'Emergency Alerts',
        'Pending Issues',
        'Schedule Management',
        'Driver Status',
        'Trip Reports'
      ];

      actionCards.forEach(action => {
        const actionCard = screen.getByText(action);
        const iconContainer = actionCard.parentElement.querySelector('.p-2.rounded-lg');
        expect(iconContainer).toBeTruthy();
      });
    });

    it('uses forward arrow icons for navigation indication', () => {
      render(
        <TestWrapper>
          <TripManagerQuickActions />
        </TestWrapper>
      );

      // Each card should have a forward arrow
      const forwardArrows = document.querySelectorAll('.text-gray-400');
      expect(forwardArrows.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Grid Layout', () => {
    it('applies responsive grid classes', () => {
      render(
        <TestWrapper>
          <TripManagerQuickActions />
        </TestWrapper>
      );

      const gridContainer = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3');
      expect(gridContainer).toBeInTheDocument();
    });

    it('shows mobile section with md:hidden class', () => {
      render(
        <TestWrapper>
          <TripManagerQuickActions />
        </TestWrapper>
      );

      const mobileSection = document.querySelector('.md\\:hidden');
      expect(mobileSection).toBeInTheDocument();
    });
  });
});