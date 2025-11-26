/**
 * Tests for Mobile-First Component Updates
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StandardPanel from '../StandardPanel';
import { Grid, Container } from '../Grid';
import FormInput from '../forms/FormInput';
import MobileFormLayout from '../forms/MobileFormLayout';
import MobileButton from '../buttons/MobileButton';

// Mock responsive utilities
jest.mock('../../../utils/responsive', () => ({
  useCurrentBreakpoint: () => 'md',
  useIsMobile: () => false,
}));

describe('Mobile-First Component Updates', () => {
  describe('StandardPanel Mobile-First Updates', () => {
    test('applies responsive classes correctly', () => {
      const { container } = render(
        <StandardPanel size="medium">
          <div>Panel Content</div>
        </StandardPanel>
      );
      
      const panel = container.querySelector('.standard-panel');
      expect(panel).toHaveClass('rounded-responsive-md');
      expect(panel).toHaveClass('transition-responsive');
      expect(panel).toHaveClass('w-full');
      expect(panel).toHaveClass('touch-manipulation');
    });

    test('applies responsive padding utilities', () => {
      const { container } = render(
        <StandardPanel padding="comfortable">
          <div>Panel Content</div>
        </StandardPanel>
      );
      
      const panelContent = container.querySelector('.p-responsive-md');
      expect(panelContent).toBeInTheDocument();
    });

    test('applies responsive min-height classes', () => {
      const { container } = render(
        <StandardPanel size="large">
          <div>Panel Content</div>
        </StandardPanel>
      );
      
      const panel = container.querySelector('.standard-panel');
      expect(panel).toHaveClass('min-h-[250px]');
      expect(panel).toHaveClass('sm:min-h-[400px]');
      expect(panel).toHaveClass('md:min-h-[450px]');
    });
  });

  describe('Grid Mobile-First Updates', () => {
    test('applies touch manipulation and responsive transitions', () => {
      const { container } = render(
        <Grid>
          <div>Grid Item</div>
        </Grid>
      );
      
      const grid = container.firstChild;
      expect(grid).toHaveClass('touch-manipulation');
      expect(grid).toHaveClass('transition-responsive');
    });

    test('Container uses responsive container utility', () => {
      const { container } = render(
        <Container>
          <div>Container Content</div>
        </Container>
      );
      
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass('container-responsive');
    });
  });

  describe('FormInput Mobile-First Updates', () => {
    test('applies mobile-friendly classes and styles', () => {
      render(<FormInput data-testid="form-input" />);
      
      const input = screen.getByTestId('form-input');
      expect(input).toHaveClass('touch-manipulation');
      expect(input).toHaveClass('w-full');
      expect(input).toHaveClass('transition-responsive');
      
      // Check minimum touch target size
      expect(input).toHaveStyle({ minHeight: '44px', fontSize: '16px' });
    });

    test('maintains validation state styling', () => {
      const { container } = render(<FormInput error={true} />);
      
      const input = container.querySelector('input');
      expect(input).toHaveClass('border-red-500');
    });
  });

  describe('MobileFormLayout', () => {
    test('renders with responsive container and proper structure', () => {
      render(
        <MobileFormLayout 
          title="Test Form" 
          subtitle="Test Subtitle"
          data-testid="mobile-form"
        >
          <div>Form Content</div>
        </MobileFormLayout>
      );
      
      expect(screen.getByText('Test Form')).toBeInTheDocument();
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
      expect(screen.getByText('Form Content')).toBeInTheDocument();
    });

    test('applies mobile-friendly classes', () => {
      const { container } = render(
        <MobileFormLayout>
          <div>Form Content</div>
        </MobileFormLayout>
      );
      
      const formLayout = container.querySelector('.mobile-form-layout');
      expect(formLayout).toHaveClass('w-full');
      expect(formLayout).toHaveClass('touch-manipulation');
    });
  });

  describe('MobileButton', () => {
    test('applies touch-friendly classes and styles', () => {
      render(
        <MobileButton data-testid="mobile-button">
          Click Me
        </MobileButton>
      );
      
      const button = screen.getByTestId('mobile-button');
      expect(button).toHaveClass('mobile-button');
      expect(button).toHaveClass('transition-responsive');
      expect(button).toHaveClass('touch-manipulation');
      expect(button).toHaveClass('touch-target');
      
      // Check minimum touch target size
      expect(button).toHaveStyle({ minHeight: '44px', fontSize: '16px' });
    });

    test('applies different touch target sizes', () => {
      const { rerender } = render(
        <MobileButton touchTarget="small" data-testid="mobile-button">
          Small Button
        </MobileButton>
      );
      
      let button = screen.getByTestId('mobile-button');
      expect(button).toHaveClass('touch-target-sm');
      expect(button).toHaveStyle({ minHeight: '36px' });
      
      rerender(
        <MobileButton touchTarget="large" data-testid="mobile-button">
          Large Button
        </MobileButton>
      );
      
      button = screen.getByTestId('mobile-button');
      expect(button).toHaveClass('touch-target-lg');
      expect(button).toHaveStyle({ minHeight: '52px' });
    });

    test('handles block prop correctly', () => {
      render(
        <MobileButton block data-testid="mobile-button">
          Block Button
        </MobileButton>
      );
      
      const button = screen.getByTestId('mobile-button');
      expect(button).toHaveClass('w-full');
    });

    test('handles click events properly', () => {
      const handleClick = jest.fn();
      render(
        <MobileButton onClick={handleClick} data-testid="mobile-button">
          Click Me
        </MobileButton>
      );
      
      const button = screen.getByTestId('mobile-button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Responsive Design Patterns', () => {
    test('components work together in mobile layout', () => {
      render(
        <Container>
          <Grid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
            <StandardPanel size="medium" padding="comfortable">
              <MobileFormLayout title="Mobile Form">
                <FormInput placeholder="Mobile Input" />
                <MobileButton block>Submit</MobileButton>
              </MobileFormLayout>
            </StandardPanel>
          </Grid>
        </Container>
      );
      
      expect(screen.getByText('Mobile Form')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Mobile Input')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    test('maintains accessibility with touch targets', () => {
      render(
        <div>
          <MobileButton touchTarget="small">Small</MobileButton>
          <MobileButton touchTarget="default">Default</MobileButton>
          <MobileButton touchTarget="large">Large</MobileButton>
        </div>
      );
      
      const buttons = screen.getAllByRole('button');
      
      // Check that all buttons meet minimum touch target requirements
      buttons.forEach((button, index) => {
        const expectedHeights = ['36px', '44px', '52px'];
        expect(button).toHaveStyle({ minHeight: expectedHeights[index] });
      });
    });
  });
});