/**
 * ActionButton Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ActionButton from '../ActionButton';
import { IconProvider } from '../../../../icons/IconProvider';

// Mock icon provider
const mockGetIconByContext = vi.fn((context, type) => <span data-testid={`icon-${context}-${type}`} />);

const MockIconProvider = ({ children }) => (
  <IconProvider value={{ getIconByContext: mockGetIconByContext }}>
    {children}
  </IconProvider>
);

const renderWithIconProvider = (component) => {
  return render(
    <MockIconProvider>
      {component}
    </MockIconProvider>
  );
};

describe('ActionButton', () => {
  beforeEach(() => {
    mockGetIconByContext.mockClear();
  });

  describe('CRUD Actions', () => {
    it('renders create action correctly', () => {
      renderWithIconProvider(<ActionButton action="create" />);
      
      const button = screen.getByRole('button', { name: /tạo mới/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('ant-btn-primary');
      expect(mockGetIconByContext).toHaveBeenCalledWith('action', 'add');
    });

    it('renders edit action correctly', () => {
      renderWithIconProvider(<ActionButton action="edit" />);
      
      const button = screen.getByRole('button', { name: /chỉnh sửa/i });
      expect(button).toBeInTheDocument();
      expect(mockGetIconByContext).toHaveBeenCalledWith('action', 'edit');
    });

    it('renders delete action correctly', () => {
      renderWithIconProvider(<ActionButton action="delete" />);
      
      const button = screen.getByRole('button', { name: /xóa/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('ant-btn-dangerous');
      expect(mockGetIconByContext).toHaveBeenCalledWith('action', 'delete');
    });

    it('renders save action correctly', () => {
      renderWithIconProvider(<ActionButton action="save" />);
      
      const button = screen.getByRole('button', { name: /lưu/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('ant-btn-primary');
      expect(mockGetIconByContext).toHaveBeenCalledWith('action', 'save');
    });

    it('renders cancel action correctly', () => {
      renderWithIconProvider(<ActionButton action="cancel" />);
      
      const button = screen.getByRole('button', { name: /hủy/i });
      expect(button).toBeInTheDocument();
      expect(mockGetIconByContext).toHaveBeenCalledWith('action', 'close');
    });
  });

  describe('Navigation Actions', () => {
    it('renders back action correctly', () => {
      renderWithIconProvider(<ActionButton action="back" />);
      
      const button = screen.getByRole('button', { name: /quay lại/i });
      expect(button).toBeInTheDocument();
      expect(mockGetIconByContext).toHaveBeenCalledWith('navigation', 'back');
    });

    it('renders forward action correctly', () => {
      renderWithIconProvider(<ActionButton action="forward" />);
      
      const button = screen.getByRole('button', { name: /tiếp tục/i });
      expect(button).toBeInTheDocument();
      expect(mockGetIconByContext).toHaveBeenCalledWith('navigation', 'forward');
    });

    it('renders home action correctly', () => {
      renderWithIconProvider(<ActionButton action="home" />);
      
      const button = screen.getByRole('button', { name: /trang chủ/i });
      expect(button).toBeInTheDocument();
      expect(mockGetIconByContext).toHaveBeenCalledWith('navigation', 'home');
    });
  });

  describe('Status Actions', () => {
    it('renders approve action correctly', () => {
      renderWithIconProvider(<ActionButton action="approve" />);
      
      const button = screen.getByRole('button', { name: /phê duyệt/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('ant-btn-primary');
      expect(mockGetIconByContext).toHaveBeenCalledWith('status', 'success');
    });

    it('renders reject action correctly', () => {
      renderWithIconProvider(<ActionButton action="reject" />);
      
      const button = screen.getByRole('button', { name: /từ chối/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('ant-btn-dangerous');
      expect(mockGetIconByContext).toHaveBeenCalledWith('status', 'error');
    });
  });

  describe('Data Actions', () => {
    it('renders search action correctly', () => {
      renderWithIconProvider(<ActionButton action="search" />);
      
      const button = screen.getByRole('button', { name: /tìm kiếm/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('ant-btn-primary');
      expect(mockGetIconByContext).toHaveBeenCalledWith('action', 'search');
    });

    it('renders filter action correctly', () => {
      renderWithIconProvider(<ActionButton action="filter" />);
      
      const button = screen.getByRole('button', { name: /lọc/i });
      expect(button).toBeInTheDocument();
      expect(mockGetIconByContext).toHaveBeenCalledWith('action', 'filter');
    });

    it('renders export action correctly', () => {
      renderWithIconProvider(<ActionButton action="export" />);
      
      const button = screen.getByRole('button', { name: /xuất dữ liệu/i });
      expect(button).toBeInTheDocument();
      expect(mockGetIconByContext).toHaveBeenCalledWith('action', 'export');
    });

    it('renders import action correctly', () => {
      renderWithIconProvider(<ActionButton action="import" />);
      
      const button = screen.getByRole('button', { name: /nhập dữ liệu/i });
      expect(button).toBeInTheDocument();
      expect(mockGetIconByContext).toHaveBeenCalledWith('action', 'import');
    });
  });

  describe('Communication Actions', () => {
    it('renders send action correctly', () => {
      renderWithIconProvider(<ActionButton action="send" />);
      
      const button = screen.getByRole('button', { name: /gửi/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('ant-btn-primary');
      expect(mockGetIconByContext).toHaveBeenCalledWith('communication', 'send');
    });

    it('renders reply action correctly', () => {
      renderWithIconProvider(<ActionButton action="reply" />);
      
      const button = screen.getByRole('button', { name: /trả lời/i });
      expect(button).toBeInTheDocument();
      expect(mockGetIconByContext).toHaveBeenCalledWith('communication', 'reply');
    });
  });

  describe('Authentication Actions', () => {
    it('renders login action correctly', () => {
      renderWithIconProvider(<ActionButton action="login" />);
      
      const button = screen.getByRole('button', { name: /đăng nhập/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('ant-btn-primary');
      expect(mockGetIconByContext).toHaveBeenCalledWith('authentication', 'login');
    });

    it('renders logout action correctly', () => {
      renderWithIconProvider(<ActionButton action="logout" />);
      
      const button = screen.getByRole('button', { name: /đăng xuất/i });
      expect(button).toBeInTheDocument();
      expect(mockGetIconByContext).toHaveBeenCalledWith('authentication', 'logout');
    });

    it('renders register action correctly', () => {
      renderWithIconProvider(<ActionButton action="register" />);
      
      const button = screen.getByRole('button', { name: /đăng ký/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('ant-btn-primary');
      expect(mockGetIconByContext).toHaveBeenCalledWith('authentication', 'register');
    });
  });

  describe('Customization', () => {
    it('allows custom text override', () => {
      renderWithIconProvider(
        <ActionButton action="create">Custom Create Text</ActionButton>
      );
      
      const button = screen.getByRole('button', { name: /custom create text/i });
      expect(button).toBeInTheDocument();
    });

    it('allows variant override', () => {
      renderWithIconProvider(
        <ActionButton action="create" variant="secondary" />
      );
      
      const button = screen.getByRole('button', { name: /tạo mới/i });
      expect(button).toBeInTheDocument();
      expect(button).not.toHaveClass('ant-btn-primary');
    });

    it('handles different sizes', () => {
      renderWithIconProvider(
        <ActionButton action="create" size="large" />
      );
      
      const button = screen.getByRole('button', { name: /tạo mới/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('ant-btn-lg');
    });

    it('handles loading state', () => {
      renderWithIconProvider(
        <ActionButton action="save" loading />
      );
      
      const button = screen.getByRole('button', { name: /lưu/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('ant-btn-loading');
      expect(button).toBeDisabled();
    });

    it('handles disabled state', () => {
      renderWithIconProvider(
        <ActionButton action="delete" disabled />
      );
      
      const button = screen.getByRole('button', { name: /xóa/i });
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });

  describe('Event Handling', () => {
    it('handles click events', () => {
      const handleClick = vi.fn();
      
      renderWithIconProvider(
        <ActionButton action="save" onClick={handleClick} />
      );
      
      const button = screen.getByRole('button', { name: /lưu/i });
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('passes through additional props', () => {
      renderWithIconProvider(
        <ActionButton 
          action="create" 
          data-testid="test-action-button" 
          title="Create New Item"
        />
      );
      
      const button = screen.getByTestId('test-action-button');
      expect(button).toHaveAttribute('title', 'Create New Item');
    });
  });

  describe('Fallback Behavior', () => {
    it('handles unknown action gracefully', () => {
      // This would normally cause a PropTypes warning in development
      renderWithIconProvider(
        <ActionButton action="unknown" />
      );
      
      const button = screen.getByRole('button', { name: /unknown/i });
      expect(button).toBeInTheDocument();
    });
  });
});