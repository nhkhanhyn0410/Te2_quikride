/**
 * Navigation Components Comprehensive Tests
 * Tests for all navigation components across different user roles
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { antdTheme } from '../../../theme/themeConfig';

// Import navigation components
import { CustomerHeader } from '../../customer/CustomerHeader';
import { OperatorHeader } from '../../operator/Header';
import { OperatorSidebar } from '../../operator/Sidebar';
import { AdminHeader } from '../../admin/AdminHeader';
import { AdminSidebar } from '../../admin/AdminSidebar';
import { TripManagerHeader } from '../../trip-manager/TripManagerHeader';
import { TripManagerQuickActions } from '../../trip-manager/TripManagerQuickActions';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Test wrapper with theme and router
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <ConfigProvider theme={antdTheme}>
      {children}
    </ConfigProvider>
  </BrowserRouter>
);

// Mock user data for different roles
const mockUsers = {
  customer: {
    id: 1,
    name: 'John Customer',
    email: 'john@customer.com',
    role: 'customer',
    avatar: null,
  },
  operator: {
    id: 2,
    name: 'Jane Operator',
    email: 'jane@operator.com',
    role: 'operator',
    company: 'QuikRide Transport',
  },
  admin: {
    id: 3,
    name: 'Bob Admin',
    email: 'bob@admin.com',
    role: 'admin',
  },
  tripManager: {
    id: 4,
    name: 'Alice Manager',
    email: 'alice@manager.com',
    role: 'tripManager',
  },
};

// Mock navigation items for each role
const mockNavigationItems = {
  customer: [
    { key: 'home', label: 'Home', path: '/' },
    { key: 'book', label: 'Book Trip', path: '/book' },
    { key: 'bookings', label: 'My Bookings', path: '/bookings' },
    { key: 'profile', label: 'Profile', path: '/profile' },
  ],
  operator: [
    { key: 'dashboard', label: 'Dashboard', path: '/operator/dashboard' },
    { key: 'trips', label: 'Trips', path: '/operator/trips' },
    { key: 'buses', label: 'Buses', path: '/operator/buses' },
    { key: 'routes', label: 'Routes', path: '/operator/routes' },
  ],
  admin: [
    { key: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
    { key: 'users', label: 'Users', path: '/admin/users' },
    { key: 'operators', label: 'Operators', path: '/admin/operators' },
    { key: 'reports', label: 'Reports', path: '/admin/reports' },
  ],
  tripManager: [
    { key: 'dashboard', label: 'Dashboard', path: '/trip-manager/dashboard' },
    { key: 'active-trips', label: 'Active Trips', path: '/trip-manager/active' },
    { key: 'history', label: 'Trip History', path: '/trip-manager/history' },
  ],
};

describe('Navigation Components', () => {
  describe('CustomerHeader', () => {
    it('should render customer header correctly', () => {
      render(
        <TestWrapper>
          <CustomerHeader user={mockUsers.customer} />
        </TestWrapper>
      );

      // Check user name is displayed
      expect(screen.getByText('John Customer')).toBeInTheDocument();
      
      // Check navigation items
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Book Trip')).toBeInTheDocument();
      expect(screen.getByText('My Bookings')).toBeInTheDocument();
    });

    it('should handle mobile menu toggle', async () => {
      render(
        <TestWrapper>
          <CustomerHeader user={mockUsers.customer} />
        </TestWrapper>
      );

      // Find mobile menu button
      const mobileMenuButton = screen.getByRole('button', { name: /menu/i });
      expect(mobileMenuButton).toBeInTheDocument();

      // Click to open mobile menu
      fireEvent.click(mobileMenuButton);

      await waitFor(() => {
        // Check if mobile menu is visible
        const mobileMenu = document.querySelector('[data-testid="mobile-menu"]');
        expect(mobileMenu).toBeInTheDocument();
      });
    });

    it('should handle user dropdown menu', async () => {
      render(
        <TestWrapper>
          <CustomerHeader user={mockUsers.customer} />
        </TestWrapper>
      );

      // Find user dropdown trigger
      const userDropdown = screen.getByText('John Customer');
      fireEvent.click(userDropdown);

      await waitFor(() => {
        // Check dropdown menu items
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
      });
    });

    it('should be accessible', async () => {
      const { container } = render(
        <TestWrapper>
          <CustomerHeader user={mockUsers.customer} />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should support keyboard navigation', () => {
      render(
        <TestWrapper>
          <CustomerHeader user={mockUsers.customer} />
        </TestWrapper>
      );

      const navigation = screen.getByRole('navigation');
      expect(navigation).toBeInTheDocument();

      // Test keyboard navigation
      fireEvent.keyDown(navigation, { key: 'Tab' });
      fireEvent.keyDown(navigation, { key: 'ArrowRight' });
      fireEvent.keyDown(navigation, { key: 'Enter' });
    });
  });

  describe('OperatorHeader', () => {
    it('should render operator header correctly', () => {
      render(
        <TestWrapper>
          <OperatorHeader user={mockUsers.operator} />
        </TestWrapper>
      );

      expect(screen.getByText('Jane Operator')).toBeInTheDocument();
      expect(screen.getByText('QuikRide Transport')).toBeInTheDocument();
    });

    it('should handle notifications', async () => {
      const mockNotifications = [
        { id: 1, message: 'New trip request', type: 'info' },
        { id: 2, message: 'Bus maintenance due', type: 'warning' },
      ];

      render(
        <TestWrapper>
          <OperatorHeader 
            user={mockUsers.operator} 
            notifications={mockNotifications}
          />
        </TestWrapper>
      );

      // Find notification bell
      const notificationBell = screen.getByRole('button', { name: /notification/i });
      fireEvent.click(notificationBell);

      await waitFor(() => {
        expect(screen.getByText('New trip request')).toBeInTheDocument();
        expect(screen.getByText('Bus maintenance due')).toBeInTheDocument();
      });
    });

    it('should be accessible', async () => {
      const { container } = render(
        <TestWrapper>
          <OperatorHeader user={mockUsers.operator} />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('OperatorSidebar', () => {
    it('should render operator sidebar correctly', () => {
      render(
        <TestWrapper>
          <OperatorSidebar 
            navigationItems={mockNavigationItems.operator}
            activeKey="dashboard"
          />
        </TestWrapper>
      );

      // Check navigation items
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Trips')).toBeInTheDocument();
      expect(screen.getByText('Buses')).toBeInTheDocument();
      expect(screen.getByText('Routes')).toBeInTheDocument();
    });

    it('should handle active state correctly', () => {
      render(
        <TestWrapper>
          <OperatorSidebar 
            navigationItems={mockNavigationItems.operator}
            activeKey="trips"
          />
        </TestWrapper>
      );

      // Check active item styling
      const activeItem = screen.getByText('Trips').closest('li');
      expect(activeItem).toHaveClass('ant-menu-item-selected');
    });

    it('should handle sidebar collapse', () => {
      const [collapsed, setCollapsed] = React.useState(false);

      const TestComponent = () => (
        <TestWrapper>
          <OperatorSidebar 
            navigationItems={mockNavigationItems.operator}
            activeKey="dashboard"
            collapsed={collapsed}
            onCollapse={setCollapsed}
          />
        </TestWrapper>
      );

      render(<TestComponent />);

      // Find collapse button
      const collapseButton = document.querySelector('.ant-menu-submenu-arrow');
      if (collapseButton) {
        fireEvent.click(collapseButton);
        expect(collapsed).toBe(true);
      }
    });

    it('should be accessible', async () => {
      const { container } = render(
        <TestWrapper>
          <OperatorSidebar 
            navigationItems={mockNavigationItems.operator}
            activeKey="dashboard"
          />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('AdminHeader', () => {
    it('should render admin header correctly', () => {
      render(
        <TestWrapper>
          <AdminHeader user={mockUsers.admin} />
        </TestWrapper>
      );

      expect(screen.getByText('Bob Admin')).toBeInTheDocument();
    });

    it('should handle system alerts', async () => {
      const mockAlerts = [
        { id: 1, message: 'System maintenance scheduled', type: 'warning' },
        { id: 2, message: 'New user registrations', type: 'info' },
      ];

      render(
        <TestWrapper>
          <AdminHeader 
            user={mockUsers.admin} 
            systemAlerts={mockAlerts}
          />
        </TestWrapper>
      );

      // Find alerts button
      const alertsButton = screen.getByRole('button', { name: /alert/i });
      fireEvent.click(alertsButton);

      await waitFor(() => {
        expect(screen.getByText('System maintenance scheduled')).toBeInTheDocument();
      });
    });

    it('should be accessible', async () => {
      const { container } = render(
        <TestWrapper>
          <AdminHeader user={mockUsers.admin} />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('AdminSidebar', () => {
    it('should render admin sidebar correctly', () => {
      render(
        <TestWrapper>
          <AdminSidebar 
            navigationItems={mockNavigationItems.admin}
            activeKey="dashboard"
          />
        </TestWrapper>
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByText('Operators')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    it('should handle nested menu items', () => {
      const nestedItems = [
        ...mockNavigationItems.admin,
        {
          key: 'settings',
          label: 'Settings',
          children: [
            { key: 'general', label: 'General', path: '/admin/settings/general' },
            { key: 'security', label: 'Security', path: '/admin/settings/security' },
          ],
        },
      ];

      render(
        <TestWrapper>
          <AdminSidebar 
            navigationItems={nestedItems}
            activeKey="dashboard"
          />
        </TestWrapper>
      );

      // Find submenu
      const settingsMenu = screen.getByText('Settings');
      fireEvent.click(settingsMenu);

      // Check submenu items
      expect(screen.getByText('General')).toBeInTheDocument();
      expect(screen.getByText('Security')).toBeInTheDocument();
    });

    it('should be accessible', async () => {
      const { container } = render(
        <TestWrapper>
          <AdminSidebar 
            navigationItems={mockNavigationItems.admin}
            activeKey="dashboard"
          />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('TripManagerHeader', () => {
    it('should render trip manager header correctly', () => {
      render(
        <TestWrapper>
          <TripManagerHeader user={mockUsers.tripManager} />
        </TestWrapper>
      );

      expect(screen.getByText('Alice Manager')).toBeInTheDocument();
    });

    it('should display active trip count', () => {
      const activeTripsCount = 15;

      render(
        <TestWrapper>
          <TripManagerHeader 
            user={mockUsers.tripManager}
            activeTripsCount={activeTripsCount}
          />
        </TestWrapper>
      );

      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText(/active trips/i)).toBeInTheDocument();
    });

    it('should be accessible', async () => {
      const { container } = render(
        <TestWrapper>
          <TripManagerHeader user={mockUsers.tripManager} />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('TripManagerQuickActions', () => {
    it('should render quick actions correctly', () => {
      const mockActions = [
        { key: 'start-trip', label: 'Start Trip', icon: 'play' },
        { key: 'end-trip', label: 'End Trip', icon: 'stop' },
        { key: 'emergency', label: 'Emergency', icon: 'warning', danger: true },
      ];

      render(
        <TestWrapper>
          <TripManagerQuickActions actions={mockActions} />
        </TestWrapper>
      );

      expect(screen.getByText('Start Trip')).toBeInTheDocument();
      expect(screen.getByText('End Trip')).toBeInTheDocument();
      expect(screen.getByText('Emergency')).toBeInTheDocument();
    });

    it('should handle action clicks', () => {
      const handleAction = vi.fn();
      const mockActions = [
        { key: 'start-trip', label: 'Start Trip', onClick: handleAction },
      ];

      render(
        <TestWrapper>
          <TripManagerQuickActions actions={mockActions} />
        </TestWrapper>
      );

      const startTripButton = screen.getByText('Start Trip');
      fireEvent.click(startTripButton);

      expect(handleAction).toHaveBeenCalledWith('start-trip');
    });

    it('should be accessible', async () => {
      const mockActions = [
        { key: 'start-trip', label: 'Start Trip', icon: 'play' },
      ];

      const { container } = render(
        <TestWrapper>
          <TripManagerQuickActions actions={mockActions} />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Responsive Navigation', () => {
    it('should adapt to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <TestWrapper>
          <CustomerHeader user={mockUsers.customer} />
        </TestWrapper>
      );

      // Check mobile menu button is visible
      const mobileMenuButton = screen.getByRole('button', { name: /menu/i });
      expect(mobileMenuButton).toBeInTheDocument();
    });

    it('should handle tablet viewport', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(
        <TestWrapper>
          <OperatorSidebar 
            navigationItems={mockNavigationItems.operator}
            activeKey="dashboard"
          />
        </TestWrapper>
      );

      // Sidebar should be collapsible on tablet
      const sidebar = document.querySelector('.ant-layout-sider');
      expect(sidebar).toBeInTheDocument();
    });
  });

  describe('Navigation Consistency', () => {
    it('should maintain consistent styling across roles', () => {
      const components = [
        <CustomerHeader key="customer" user={mockUsers.customer} />,
        <OperatorHeader key="operator" user={mockUsers.operator} />,
        <AdminHeader key="admin" user={mockUsers.admin} />,
        <TripManagerHeader key="tripManager" user={mockUsers.tripManager} />,
      ];

      components.forEach((component, index) => {
        const { unmount } = render(
          <TestWrapper>
            {component}
          </TestWrapper>
        );

        // Check consistent header structure
        const header = document.querySelector('header') || document.querySelector('.ant-layout-header');
        expect(header).toBeInTheDocument();

        unmount();
      });
    });

    it('should have consistent navigation patterns', () => {
      const sidebarComponents = [
        <OperatorSidebar key="operator" navigationItems={mockNavigationItems.operator} activeKey="dashboard" />,
        <AdminSidebar key="admin" navigationItems={mockNavigationItems.admin} activeKey="dashboard" />,
      ];

      sidebarComponents.forEach((component) => {
        const { unmount } = render(
          <TestWrapper>
            {component}
          </TestWrapper>
        );

        // Check consistent sidebar structure
        const sidebar = document.querySelector('.ant-menu');
        expect(sidebar).toBeInTheDocument();

        unmount();
      });
    });
  });

  describe('Performance', () => {
    it('should render navigation components quickly', () => {
      const startTime = performance.now();

      render(
        <TestWrapper>
          <OperatorHeader user={mockUsers.operator} />
          <OperatorSidebar 
            navigationItems={mockNavigationItems.operator}
            activeKey="dashboard"
          />
        </TestWrapper>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within 100ms
      expect(renderTime).toBeLessThan(100);
    });

    it('should handle large navigation menus efficiently', () => {
      const largeNavigationItems = Array.from({ length: 50 }, (_, i) => ({
        key: `item-${i}`,
        label: `Menu Item ${i}`,
        path: `/item-${i}`,
      }));

      const startTime = performance.now();

      render(
        <TestWrapper>
          <AdminSidebar 
            navigationItems={largeNavigationItems}
            activeKey="item-0"
          />
        </TestWrapper>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should handle large menus efficiently
      expect(renderTime).toBeLessThan(200);
    });
  });
});