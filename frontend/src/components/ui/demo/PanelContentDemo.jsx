/**
 * Panel Content Components Demo
 * Demonstrates the usage of panel content components with loading and empty states
 */

import React, { useState } from 'react';
import { Button, Switch, Space } from 'antd';
import { ReloadOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { 
  StandardPanel, 
  PanelContent,
  Grid, 
  GridItem, 
  Container,
  LoadingSpinner,
  PanelSkeleton,
  TableSkeleton,
  CardSkeleton,
  FormSkeleton,
  ChartSkeleton,
  EmptyState,
  NoDataEmpty,
  NoResultsEmpty,
  EmptyTable,
  EmptyChart,
  EmptyList,
  EmptyUser,
  CustomEmpty
} from '../index';

const PanelContentDemo = () => {
  const [loadingStates, setLoadingStates] = useState({
    panel1: false,
    panel2: false,
    panel3: false,
    panel4: false,
  });

  const [emptyStates, setEmptyStates] = useState({
    panel1: false,
    panel2: false,
    panel3: false,
    panel4: false,
  });

  const toggleLoading = (panel) => {
    setLoadingStates(prev => ({
      ...prev,
      [panel]: !prev[panel]
    }));
  };

  const toggleEmpty = (panel) => {
    setEmptyStates(prev => ({
      ...prev,
      [panel]: !prev[panel]
    }));
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <Container>
        <h1 className="text-3xl font-bold text-neutral-800 mb-8">Panel Content Components Demo</h1>
        
        {/* Loading States Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral-700 mb-6">Loading States</h2>
          
          <Grid columns={{ desktop: 12, tablet: 8, mobile: 1 }} gap={{ desktop: 6, tablet: 4, mobile: 3 }}>
            {/* Loading Spinner */}
            <GridItem span={{ desktop: 6, tablet: 4, mobile: 1 }}>
              <StandardPanel
                variant="default"
                header={{
                  title: "Loading Spinner",
                  subtitle: "Standard loading indicator",
                  actions: [
                    <Switch 
                      key="toggle"
                      checked={loadingStates.panel1}
                      onChange={() => toggleLoading('panel1')}
                      checkedChildren="Loading"
                      unCheckedChildren="Loaded"
                    />
                  ]
                }}
                className="h-64"
              >
                {loadingStates.panel1 ? (
                  <LoadingSpinner size="large" tip="Loading data..." />
                ) : (
                  <div className="p-6">
                    <p>This is the actual content that appears after loading.</p>
                    <p>Toggle the switch above to see the loading state.</p>
                  </div>
                )}
              </StandardPanel>
            </GridItem>

            {/* Panel Skeleton */}
            <GridItem span={{ desktop: 6, tablet: 4, mobile: 1 }}>
              <StandardPanel
                variant="elevated"
                header={{
                  title: "Panel Skeleton",
                  subtitle: "Skeleton loading for panels",
                  actions: [
                    <Switch 
                      key="toggle"
                      checked={loadingStates.panel2}
                      onChange={() => toggleLoading('panel2')}
                      checkedChildren="Loading"
                      unCheckedChildren="Loaded"
                    />
                  ]
                }}
                className="h-64"
              >
                {loadingStates.panel2 ? (
                  <PanelSkeleton rows={3} avatar />
                ) : (
                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                        JD
                      </div>
                      <div>
                        <h3 className="font-semibold">John Doe</h3>
                        <p className="text-sm text-neutral-600">Software Engineer</p>
                      </div>
                    </div>
                    <p>This is the actual user profile content.</p>
                  </div>
                )}
              </StandardPanel>
            </GridItem>

            {/* Table Skeleton */}
            <GridItem span={{ desktop: 6, tablet: 4, mobile: 1 }}>
              <StandardPanel
                variant="bordered"
                header={{
                  title: "Table Skeleton",
                  subtitle: "Loading state for tables",
                  actions: [
                    <Switch 
                      key="toggle"
                      checked={loadingStates.panel3}
                      onChange={() => toggleLoading('panel3')}
                      checkedChildren="Loading"
                      unCheckedChildren="Loaded"
                    />
                  ]
                }}
                className="h-64"
              >
                {loadingStates.panel3 ? (
                  <TableSkeleton columns={3} rows={4} />
                ) : (
                  <div className="p-6">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Name</th>
                          <th className="text-left py-2">Role</th>
                          <th className="text-left py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">John Doe</td>
                          <td className="py-2">Admin</td>
                          <td className="py-2">Active</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Jane Smith</td>
                          <td className="py-2">User</td>
                          <td className="py-2">Active</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </StandardPanel>
            </GridItem>

            {/* Card Skeleton */}
            <GridItem span={{ desktop: 6, tablet: 4, mobile: 1 }}>
              <StandardPanel
                variant="ghost"
                header={{
                  title: "Card Skeleton",
                  subtitle: "Loading state for cards",
                  actions: [
                    <Switch 
                      key="toggle"
                      checked={loadingStates.panel4}
                      onChange={() => toggleLoading('panel4')}
                      checkedChildren="Loading"
                      unCheckedChildren="Loaded"
                    />
                  ]
                }}
                className="h-64"
              >
                {loadingStates.panel4 ? (
                  <CardSkeleton />
                ) : (
                  <div className="p-6 space-y-4">
                    <div className="w-full h-20 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg"></div>
                    <h3 className="font-semibold">Product Card</h3>
                    <p className="text-sm text-neutral-600">This is a sample product card with image, title, and description.</p>
                    <div className="flex space-x-2">
                      <Button type="primary" size="small">Buy Now</Button>
                      <Button size="small">Add to Cart</Button>
                    </div>
                  </div>
                )}
              </StandardPanel>
            </GridItem>
          </Grid>
        </section>

        {/* Additional Loading Types */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral-700 mb-6">Specialized Loading States</h2>
          
          <Grid columns={{ desktop: 12, tablet: 8, mobile: 1 }} gap={{ desktop: 6, tablet: 4, mobile: 3 }}>
            <GridItem span={{ desktop: 6, tablet: 4, mobile: 1 }}>
              <StandardPanel
                variant="default"
                header={{ title: "Form Skeleton" }}
                className="h-80"
              >
                <FormSkeleton fields={3} buttons={2} />
              </StandardPanel>
            </GridItem>

            <GridItem span={{ desktop: 6, tablet: 4, mobile: 1 }}>
              <StandardPanel
                variant="elevated"
                header={{ title: "Chart Skeleton" }}
                className="h-80"
              >
                <ChartSkeleton type="bar" />
              </StandardPanel>
            </GridItem>
          </Grid>
        </section>

        {/* Empty States Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral-700 mb-6">Empty States</h2>
          
          <Grid columns={{ desktop: 12, tablet: 8, mobile: 1 }} gap={{ desktop: 6, tablet: 4, mobile: 3 }}>
            {/* No Data Empty */}
            <GridItem span={{ desktop: 4, tablet: 4, mobile: 1 }}>
              <StandardPanel
                variant="default"
                header={{ title: "No Data" }}
                className="h-64"
              >
                <NoDataEmpty 
                  onRefresh={() => console.log('Refresh clicked')}
                />
              </StandardPanel>
            </GridItem>

            {/* No Results Empty */}
            <GridItem span={{ desktop: 4, tablet: 4, mobile: 1 }}>
              <StandardPanel
                variant="elevated"
                header={{ title: "No Search Results" }}
                className="h-64"
              >
                <NoResultsEmpty 
                  onClear={() => console.log('Clear filters clicked')}
                />
              </StandardPanel>
            </GridItem>

            {/* Empty Table */}
            <GridItem span={{ desktop: 4, tablet: 4, mobile: 1 }}>
              <StandardPanel
                variant="bordered"
                header={{ title: "Empty Table" }}
                className="h-64"
              >
                <EmptyTable 
                  onCreate={() => console.log('Create record clicked')}
                  onRefresh={() => console.log('Refresh clicked')}
                />
              </StandardPanel>
            </GridItem>

            {/* Empty Chart */}
            <GridItem span={{ desktop: 4, tablet: 4, mobile: 1 }}>
              <StandardPanel
                variant="ghost"
                header={{ title: "Empty Chart" }}
                className="h-64"
              >
                <EmptyChart 
                  onRefresh={() => console.log('Refresh data clicked')}
                />
              </StandardPanel>
            </GridItem>

            {/* Empty List */}
            <GridItem span={{ desktop: 4, tablet: 4, mobile: 1 }}>
              <StandardPanel
                variant="default"
                header={{ title: "Empty List" }}
                className="h-64"
              >
                <EmptyList 
                  onCreate={() => console.log('Add first item clicked')}
                />
              </StandardPanel>
            </GridItem>

            {/* Empty User */}
            <GridItem span={{ desktop: 4, tablet: 4, mobile: 1 }}>
              <StandardPanel
                variant="elevated"
                header={{ title: "No Users" }}
                className="h-64"
              >
                <EmptyUser 
                  onInvite={() => console.log('Invite users clicked')}
                />
              </StandardPanel>
            </GridItem>
          </Grid>
        </section>

        {/* Custom Empty States */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral-700 mb-6">Custom Empty States</h2>
          
          <Grid columns={{ desktop: 12, tablet: 8, mobile: 1 }} gap={{ desktop: 6, tablet: 4, mobile: 3 }}>
            <GridItem span={{ desktop: 4, tablet: 4, mobile: 1 }}>
              <StandardPanel
                variant="default"
                header={{ title: "Small Custom Empty" }}
                className="h-48"
              >
                <CustomEmpty
                  size="small"
                  icon={<SearchOutlined />}
                  title="No matches"
                  description="Try a different search term"
                  actions={[
                    <Button key="clear" size="small">Clear search</Button>
                  ]}
                />
              </StandardPanel>
            </GridItem>

            <GridItem span={{ desktop: 4, tablet: 4, mobile: 1 }}>
              <StandardPanel
                variant="elevated"
                header={{ title: "Default Custom Empty" }}
                className="h-64"
              >
                <CustomEmpty
                  icon={<PlusOutlined />}
                  title="Create your first project"
                  description="Get started by creating a new project to organize your work"
                  actions={[
                    <Button key="create" type="primary">Create Project</Button>,
                    <Button key="import">Import Project</Button>
                  ]}
                />
              </StandardPanel>
            </GridItem>

            <GridItem span={{ desktop: 4, tablet: 4, mobile: 1 }}>
              <StandardPanel
                variant="bordered"
                header={{ title: "Large Custom Empty" }}
                className="h-80"
              >
                <CustomEmpty
                  size="large"
                  icon={<ReloadOutlined />}
                  title="Connection Error"
                  description="We're having trouble connecting to our servers. Please check your internet connection and try again."
                  actions={[
                    <Button key="retry" type="primary">Retry Connection</Button>,
                    <Button key="offline">Work Offline</Button>
                  ]}
                />
              </StandardPanel>
            </GridItem>
          </Grid>
        </section>

        {/* Padding Options Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral-700 mb-6">Padding Options</h2>
          
          <Grid columns={{ desktop: 12, tablet: 8, mobile: 1 }} gap={{ desktop: 6, tablet: 4, mobile: 3 }}>
            <GridItem span={{ desktop: 3, tablet: 4, mobile: 1 }}>
              <StandardPanel
                variant="bordered"
                header={{ title: "No Padding" }}
                className="h-48"
              >
                <PanelContent padding="none">
                  <div className="bg-primary-100 h-full flex items-center justify-center">
                    <span className="text-primary-700">No padding content</span>
                  </div>
                </PanelContent>
              </StandardPanel>
            </GridItem>

            <GridItem span={{ desktop: 3, tablet: 4, mobile: 1 }}>
              <StandardPanel
                variant="bordered"
                header={{ title: "Compact Padding" }}
                className="h-48"
              >
                <PanelContent padding="compact">
                  <div className="bg-success-100 h-full flex items-center justify-center rounded">
                    <span className="text-success-700">Compact padding</span>
                  </div>
                </PanelContent>
              </StandardPanel>
            </GridItem>

            <GridItem span={{ desktop: 3, tablet: 4, mobile: 1 }}>
              <StandardPanel
                variant="bordered"
                header={{ title: "Default Padding" }}
                className="h-48"
              >
                <PanelContent padding="default">
                  <div className="bg-warning-100 h-full flex items-center justify-center rounded">
                    <span className="text-warning-700">Default padding</span>
                  </div>
                </PanelContent>
              </StandardPanel>
            </GridItem>

            <GridItem span={{ desktop: 3, tablet: 4, mobile: 1 }}>
              <StandardPanel
                variant="bordered"
                header={{ title: "Comfortable Padding" }}
                className="h-48"
              >
                <PanelContent padding="comfortable">
                  <div className="bg-error-100 h-full flex items-center justify-center rounded">
                    <span className="text-error-700">Comfortable padding</span>
                  </div>
                </PanelContent>
              </StandardPanel>
            </GridItem>
          </Grid>
        </section>

        {/* Interactive Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral-700 mb-6">Interactive Demo</h2>
          
          <StandardPanel
            variant="default"
            header={{
              title: "Interactive Panel Content",
              subtitle: "Toggle between different states",
              actions: [
                <Space key="controls">
                  <Switch 
                    checked={emptyStates.panel1}
                    onChange={() => toggleEmpty('panel1')}
                    checkedChildren="Empty"
                    unCheckedChildren="Content"
                  />
                  <Switch 
                    checked={loadingStates.panel1}
                    onChange={() => toggleLoading('panel1')}
                    checkedChildren="Loading"
                    unCheckedChildren="Loaded"
                  />
                </Space>
              ]
            }}
            className="h-64"
          >
            {loadingStates.panel1 ? (
              <PanelSkeleton rows={4} />
            ) : emptyStates.panel1 ? (
              <NoDataEmpty 
                title="No content available"
                description="Toggle the switches above to see different states"
                onRefresh={() => {
                  setEmptyStates(prev => ({ ...prev, panel1: false }));
                  setLoadingStates(prev => ({ ...prev, panel1: false }));
                }}
              />
            ) : (
              <PanelContent padding="default">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Panel Content</h3>
                  <p>This is the normal content state of the panel. You can toggle between loading, empty, and content states using the switches above.</p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-primary-50 p-4 rounded-lg">
                      <h4 className="font-medium text-primary-700">Feature 1</h4>
                      <p className="text-sm text-primary-600">Description of feature 1</p>
                    </div>
                    <div className="bg-success-50 p-4 rounded-lg">
                      <h4 className="font-medium text-success-700">Feature 2</h4>
                      <p className="text-sm text-success-600">Description of feature 2</p>
                    </div>
                  </div>
                </div>
              </PanelContent>
            )}
          </StandardPanel>
        </section>
      </Container>
    </div>
  );
};

export default PanelContentDemo;