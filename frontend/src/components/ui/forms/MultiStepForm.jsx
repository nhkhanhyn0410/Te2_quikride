/**
 * Multi-Step Form Components
 * Components for building multi-step forms with consistent progress indicators
 */

import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Steps, Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

const { Step } = Steps;

/**
 * MultiStepForm - Main container for multi-step forms
 */
export const MultiStepForm = ({
  steps = [],
  initialStep = 0,
  onStepChange,
  onComplete,
  className,
  children,
  ...props
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const handleNext = useCallback(() => {
    const nextStep = currentStep + 1;
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    
    if (nextStep < steps.length) {
      setCurrentStep(nextStep);
      onStepChange?.(nextStep, currentStep);
    } else {
      onComplete?.(currentStep);
    }
  }, [currentStep, steps.length, onStepChange, onComplete]);

  const handlePrevious = useCallback(() => {
    const prevStep = currentStep - 1;
    if (prevStep >= 0) {
      setCurrentStep(prevStep);
      onStepChange?.(prevStep, currentStep);
    }
  }, [currentStep, onStepChange]);

  const handleStepClick = useCallback((step) => {
    // Only allow navigation to completed steps or the next step
    if (completedSteps.has(step) || step === currentStep + 1 || step === currentStep) {
      setCurrentStep(step);
      onStepChange?.(step, currentStep);
    }
  }, [completedSteps, currentStep, onStepChange]);

  const formClassName = classNames(
    'multi-step-form',
    className
  );

  return (
    <div className={formClassName} {...props}>
      <MultiStepProgress
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />
      
      <div className="multi-step-content mt-8">
        {children || (
          <div className="step-content">
            {steps[currentStep]?.content}
          </div>
        )}
      </div>
      
      <MultiStepNavigation
        currentStep={currentStep}
        totalSteps={steps.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
        nextDisabled={steps[currentStep]?.nextDisabled}
        nextText={steps[currentStep]?.nextText}
        previousText={steps[currentStep]?.previousText}
      />
    </div>
  );
};

MultiStepForm.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      content: PropTypes.node,
      nextText: PropTypes.string,
      previousText: PropTypes.string,
      nextDisabled: PropTypes.bool,
    })
  ).isRequired,
  initialStep: PropTypes.number,
  onStepChange: PropTypes.func,
  onComplete: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * MultiStepProgress - Progress indicator for multi-step forms
 */
export const MultiStepProgress = ({
  steps = [],
  currentStep = 0,
  completedSteps = new Set(),
  onStepClick,
  size = 'default',
  direction = 'horizontal',
  className,
  ...props
}) => {
  const progressClassName = classNames(
    'multi-step-progress',
    className
  );

  return (
    <div className={progressClassName} {...props}>
      <Steps
        current={currentStep}
        size={size}
        direction={direction}
        className="mb-6"
      >
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const isClickable = isCompleted || index === currentStep + 1 || index === currentStep;
          
          return (
            <Step
              key={index}
              title={step.title}
              description={step.description}
              status={
                isCompleted ? 'finish' : 
                index === currentStep ? 'process' : 
                'wait'
              }
              icon={isCompleted ? <CheckOutlined /> : undefined}
              onClick={isClickable ? () => onStepClick?.(index) : undefined}
              className={classNames({
                'cursor-pointer hover:opacity-80': isClickable,
                'cursor-not-allowed opacity-50': !isClickable,
              })}
            />
          );
        })}
      </Steps>
    </div>
  );
};

MultiStepProgress.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
  currentStep: PropTypes.number,
  completedSteps: PropTypes.instanceOf(Set),
  onStepClick: PropTypes.func,
  size: PropTypes.oneOf(['default', 'small']),
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  className: PropTypes.string,
};

/**
 * MultiStepNavigation - Navigation buttons for multi-step forms
 */
export const MultiStepNavigation = ({
  currentStep = 0,
  totalSteps = 1,
  onNext,
  onPrevious,
  nextDisabled = false,
  previousDisabled = false,
  nextText,
  previousText,
  showProgress = true,
  className,
  ...props
}) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const getNextText = () => {
    if (nextText) return nextText;
    return isLastStep ? 'Complete' : 'Next';
  };

  const getPreviousText = () => {
    if (previousText) return previousText;
    return 'Previous';
  };

  const navigationClassName = classNames(
    'multi-step-navigation',
    'flex items-center justify-between pt-6 mt-6 border-t border-gray-200',
    className
  );

  return (
    <div className={navigationClassName} {...props}>
      <div className="flex items-center gap-4">
        {!isFirstStep && (
          <Button
            onClick={onPrevious}
            disabled={previousDisabled}
            size="large"
          >
            {getPreviousText()}
          </Button>
        )}
      </div>

      {showProgress && (
        <div className="text-sm text-gray-500">
          Step {currentStep + 1} of {totalSteps}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button
          type="primary"
          onClick={onNext}
          disabled={nextDisabled}
          size="large"
        >
          {getNextText()}
        </Button>
      </div>
    </div>
  );
};

MultiStepNavigation.propTypes = {
  currentStep: PropTypes.number,
  totalSteps: PropTypes.number,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
  nextDisabled: PropTypes.bool,
  previousDisabled: PropTypes.bool,
  nextText: PropTypes.string,
  previousText: PropTypes.string,
  showProgress: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * StepContent - Wrapper for individual step content
 */
export const StepContent = ({
  children,
  title,
  description,
  className,
  ...props
}) => {
  const contentClassName = classNames(
    'step-content',
    'min-h-[400px] py-6',
    className
  );

  return (
    <div className={contentClassName} {...props}>
      {(title || description) && (
        <div className="step-header mb-6">
          {title && (
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-gray-600">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className="step-body">
        {children}
      </div>
    </div>
  );
};

StepContent.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  className: PropTypes.string,
};