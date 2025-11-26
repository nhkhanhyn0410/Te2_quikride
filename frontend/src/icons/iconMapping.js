/**
 * Icon Mapping Configuration
 * Defines the standardized icon usage across the application
 * Primary: Ant Design Icons (for UI actions and states)
 * Decorative: React Icons (for specific domain icons like bus, user roles)
 */

// Ant Design Icons - Primary UI Icons
export const antdIcons = {
  // Navigation & Actions
  search: 'SearchOutlined',
  add: 'PlusOutlined',
  edit: 'EditOutlined',
  delete: 'DeleteOutlined',
  save: 'SaveOutlined',
  close: 'CloseOutlined',
  back: 'ArrowLeftOutlined',
  forward: 'ArrowRightOutlined',
  up: 'UpOutlined',
  down: 'DownOutlined',
  
  // User & Authentication
  user: 'UserOutlined',
  login: 'LoginOutlined',
  logout: 'LogoutOutlined',
  settings: 'SettingOutlined',
  profile: 'UserOutlined',
  
  // Communication
  mail: 'MailOutlined',
  phone: 'PhoneOutlined',
  message: 'MessageOutlined',
  notification: 'BellOutlined',
  
  // Security & Safety
  lock: 'LockOutlined',
  unlock: 'UnlockOutlined',
  safety: 'SafetyOutlined',
  shield: 'ShieldOutlined',
  
  // Status & States
  success: 'CheckCircleOutlined',
  error: 'CloseCircleOutlined',
  warning: 'ExclamationCircleOutlined',
  info: 'InfoCircleOutlined',
  loading: 'LoadingOutlined',
  
  // Data & Content
  file: 'FileOutlined',
  fileText: 'FileTextOutlined',
  image: 'FileImageOutlined',
  download: 'DownloadOutlined',
  upload: 'UploadOutlined',
  
  // Time & Calendar
  calendar: 'CalendarOutlined',
  clock: 'ClockCircleOutlined',
  time: 'FieldTimeOutlined',
  
  // Business & Commerce
  shop: 'ShopOutlined',
  money: 'DollarOutlined',
  card: 'CreditCardOutlined',
  gift: 'GiftOutlined',
  
  // System & Technical
  home: 'HomeOutlined',
  dashboard: 'DashboardOutlined',
  setting: 'SettingOutlined',
  tool: 'ToolOutlined',
  api: 'ApiOutlined',
  
  // Social & External
  google: 'GoogleOutlined',
  facebook: 'FacebookOutlined',
  twitter: 'TwitterOutlined',
  
  // Layout & UI
  menu: 'MenuOutlined',
  more: 'MoreOutlined',
  expand: 'ExpandOutlined',
  collapse: 'ShrinkOutlined',
  
  // Transport (Basic)
  car: 'CarOutlined',
  
  // Filled variants for important states
  successFilled: 'CheckCircleFilled',
  errorFilled: 'CloseCircleFilled',
  warningFilled: 'ExclamationCircleFilled',
  infoFilled: 'InfoCircleFilled',
};

// React Icons - Decorative & Domain-Specific Icons
export const reactIcons = {
  // Transport & Business Domain
  bus: { library: 'fa', icon: 'FaBus', usage: 'decorative' },
  userTie: { library: 'fa', icon: 'FaUserTie', usage: 'decorative' },
  ticket: { library: 'fa', icon: 'FaTicketAlt', usage: 'decorative' },
  
  // Emotions & Feedback
  smile: { library: 'fa', icon: 'FaSmile', usage: 'decorative' },
  
  // System & Admin
  reportProblem: { library: 'md', icon: 'MdReportProblem', usage: 'decorative' },
  adminPanel: { library: 'md', icon: 'MdAdminPanelSettings', usage: 'decorative' },
  review: { library: 'md', icon: 'MdRateReview', usage: 'decorative' },
  
  // Media & Content
  images: { library: 'io', icon: 'IoMdImages', usage: 'decorative' },
};

// Icon usage contexts - helps determine which icon to use
export const iconContexts = {
  // Authentication & User Management
  authentication: {
    login: antdIcons.login,
    logout: antdIcons.logout,
    register: antdIcons.user,
    profile: antdIcons.user,
    email: antdIcons.mail,
    password: antdIcons.lock,
    phone: antdIcons.phone,
    security: antdIcons.safety,
  },
  
  // CRUD Operations
  crud: {
    create: antdIcons.add,
    read: antdIcons.file,
    update: antdIcons.edit,
    delete: antdIcons.delete,
    save: antdIcons.save,
    cancel: antdIcons.close,
  },
  
  // Navigation
  navigation: {
    home: antdIcons.home,
    back: antdIcons.back,
    forward: antdIcons.forward,
    menu: antdIcons.menu,
    search: antdIcons.search,
    settings: antdIcons.settings,
  },
  
  // Status & Feedback
  status: {
    success: antdIcons.success,
    error: antdIcons.error,
    warning: antdIcons.warning,
    info: antdIcons.info,
    loading: antdIcons.loading,
    pending: antdIcons.clock,
  },
  
  // Business Domain (QuikRide specific)
  transport: {
    bus: reactIcons.bus,
    driver: reactIcons.userTie,
    ticket: reactIcons.ticket,
    route: antdIcons.car,
  },
  
  // Customer Service
  support: {
    complaint: reactIcons.reportProblem,
    review: reactIcons.review,
    rating: reactIcons.smile,
    feedback: antdIcons.message,
  },
  
  // Admin & Management
  admin: {
    dashboard: antdIcons.dashboard,
    users: antdIcons.user,
    reports: antdIcons.fileText,
    settings: antdIcons.settings,
    admin: reactIcons.adminPanel,
  },
  
  // Time & Scheduling
  time: {
    calendar: antdIcons.calendar,
    clock: antdIcons.clock,
    schedule: antdIcons.time,
  },
  
  // Payment & Commerce
  payment: {
    money: antdIcons.money,
    card: antdIcons.card,
    gift: antdIcons.gift,
    shop: antdIcons.shop,
  },
};

// Default fallback icons
export const fallbackIcons = {
  primary: antdIcons.info,
  decorative: reactIcons.smile,
};

// Icon size standards
export const iconSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
};

// Icon color standards (should match theme colors)
export const iconColors = {
  primary: '#0ea5e9',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  neutral: '#6b7280',
  muted: '#9ca3af',
};

// Complete icon mapping export
export const iconMapping = {
  antdIcons,
  reactIcons,
  iconContexts,
  fallbackIcons,
  iconSizes,
  iconColors,
};

export default {
  antdIcons,
  reactIcons,
  iconContexts,
  fallbackIcons,
  iconSizes,
  iconColors,
};