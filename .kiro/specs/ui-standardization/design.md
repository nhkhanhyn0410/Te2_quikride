# Design Document

## Overview

Thiết kế hệ thống UI chuẩn hóa cho QuikRide nhằm tạo ra trải nghiệm người dùng nhất quán trên tất cả các role (Customer, Operator, Admin, Trip Manager). Hệ thống sẽ sử dụng Ant Design làm primary UI framework kết hợp với Tailwind CSS cho styling, đảm bảo tính nhất quán về icon, color scheme, spacing, và component behavior.

## Architecture

### Design System Hierarchy

```
Design System
├── Foundation Layer
│   ├── Color Palette
│   ├── Typography Scale
│   ├── Spacing System
│   └── Icon Library
├── Component Layer
│   ├── Basic Components (Button, Input, Card)
│   ├── Layout Components (Header, Sidebar, Panel)
│   └── Complex Components (Forms, Tables, Modals)
└── Pattern Layer
    ├── Navigation Patterns
    ├── Form Patterns
    └── Dashboard Patterns
```

### Technology Stack Integration

- **Primary UI Framework**: Ant Design 5.11.0
- **Icon System**: @ant-design/icons (primary) + react-icons (decorative only)
- **Styling**: Tailwind CSS 3.3.5 + Ant Design theme system
- **State Management**: Zustand (existing)
- **Routing**: React Router DOM (existing)

## Components and Interfaces

### 1. Icon Standardization System

#### Icon Provider Interface
```typescript
interface IconStandardization {
  primary: AntDesignIconLibrary;
  decorative: ReactIconLibrary;
  mapping: IconMappingConfig;
}

interface IconMappingConfig {
  [key: string]: {
    antDesign?: string;
    reactIcon?: string;
    usage: 'primary' | 'decorative';
    context: string[];
  };
}
```

#### Implementation Strategy
- **Phase 1**: Audit existing icon usage across all components
- **Phase 2**: Create icon mapping configuration
- **Phase 3**: Implement IconProvider component for centralized icon management
- **Phase 4**: Migrate components to use standardized icons

### 2. Panel Design System

#### Panel Component Architecture
```typescript
interface StandardPanel {
  variant: 'default' | 'elevated' | 'bordered' | 'ghost';
  size: 'small' | 'medium' | 'large';
  padding: 'compact' | 'comfortable' | 'spacious';
  header?: PanelHeader;
  footer?: PanelFooter;
  actions?: PanelAction[];
}

interface PanelHeader {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: HeaderAction[];
}
```

#### Panel Variants
1. **Default Panel**: Standard white background with subtle shadow
2. **Elevated Panel**: Enhanced shadow for important content
3. **Bordered Panel**: Clear border definition for content separation
4. **Ghost Panel**: Minimal styling for secondary content

### 3. Layout Standardization

#### Responsive Grid System
```css
/* Desktop First Approach */
.panel-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(12, 1fr);
}

/* Tablet */
@media (max-width: 1024px) {
  .panel-grid {
    gap: 16px;
    grid-template-columns: repeat(8, 1fr);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .panel-grid {
    gap: 12px;
    grid-template-columns: 1fr;
  }
}
```

#### Layout Components
1. **DashboardLayout**: Consistent layout for all dashboard pages
2. **ContentPanel**: Standardized content container
3. **ActionPanel**: Consistent action button grouping
4. **StatPanel**: Unified statistics display

### 4. Navigation System Design

#### Navigation Component Hierarchy
```
NavigationSystem
├── CustomerNavigation
│   ├── CustomerHeader
│   ├── CustomerFooter
│   └── CustomerMobileMenu
├── OperatorNavigation
│   ├── OperatorSidebar
│   ├── OperatorHeader
│   └── OperatorMobileDrawer
├── AdminNavigation
│   ├── AdminSidebar
│   ├── AdminHeader
│   └── AdminBreadcrumb
└── TripManagerNavigation
    ├── TripManagerHeader
    └── TripManagerQuickActions
```

#### Navigation Standards
- **Active State**: Consistent highlighting with primary color
- **Hover Effects**: Subtle background color change
- **Icon Placement**: Left-aligned with consistent spacing
- **Typography**: Consistent font weights and sizes
- **Mobile Behavior**: Collapsible with drawer pattern

## Data Models

### 1. Theme Configuration Model

```typescript
interface ThemeConfig {
  colors: {
    primary: ColorPalette;
    secondary: ColorPalette;
    success: ColorPalette;
    warning: ColorPalette;
    error: ColorPalette;
    neutral: ColorPalette;
  };
  spacing: SpacingScale;
  typography: TypographyScale;
  shadows: ShadowScale;
  borderRadius: BorderRadiusScale;
}

interface ColorPalette {
  50: string;   // Lightest
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;  // Base color
  600: string;
  700: string;
  800: string;
  900: string;  // Darkest
}
```

### 2. Component Configuration Model

```typescript
interface ComponentConfig {
  name: string;
  variants: ComponentVariant[];
  defaultProps: Record<string, any>;
  styleOverrides: StyleOverrides;
  iconMapping: IconMapping;
}

interface ComponentVariant {
  name: string;
  props: Record<string, any>;
  styles: CSSProperties;
}
```

### 3. Layout Configuration Model

```typescript
interface LayoutConfig {
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
    wide: number;
  };
  containerSizes: {
    mobile: string;
    tablet: string;
    desktop: string;
    wide: string;
  };
  gridSystem: {
    columns: number;
    gutter: number;
  };
}
```

## Error Handling

### 1. Component Error Boundaries

```typescript
interface UIErrorBoundary {
  fallbackComponent: React.ComponentType;
  errorReporting: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange: boolean;
}
```

### 2. Theme Loading Error Handling

- **Fallback Theme**: Default Ant Design theme if custom theme fails
- **Progressive Enhancement**: Core functionality works without custom styling
- **Error Reporting**: Log theme loading errors for debugging

### 3. Icon Loading Error Handling

- **Fallback Icons**: Generic icons when specific icons fail to load
- **Lazy Loading**: Icons loaded on demand to prevent blocking
- **Error States**: Clear indication when icons are unavailable

## Testing Strategy

### 1. Visual Regression Testing

```typescript
interface VisualTest {
  component: string;
  variants: string[];
  viewports: Viewport[];
  interactions: Interaction[];
}

interface Viewport {
  name: string;
  width: number;
  height: number;
}
```

### 2. Component Testing Strategy

#### Unit Tests
- Icon mapping functionality
- Theme configuration loading
- Component variant rendering
- Responsive behavior

#### Integration Tests
- Navigation flow consistency
- Panel interaction patterns
- Form submission workflows
- Error state handling

#### E2E Tests
- Cross-role navigation consistency
- Mobile responsive behavior
- Theme switching functionality
- Accessibility compliance

### 3. Performance Testing

#### Metrics to Monitor
- **Bundle Size**: Track impact of UI standardization on bundle size
- **Render Performance**: Measure component render times
- **Icon Loading**: Monitor icon loading performance
- **Theme Switching**: Measure theme change performance

#### Performance Targets
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## Implementation Phases

### Phase 1: Foundation Setup (Week 1-2)
1. **Theme System Configuration**
   - Configure Ant Design theme with custom colors
   - Set up Tailwind CSS integration
   - Create theme provider component

2. **Icon System Setup**
   - Audit current icon usage
   - Create icon mapping configuration
   - Implement IconProvider component

### Phase 2: Component Standardization (Week 3-4)
1. **Basic Components**
   - Standardize Button variants
   - Unify Input field styling
   - Create consistent Card components

2. **Layout Components**
   - Implement StandardPanel component
   - Create responsive grid system
   - Standardize spacing utilities

### Phase 3: Navigation Unification (Week 5-6)
1. **Header Components**
   - Unify all header components
   - Implement consistent user menus
   - Standardize mobile navigation

2. **Sidebar Components**
   - Standardize sidebar layouts
   - Implement consistent menu styling
   - Create unified navigation patterns

### Phase 4: Advanced Components (Week 7-8)
1. **Form Components**
   - Standardize form layouts
   - Unify validation styling
   - Create consistent error states

2. **Data Display Components**
   - Standardize table styling
   - Unify chart components
   - Create consistent empty states

### Phase 5: Testing & Optimization (Week 9-10)
1. **Testing Implementation**
   - Set up visual regression tests
   - Implement component tests
   - Create E2E test scenarios

2. **Performance Optimization**
   - Optimize bundle size
   - Implement lazy loading
   - Monitor performance metrics

## Migration Strategy

### 1. Backward Compatibility
- Maintain existing component APIs during migration
- Provide deprecation warnings for old patterns
- Create migration guides for each component type

### 2. Gradual Migration Approach
```typescript
interface MigrationPlan {
  phase: number;
  components: string[];
  timeline: string;
  riskLevel: 'low' | 'medium' | 'high';
  rollbackPlan: string;
}
```

### 3. Feature Flags
- Use feature flags to control UI standardization rollout
- Enable A/B testing between old and new designs
- Allow quick rollback if issues are discovered

## Accessibility Considerations

### 1. WCAG 2.1 Compliance
- **Color Contrast**: Minimum 4.5:1 ratio for normal text
- **Focus Management**: Clear focus indicators
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels

### 2. Responsive Design
- **Touch Targets**: Minimum 44px for mobile interactions
- **Text Scaling**: Support up to 200% zoom
- **Orientation Support**: Both portrait and landscape modes

### 3. Internationalization
- **RTL Support**: Right-to-left language support
- **Text Expansion**: Account for text length variations
- **Cultural Colors**: Avoid culturally inappropriate color usage