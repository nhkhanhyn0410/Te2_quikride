# Icon Standardization Guide

## Icon Library Standards

### Primary: Ant Design Icons (@ant-design/icons)

**Use for:**
- All UI interactions (buttons, menus, forms)
- Navigation elements
- Status indicators
- System feedback

**Why:**
- Native integration with Ant Design components
- Consistent sizing and styling
- Better performance
- Type-safe (TypeScript support)

### Secondary: React Icons (react-icons)

**Use for:**
- Decorative purposes only
- When Ant Design doesn't have equivalent
- Marketing/landing page elements
- Custom illustrations

**Libraries to use:**
- `react-icons/fa` - Font Awesome (general purpose)
- `react-icons/md` - Material Design (modern look)
- `react-icons/io` - Ionicons (mobile-friendly)

## Icon Usage Examples

### ✅ CORRECT - Ant Design Icons

```jsx
import {
  HomeOutlined,
  UserOutlined,
  SearchOutlined,
  TicketOutlined,
  StarOutlined,
  TrophyOutlined,
} from '@ant-design/icons';

// In buttons
<Button icon={<HomeOutlined />}>Home</Button>

// In menus
{
  key: 'home',
  icon: <HomeOutlined />,
  label: 'Home',
}

// In inputs
<Input prefix={<SearchOutlined />} />
```

### ⚠️ USE SPARINGLY - React Icons

```jsx
import { FaBus, FaUserTie } from 'react-icons/fa';
import { MdReportProblem } from 'react-icons/md';

// Decorative only
<div className="text-4xl text-blue-500">
  <FaBus />
</div>

// Custom illustrations
<span className="text-orange-500">
  <MdReportProblem />
</span>
```

### ❌ INCORRECT - Mixing unnecessarily

```jsx
// DON'T mix when Ant Design has equivalent
import { FaHome } from 'react-icons/fa'; // ❌
import { HomeOutlined } from '@ant-design/icons'; // ✅

// DON'T use React Icons in Ant Design components
<Button icon={<FaHome />}> // ❌
<Button icon={<HomeOutlined />}> // ✅
```

## Common Icon Mappings

| Purpose | Ant Design Icon | React Icon (if needed) |
|---------|----------------|----------------------|
| Home | `HomeOutlined` | `FaHome` |
| Search | `SearchOutlined` | `FaSearch` |
| User | `UserOutlined` | `FaUser` |
| Settings | `SettingOutlined` | `FaCog` |
| Ticket | `TicketOutlined` | `FaTicketAlt` |
| Star/Rating | `StarOutlined` | `FaStar` |
| Trophy | `TrophyOutlined` | `FaTrophy` |
| Bus | `CarOutlined` | `FaBus` (no Ant equiv) |
| Driver | `UserOutlined` | `FaUserTie` (detailed) |
| Complaint | `ExclamationCircleOutlined` | `MdReportProblem` |

## Current Status

### Files Using Ant Design Icons ✅
- All new navigation components
- CustomerHeader.jsx
- CustomerFooter.jsx
- NewHomePage.jsx
- All operator/admin dashboards

### Files Using React Icons (Review needed)
- ReviewsSection.jsx (FaBus, FaUserTie, FaClock, FaSmile)
- CreateReviewModal.jsx (FaStar, FaBus, FaUserTie, FaClock, FaSmile)
- OperatorReviewsPage.jsx (FaBus, FaUserTie, FaClock, FaSmile)
- CreateComplaintModal.jsx (MdReportProblem)
- MyComplaintsPage.jsx (MdReportProblem)
- ComplaintDetailPage.jsx (MdReportProblem, MdAdminPanelSettings)
- LoyaltyOverviewPage.jsx (All using Ant Design ✅)

## Migration Priority

### High Priority (UI Components)
- [ ] Replace React Icons in buttons with Ant Design
- [ ] Replace React Icons in menus with Ant Design
- [ ] Replace React Icons in form inputs with Ant Design

### Low Priority (Decorative)
- [ ] Keep React Icons for detailed illustrations (FaBus, FaUserTie)
- [ ] Keep React Icons where no Ant equivalent exists

## Best Practices

1. **Always check Ant Design first** - Search for icon at https://ant.design/components/icon
2. **Use consistent sizes** - Let Ant Design handle sizing automatically
3. **Use className for colors** - Use Tailwind/CSS classes for colors
4. **Prefer outlined style** - Use `*Outlined` variants for consistency
5. **Use filled for emphasis** - Use `*Filled` variants sparingly for important states

## Size Guidelines

```jsx
// Small (default in buttons/inputs)
<Icon />

// Medium (headers, cards)
<Icon className="text-lg" />

// Large (hero sections, empty states)
<Icon className="text-2xl" />

// Extra Large (decorative, marketing)
<Icon className="text-4xl" />
```

## Color Guidelines

```jsx
// Primary actions
<Icon className="text-blue-500" />

// Success states
<Icon className="text-green-500" />

// Warning states
<Icon className="text-orange-500" />

// Error states
<Icon className="text-red-500" />

// Neutral/inactive
<Icon className="text-gray-400" />
```

## Maintenance

- Review this guide quarterly
- Update when new Ant Design icons are added
- Remove React Icons when Ant Design equivalents become available
- Keep decorative React Icons only if they add significant value
