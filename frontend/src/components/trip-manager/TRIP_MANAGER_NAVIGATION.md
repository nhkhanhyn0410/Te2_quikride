# Trip Manager Navigation Components

This document describes the standardized navigation components for the Trip Manager role, implementing the UI standardization requirements.

## Components Overview

### 1. TripManagerHeader
The main header component for trip manager pages with consistent styling and functionality.

**Features:**
- Standardized icon usage from IconProvider
- Mobile-responsive design with hamburger menu
- Real-time badge counts for active trips and emergency alerts
- User dropdown menu with profile, settings, and logout options
- Breadcrumb navigation support
- Consistent color scheme and spacing

**Props:**
- `title` (string): Page title (default: 'Trip Manager')
- `subtitle` (string): Page subtitle (default: 'Trip Management Dashboard')
- `showBreadcrumb` (boolean): Whether to show breadcrumb navigation
- `breadcrumbItems` (array): Breadcrumb navigation items
- `onMenuToggle` (function): Callback for mobile menu toggle
- `activeTrips` (number): Count of active trips for badge display
- `emergencyAlerts` (number): Count of emergency alerts for badge display
- `className` (string): Additional CSS classes

**Usage:**
```jsx
<TripManagerHeader
  title="Active Trips"
  subtitle="Monitor ongoing trips"
  activeTrips={5}
  emergencyAlerts={2}
  onMenuToggle={() => setMobileNavVisible(true)}
  showBreadcrumb={true}
  breadcrumbItems={[
    { title: 'Dashboard', href: '/trip-manager/dashboard' },
    { title: 'Active Trips' }
  ]}
/>
```

### 2. TripManagerQuickActions
A dashboard widget providing quick access to common trip management tasks.

**Features:**
- Grid layout with responsive breakpoints
- Color-coded action cards with hover effects
- Badge counts for actionable items
- Emergency alert section with pulse animation
- Mobile-optimized quick actions and stats
- Consistent icon usage and navigation

**Props:**
- `activeTrips` (number): Count of active trips
- `pendingIssues` (number): Count of pending issues
- `emergencyAlerts` (number): Count of emergency alerts
- `className` (string): Additional CSS classes
- `isMobile` (boolean): Mobile optimization flag

**Usage:**
```jsx
<TripManagerQuickActions
  activeTrips={5}
  pendingIssues={3}
  emergencyAlerts={2}
  className="mb-6"
/>
```

### 3. TripManagerMobileNav
A mobile-optimized navigation drawer for trip manager functionality.

**Features:**
- Slide-out drawer navigation
- User profile display with avatar
- Badge counts in navigation items
- Quick stats dashboard
- Emergency actions section
- Consistent icon mapping and styling

**Props:**
- `visible` (boolean): Whether the drawer is visible
- `onClose` (function): Callback to close the drawer
- `activeTrips` (number): Count of active trips
- `pendingIssues` (number): Count of pending issues
- `emergencyAlerts` (number): Count of emergency alerts

**Usage:**
```jsx
<TripManagerMobileNav
  visible={mobileNavVisible}
  onClose={() => setMobileNavVisible(false)}
  activeTrips={5}
  pendingIssues={3}
  emergencyAlerts={2}
/>
```

## Icon Standardization

All components use the standardized icon system from IconProvider:

### Primary Icons (Ant Design)
- Navigation: `getIconByContext('navigation', 'menu')`
- Status: `getIconByContext('status', 'warning')`
- Authentication: `getIconByContext('authentication', 'profile')`
- Time: `getIconByContext('time', 'calendar')`

### Decorative Icons (React Icons)
- Transport: `createContextIcon('transport', 'bus', { size: 'lg', color: 'primary' })`
- Schedule: `createContextIcon('time', 'schedule', { size: 'xl', color: 'primary' })`
- Support: `createContextIcon('support', 'complaint', { size: 'lg', color: 'warning' })`

## Color Scheme

### Status Colors
- **Primary Actions**: Blue (`text-blue-600`, `bg-blue-500`)
- **Emergency**: Red (`text-red-600`, `bg-red-500`) with pulse animation
- **Warning/Issues**: Orange (`text-orange-600`, `bg-orange-500`)
- **Success**: Green (`text-green-600`, `bg-green-500`)
- **Neutral**: Gray (`text-gray-600`, `bg-gray-500`)

### Gradient Backgrounds
- **User Avatar**: `bg-gradient-to-br from-orange-600 to-red-600`
- **Brand Elements**: `bg-gradient-to-r from-orange-50 to-red-50`

## Responsive Design

### Breakpoints
- **Mobile**: `< 768px` - Single column layout, drawer navigation
- **Tablet**: `768px - 1024px` - Two column grid, collapsible sidebar
- **Desktop**: `> 1024px` - Three column grid, full navigation

### Mobile Optimizations
- Touch-friendly button sizes (minimum 44px)
- Drawer navigation with gesture support
- Quick stats cards for at-a-glance information
- Emergency hotline quick access
- Optimized spacing and typography

## Navigation Patterns

### Consistent Navigation Paths
- Dashboard: `/trip-manager/dashboard`
- Active Trips: `/trip-manager/trips/active`
- Emergency: `/trip-manager/emergency`
- Issues: `/trip-manager/issues`
- Schedule: `/trip-manager/schedule`
- Drivers: `/trip-manager/drivers`
- Reports: `/trip-manager/reports`

### User Account Paths
- Profile: `/trip-manager/profile`
- Settings: `/trip-manager/settings`
- Login: `/trip-manager/login`

## Testing

All components include comprehensive test coverage:

### Unit Tests
- Component rendering and props
- User interactions and navigation
- Icon standardization
- Responsive behavior
- Error handling

### Integration Tests
- Cross-component data consistency
- Navigation flow between components
- Mobile navigation integration
- State management across components

### Test Files
- `TripManagerHeader.test.jsx`
- `TripManagerQuickActions.test.jsx`
- `TripManagerMobileNav.test.jsx`
- `TripManagerNavigation.integration.test.jsx`

## Implementation Requirements Compliance

### ✅ Requirement 6.1: Navigation Consistency
- Consistent menu structure and styling across all components
- Standardized active states and hover effects
- Unified navigation patterns

### ✅ Requirement 6.2: Visual Feedback
- Active menu item highlighting with consistent colors
- Hover effects with appropriate color transitions
- Loading and interaction states

### ✅ Requirement 6.3: Sub-menu Consistency
- Consistent indentation and styling in mobile navigation
- Hierarchical menu structure with proper spacing
- Clear visual hierarchy

### ✅ Requirement 6.4: Hover Effects
- Consistent hover effects across all interactive elements
- Color transitions that match the design system
- Touch-friendly interactions for mobile

### ✅ Requirement 1.1-1.3: Icon Standardization
- Primary use of Ant Design Icons
- Decorative use of React Icons where appropriate
- Consistent icon sizing and coloring
- Proper icon context mapping

## Usage Examples

### Basic Implementation
```jsx
import { 
  TripManagerHeader, 
  TripManagerQuickActions, 
  TripManagerMobileNav 
} from '../components/trip-manager';

const TripManagerDashboard = () => {
  const [mobileNavVisible, setMobileNavVisible] = useState(false);
  const [stats, setStats] = useState({
    activeTrips: 5,
    pendingIssues: 3,
    emergencyAlerts: 2
  });

  return (
    <div>
      <TripManagerHeader
        title="Dashboard"
        activeTrips={stats.activeTrips}
        emergencyAlerts={stats.emergencyAlerts}
        onMenuToggle={() => setMobileNavVisible(true)}
      />
      
      <div className="p-6">
        <TripManagerQuickActions
          activeTrips={stats.activeTrips}
          pendingIssues={stats.pendingIssues}
          emergencyAlerts={stats.emergencyAlerts}
        />
      </div>
      
      <TripManagerMobileNav
        visible={mobileNavVisible}
        onClose={() => setMobileNavVisible(false)}
        {...stats}
      />
    </div>
  );
};
```

### Advanced Integration
```jsx
// With breadcrumb navigation and custom styling
<TripManagerHeader
  title="Trip Details"
  subtitle="Trip #TR-2024-001"
  activeTrips={stats.activeTrips}
  emergencyAlerts={stats.emergencyAlerts}
  onMenuToggle={() => setMobileNavVisible(true)}
  showBreadcrumb={true}
  breadcrumbItems={[
    { title: 'Dashboard', href: '/trip-manager/dashboard' },
    { title: 'Active Trips', href: '/trip-manager/trips/active' },
    { title: 'Trip Details' }
  ]}
  className="shadow-lg"
/>
```

## Maintenance Notes

### Adding New Navigation Items
1. Update the navigation arrays in each component
2. Add corresponding icon mappings
3. Update tests to include new items
4. Ensure consistent styling and behavior

### Updating Icons
1. Check IconProvider for available icons
2. Use `getIconByContext()` for primary icons
3. Use `createContextIcon()` for decorative icons
4. Maintain size and color consistency

### Responsive Updates
1. Test on all breakpoints
2. Ensure touch targets meet accessibility guidelines
3. Verify mobile navigation functionality
4. Update CSS classes as needed

This navigation system provides a consistent, accessible, and mobile-optimized experience for trip managers while maintaining the standardized design system requirements.