/**
 * Grid System Demo
 * Demonstrates the usage of the responsive grid system
 */

import React from 'react';
import { Grid, GridItem, Container, PanelGrid } from '../Grid';
import StandardPanel from '../StandardPanel';

const GridDemo = () => {
    return (
        <div className="bg-neutral-50 min-h-screen py-8">
            <Container>
                <h1 className="text-3xl font-bold text-neutral-800 mb-8">Responsive Grid System Demo</h1>

                {/* Basic Grid Example */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-neutral-700 mb-6">Basic Grid System</h2>
                    <Grid columns={{ desktop: 12, tablet: 8, mobile: 1 }} gap={{ desktop: 6, tablet: 4, mobile: 3 }}>
                        <GridItem span={{ desktop: 6, tablet: 4, mobile: 1 }}>
                            <StandardPanel variant="default" className="h-32">
                                <div className="flex items-center justify-center h-full">
                                    <span className="text-neutral-600">6/12 Desktop, 4/8 Tablet, 1/1 Mobile</span>
                                </div>
                            </StandardPanel>
                        </GridItem>
                        <GridItem span={{ desktop: 6, tablet: 4, mobile: 1 }}>
                            <StandardPanel variant="elevated" className="h-32">
                                <div className="flex items-center justify-center h-full">
                                    <span className="text-neutral-600">6/12 Desktop, 4/8 Tablet, 1/1 Mobile</span>
                                </div>
                            </StandardPanel>
                        </GridItem>
                        <GridItem span={{ desktop: 4, tablet: 3, mobile: 1 }}>
                            <StandardPanel variant="bordered" className="h-32">
                                <div className="flex items-center justify-center h-full">
                                    <span className="text-neutral-600">4/12 Desktop, 3/8 Tablet, 1/1 Mobile</span>
                                </div>
                            </StandardPanel>
                        </GridItem>
                        <GridItem span={{ desktop: 4, tablet: 3, mobile: 1 }}>
                            <StandardPanel variant="ghost" className="h-32">
                                <div className="flex items-center justify-center h-full">
                                    <span className="text-neutral-600">4/12 Desktop, 3/8 Tablet, 1/1 Mobile</span>
                                </div>
                            </StandardPanel>
                        </GridItem>
                        <GridItem span={{ desktop: 4, tablet: 2, mobile: 1 }}>
                            <StandardPanel variant="default" className="h-32">
                                <div className="flex items-center justify-center h-full">
                                    <span className="text-neutral-600">4/12 Desktop, 2/8 Tablet, 1/1 Mobile</span>
                                </div>
                            </StandardPanel>
                        </GridItem>
                    </Grid>
                </section>

                {/* Container Sizes */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-neutral-700 mb-6">Container Sizes</h2>

                    <div className="space-y-6">
                        <Container size="small" className="bg-primary-100 py-4 rounded-lg">
                            <p className="text-center text-primary-700">Small Container (max-w-4xl)</p>
                        </Container>

                        <Container size="default" className="bg-success-100 py-4 rounded-lg">
                            <p className="text-center text-success-700">Default Container (max-w-6xl)</p>
                        </Container>

                        <Container size="large" className="bg-warning-100 py-4 rounded-lg">
                            <p className="text-center text-warning-700">Large Container (max-w-7xl)</p>
                        </Container>

                        <Container size="full" className="bg-error-100 py-4 rounded-lg">
                            <p className="text-center text-error-700">Full Container (max-w-full)</p>
                        </Container>
                    </div>
                </section>

                {/* Panel Grid Layouts */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-neutral-700 mb-6">Panel Grid Layouts</h2>

                    {/* Auto Layout */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-neutral-600 mb-4">Auto Layout (12/8/1 columns)</h3>
                        <PanelGrid layout="auto">
                            {Array.from({ length: 6 }, (_, i) => (
                                <GridItem key={i} span={{ desktop: 2, tablet: 2, mobile: 1 }}>
                                    <StandardPanel variant="default" className="h-24">
                                        <div className="flex items-center justify-center h-full">
                                            <span className="text-neutral-600">Item {i + 1}</span>
                                        </div>
                                    </StandardPanel>
                                </GridItem>
                            ))}
                        </PanelGrid>
                    </div>

                    {/* Cards Layout */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-neutral-600 mb-4">Cards Layout (3/2/1 columns)</h3>
                        <PanelGrid layout="cards">
                            {Array.from({ length: 6 }, (_, i) => (
                                <GridItem key={i} span={{ desktop: 1, tablet: 1, mobile: 1 }}>
                                    <StandardPanel
                                        variant="elevated"
                                        header={{
                                            title: `Card ${i + 1}`,
                                            subtitle: "Card subtitle",
                                        }}
                                        className="h-40"
                                    >
                                        <div className="flex items-center justify-center h-full">
                                            <span className="text-neutral-600">Card content {i + 1}</span>
                                        </div>
                                    </StandardPanel>
                                </GridItem>
                            ))}
                        </PanelGrid>
                    </div>

                    {/* Dashboard Layout */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-neutral-600 mb-4">Dashboard Layout (6/4/2 columns)</h3>
                        <PanelGrid layout="dashboard">
                            {Array.from({ length: 12 }, (_, i) => (
                                <GridItem key={i} span={{ desktop: 1, tablet: 1, mobile: 1 }}>
                                    <StandardPanel variant="bordered" className="h-20">
                                        <div className="flex items-center justify-center h-full">
                                            <span className="text-xs text-neutral-600">Widget {i + 1}</span>
                                        </div>
                                    </StandardPanel>
                                </GridItem>
                            ))}
                        </PanelGrid>
                    </div>

                    {/* Sidebar Layout */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-neutral-600 mb-4">Sidebar Layout (4/3/1 columns)</h3>
                        <PanelGrid layout="sidebar">
                            <GridItem span={{ desktop: 1, tablet: 1, mobile: 1 }}>
                                <StandardPanel
                                    variant="default"
                                    header={{ title: "Main Content" }}
                                    className="h-64"
                                >
                                    <div className="flex items-center justify-center h-full">
                                        <span className="text-neutral-600">Main content area</span>
                                    </div>
                                </StandardPanel>
                            </GridItem>
                            <GridItem span={{ desktop: 1, tablet: 1, mobile: 1 }}>
                                <StandardPanel
                                    variant="ghost"
                                    header={{ title: "Sidebar" }}
                                    className="h-64"
                                >
                                    <div className="flex items-center justify-center h-full">
                                        <span className="text-neutral-600">Sidebar content</span>
                                    </div>
                                </StandardPanel>
                            </GridItem>
                            <GridItem span={{ desktop: 1, tablet: 1, mobile: 1 }}>
                                <StandardPanel
                                    variant="elevated"
                                    header={{ title: "Widget" }}
                                    className="h-64"
                                >
                                    <div className="flex items-center justify-center h-full">
                                        <span className="text-neutral-600">Widget content</span>
                                    </div>
                                </StandardPanel>
                            </GridItem>
                            <GridItem span={{ desktop: 1, tablet: 1, mobile: 1 }}>
                                <StandardPanel
                                    variant="bordered"
                                    header={{ title: "Extra" }}
                                    className="h-64"
                                >
                                    <div className="flex items-center justify-center h-full">
                                        <span className="text-neutral-600">Extra content</span>
                                    </div>
                                </StandardPanel>
                            </GridItem>
                        </PanelGrid>
                    </div>
                </section>

                {/* Responsive Behavior Demo */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-neutral-700 mb-6">Responsive Behavior</h2>
                    <div className="bg-neutral-100 p-6 rounded-lg">
                        <p className="text-neutral-600 mb-4">
                            Resize your browser window to see how the grid adapts to different screen sizes:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-600">
                            <li><strong>Desktop (≥1024px):</strong> Full column count as specified</li>
                            <li><strong>Tablet (768px-1023px):</strong> Reduced column count for better touch interaction</li>
                            <li><strong>Mobile (&lt;768px):</strong> Single column layout for optimal mobile experience</li>
                        </ul>
                    </div>
                </section>

                {/* Utility Classes Demo */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-neutral-700 mb-6">Utility Classes</h2>
                    <div className="space-y-6">
                        <div className="panel-grid-cards">
                            <StandardPanel variant="default" className="grid-item-full">
                                <div className="p-4 text-center">
                                    <span className="text-neutral-600">Full Width (.grid-item-full)</span>
                                </div>
                            </StandardPanel>
                            <StandardPanel variant="elevated" className="grid-item-half">
                                <div className="p-4 text-center">
                                    <span className="text-neutral-600">Half Width (.grid-item-half)</span>
                                </div>
                            </StandardPanel>
                            <StandardPanel variant="bordered" className="grid-item-half">
                                <div className="p-4 text-center">
                                    <span className="text-neutral-600">Half Width (.grid-item-half)</span>
                                </div>
                            </StandardPanel>
                            <StandardPanel variant="ghost" className="grid-item-third">
                                <div className="p-4 text-center">
                                    <span className="text-neutral-600">Third (.grid-item-third)</span>
                                </div>
                            </StandardPanel>
                            <StandardPanel variant="default" className="grid-item-third">
                                <div className="p-4 text-center">
                                    <span className="text-neutral-600">Third (.grid-item-third)</span>
                                </div>
                            </StandardPanel>
                            <StandardPanel variant="elevated" className="grid-item-third">
                                <div className="p-4 text-center">
                                    <span className="text-neutral-600">Third (.grid-item-third)</span>
                                </div>
                            </StandardPanel>
                        </div>
                    </div>
                </section>
            </Container>
        </div>
    );
};

export default GridDemo;