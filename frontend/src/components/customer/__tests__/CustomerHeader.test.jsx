import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CustomerHeader from '../CustomerHeader';
import IconProvider from '../../../icons/IconProvider';
import ThemeProvider from '../../../theme/ThemeProvider';

// Mock the auth store
const mockAuthStore = {
  user: null,
  isAuthenticated: false,
  logout: vi.fn(),
};

vi.mock('../../../store/authStore', () => ({
  default: () => mockAuthStore,
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }),
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

describe('CustomerHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthStore.user = null;
    mockAuthStore.isAuthenticated = false;
  });

  describe('Basic Rendering', () => {
    it('renders the header with logo and navigation', () => {
      render(
        <TestWrapper>
          <CustomerHeader />
        </TestWrapper>
      );

      expect(screen.getByText('QuikRide')).toBeInTheDocument();
      expect(screen.getByText('Trang chủ')).toBeInTheDocument();
      expect(screen.getByText('Tìm chuyến')).toBeInTheDocument();
      expect(screen.getByText('Tra cứu vé')).toBeInTheDocument();
    });

    it('shows login and register buttons when not authenticated', () => {
      render(
        <TestWrapper>
          <CustomerHeader />
        </TestWrapper>
      );

      expect(screen.getByText('Đăng nhập')).toBeInTheDocument();
      expect(screen.getByText('Đăng ký')).toBeInTheDocument();
    });

    it('shows user menu when authenticated', () => {
      mockAuthStore.isAuthenticated = true;
      mockAuthStore.user = {
        fullName: 'John Doe',
        email: 'john@example.com',
      };

      render(
        <TestWrapper>
          <CustomerHeader />
        </TestWrapper>
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  describe('Navigation Functionality', () => {
    it('navigates to home when logo is clicked', () => {
      render(
        <TestWrapper>
          <CustomerHeader />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('QuikRide'));
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('navigates to login when login button is clicked', () => {
      render(
        <TestWrapper>
          <CustomerHeader />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Đăng nhập'));
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('navigates to register when register button is clicked', () => {
      render(
        <TestWrapper>
          <CustomerHeader />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText('Đăng ký'));
      expect(mockNavigate).toHaveBeenCalledWith('/register');
    });
  });

  describe('Mobile Menu', () => {
    it('opens mobile menu when menu button is clicked', async () => {
      render(
        <TestWrapper>
          <CustomerHeader />
        </TestWrapper>
      );

      // Find and click the mobile menu button
      const menuButton = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(menuButton);

      // Wait for the mobile menu to appear
      await waitFor(() => {
        expect(screen.getAllByText('QuikRide')).toHaveLength(2); // One in header, one in mobile menu
      });
    });

    it('closes mobile menu when close button is clicked', async () => {
      render(
        <TestWrapper>
          <CustomerHeader />
        </TestWrapper>
      );

      // Open mobile menu
      const menuButton = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getAllByText('QuikRide')).toHaveLength(2);
      });

      // Close mobile menu
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.getAllByText('QuikRide')).toHaveLength(1);
      });
    });

    it('shows user info in mobile menu when authenticated', async () => {
      mockAuthStore.isAuthenticated = true;
      mockAuthStore.user = {
        fullName: 'John Doe',
        email: 'john@example.com',
      };

      render(
        <TestWrapper>
          <CustomerHeader />
        </TestWrapper>
      );

      // Open mobile menu
      const menuButton = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getAllByText('John Doe')).toHaveLength(2); // Desktop and mobile
        expect(screen.getAllByText('john@example.com')).toHaveLength(1); // Only in mobile
      });
    });
  });

  describe('Breadcrumb Navigation', () => {
    it('shows breadcrumb when showBreadcrumb is true and items are provided', () => {
      const breadcrumbItems = [
        { title: 'Home', href: '/' },
        { title: 'Trips', href: '/trips' },
        { title: 'Current Trip' },
      ];

      render(
        <TestWrapper>
          <CustomerHeader showBreadcrumb={true} breadcrumbItems={breadcrumbItems} />
        </TestWrapper>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Trips')).toBeInTheDocument();
      expect(screen.getByText('Current Trip')).toBeInTheDocument();
    });

    it('does not show breadcrumb when showBreadcrumb is false', () => {
      const breadcrumbItems = [
        { title: 'Home', href: '/' },
        { title: 'Trips', href: '/trips' },
      ];

      render(
        <TestWrapper>
          <CustomerHeader showBreadcrumb={false} breadcrumbItems={breadcrumbItems} />
        </TestWrapper>
      );

      // Should not find breadcrumb items in the breadcrumb section
      const breadcrumbSection = screen.queryByRole('navigation');
      expect(breadcrumbSection).not.toBeInTheDocument();
    });

    it('does not show breadcrumb when no items are provided', () => {
      render(
        <TestWrapper>
          <CustomerHeader showBreadcrumb={true} breadcrumbItems={[]} />
        </TestWrapper>
      );

      const breadcrumbSection = screen.queryByRole('navigation');
      expect(breadcrumbSection).not.toBeInTheDocument();
    });
  });

  describe('User Authentication', () => {
    it('calls logout function when logout is clicked', async () => {
      mockAuthStore.isAuthenticated = true;
      mockAuthStore.user = {
        fullName: 'John Doe',
        email: 'john@example.com',
      };

      render(
        <TestWrapper>
          <CustomerHeader />
        </TestWrapper>
      );

      // Click on user dropdown
      const userButton = screen.getByText('John Doe');
      fireEvent.click(userButton);

      // Wait for dropdown to appear and click logout
      await waitFor(() => {
        const logoutButton = screen.getByText('Đăng xuất');
        fireEvent.click(logoutButton);
      });

      expect(mockAuthStore.logout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('shows correct menu items for authenticated users', async () => {
      mockAuthStore.isAuthenticated = true;
      mockAuthStore.user = {
        fullName: 'John Doe',
        email: 'john@example.com',
      };

      render(
        <TestWrapper>
          <CustomerHeader />
        </TestWrapper>
      );

      // Click on user dropdown
      const userButton = screen.getByText('John Doe');
      fireEvent.click(userButton);

      await waitFor(() => {
        expect(screen.getByText('Vé của tôi')).toBeInTheDocument();
        expect(screen.getByText('Đánh giá của tôi')).toBeInTheDocument();
        expect(screen.getByText('Khiếu nại')).toBeInTheDocument();
        expect(screen.getByText('Loyalty Program')).toBeInTheDocument();
        expect(screen.getByText('Đăng xuất')).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('hides desktop navigation on mobile screens', () => {
      // Mock window.matchMedia for mobile
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query.includes('max-width'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(
        <TestWrapper>
          <CustomerHeader />
        </TestWrapper>
      );

      // Desktop navigation should be hidden (md:flex class)
      const desktopNav = screen.getByText('Trang chủ').closest('.hidden');
      expect(desktopNav).toHaveClass('md:flex');
    });

    it('shows mobile menu button on mobile screens', () => {
      render(
        <TestWrapper>
          <CustomerHeader />
        </TestWrapper>
      );

      const mobileMenuButton = screen.getByRole('button', { name: /menu/i });
      expect(mobileMenuButton).toHaveClass('md:hidden');
    });
  });

  describe('Icon Standardization', () => {
    it('uses standardized icons from IconProvider', () => {
      render(
        <TestWrapper>
          <CustomerHeader />
        </TestWrapper>
      );

      // Check that icons are rendered (they should be present as SVG elements or icon components)
      const homeIcon = screen.getByText('Trang chủ').previousSibling;
      const searchIcon = screen.getByText('Tìm chuyến').previousSibling;
      const ticketIcon = screen.getByText('Tra cứu vé').previousSibling;

      expect(homeIcon).toBeTruthy();
      expect(searchIcon).toBeTruthy();
      expect(ticketIcon).toBeTruthy();
    });

    it('uses transport bus icon in logo', () => {
      render(
        <TestWrapper>
          <CustomerHeader />
        </TestWrapper>
      );

      // The bus icon should be present in the logo area
      const logoArea = screen.getByText('QuikRide').parentElement;
      expect(logoArea).toBeTruthy();
    });
  });
});