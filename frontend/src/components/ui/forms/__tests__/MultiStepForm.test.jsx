/**
 * MultiStepForm Components Tests
 * Tests for multi-step form components
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import {
  MultiStepForm,
  MultiStepProgress,
  MultiStepNavigation,
  StepContent,
} from '../MultiStepForm';

// Test wrapper with Ant Design ConfigProvider
const TestWrapper = ({ children }) => (
  <ConfigProvider>
    {children}
  </ConfigProvider>
);

const mockSteps = [
  {
    title: 'Personal Info',
    description: 'Enter your personal information',
    content: <div>Step 1 Content</div>,
  },
  {
    title: 'Contact Details',
    description: 'Provide contact information',
    content: <div>Step 2 Content</div>,
  },
  {
    title: 'Review',
    description: 'Review your information',
    content: <div>Step 3 Content</div>,
  },
];

describe('MultiStepForm', () => {
  it('renders with default props', () => {
    render(
      <TestWrapper>
        <MultiStepForm steps={mockSteps} />
      </TestWrapper>
    );

    expect(screen.getByText('Personal Info')).toBeInTheDocument();
    expect(screen.getByText('Step 1 Content')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('starts at specified initial step', () => {
    render(
      <TestWrapper>
        <MultiStepForm steps={mockSteps} initialStep={1} />
      </TestWrapper>
    );

    expect(screen.getByText('Step 2 Content')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('handles step navigation', () => {
    const onStepChange = vi.fn();
    render(
      <TestWrapper>
        <MultiStepForm steps={mockSteps} onStepChange={onStepChange} />
      </TestWrapper>
    );

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(onStepChange).toHaveBeenCalledWith(1, 0);
    expect(screen.getByText('Step 2 Content')).toBeInTheDocument();
  });

  it('shows Complete button on last step', () => {
    render(
      <TestWrapper>
        <MultiStepForm steps={mockSteps} initialStep={2} />
      </TestWrapper>
    );

    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('calls onComplete when completing the form', () => {
    const onComplete = vi.fn();
    render(
      <TestWrapper>
        <MultiStepForm 
          steps={mockSteps} 
          initialStep={2} 
          onComplete={onComplete} 
        />
      </TestWrapper>
    );

    const completeButton = screen.getByText('Complete');
    fireEvent.click(completeButton);

    expect(onComplete).toHaveBeenCalledWith(2);
  });

  it('renders custom children instead of step content', () => {
    render(
      <TestWrapper>
        <MultiStepForm steps={mockSteps}>
          <div>Custom Content</div>
        </MultiStepForm>
      </TestWrapper>
    );

    expect(screen.getByText('Custom Content')).toBeInTheDocument();
    expect(screen.queryByText('Step 1 Content')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <MultiStepForm steps={mockSteps} className="custom-form" />
      </TestWrapper>
    );

    expect(container.querySelector('.multi-step-form')).toHaveClass('custom-form');
  });
});

describe('MultiStepProgress', () => {
  it('renders progress steps', () => {
    render(
      <TestWrapper>
        <MultiStepProgress steps={mockSteps} currentStep={0} />
      </TestWrapper>
    );

    expect(screen.getByText('Personal Info')).toBeInTheDocument();
    expect(screen.getByText('Contact Details')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('shows current step as active', () => {
    const { container } = render(
      <TestWrapper>
        <MultiStepProgress steps={mockSteps} currentStep={1} />
      </TestWrapper>
    );

    const steps = container.querySelectorAll('.ant-steps-item');
    expect(steps[1]).toHaveClass('ant-steps-item-active');
  });

  it('shows completed steps with check icon', () => {
    const completedSteps = new Set([0]);
    const { container } = render(
      <TestWrapper>
        <MultiStepProgress 
          steps={mockSteps} 
          currentStep={1} 
          completedSteps={completedSteps} 
        />
      </TestWrapper>
    );

    const completedStep = container.querySelector('.ant-steps-item-finish');
    expect(completedStep).toBeInTheDocument();
    expect(container.querySelector('.anticon-check')).toBeInTheDocument();
  });

  it('handles step click for clickable steps', () => {
    const onStepClick = vi.fn();
    const completedSteps = new Set([0]);
    
    render(
      <TestWrapper>
        <MultiStepProgress 
          steps={mockSteps} 
          currentStep={1} 
          completedSteps={completedSteps}
          onStepClick={onStepClick}
        />
      </TestWrapper>
    );

    // Click on completed step should work
    const completedStepElement = screen.getByText('Personal Info');
    fireEvent.click(completedStepElement);
    
    expect(onStepClick).toHaveBeenCalledWith(0);
  });

  it('applies different sizes', () => {
    const { container } = render(
      <TestWrapper>
        <MultiStepProgress steps={mockSteps} size="small" />
      </TestWrapper>
    );

    expect(container.querySelector('.ant-steps-small')).toBeInTheDocument();
  });

  it('applies vertical direction', () => {
    const { container } = render(
      <TestWrapper>
        <MultiStepProgress steps={mockSteps} direction="vertical" />
      </TestWrapper>
    );

    expect(container.querySelector('.ant-steps-vertical')).toBeInTheDocument();
  });
});

describe('MultiStepNavigation', () => {
  it('renders navigation buttons', () => {
    render(
      <TestWrapper>
        <MultiStepNavigation 
          currentStep={1} 
          totalSteps={3}
          onNext={vi.fn()}
          onPrevious={vi.fn()}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
  });

  it('hides Previous button on first step', () => {
    render(
      <TestWrapper>
        <MultiStepNavigation 
          currentStep={0} 
          totalSteps={3}
          onNext={vi.fn()}
          onPrevious={vi.fn()}
        />
      </TestWrapper>
    );

    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('shows Complete button on last step', () => {
    render(
      <TestWrapper>
        <MultiStepNavigation 
          currentStep={2} 
          totalSteps={3}
          onNext={vi.fn()}
          onPrevious={vi.fn()}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('handles button clicks', () => {
    const onNext = vi.fn();
    const onPrevious = vi.fn();
    
    render(
      <TestWrapper>
        <MultiStepNavigation 
          currentStep={1} 
          totalSteps={3}
          onNext={onNext}
          onPrevious={onPrevious}
        />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Next'));
    expect(onNext).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Previous'));
    expect(onPrevious).toHaveBeenCalled();
  });

  it('disables buttons when disabled props are true', () => {
    render(
      <TestWrapper>
        <MultiStepNavigation 
          currentStep={1} 
          totalSteps={3}
          onNext={vi.fn()}
          onPrevious={vi.fn()}
          nextDisabled
          previousDisabled
        />
      </TestWrapper>
    );

    expect(screen.getByText('Next')).toBeDisabled();
    expect(screen.getByText('Previous')).toBeDisabled();
  });

  it('uses custom button text', () => {
    render(
      <TestWrapper>
        <MultiStepNavigation 
          currentStep={1} 
          totalSteps={3}
          onNext={vi.fn()}
          onPrevious={vi.fn()}
          nextText="Continue"
          previousText="Back"
        />
      </TestWrapper>
    );

    expect(screen.getByText('Continue')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('hides progress when showProgress is false', () => {
    render(
      <TestWrapper>
        <MultiStepNavigation 
          currentStep={1} 
          totalSteps={3}
          onNext={vi.fn()}
          onPrevious={vi.fn()}
          showProgress={false}
        />
      </TestWrapper>
    );

    expect(screen.queryByText('Step 2 of 3')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <MultiStepNavigation 
          currentStep={1} 
          totalSteps={3}
          onNext={vi.fn()}
          onPrevious={vi.fn()}
          className="custom-navigation"
        />
      </TestWrapper>
    );

    expect(container.querySelector('.multi-step-navigation')).toHaveClass('custom-navigation');
  });
});

describe('StepContent', () => {
  it('renders children', () => {
    render(
      <TestWrapper>
        <StepContent>
          <div>Step content here</div>
        </StepContent>
      </TestWrapper>
    );

    expect(screen.getByText('Step content here')).toBeInTheDocument();
  });

  it('renders with title and description', () => {
    render(
      <TestWrapper>
        <StepContent 
          title="Step Title" 
          description="Step description"
        >
          <div>Step content</div>
        </StepContent>
      </TestWrapper>
    );

    expect(screen.getByText('Step Title')).toBeInTheDocument();
    expect(screen.getByText('Step description')).toBeInTheDocument();
    expect(screen.getByText('Step content')).toBeInTheDocument();
  });

  it('renders without header when no title or description', () => {
    render(
      <TestWrapper>
        <StepContent>
          <div>Step content</div>
        </StepContent>
      </TestWrapper>
    );

    expect(screen.getByText('Step content')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <StepContent className="custom-step">
          <div>Content</div>
        </StepContent>
      </TestWrapper>
    );

    expect(container.querySelector('.step-content')).toHaveClass('custom-step');
  });
});