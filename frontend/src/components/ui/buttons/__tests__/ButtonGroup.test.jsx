/**
 * ButtonGroup Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ButtonGroup from '../ButtonGroup';
import StandardButton from '../StandardButton';
import { IconProvider } from '../../../../icons/IconProvider';

// Mock icon provider
const MockIconProvider = ({ children }) => (
  <IconProvider value={{ getIconByContext: () => null }}>
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

describe('ButtonGroup', () => {
  it('renders children correctly', () => {
    renderWithIconProvider(
      <ButtonGroup>
        <StandardButton>Button 1</StandardButton>
        <StandardButton>Button 2</StandardButton>
        <StandardButton>Button 3</StandardButton>
      </ButtonGroup>
    );
    
    expect(screen.getByRole('button', { name: /button 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /button 2/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /button 3/i })).toBeInTheDocument();
  });

  it('applies default alignment (left)', () => {
    renderWithIconProvider(
      <ButtonGroup data-testid="button-group">
        <StandardButton>Button 1</StandardButton>
        <StandardButton>Button 2</StandardButton>
      </ButtonGroup>
    );
    
    const buttonGroup = screen.getByTestId('button-group');
    expect(buttonGroup).toHaveClass('justify-start');
  });

  it('applies center alignment correctly', () => {
    renderWithIconProvider(
      <ButtonGroup align="center" data-testid="button-group">
        <StandardButton>Button 1</StandardButton>
        <StandardButton>Button 2</StandardButton>
      </ButtonGroup>
    );
    
    const buttonGroup = screen.getByTestId('button-group');
    expect(buttonGroup).toHaveClass('justify-center', 'w-full');
  });

  it('applies right alignment correctly', () => {
    renderWithIconProvider(
      <ButtonGroup align="right" data-testid="button-group">
        <StandardButton>Button 1</StandardButton>
        <StandardButton>Button 2</StandardButton>
      </ButtonGroup>
    );
    
    const buttonGroup = screen.getByTestId('button-group');
    expect(buttonGroup).toHaveClass('justify-end');
  });

  it('applies space-between alignment correctly', () => {
    renderWithIconProvider(
      <ButtonGroup align="space-between" data-testid="button-group">
        <StandardButton>Button 1</StandardButton>
        <StandardButton>Button 2</StandardButton>
      </ButtonGroup>
    );
    
    const buttonGroup = screen.getByTestId('button-group');
    expect(buttonGroup).toHaveClass('justify-between', 'w-full');
  });

  it('handles different spacing sizes', () => {
    const spacingSizes = ['small', 'middle', 'large'];
    
    spacingSizes.forEach(spacing => {
      const { unmount } = renderWithIconProvider(
        <ButtonGroup spacing={spacing} data-testid={`button-group-${spacing}`}>
          <StandardButton>Button 1</StandardButton>
          <StandardButton>Button 2</StandardButton>
        </ButtonGroup>
      );
      
      const buttonGroup = screen.getByTestId(`button-group-${spacing}`);
      expect(buttonGroup).toBeInTheDocument();
      
      unmount();
    });
  });

  it('handles custom numeric spacing', () => {
    renderWithIconProvider(
      <ButtonGroup spacing={32} data-testid="button-group">
        <StandardButton>Button 1</StandardButton>
        <StandardButton>Button 2</StandardButton>
      </ButtonGroup>
    );
    
    const buttonGroup = screen.getByTestId('button-group');
    expect(buttonGroup).toBeInTheDocument();
  });

  it('handles vertical direction', () => {
    renderWithIconProvider(
      <ButtonGroup direction="vertical" data-testid="button-group">
        <StandardButton>Button 1</StandardButton>
        <StandardButton>Button 2</StandardButton>
      </ButtonGroup>
    );
    
    const buttonGroup = screen.getByTestId('button-group');
    expect(buttonGroup).toBeInTheDocument();
    expect(buttonGroup).toHaveClass('ant-space-vertical');
  });

  it('handles wrap prop', () => {
    renderWithIconProvider(
      <ButtonGroup wrap data-testid="button-group">
        <StandardButton>Button 1</StandardButton>
        <StandardButton>Button 2</StandardButton>
        <StandardButton>Button 3</StandardButton>
      </ButtonGroup>
    );
    
    const buttonGroup = screen.getByTestId('button-group');
    expect(buttonGroup).toBeInTheDocument();
  });

  it('applies custom className', () => {
    renderWithIconProvider(
      <ButtonGroup className="custom-group-class" data-testid="button-group">
        <StandardButton>Button 1</StandardButton>
        <StandardButton>Button 2</StandardButton>
      </ButtonGroup>
    );
    
    const buttonGroup = screen.getByTestId('button-group');
    expect(buttonGroup).toHaveClass('custom-group-class', 'button-group');
  });

  it('passes through additional props', () => {
    renderWithIconProvider(
      <ButtonGroup data-testid="button-group" title="Button Group Title">
        <StandardButton>Button 1</StandardButton>
        <StandardButton>Button 2</StandardButton>
      </ButtonGroup>
    );
    
    const buttonGroup = screen.getByTestId('button-group');
    expect(buttonGroup).toHaveAttribute('title', 'Button Group Title');
  });

  it('renders with mixed button types', () => {
    renderWithIconProvider(
      <ButtonGroup>
        <StandardButton variant="primary">Primary</StandardButton>
        <StandardButton variant="secondary">Secondary</StandardButton>
        <StandardButton variant="text">Text</StandardButton>
      </ButtonGroup>
    );
    
    expect(screen.getByRole('button', { name: /primary/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /secondary/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /text/i })).toBeInTheDocument();
  });

  it('handles empty children gracefully', () => {
    renderWithIconProvider(
      <ButtonGroup data-testid="empty-group">
        {null}
        {false}
        {undefined}
      </ButtonGroup>
    );
    
    const buttonGroup = screen.getByTestId('empty-group');
    expect(buttonGroup).toBeInTheDocument();
  });
});