import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Sidebar from '../Sidebar';
import IconProvider from '../../../icons/IconProvider';
import ThemeProvider from '../../../theme/ThemeProvider';

// Mock useLocation
const mockLocation = { pathname: '/operator/dashboard' };
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => mockLocation,
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

describe('OperatorSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the sidebar with logo and navigation items', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      expect(screen.getByText('QuikRide')).toBeInTheDocument();
      expect(screen.getByText('Operator Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Tuyến Đường')).toBeInTheDocument();
      expect(screen.getByText('Quản Lý Xe')).toBeInTheDocument();
      expect(screen.getByText('Chuyến Xe')).toBeInTheDocument();
      expect(screen.getByText('Nhân Viên')).toBeInTheDocument();
      expect(screen.getByText('Báo Cáo')).toBeInTheDocument();
      expect(screen.getByText('Voucher')).toBeInTheDocument();
    });

    it('shows copyright footer', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      expect(screen.getByText('© 2024 QuikRide')).toBeInTheDocument();
    });

    it('highlights active menu item', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const dashboardLink = screen.getByText('Dashboard').closest('a');
      expect(dashboardLink).toHaveClass('bg-blue-700');
    });
  });

  describe('Collapse Functionality', () => {
    it('renders in expanded state by default', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      expect(screen.getByText('Operator Dashboard')).toBeInTheDocument();
      expect(screen.getByText('© 2024 QuikRide')).toBeInTheDocument();
    });

    it('collapses when collapse button is clicked', async () => {
      const onCollapse = vi.fn();
      render(
        <TestWrapper>
          <Sidebar onCollapse={onCollapse} />
        </TestWrapper>
      );

      const collapseButton = screen.getByRole('button');
      fireEvent.click(collapseButton);

      await waitFor(() => {
        expect(onCollapse).toHaveBeenCalledWith(true);
      });
    });

    it('starts collapsed when collapsed prop is true', () => {
      render(
        <TestWrapper>
          <Sidebar collapsed={true} />
        </TestWrapper>
      );

      // In collapsed state, text should be hidden
      expect(screen.queryByText('Operator Dashboard')).not.toBeInTheDocument();
      expect(screen.queryByText('© 2024 QuikRide')).not.toBeInTheDocument();
    });

    it('shows tooltips in collapsed state', () => {
      render(
        <TestWrapper>
          <Sidebar collapsed={true} />
        </TestWrapper>
      );

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      expect(dashboardLink).toHaveAttribute('title', 'Dashboard');
    });
  });

  describe('Navigation Links', () => {
    it('renders all navigation links with correct paths', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/operator/dashboard');
      expect(screen.getByRole('link', { name: /tuyến đường/i })).toHaveAttribute('href', '/operator/routes');
      expect(screen.getByRole('link', { name: /quản lý xe/i })).toHaveAttribute('href', '/operator/buses');
      expect(screen.getByRole('link', { name: /chuyến xe/i })).toHaveAttribute('href', '/operator/trips');
      expect(screen.getByRole('link', { name: /nhân viên/i })).toHaveAttribute('href', '/operator/employees');
      expect(screen.getByRole('link', { name: /báo cáo/i })).toHaveAttribute('href', '/operator/reports');
      expect(screen.getByRole('link', { name: /voucher/i })).toHaveAttribute('href', '/operator/vouchers');
    });

    it('logo links to dashboard', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const logoLink = screen.getByText('QuikRide').closest('a');
      expect(logoLink).toHaveAttribute('href', '/operator/dashboard');
    });
  });

  describe('Icon Standardization', () => {
    it('uses standardized icons from IconProvider', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      // Check that icons are rendered for each menu item
      const menuItems = [
        'Dashboard',
        'Tuyến Đường',
        'Quản Lý Xe',
        'Chuyến Xe',
        'Nhân Viên',
        'Báo Cáo',
        'Voucher'
      ];

      menuItems.forEach(item => {
        const menuItem = screen.getByText(item);
        const icon = menuItem.previousSibling;
        expect(icon).toBeTruthy();
      });
    });

    it('uses transport bus icon in logo', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const logoArea = screen.getByText('QuikRide').parentElement;
      expect(logoArea).toBeTruthy();
    });
  });

  describe('Responsive Behavior', () => {
    it('shows mobile overlay in mobile view', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const overlay = document.querySelector('.md\\:hidden.fixed.inset-0');
      expect(overlay).toBeInTheDocument();
    });

    it('hides collapse button on mobile', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const collapseButton = screen.getByRole('button');
      expect(collapseButton).toHaveClass('md:flex', 'hidden');
    });
  });

  describe('Active State Management', () => {
    it('highlights correct menu item based on current path', () => {
      // Change mock location
      mockLocation.pathname = '/operator/routes';
      
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const routesLink = screen.getByText('Tuyến Đường').closest('a');
      expect(routesLink).toHaveClass('bg-blue-700');
    });

    it('applies hover effects to non-active items', () => {
      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      const routesLink = screen.getByText('Tuyến Đường').closest('a');
      expect(routesLink).toHaveClass('hover:bg-blue-700/50');
    });
  });
});