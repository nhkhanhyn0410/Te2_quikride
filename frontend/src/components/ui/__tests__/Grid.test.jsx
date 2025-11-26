/**
 * Grid Components Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Grid, GridItem, Container, PanelGrid } from '../Grid';

describe('Grid Component', () => {
  it('renders with default props', () => {
    render(
      <Grid data-testid="grid">
        <div>Grid content</div>
      </Grid>
    );

    const grid = screen.getByTestId('grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid', 'w-full');
  });

  it('applies custom columns configuration', () => {
    const columns = { desktop: 6, tablet: 4, mobile: 2 };
    const { container } = render(
      <Grid columns={columns}>
        <div>Grid content</div>
      </Grid>
    );

    const grid = container.firstChild;
    expect(grid).toHaveClass('grid-cols-2', 'md:grid-cols-4', 'lg:grid-cols-6');
  });

  it('applies custom gap configuration', () => {
    const gap = { desktop: 8, tablet: 6, mobile: 4 };
    const { container } = render(
      <Grid gap={gap}>
        <div>Grid content</div>
      </Grid>
    );

    const grid = container.firstChild;
    expect(grid).toHaveClass('gap-4', 'md:gap-6', 'lg:gap-8');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Grid className="custom-grid">
        <div>Grid content</div>
      </Grid>
    );

    expect(container.firstChild).toHaveClass('custom-grid');
  });

  it('passes through additional props', () => {
    render(
      <Grid data-testid="custom-grid" id="test-grid">
        <div>Grid content</div>
      </Grid>
    );

    expect(screen.getByTestId('custom-grid')).toBeInTheDocument();
    expect(document.getElementById('test-grid')).toBeInTheDocument();
  });
});

describe('GridItem Component', () => {
  it('renders with default props', () => {
    render(
      <GridItem data-testid="grid-item">
        <div>Grid item content</div>
      </GridItem>
    );

    const gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toBeInTheDocument();
    expect(screen.getByText('Grid item content')).toBeInTheDocument();
  });

  it('applies custom span configuration', () => {
    const span = { desktop: 6, tablet: 4, mobile: 2 };
    const { container } = render(
      <GridItem span={span}>
        <div>Grid item content</div>
      </GridItem>
    );

    const gridItem = container.firstChild;
    expect(gridItem).toHaveClass('col-span-2', 'md:col-span-4', 'lg:col-span-6');
  });

  it('applies offset configuration', () => {
    const offset = { desktop: 2, tablet: 1, mobile: 0 };
    const { container } = render(
      <GridItem offset={offset}>
        <div>Grid item content</div>
      </GridItem>
    );

    const gridItem = container.firstChild;
    expect(gridItem).toHaveClass('md:col-start-2', 'lg:col-start-3');
  });

  it('applies custom className', () => {
    const { container } = render(
      <GridItem className="custom-grid-item">
        <div>Grid item content</div>
      </GridItem>
    );

    expect(container.firstChild).toHaveClass('custom-grid-item');
  });
});

describe('Container Component', () => {
  it('renders with default props', () => {
    render(
      <Container data-testid="container">
        <div>Container content</div>
      </Container>
    );

    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('w-full', 'px-4', 'sm:px-6', 'lg:px-8', 'max-w-6xl', 'mx-auto');
  });

  it('applies different sizes', () => {
    const sizes = ['small', 'default', 'large', 'full'];
    const expectedClasses = ['max-w-4xl', 'max-w-6xl', 'max-w-7xl', 'max-w-full'];

    sizes.forEach((size, index) => {
      const { container } = render(
        <Container size={size} data-testid={`container-${size}`}>
          <div>Container content</div>
        </Container>
      );

      const containerElement = container.querySelector(`[data-testid="container-${size}"]`);
      expect(containerElement).toHaveClass(expectedClasses[index]);
    });
  });

  it('applies centering by default', () => {
    const { container } = render(
      <Container>
        <div>Container content</div>
      </Container>
    );

    expect(container.firstChild).toHaveClass('mx-auto');
  });

  it('removes centering when centered is false', () => {
    const { container } = render(
      <Container centered={false}>
        <div>Container content</div>
      </Container>
    );

    expect(container.firstChild).not.toHaveClass('mx-auto');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Container className="custom-container">
        <div>Container content</div>
      </Container>
    );

    expect(container.firstChild).toHaveClass('custom-container');
  });
});

describe('PanelGrid Component', () => {
  it('renders with default auto layout', () => {
    const { container } = render(
      <PanelGrid data-testid="panel-grid">
        <div>Panel grid content</div>
      </PanelGrid>
    );

    const panelGrid = container.firstChild;
    expect(panelGrid).toHaveClass('grid', 'w-full');
    // Auto layout: 12 desktop, 8 tablet, 1 mobile
    expect(panelGrid).toHaveClass('grid-cols-1', 'md:grid-cols-8', 'lg:grid-cols-12');
  });

  it('applies sidebar layout', () => {
    const { container } = render(
      <PanelGrid layout="sidebar">
        <div>Sidebar content</div>
      </PanelGrid>
    );

    const panelGrid = container.firstChild;
    // Sidebar layout: 4 desktop, 3 tablet, 1 mobile
    expect(panelGrid).toHaveClass('grid-cols-1', 'md:grid-cols-3', 'lg:grid-cols-4');
  });

  it('applies cards layout', () => {
    const { container } = render(
      <PanelGrid layout="cards">
        <div>Cards content</div>
      </PanelGrid>
    );

    const panelGrid = container.firstChild;
    // Cards layout: 3 desktop, 2 tablet, 1 mobile
    expect(panelGrid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
  });

  it('applies dashboard layout', () => {
    const { container } = render(
      <PanelGrid layout="dashboard">
        <div>Dashboard content</div>
      </PanelGrid>
    );

    const panelGrid = container.firstChild;
    // Dashboard layout: 6 desktop, 4 tablet, 2 mobile
    expect(panelGrid).toHaveClass('grid-cols-2', 'md:grid-cols-4', 'lg:grid-cols-6');
  });

  it('applies custom className', () => {
    const { container } = render(
      <PanelGrid className="custom-panel-grid">
        <div>Panel grid content</div>
      </PanelGrid>
    );

    expect(container.firstChild).toHaveClass('custom-panel-grid');
  });

  it('passes through additional props', () => {
    render(
      <PanelGrid data-testid="custom-panel-grid" id="test-panel-grid">
        <div>Panel grid content</div>
      </PanelGrid>
    );

    expect(screen.getByTestId('custom-panel-grid')).toBeInTheDocument();
    expect(document.getElementById('test-panel-grid')).toBeInTheDocument();
  });
});