import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminSidebar from '../AdminSidebar';
import IconProvider from '../../../icons/IconProvider';
import ThemeProvider from '../../../theme/ThemeProvider';

// Mock useLocation
const mockLocation = { pathname: '/admin/dashboard' };
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

describe('AdminSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the sidebar with logo and navigation items', () => {
      render(
        <TestWrapper>
          <AdminSidebar />
        </TestWrapper>
      );

      expect(screen.getByText('QuikRide Admin')).toBeInTheDocument();
      expect(screen.getByText('System Administration')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Người Dùng')).toBeInTheDocument();
      expect(screen.getByText('Nhà Xe')).toBeInTheDocument();
      expect(screen.getByText('Khiếu Nại')).toBeInTheDocument();
      expect(screen.getByText('Nội Dung')).toBeInTheDocument();
      expect(screen.getByText('Báo Cáo')).toBeInTheDocument();
    });

    it('shows system status and copyright footer', () => {
      render(
        <TestWrapper>
          <AdminSidebar />
        </TestWrapper>
      );

      expect(screen.getByText('System Status')).toBeInTheDocument();
      expect(screen.getByText('Online')).toBeInTheDocument();
      expect(screen.getByText('© 2024 QuikRide Admin Panel')).toBeInTheDocument();
    });

    it('highlights active menu item', () => {
      render(
        <TestWrapper>
          <AdminSidebar />
        </TestWrapper>
      );

      const dashboardLink = screen.getByText('Dashboard').closest('a');
      expect(dashboardLink).toHaveClass('bg-white/10');
    });

    it('shows menu item descriptions', () => {
      render(
        <TestWrapper>
          <AdminSidebar />
        </TestWrapper>
      );

      expect(screen.getByText('Tổng quan hệ thống')).toBeInTheDocument();
      expect(screen.getByText('Quản lý users')).toBeInTheDocument();
      expect(screen.getByText('Duyệt & quản lý')).toBeInTheDocument();
      expect(screen.getByText('Xử lý khiếu nại')).toBeInTheDocument();
      expect(screen.getByText('Banners, Blogs, FAQs')).toBeInTheDocument();
      expect(screen.getByText('Thống kê & phân tích')).toBeInTheDocument();
    });
  });

  describe('Collapse Functionality', () => {
    it('renders in expanded state by default', () => {
      render(
        <TestWrapper>
          <AdminSidebar />
        </TestWrapper>
      );

      expect(screen.getByText('System Administration')).toBeInTheDocument();
      expect(screen.getByText('© 2024 QuikRide Admin Panel')).toBeInTheDocument();
    });

    it('collapses when collapse button is clicked', async () => {
      const onCollapse = vi.fn();
      render(
        <TestWrapper>
          <AdminSidebar onCollapse={onCollapse} />
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
          <AdminSidebar collapsed={true} />
        </TestWrapper>
      );

      // In collapsed state, text should be hidden
      expect(screen.queryByText('System Administration')).not.toBeInTheDocument();
      expect(screen.queryByText('© 2024 QuikRide Admin Panel')).not.toBeInTheDocument();
    });

    it('shows tooltips in collapsed state', () => {
      render(
        <TestWrapper>
          <AdminSidebar collapsed={true} />
        </TestWrapper>
      );

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      expect(dashboardLink).toHaveAttribute('title', 'Dashboard');
    });

    it('shows system status indicator in collapsed state', () => {
      render(
        <TestWrapper>
          <AdminSidebar collapsed={true} />
        </TestWrapper>
      );

      const statusIndicator = document.querySelector('.bg-green-400.rounded-full.animate-pulse');
      expect(statusIndicator).toBeInTheDocument();
      expect(statusIndicator).toHaveAttribute('title', 'System Online');
    });
  });

  describe('Navigation Links', () => {
    it('renders all navigation links with correct paths', () => {
      render(
        <TestWrapper>
          <AdminSidebar />
        </TestWrapper>
      );

      expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/admin/dashboard');
      expect(screen.getByRole('link', { name: /người dùng/i })).toHaveAttribute('href', '/admin/users');
      expect(screen.getByRole('link', { name: /nhà xe/i })).toHaveAttribute('href', '/admin/operators');
      expect(screen.getByRole('link', { name: /khiếu nại/i })).toHaveAttribute('href', '/admin/complaints');
      expect(screen.getByRole('link', { name: /nội dung/i })).toHaveAttribute('href', '/admin/content');
      expect(screen.getByRole('link', { name: /báo cáo/i })).toHaveAttribute('href', '/admin/reports');
    });

    it('logo links to dashboard', () => {
      render(
        <TestWrapper>
          <AdminSidebar />
        </TestWrapper>
      );

      const logoLink = screen.getByText('QuikRide Admin').closest('a');
      expect(logoLink).toHaveAttribute('href', '/admin/dashboard');
    });
  });

  describe('Icon Standardization', () => {
    it('uses standardized icons from IconProvider', () => {
      render(
        <TestWrapper>
          <AdminSidebar />
        </TestWrapper>
      );

      // Check that icons are rendered for each menu item
      const menuItems = [
        'Dashboard',
        'Người Dùng',
        'Nhà Xe',
        'Khiếu Nại',
        'Nội Dung',
        'Báo Cáo'
      ];

      menuItems.forEach(item => {
        const menuItem = screen.getByText(item);
        const icon = menuItem.parentElement.querySelector('span');
        expect(icon).toBeTruthy();
      });
    });

    it('uses admin icon in logo', () => {
      render(
        <TestWrapper>
          <AdminSidebar />
        </TestWrapper>
      );

      const logoArea = screen.getByText('QuikRide Admin').parentElement;
      expect(logoArea).toBeTruthy();
    });
  });

  describe('Responsive Behavior', () => {
    it('shows mobile overlay in mobile view', () => {
      render(
        <TestWrapper>
          <AdminSidebar />
        </TestWrapper>
      );

      const overlay = document.querySelector('.md\\:hidden.fixed.inset-0');
      expect(overlay).toBeInTheDocument();
    });

    it('hides collapse button on mobile', () => {
      render(
        <TestWrapper>
          <AdminSidebar />
        </TestWrapper>
      );

      const collapseButton = screen.getByRole('button');
      expect(collapseButton).toHaveClass('md:flex', 'hidden');
    });
  });

  describe('Active State Management', () => {
    it('highlights correct menu item based on current path', () => {
      // Change mock location
      mockLocation.pathname = '/admin/users';
      
      render(
        <TestWrapper>
          <AdminSidebar />
        </TestWrapper>
      );

      const usersLink = screen.getByText('Người Dùng').closest('a');
      expect(usersLink).toHaveClass('bg-white/10');
    });

    it('applies hover effects to non-active items', () => {
      render(
        <TestWrapper>
          <AdminSidebar />
        </TestWrapper>
      );

      const usersLink = screen.getByText('Người Dùng').closest('a');
      expect(usersLink).toHaveClass('hover:bg-white/5');
    });
  });

  describe('System Status Display', () => {
    it('shows online status with green indicator', () => {
      render(
        <TestWrapper>
          <AdminSidebar />
        </TestWrapper>
      );

      const statusIndicator = document.querySelector('.bg-green-400.rounded-full.animate-pulse');
      expect(statusIndicator).toBeInTheDocument();
      expect(screen.getByText('Online')).toBeInTheDocument();
    });

    it('shows system status section with backdrop blur', () => {
      render(
        <TestWrapper>
          <AdminSidebar />
        </TestWrapper>
      );

      const statusSection = screen.getByText('System Status').closest('.bg-white\\/5');
      expect(statusSection).toHaveClass('backdrop-blur-sm');
    });
  });
});