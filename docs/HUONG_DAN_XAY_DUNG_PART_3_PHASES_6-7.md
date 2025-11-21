# HƯỚNG DẪN XÂY DỰNG DỰ ÁN QUIKRIDE - PART 3
## PHASES 6-7: SYSTEM ADMIN & ADVANCED FEATURES

---

## 🎯 TỔNG QUAN PART 3

**Nội dung:** Phase 6-7 - Hoàn thiện system admin và polish features
**Thời gian:** 3.5 tuần
**Mục tiêu:** System administration, content management, advanced features

### Các Phase trong Part 3:
- **Phase 6:** System Admin (1.5 tuần)
- **Phase 7:** Additional Features & Polish (2 tuần)

---

# PHASE 6: SYSTEM ADMIN

**Thời gian:** 1.5 tuần
**Độ ưu tiên:** 🟡 Trung bình

## MỤC TIÊU PHASE 6
Xây dựng hệ thống quản trị cho system admin để giám sát và quản lý toàn bộ platform

---

## 📦 BƯỚC 6.1: ADMIN AUTHENTICATION & AUTHORIZATION

### A. Admin Model (sử dụng User model với role)

**File: backend/src/models/User.js (update)**
```
Thêm field:

- role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  }

- permissions: [{
    type: String,
    enum: [
      'manage_users',
      'manage_operators',
      'manage_content',
      'manage_complaints',
      'view_reports',
      'system_settings'
    ]
  }]

Pre-defined admin:
- Create seed script để tạo admin account mặc định:
  * Email: admin@quikride.com
  * Password: (hash từ .env ADMIN_PASSWORD)
  * Role: admin
  * Permissions: all
```

### B. Admin Auth Middleware

**File: backend/src/middleware/adminAuth.middleware.js**
```
Function: authenticateAdmin

Steps:
- Verify JWT token (reuse auth logic)
- Find user
- Check role = 'admin'
- Attach user to req.admin
- Call next()

Function: requirePermission(permission)
Returns middleware:
- Check req.admin.permissions includes permission
- If not: Return 403 Forbidden
- Call next()

Export both
```

### C. Admin Controller

**File: backend/src/controllers/admin.controller.js (tạo mới)**
```
Functions:

1. login
   Input: { email, password }

   Steps:
   - Find user by email
   - Check role = 'admin'
   - Verify password
   - Generate JWT token
   - Return token + admin info

2. getMe (protected)
   - Return admin info from req.admin

3. getDashboardStats (protected)
   Will implement in Step 6.2

4. User Management Functions:
   Will implement in Step 6.2

5. Operator Management Functions:
   Will implement in Step 6.3

Export functions
```

### D. Admin Routes

**File: backend/src/routes/admin.routes.js**
```
Routes:

Public:
- POST /admin/login

Protected (adminAuth):
- GET /admin/me
- GET /admin/dashboard/stats

User Management:
- GET /admin/users
- GET /admin/users/:id
- PUT /admin/users/:id/block
- PUT /admin/users/:id/unblock
- POST /admin/users/:id/reset-password

Operator Management:
- GET /admin/operators
- GET /admin/operators/:id
- PUT /admin/operators/:id/verify
- PUT /admin/operators/:id/reject
- PUT /admin/operators/:id/suspend
- PUT /admin/operators/:id/resume

Content Management:
- Will add in Step 6.4

Complaints:
- Will add in Step 6.5

Reports:
- Will add in Step 6.6

Mount in main routes
```

### E. Frontend: Admin Login

**File: frontend/src/pages/admin/AdminLoginPage.jsx**
```
Structure:

1. Full-screen layout
   - Background: Admin-themed (dark, professional)

2. Login form:
   - Logo
   - Heading: "Admin Portal"
   - Email input
   - Password input
   - Login button

3. Security notice:
   - "Authorized personnel only"
   - IP will be logged

Handler:
- handleLogin:
  - Call adminApi.login()
  - Save token to localStorage ('adminToken')
  - Redirect to /admin/dashboard

Styling:
- Dark theme
- Professional, secure look
```

**File: frontend/src/services/adminApi.js**
```
API functions:

Authentication:
- login(credentials): POST /admin/login
- getMe(): GET /admin/me

Dashboard:
- getDashboardStats(): GET /admin/dashboard/stats

User Management:
- getUsers(params): GET /admin/users
- getUserById(id): GET /admin/users/:id
- blockUser(id): PUT /admin/users/:id/block
- unblockUser(id): PUT /admin/users/:id/unblock
- resetUserPassword(id): POST /admin/users/:id/reset-password

Operator Management:
- getOperators(params): GET /admin/operators
- getOperatorById(id): GET /admin/operators/:id
- verifyOperator(id, data): PUT /admin/operators/:id/verify
- rejectOperator(id, reason): PUT /admin/operators/:id/reject
- suspendOperator(id, reason): PUT /admin/operators/:id/suspend
- resumeOperator(id): PUT /admin/operators/:id/resume

(Will add more in later steps)
```

---

## 📦 BƯỚC 6.2: USER MANAGEMENT

### A. Admin User Management APIs

**File: backend/src/controllers/admin.controller.js (update)**
```
Functions:

1. getUsers (protected, admin, permission: manage_users)
   Query: {
     page, limit,
     search (email, phone, name),
     role (customer, admin),
     isBlocked (true/false),
     loyaltyTier,
     sortBy (createdAt, loyaltyPoints),
     order (asc/desc)
   }

   Steps:
   - Build query filters
   - Find users with pagination
   - Populate relevant fields
   - Calculate stats for each:
     * Total bookings
     * Total spent
     * Last booking date
   - Return users list với stats

2. getUserById (protected, admin)
   Params: userId

   - Find user by ID
   - Populate bookings (last 10)
   - Calculate detailed stats:
     * Total bookings
     * Total spent
     * Loyalty points earned
     * Average rating given
   - Return user với stats

3. blockUser (protected, admin, permission: manage_users)
   Input: userId, { reason }

   - Find user
   - Check not already blocked
   - Update user:
     * isBlocked = true
     * blockedReason = reason
     * blockedAt = now
     * blockedBy = req.admin._id
   - Cancel all upcoming bookings của user
   - Send email notification
   - Return success

4. unblockUser (protected, admin, permission: manage_users)
   - Find user
   - Update user:
     * isBlocked = false
     * blockedReason = null
   - Send email notification
   - Return success

5. resetUserPassword (protected, admin, permission: manage_users)
   Input: userId

   - Find user
   - Generate temporary password
   - Hash and update user.password
   - Send email với temporary password
   - Flag: mustChangePassword = true
   - Return success

6. getUserActivityLog (protected, admin)
   - Get user's recent activities:
     * Logins
     * Bookings
     * Cancellations
     * Reviews
   - Return activity log

Export functions
```

### B. Frontend: User Management

**File: frontend/src/pages/admin/UsersPage.jsx**
```
Structure:

1. Header:
   - Title: "User Management"
   - Button: "Export Users" (Excel)

2. Filters & Search:
   - Search box (email, phone, name)
   - Role filter (All, Customers, Admins)
   - Status filter (All, Active, Blocked)
   - Loyalty tier filter
   - Date range (registration date)

3. Stats Cards:
   - Total Users
   - Active Users
   - Blocked Users
   - New Users (this month)

4. Users Table:
   Columns:
   - Avatar
   - Name
   - Email
   - Phone
   - Role badge
   - Loyalty Tier badge
   - Total Bookings
   - Total Spent
   - Status (Active/Blocked badge)
   - Registered Date
   - Actions (dropdown):
     * View Details
     * Block/Unblock
     * Reset Password
     * View Activity

   Features:
   - Sort by any column
   - Pagination
   - Bulk actions (future)

5. Handlers:
   - Fetch users with filters
   - handleViewUser: Open user detail modal
   - handleBlockUser: Confirm modal → Block
   - handleUnblockUser: Unblock
   - handleResetPassword: Confirm → Reset

State:
- users (array)
- filters (object)
- pagination
- loading
```

**File: frontend/src/components/admin/UserDetailModal.jsx**
```
Props: user, visible, onClose

Structure:

1. Header:
   - User avatar (large)
   - Name, email, phone
   - Status badges (Active/Blocked, Loyalty Tier)

2. Tabs:

   Tab 1: Overview
   - Personal info
   - Account info
   - Loyalty points
   - Statistics cards:
     * Total Bookings
     * Total Spent
     * Avg Booking Value
     * Last Active

   Tab 2: Booking History
   - Table of bookings:
     | Date | Route | Amount | Status |
   - Pagination

   Tab 3: Activity Log
   - Timeline of activities:
     * Login
     * Booking created
     * Booking cancelled
     * Review posted

   Tab 4: Actions
   - Button: Block User (nếu active)
   - Button: Unblock User (nếu blocked)
   - Button: Reset Password
   - Button: Send Message
   - Button: View Full Report

Implementation:
- Fetch user details on modal open
- Real-time updates via WebSocket (optional)
```

**File: frontend/src/components/admin/BlockUserModal.jsx**
```
Confirmation modal:

1. Warning message
2. Reason select/input:
   - Violation of terms
   - Fraudulent activity
   - Multiple complaints
   - Other (textarea)
3. Impact notice:
   - "All upcoming bookings will be cancelled"
   - "User will not be able to login"
4. Buttons:
   - Cancel
   - Confirm Block (danger)

Handler:
- Call API block user
- Refresh users list
```

---

## 📦 BƯỚC 6.3: OPERATOR MANAGEMENT

### A. Operator Approval Workflow

**File: backend/src/controllers/admin.controller.js (update)**
```
Functions:

1. getOperators (protected, admin, permission: manage_operators)
   Query: {
     page, limit,
     search (name, email),
     verificationStatus (pending, approved, rejected),
     isActive, isSuspended,
     sortBy (createdAt, totalRevenue),
     order
   }

   - Find operators with filters
   - Populate stats:
     * Total trips
     * Total revenue
     * Total bookings
     * Average rating
   - Return operators list

2. getOperatorById (protected, admin)
   - Find operator
   - Populate:
     * Routes
     * Buses
     * Employees
     * Recent trips
   - Calculate detailed stats
   - Return operator details

3. verifyOperator (protected, admin, permission: manage_operators)
   Input: operatorId, { notes }

   Steps:
   - Find operator
   - Check verificationStatus = 'pending'
   - Verify documents uploaded
   - Update operator:
     * verificationStatus = 'approved'
     * approvedBy = req.admin._id
     * approvedAt = now
     * verificationNotes = notes
   - Send email notification (success)
   - Return success

4. rejectOperator (protected, admin, permission: manage_operators)
   Input: operatorId, { reason }

   - Find operator
   - Update operator:
     * verificationStatus = 'rejected'
     * rejectionReason = reason
     * rejectedBy = req.admin._id
   - Send email với reason
   - Return success

5. suspendOperator (protected, admin, permission: manage_operators)
   Input: operatorId, { reason }

   - Find operator
   - Update operator:
     * isSuspended = true
     * suspensionReason = reason
     * suspendedAt = now
   - Cancel all upcoming trips của operator
   - Send email notification
   - Return success

6. resumeOperator (protected, admin, permission: manage_operators)
   - Find operator
   - Update:
     * isSuspended = false
     * suspensionReason = null
   - Send email
   - Return success

7. getOperatorStats (protected, admin)
   - Aggregate statistics:
     * Total operators
     * Pending approval
     * Active operators
     * Suspended operators
     * Total revenue (all operators)
   - Return stats

Export functions
```

### B. Frontend: Operator Management

**File: frontend/src/pages/admin/OperatorsPage.jsx**
```
Structure:

1. Header:
   - Title: "Operator Management"
   - Tabs:
     * Pending Approval (badge with count)
     * Active Operators
     * Suspended
     * Rejected

2. Stats Cards:
   - Total Operators
   - Pending Approval
   - Active Operators
   - Total Revenue (system-wide)

3. Filters:
   - Search (name, email)
   - Verification status
   - Sort by (revenue, trips, rating)

4. Operators Table/Cards:

   Pending Approval Tab:
   - Card layout (more visual)
   - Each card:
     * Company logo
     * Company name
     * Email, phone
     * Registration date
     * Documents preview (thumbnails)
     * Actions:
       - View Details
       - Approve (green button)
       - Reject (red button)

   Active Operators Tab:
   - Table layout
   - Columns:
     | Logo | Company | Email | Routes | Trips | Revenue | Rating | Actions |
   - Actions:
     * View Details
     * Suspend
     * View Reports

5. Handlers:
   - Fetch operators by tab
   - handleApprove: Open approval modal
   - handleReject: Open rejection modal
   - handleSuspend: Open suspension modal
   - handleResume: Resume operator
```

**File: frontend/src/components/admin/OperatorApprovalModal.jsx**
```
Props: operator, visible, onClose, onApprove

Structure:

1. Operator Information:
   - Company name
   - Business license number
   - Tax code
   - Representative info
   - Bank info

2. Verification Documents:
   - Document viewer/carousel:
     * Business license (image/PDF)
     * Tax certificate
     * Other documents
   - Zoom/download functionality

3. Verification Checklist:
   - Checkbox: Business license valid
   - Checkbox: Tax code verified
   - Checkbox: Bank account verified
   - Checkbox: All information accurate

4. Notes:
   - Textarea: Internal notes (optional)

5. Buttons:
   - Cancel
   - Approve (primary, enabled khi all checks done)

Handler:
- handleApprove:
  - Call API verify operator
  - Show success message
  - Refresh list
```

**File: frontend/src/components/admin/OperatorRejectModal.jsx**
```
Structure:

1. Warning message

2. Rejection reason:
   - Select:
     * Incomplete documents
     * Invalid business license
     * Fraudulent information
     * Other
   - Textarea: Detailed reason

3. Impact notice:
   - "Operator will be notified"
   - "They can re-apply after fixing issues"

4. Buttons:
   - Cancel
   - Confirm Rejection (danger)
```

**File: frontend/src/components/admin/OperatorDetailModal.jsx**
```
Similar to UserDetailModal:

Tabs:
1. Overview: Company info, stats
2. Routes: List of routes
3. Buses: List of buses
4. Trips: Recent trips
5. Revenue: Revenue charts
6. Reviews: Customer reviews
7. Actions: Suspend, verify documents, etc.
```

---

## 📦 BƯỚC 6.4: CONTENT MANAGEMENT

### A. Content Models

**File: backend/src/models/Banner.js**
```
Schema fields:

- title: String
- description: String
- image: {
    type: String,
    required: true
  }
- link: String (URL to redirect khi click)
- position: {
    type: String,
    enum: ['home_hero', 'home_featured', 'search_page', 'sidebar'],
    required: true
  }
- order: {
    type: Number,
    default: 0
  }
- isActive: {
    type: Boolean,
    default: true
  }
- startDate: Date
- endDate: Date
- createdBy: { type: Schema.Types.ObjectId, ref: 'User' }

Timestamps

Indexes: position + order + isActive
```

**File: backend/src/models/Blog.js**
```
Schema fields:

- title: { type: String, required: true }
- slug: { type: String, unique: true }
- excerpt: String
- content: { type: String, required: true } // HTML content
- featuredImage: String
- category: {
    type: String,
    enum: ['travel_tips', 'destinations', 'news', 'guides']
  }
- tags: [String]
- author: { type: Schema.Types.ObjectId, ref: 'User' }
- isPublished: { type: Boolean, default: false }
- publishedAt: Date
- views: { type: Number, default: 0 }
- seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }

Timestamps

Indexes: slug (unique), category, isPublished
```

**File: backend/src/models/FAQ.js**
```
Schema fields:

- question: { type: String, required: true }
- answer: { type: String, required: true } // HTML
- category: {
    type: String,
    enum: ['booking', 'payment', 'tickets', 'cancellation', 'general']
  }
- order: { type: Number, default: 0 }
- isActive: { type: Boolean, default: true }
- views: { type: Number, default: 0 }

Timestamps

Indexes: category + order
```

### B. Content Management APIs

**File: backend/src/controllers/content.controller.js (tạo mới)**
```
Banner Management:

1. getBanners (public)
   Query: position, isActive

   - Find banners
   - Filter by position, isActive
   - Check date range (startDate <= now <= endDate)
   - Sort by order
   - Return banners

2. createBanner (protected, admin, permission: manage_content)
   Input: { title, description, image (file), link, position, order, startDate, endDate }

   - Upload image to Cloudinary
   - Create banner
   - Return created banner

3. updateBanner (protected, admin)
   - Update banner fields
   - Upload new image nếu có
   - Return updated

4. deleteBanner (protected, admin)
   - Soft delete (isActive = false)

Blog Management:

1. getBlogs (public)
   Query: category, tag, isPublished, search, page, limit

   - Find blogs
   - Filter
   - Sort by publishedAt desc
   - Paginate
   - Return blogs

2. getBlogBySlug (public)
   - Find blog by slug
   - Increment views
   - Return blog

3. createBlog (protected, admin, permission: manage_content)
   Input: { title, content, excerpt, featuredImage (file), category, tags }

   - Generate slug từ title
   - Upload featured image
   - Create blog với isPublished = false
   - Return created blog

4. updateBlog (protected, admin)
   - Update blog
   - Return updated

5. publishBlog (protected, admin)
   - Update isPublished = true, publishedAt = now
   - Return success

6. deleteBlog (protected, admin)
   - Delete blog (hard delete hoặc soft)

FAQ Management:

1. getFAQs (public)
   Query: category

   - Find FAQs
   - Filter by category, isActive
   - Sort by order
   - Return FAQs

2. createFAQ (protected, admin, permission: manage_content)
   - Create FAQ
   - Return created

3. updateFAQ (protected, admin)
   - Update FAQ
   - Return updated

4. deleteFAQ (protected, admin)
   - Soft delete

Export all functions
```

### C. Content Routes

**File: backend/src/routes/content.routes.js**
```
Public routes:
- GET /content/banners
- GET /content/blogs
- GET /content/blogs/:slug
- GET /content/faqs

Admin routes (protected):
- POST /admin/content/banners
- PUT /admin/content/banners/:id
- DELETE /admin/content/banners/:id

- POST /admin/content/blogs
- PUT /admin/content/blogs/:id
- PUT /admin/content/blogs/:id/publish
- DELETE /admin/content/blogs/:id

- POST /admin/content/faqs
- PUT /admin/content/faqs/:id
- DELETE /admin/content/faqs/:id

Mount in routes
```

### D. Frontend: Content Management

**File: frontend/src/pages/admin/ContentPage.jsx**
```
Structure:

1. Tabs:
   - Banners
   - Blogs
   - FAQs

Tab 1: Banners
- Header: "Banner Management", "Add Banner" button
- Table:
  | Preview | Title | Position | Order | Active | Date Range | Actions |
- Actions: Edit, Delete, Toggle Active

- Banner Form Modal:
  * Title, description
  * Image upload (drag & drop)
  * Link URL
  * Position select
  * Order number
  * Date range picker (start - end)
  * Active checkbox
  * Preview section

Tab 2: Blogs
- Header: "Blog Management", "Create Blog" button
- Table:
  | Featured Image | Title | Category | Published | Views | Date | Actions |
- Filters: Category, Published status
- Actions: Edit, Publish/Unpublish, Delete

- Blog Editor:
  * Title input
  * Slug (auto-generate từ title, editable)
  * Category select
  * Tags input (chips)
  * Featured image upload
  * Excerpt textarea
  * Rich text editor cho content (use react-quill hoặc tiptap)
  * SEO section:
    - Meta title
    - Meta description
    - Keywords
  * Preview button
  * Save as Draft / Publish buttons

Tab 3: FAQs
- Header: "FAQ Management", "Add FAQ" button
- Grouped by category
- Accordion view:
  * Question (bold)
  * Answer (collapsible)
  * Edit/Delete icons
- Drag & drop to reorder

- FAQ Form Modal:
  * Category select
  * Question input
  * Answer rich text editor
  * Order number
  * Active checkbox
```

**File: frontend/src/components/admin/RichTextEditor.jsx**
```
Wrapper component cho rich text editor:

Use: react-quill hoặc tiptap

Features:
- Bold, italic, underline
- Headings (H1-H6)
- Lists (ordered, unordered)
- Links
- Images
- Code blocks
- Alignment
- Tables
- Embed (YouTube, etc.)

Props:
- value (HTML string)
- onChange (callback)
- placeholder

Implementation:
```jsx
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={modules}
      placeholder={placeholder}
      theme="snow"
    />
  );
};
```
```

### E. Display Content on Customer Web

**File: frontend/src/pages/customer/HomePage.jsx (update)**
```
Fetch và display banners:

1. Hero banner (position: 'home_hero'):
   - Full-width carousel
   - Auto-rotate every 5 seconds
   - Click to navigate

2. Featured banners (position: 'home_featured'):
   - Grid layout below search
   - 2-3 banners

useEffect: Fetch banners on mount
```

**File: frontend/src/pages/customer/BlogPage.jsx (tạo mới)**
```
Structure:

1. Header:
   - Title: "Travel Blog"
   - Category filter (tabs)

2. Blog Grid:
   - Card cho mỗi blog:
     * Featured image
     * Category badge
     * Title
     * Excerpt (truncate)
     * Author, date, views
     * "Read more" link

3. Pagination

4. Sidebar (desktop):
   - Popular posts
   - Categories
   - Tags cloud

Handler:
- Fetch blogs
- Filter by category
- Click to view blog detail
```

**File: frontend/src/pages/customer/BlogDetailPage.jsx**
```
Structure:

1. Header:
   - Featured image (large)
   - Title (H1)
   - Author, date, category, views

2. Content:
   - HTML content (rendered safely)
   - Styling cho headings, paragraphs, images

3. Share buttons:
   - Facebook, Twitter, Copy link

4. Related posts:
   - Same category
   - Grid of 3-4 posts

5. Comments section (optional - future)
```

**File: frontend/src/pages/customer/FAQPage.jsx (tạo mới)**
```
Structure:

1. Header:
   - Title: "Frequently Asked Questions"
   - Search FAQs (filter by keyword)

2. Category tabs

3. FAQ Accordion:
   - Question as accordion header
   - Answer as collapsible content
   - Search highlight matching text

4. Can't find answer section:
   - Link to contact support
   - Link to create complaint
```

---

## 📦 BƯỚC 6.5: COMPLAINT MANAGEMENT

### A. Complaint Model (đã có từ overview)

**File: backend/src/models/Complaint.js**
```
Schema fields:

- user: { type: Schema.Types.ObjectId, ref: 'User' }
- booking: { type: Schema.Types.ObjectId, ref: 'Booking' } // Optional
- subject: { type: String, required: true }
- description: { type: String, required: true }
- category: {
    type: String,
    enum: ['booking_issue', 'payment_issue', 'driver_behavior', 'bus_condition', 'other'],
    required: true
  }
- priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
- status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  }
- assignedTo: { type: Schema.Types.ObjectId, ref: 'User' } // Admin
- attachments: [{
    url: String,
    type: String // 'image' | 'document'
  }]
- notes: [{
    text: String,
    addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now }
  }]
- resolution: String
- resolvedAt: Date

Timestamps

Indexes: user, status, priority, assignedTo
```

### B. Complaint APIs

**File: backend/src/controllers/complaint.controller.js (tạo mới)**
```
Customer Functions:

1. createComplaint (protected, user)
   Input: {
     bookingId (optional),
     subject, description, category,
     attachments (files)
   }

   - Upload attachments to Cloudinary
   - Create complaint với user = req.user._id
   - Send notification to admins
   - Return created complaint

2. getMyComplaints (protected, user)
   - Find complaints của user
   - Sort by createdAt desc
   - Paginate
   - Return complaints

3. getComplaintById (protected, user/admin)
   - Find complaint
   - Verify ownership (nếu user) hoặc admin
   - Populate notes
   - Return complaint

Admin Functions:

1. getAllComplaints (protected, admin, permission: manage_complaints)
   Query: { status, priority, category, assignedTo, page, limit }

   - Find all complaints với filters
   - Populate user, assignedTo
   - Sort by priority desc, createdAt desc
   - Paginate
   - Return complaints

2. assignComplaint (protected, admin)
   Input: complaintId, { assignedTo }

   - Find complaint
   - Update assignedTo
   - Add note: "Assigned to [admin name]"
   - Send notification to assigned admin
   - Return updated

3. updateComplaintStatus (protected, admin)
   Input: complaintId, { status }

   - Find complaint
   - Update status
   - If status = 'resolved':
     * Set resolvedAt = now
   - Add status change note
   - Send notification to user
   - Return updated

4. addComplaintNote (protected, admin)
   Input: complaintId, { note }

   - Find complaint
   - Add to notes array:
     { text: note, addedBy: req.admin._id }
   - Return updated

5. resolveComplaint (protected, admin)
   Input: complaintId, { resolution }

   - Find complaint
   - Update status = 'resolved'
   - Update resolution field
   - Update resolvedAt = now
   - Send email to user với resolution
   - Return success

Export functions
```

### C. Complaint Routes

**File: backend/src/routes/complaint.routes.js**
```
Customer routes (protected):
- POST /complaints
- GET /complaints/my-complaints
- GET /complaints/:id

Admin routes (protected, admin):
- GET /admin/complaints
- PUT /admin/complaints/:id/assign
- PUT /admin/complaints/:id/status
- POST /admin/complaints/:id/notes
- PUT /admin/complaints/:id/resolve

Mount in routes
```

### D. Frontend: Complaint Management (Admin)

**File: frontend/src/pages/admin/ComplaintsPage.jsx**
```
Structure:

1. Header:
   - Title: "Complaint Management"
   - Stats cards:
     * Open Complaints (red badge)
     * In Progress (yellow)
     * Resolved Today (green)
     * Avg Resolution Time

2. Filters:
   - Status tabs (Open, In Progress, Resolved, All)
   - Priority filter
   - Category filter
   - Assigned to filter
   - Date range

3. Complaints Table:
   Columns:
   | ID | User | Subject | Category | Priority | Status | Assigned To | Created | Actions |

   Priority badges: Low (gray), Medium (blue), High (orange), Urgent (red)
   Status badges: Open, In Progress, Resolved, Closed

   Actions: View Details, Assign, Update Status

4. Handlers:
   - Fetch complaints with filters
   - handleViewDetails: Open complaint detail modal
   - handleAssign: Open assign modal
   - handleUpdateStatus: Update status
```

**File: frontend/src/components/admin/ComplaintDetailModal.jsx**
```
Props: complaint, visible, onClose

Structure:

1. Header:
   - Complaint ID
   - Priority badge
   - Status badge
   - Created date

2. User Information:
   - User name, email
   - Related booking (if any): Link to booking

3. Complaint Details:
   - Category
   - Subject (bold)
   - Description
   - Attachments (images/documents - preview/download)

4. Timeline (Notes):
   - Vertical timeline
   - Each note:
     * Text
     * Added by (admin name)
     * Timestamp
   - Add note section:
     * Textarea
     * "Add Note" button

5. Actions Panel (sidebar):
   - Assign to: Admin select
   - Update Status: Status select
   - Resolution: Textarea (nếu status = resolved)
   - Buttons:
     * Save Changes
     * Close Complaint

Implementation:
- Fetch complaint details
- Real-time updates (WebSocket - optional)
- Form validation
```

### E. Frontend: Submit Complaint (Customer)

**File: frontend/src/pages/customer/SubmitComplaintPage.jsx**
```
Structure:

1. Header:
   - Title: "Submit a Complaint"
   - Subtitle: "We're here to help resolve your issue"

2. Form:
   - Related Booking (select - optional):
     * Dropdown of user's bookings
     * Shows: Booking code, route, date

   - Category (select - required):
     * Booking Issue
     * Payment Issue
     * Driver Behavior
     * Bus Condition
     * Other

   - Subject (input - required)

   - Description (textarea - required):
     * Placeholder: "Please describe your issue in detail"

   - Attachments (upload):
     * Drag & drop area
     * Max 5 files
     * Accept: images, PDFs
     * Preview uploaded files

3. Submit button

Handler:
- handleSubmit:
  - Validate form
  - Upload attachments
  - Call API create complaint
  - Show success message
  - Navigate to my complaints page

Styling:
- User-friendly
- Clear instructions
```

**File: frontend/src/pages/customer/MyComplaintsPage.jsx**
```
Structure:

1. Header:
   - Title: "My Complaints"
   - Button: "Submit New Complaint"

2. Filters:
   - Status tabs (All, Open, In Progress, Resolved)

3. Complaint Cards:
   - Each card:
     * Complaint ID, date
     * Status badge
     * Priority badge
     * Subject (bold)
     * Description (truncate)
     * Category
     * Last updated
     * "View Details" button

4. Empty state: "No complaints yet"

Handler:
- Fetch user's complaints
- Filter by status
- View complaint details
```

**File: frontend/src/components/customer/ComplaintDetailModal.jsx**
```
Customer view (simpler than admin):

- Complaint details
- Timeline of notes (read-only)
- Status updates
- Resolution (nếu resolved)
- Cannot edit, just view
```

---

## 📦 BƯỚC 6.6: SYSTEM-WIDE REPORTS

### A. Admin Report Service

**File: backend/src/services/adminReport.service.js (tạo mới)**
```
Functions:

1. getSystemOverviewStats(dateRange)
   Aggregate system-wide statistics:

   - Total users (breakdown: customers, admins)
   - Total operators (pending, approved, active, suspended)
   - Total bookings (confirmed, cancelled)
   - Total revenue
   - Growth metrics (vs previous period):
     * User growth %
     * Booking growth %
     * Revenue growth %
   - Top operators by revenue
   - Top routes by bookings
   - Popular destinations

   Return comprehensive stats object

2. getUserGrowthReport(dateRange)
   - Daily/monthly user registrations
   - User retention rate
   - Active vs inactive users
   - User distribution by loyalty tier
   - Return growth data for charts

3. getRevenueReport(dateRange)
   - Total revenue
   - Revenue breakdown:
     * By operator
     * By route
     * By payment method
   - Platform fee collected (nếu có)
   - Refunds issued
   - Return revenue report

4. getBookingReport(dateRange)
   - Total bookings
   - Booking success rate
   - Cancellation rate
   - Average booking value
   - Bookings by bus type
   - Peak booking times
   - Return booking analytics

5. getOperatorPerformanceReport(dateRange)
   - Operator rankings:
     * By revenue
     * By trips
     * By rating
   - Average occupancy rate by operator
   - Top performing operators
   - Underperforming operators
   - Return operator analytics

6. exportSystemReport(reportType, dateRange)
   - Generate Excel report
   - Multiple sheets:
     * Summary
     * Users
     * Operators
     * Bookings
     * Revenue
   - Charts and graphs
   - Return Excel buffer

Export functions
```

### B. Admin Report Controller

**File: backend/src/controllers/admin.controller.js (update)**
```
Add functions:

1. getSystemReports (protected, admin, permission: view_reports)
   Query: { reportType, startDate, endDate }

   - Call appropriate report service function
   - Return report data

2. exportReport (protected, admin)
   - Generate Excel report
   - Return file download

Export functions
```

### C. Admin Report Routes

```
In admin.routes.js:

- GET /admin/reports/overview
- GET /admin/reports/users
- GET /admin/reports/revenue
- GET /admin/reports/bookings
- GET /admin/reports/operators
- GET /admin/reports/:type/export
```

### D. Frontend: Admin Dashboard

**File: frontend/src/pages/admin/AdminDashboard.jsx**
```
Complete implementation:

Structure:

1. Header:
   - Welcome message: "Welcome, Admin"
   - Date range picker (global)
   - Refresh button

2. Stats Overview (4 cards):
   - Total Users (icon: users)
     * Value, growth indicator
   - Total Operators (icon: building)
     * Active/pending breakdown
   - Total Revenue (icon: dollar)
     * Value, growth indicator
   - Total Bookings (icon: ticket)
     * Value, success rate

3. Charts Section (2 columns):

   Left Column:
   - User Growth Chart (line chart)
     * X: Dates
     * Y: User count
     * Period: Week/Month/Year selector

   - Revenue Chart (area chart)
     * X: Dates
     * Y: Revenue
     * Overlay: Bookings count (line)

   Right Column:
   - Booking Distribution (pie chart)
     * By status: Confirmed, Cancelled, Pending

   - Top Routes (bar chart - horizontal)
     * Top 10 routes by bookings

4. Quick Stats Grid (3 columns):
   - Pending Operator Approvals (count, link)
   - Open Complaints (count, link)
   - Recent Signups (today count)

5. Recent Activity Feed:
   - Last 10 activities:
     * New operator registered
     * Booking created
     * Complaint submitted
     * User registered
   - Timestamp
   - Link to details

6. Top Operators Table:
   - Top 5 operators
   - Columns: Operator, Revenue, Trips, Rating
   - "View All" link

State:
- stats (object)
- charts data
- dateRange
- loading

Handlers:
- useEffect: Fetch dashboard data
- handleDateChange: Update date range, refetch
- Auto-refresh every 5 minutes (optional)

Implementation với Recharts:
```jsx
import {
  LineChart, AreaChart, PieChart, BarChart,
  Line, Area, Pie, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

// User Growth Chart
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={userGrowthData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="users" stroke="#0ea5e9" strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>

// Revenue Chart
<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={revenueData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis yAxisId="left" />
    <YAxis yAxisId="right" orientation="right" />
    <Tooltip />
    <Legend />
    <Area
      yAxisId="left"
      type="monotone"
      dataKey="revenue"
      fill="#10b981"
      stroke="#10b981"
      fillOpacity={0.6}
    />
    <Line
      yAxisId="right"
      type="monotone"
      dataKey="bookings"
      stroke="#f59e0b"
      strokeWidth={2}
    />
  </AreaChart>
</ResponsiveContainer>

// Booking Distribution (Pie)
<ResponsiveContainer width="100%" height={250}>
  <PieChart>
    <Pie
      data={bookingDistribution}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={80}
      fill="#8884d8"
      label
    >
      {bookingDistribution.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>
```
```

**File: frontend/src/pages/admin/ReportsPage.jsx**
```
Structure:

1. Header:
   - Title: "System Reports"
   - Date range picker
   - Export button (Excel)

2. Tabs:
   - Overview
   - Users
   - Operators
   - Revenue
   - Bookings

Each tab có charts và tables tương ứng với report data

Export Excel:
- Click Export
- Generate filename: QuikRide_Report_[Date].xlsx
- Download file
```

---

## ✅ DELIVERABLES PHASE 6

Sau khi hoàn thành Phase 6:

### Backend
- ✅ Admin authentication và authorization
- ✅ User management APIs (block, reset password)
- ✅ Operator approval workflow
- ✅ Operator suspension/resume
- ✅ Content management (banners, blogs, FAQs)
- ✅ Complaint system (submit, assign, resolve)
- ✅ System-wide reports và analytics
- ✅ Excel export functionality

### Frontend
- ✅ Admin login page
- ✅ Admin dashboard với comprehensive stats
- ✅ User management page với filters
- ✅ Operator approval interface
- ✅ Content management (banners, blogs, FAQs)
- ✅ Rich text editor
- ✅ Complaint management dashboard
- ✅ System reports với charts
- ✅ Blog pages (customer view)
- ✅ FAQ page (customer view)
- ✅ Submit complaint page (customer)

### Testing
- ✅ Admin có thể login và access dashboard
- ✅ Admin có thể manage users (block/unblock)
- ✅ Operator approval workflow hoạt động
- ✅ Content (banners, blogs, FAQs) có thể tạo/edit
- ✅ Complaints có thể submit và resolve
- ✅ Reports hiển thị accurate data
- ✅ Excel export hoạt động
- ✅ Customer có thể view blogs và FAQs

---

# PHASE 7: ADDITIONAL FEATURES & POLISH

**Thời gian:** 2 tuần
**Độ ưu tiên:** 🟢 Thấp (Nice to have)

## MỤC TIÊU PHASE 7
Bổ sung các tính năng nâng cao, tối ưu performance, và polish UI/UX

---

## 📦 BƯỚC 7.1: RATING & REVIEW SYSTEM

### A. Review Model

**File: backend/src/models/Review.js**
```
Schema fields:

- booking: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true // 1 booking = 1 review
  }

- user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

- operator: {
    type: Schema.Types.ObjectId,
    ref: 'BusOperator',
    required: true
  }

- trip: {
    type: Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  }

Ratings (1-5 stars):
- overallRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }

- detailedRatings: {
    vehicle: { type: Number, min: 1, max: 5 },      // Bus condition
    driver: { type: Number, min: 1, max: 5 },        // Driver behavior
    punctuality: { type: Number, min: 1, max: 5 },   // On-time departure/arrival
    service: { type: Number, min: 1, max: 5 }        // Customer service
  }

- comment: { type: String, maxlength: 1000 }

- images: [String] // Optional review images

Status:
- isPublished: { type: Boolean, default: true }
- isVerified: { type: Boolean, default: true } // Auto-verified nếu từ real booking

Admin moderation:
- isFlagged: { type: Boolean, default: false }
- flagReason: String
- moderatedBy: { type: Schema.Types.ObjectId, ref: 'User' }

Helpful votes:
- helpfulCount: { type: Number, default: 0 }
- helpfulVotes: [{ type: Schema.Types.ObjectId, ref: 'User' }]

Timestamps

Indexes:
- booking (unique)
- operator + isPublished
- user
```

### B. Review Service

**File: backend/src/services/review.service.js**
```
Functions:

1. createReview(bookingId, userId, reviewData)
   Input: bookingId, userId, { overallRating, detailedRatings, comment, images }

   Steps:
   - Find booking
   - Verify:
     * Booking belongs to user
     * Booking status = 'confirmed'
     * Trip completed (departureTime < now)
     * Review not already exists
   - Upload images (nếu có)
   - Create review
   - Update operator rating:
     * Calculate new average rating
     * Increment totalReviews
     * Update operator document
   - Send thank you email to user
   - Return created review

2. getOperatorReviews(operatorId, options)
   Options: { page, limit, sort, minRating }

   - Find reviews của operator
   - Filter by isPublished = true
   - Filter by minRating (nếu có)
   - Sort: newest, highest rating, most helpful
   - Paginate
   - Populate user (name, avatar)
   - Return reviews

3. getUserReviews(userId)
   - Find reviews của user
   - Populate trip, operator
   - Return reviews

4. updateOperatorRating(operatorId)
   Called after new review:

   - Aggregate all reviews của operator
   - Calculate:
     * Average overall rating
     * Average detailed ratings
   - Update operator document
   - Return new rating

5. markReviewHelpful(reviewId, userId)
   - Find review
   - Check user chưa vote
   - Add userId to helpfulVotes
   - Increment helpfulCount
   - Return updated review

Export functions
```

### C. Review Controller

**File: backend/src/controllers/review.controller.js (tạo mới)**
```
Functions:

1. createReview (protected, user)
   Input: bookingId, reviewData

   - Call review.service.createReview()
   - Return created review

2. getMyReviews (protected, user)
   - Call review.service.getUserReviews()
   - Return reviews

3. getOperatorReviews (public)
   Query: operatorId, page, limit, sort, minRating

   - Call review.service.getOperatorReviews()
   - Return reviews

4. markHelpful (protected, user)
   Input: reviewId

   - Call review.service.markReviewHelpful()
   - Return success

5. flagReview (protected, user)
   Input: reviewId, { reason }

   - Update review: isFlagged = true, flagReason
   - Notify admin
   - Return success

Admin functions:

6. getAllReviews (protected, admin)
   - Get all reviews với filters
   - Return reviews

7. moderateReview (protected, admin)
   Input: reviewId, { action: 'approve' | 'hide' | 'delete' }

   - Update review based on action
   - Return success

Export functions
```

### D. Review Routes

**File: backend/src/routes/review.routes.js**
```
Public:
- GET /reviews/operator/:operatorId

Protected (user):
- POST /reviews
- GET /reviews/my-reviews
- POST /reviews/:id/helpful
- POST /reviews/:id/flag

Protected (admin):
- GET /admin/reviews
- PUT /admin/reviews/:id/moderate

Mount in routes
```

### E. Frontend: Review System

**File: frontend/src/pages/customer/SubmitReviewPage.jsx**
```
Access: After trip completed, từ my tickets page

Structure:

1. Trip Summary:
   - Route, date
   - Operator name

2. Rating Form:

   Overall Rating:
   - Star rating component (1-5 stars, large)
   - Click to select

   Detailed Ratings:
   - Vehicle Condition: Star rating (1-5)
   - Driver Behavior: Star rating
   - Punctuality: Star rating
   - Customer Service: Star rating

   Comment:
   - Textarea: "Share your experience..."
   - Character count (max 1000)

   Photos (optional):
   - Upload up to 5 images
   - Preview

3. Submit button

Handler:
- handleSubmit:
  - Validate ratings
  - Upload images
  - Call API create review
  - Show success message
  - Navigate back to my tickets

Styling:
- User-friendly
- Large touch targets for stars (mobile-friendly)
```

**File: frontend/src/components/customer/StarRating.jsx**
```
Reusable star rating component:

Props:
- value (number 0-5)
- onChange (callback)
- readonly (boolean)
- size (small/medium/large)

Implementation:
- Render 5 stars
- Click to set rating
- Hover effect (nếu not readonly)
- Half-star support (optional)

```jsx
const StarRating = ({ value, onChange, readonly = false, size = 'medium' }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || value) ? 'filled' : ''} ${size}`}
          onClick={() => !readonly && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};
```
```

**File: frontend/src/components/customer/ReviewList.jsx**
```
Display reviews:

Props:
- operatorId
- limit (optional)

Structure:

1. Header:
   - "Customer Reviews"
   - Average rating (stars + number)
   - Total reviews count
   - Rating distribution (bar chart):
     * 5 stars: XX%
     * 4 stars: XX%
     * etc.

2. Filters:
   - Sort by: Newest, Highest rated, Most helpful
   - Filter by rating: All, 5 stars, 4+, etc.

3. Review Cards:
   Each card:
   - User avatar, name
   - Overall rating (stars)
   - Detailed ratings (smaller)
   - Date
   - Comment
   - Images (nếu có, thumbnail carousel)
   - Helpful button: "Helpful (X)" (toggle)
   - Flag button (report review)

4. Pagination / Load More

Handler:
- Fetch reviews
- Filter/sort
- Mark helpful
- Flag review
```

**Update TripDetailPage:**
```
Add ReviewList component:
- Display operator reviews
- Show average rating
- Link to all reviews
```

---

## 📦 BƯỚC 7.2: LOYALTY PROGRAM

### A. Loyalty Logic (Model đã có từ Phase 1)

**File: backend/src/services/loyalty.service.js (tạo mới)**
```
Loyalty tiers:
- Bronze: 0-999 points (default)
- Silver: 1000-2999 points (5% discount)
- Gold: 3000-6999 points (10% discount)
- Platinum: 7000+ points (15% discount)

Functions:

1. calculatePoints(bookingAmount)
   - Points earned = bookingAmount / 1000 (1 point per 1000 VND)
   - Return points

2. addPoints(userId, points, description)
   - Find user
   - Update loyaltyPoints += points
   - Add to pointsHistory:
     { points, type: 'earn', description }
   - Check tier upgrade:
     * Calculate new tier
     * If upgraded: Update loyaltyTier, send congrats email
   - Return new points balance

3. redeemPoints(userId, points, description)
   - Find user
   - Check sufficient points
   - Update loyaltyPoints -= points
   - Add to pointsHistory:
     { points, type: 'redeem', description }
   - Check tier downgrade
   - Return new points balance

4. getTierDiscount(user)
   - Get discount percentage based on tier:
     * Bronze: 0%
     * Silver: 5%
     * Gold: 10%
     * Platinum: 15%
   - Return discount percentage

5. getPointsForBooking(bookingAmount, loyaltyTier)
   - Base points: bookingAmount / 1000
   - Tier bonus:
     * Silver: +10%
     * Gold: +25%
     * Platinum: +50%
   - Return total points

Export functions
```

### B. Update Booking Confirmation

**File: backend/src/controllers/booking.controller.js (update)**
```
In confirmBooking function:

After payment success:
1. Calculate points earned:
   - points = loyalty.service.getPointsForBooking(amount, user.loyaltyTier)

2. Add points to user:
   - loyalty.service.addPoints(userId, points, `Booking ${bookingCode}`)

3. Include points info in confirmation email
```

### C. Frontend: Loyalty Features

**File: frontend/src/pages/customer/LoyaltyPage.jsx (tạo mới)**
```
Structure:

1. Header:
   - Title: "QuikRide Rewards"

2. Current Tier Card:
   - Large card với tier icon/badge
   - Current tier name (Bronze/Silver/Gold/Platinum)
   - Current points (large number)
   - Progress bar to next tier
   - Points needed for next tier
   - Tier benefits:
     * Discount percentage
     * Priority support (Gold+)
     * Bonus points earning rate

3. Tier Comparison Table:
   | Tier | Points Required | Discount | Bonus Points | Benefits |
   - Highlight current tier

4. Points History:
   - Table/List:
     | Date | Description | Points | Type (Earned/Redeemed) | Balance |
   - Sort by date desc
   - Pagination

5. How to Earn Points:
   - Info cards:
     * Book a trip: X points per 1000đ
     * Refer a friend: XXX points
     * Write a review: XX points
     * etc.

6. Redeem Points (future):
   - Redeem for discounts
   - Redeem for vouchers

Handler:
- Fetch user loyalty info
- Fetch points history
```

**Update ProfilePage:**
```
Add Loyalty section:
- Display current tier badge
- Points balance
- Link to Loyalty page
```

**Update BookingConfirmationPage:**
```
Show points earned:
- "You earned XXX points from this booking!"
- New points balance
- Progress to next tier
```

---

## 📦 BƯỚC 7.3: NOTIFICATIONS & ALERTS

### A. Notification System

**File: backend/src/models/Notification.js (tạo mới)**
```
Schema fields:

- user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
- type: {
    type: String,
    enum: [
      'booking_confirmed', 'booking_cancelled',
      'trip_reminder', 'payment_received',
      'review_request', 'loyalty_tier_upgrade',
      'complaint_update', 'system_announcement'
    ],
    required: true
  }
- title: { type: String, required: true }
- message: { type: String, required: true }
- link: String // Deep link to relevant page
- data: Schema.Types.Mixed // Additional data (booking, trip, etc.)
- isRead: { type: Boolean, default: false }
- readAt: Date

Timestamps

Indexes: user + isRead, createdAt
```

**File: backend/src/services/notification.service.js**
```
Functions:

1. createNotification(userId, notificationData)
   - Create notification in database
   - Emit WebSocket event (real-time)
   - Send push notification (nếu có FCM token)
   - Return notification

2. getUserNotifications(userId, options)
   - Find notifications của user
   - Filter: unread only (optional)
   - Sort by createdAt desc
   - Paginate
   - Return notifications

3. markAsRead(notificationId, userId)
   - Find notification
   - Verify ownership
   - Update isRead = true, readAt = now
   - Return updated

4. markAllAsRead(userId)
   - Update all user's notifications
   - Return count

5. deleteNotification(notificationId, userId)
   - Soft delete or hard delete
   - Return success

Export functions
```

### B. Notification APIs

**File: backend/src/controllers/notification.controller.js (tạo mới)**
```
Functions:

1. getNotifications (protected, user)
   Query: { page, limit, unreadOnly }

   - Call notification.service.getUserNotifications()
   - Return notifications

2. markAsRead (protected, user)
   Input: notificationId

   - Call notification.service.markAsRead()
   - Return success

3. markAllAsRead (protected, user)
   - Call notification.service.markAllAsRead()
   - Return count

4. deleteNotification (protected, user)
   - Call notification.service.deleteNotification()
   - Return success

Export functions
```

### C. Frontend: Notifications

**File: frontend/src/components/common/NotificationDropdown.jsx**
```
Header notification icon với dropdown:

Structure:

1. Icon:
   - Bell icon
   - Badge với unread count (nếu > 0)

2. Dropdown (click icon):
   - Header: "Notifications", "Mark all as read" link
   - Notification list (max 5):
     Each item:
     - Icon based on type
     - Title (bold nếu unread)
     - Message (truncate)
     - Time ago
     - Click to mark as read và navigate to link
   - Footer: "See all notifications" link

State:
- notifications (array)
- unreadCount (number)

Handlers:
- useEffect: Fetch notifications on mount
- WebSocket listener: New notification
- handleMarkAsRead: Mark and navigate
- handleMarkAllRead: Mark all

WebSocket Integration:
```jsx
useEffect(() => {
  socket.on('new_notification', (notification) => {
    // Add to notifications list
    setNotifications(prev => [notification, ...prev]);
    // Increment unread count
    setUnreadCount(prev => prev + 1);
    // Show toast notification
    toast.success(notification.title);
  });

  return () => {
    socket.off('new_notification');
  };
}, []);
```
```

**File: frontend/src/pages/customer/NotificationsPage.jsx**
```
Full notifications page:

Structure:

1. Header:
   - Title: "All Notifications"
   - "Mark all as read" button
   - Tabs: All, Unread

2. Notification List:
   - Group by date (Today, Yesterday, This Week, Older)
   - Each notification:
     * Icon
     * Title, message
     * Timestamp
     * Unread indicator (blue dot)
     * Click to view details và mark as read
   - Delete button (swipe on mobile)

3. Empty state: "No notifications"

Handlers:
- Fetch all notifications
- Filter by tab
- Mark as read
- Delete
```

---

## 📦 BƯỚC 7.4: PERFORMANCE OPTIMIZATION

### A. Backend Optimization

**Database Indexing:**
```
Review và optimize indexes:

1. User Model:
   - Index: email (unique)
   - Index: phone (unique, sparse)
   - Compound: role + isActive

2. Trip Model:
   - Compound: route + departureTime + status
   - Index: departureTime
   - Index: operator + status

3. Booking Model:
   - Compound: user + status
   - Compound: trip + status
   - Index: bookingCode (unique)
   - Index: createdAt (for cleanup)

4. Review Model:
   - Compound: operator + isPublished
   - Index: user

Check và tạo indexes trong MongoDB
```

**Caching Strategy:**
```
File: backend/src/middleware/cache.middleware.js

Functions:

1. cacheMiddleware(duration)
   Returns middleware:
   - Generate cache key từ request (URL + query)
   - Check Redis cho cached response
   - If exists: Return cached
   - If not: Continue to handler
   - After handler: Cache response với TTL

2. invalidateCache(pattern)
   - Delete keys matching pattern
   - Used khi data changes

Apply caching:
- Trip search: Cache 5 minutes
- Operator info: Cache 10 minutes
- Static content: Cache 1 hour

Clear cache on:
- New trip created
- Booking created
- Content updated
```

**Database Query Optimization:**
```
1. Use lean() cho read-only queries:
   - Trip.find().lean()
   - Faster, returns plain objects

2. Select only needed fields:
   - User.findById(id).select('name email')

3. Limit results:
   - Always use pagination
   - Default limit: 20

4. Use aggregation cho complex queries:
   - Dashboard stats
   - Reports

5. Avoid N+1 queries:
   - Use populate wisely
   - Consider denormalization for frequently accessed data
```

**API Response Optimization:**
```
1. Compression:
   - Already using compression middleware
   - Ensure enabled in production

2. Pagination:
   - Standard format:
     {
       data: [...],
       pagination: {
         page, limit, total, totalPages
       }
     }

3. Field filtering:
   - Allow clients to specify fields:
     /api/trips?fields=route,departureTime,price

4. Response size:
   - Don't send unnecessary data
   - Trim long text fields
```

### B. Frontend Optimization

**Code Splitting:**
```
Use React lazy loading:

File: frontend/src/App.jsx

```jsx
import { lazy, Suspense } from 'react';

// Lazy load pages
const HomePage = lazy(() => import('./pages/customer/HomePage'));
const SearchResultsPage = lazy(() => import('./pages/customer/SearchResultsPage'));
const OperatorDashboard = lazy(() => import('./pages/operator/OperatorDashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// In Routes:
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/search" element={<SearchResultsPage />} />
    {/* etc. */}
  </Routes>
</Suspense>
```
```

**Image Optimization:**
```
1. Lazy loading images:
   ```jsx
   <img
     src={image}
     loading="lazy"
     alt="..."
   />
   ```

2. Responsive images:
   ```jsx
   <img
     srcSet={`
       ${image_small} 300w,
       ${image_medium} 768w,
       ${image_large} 1200w
     `}
     sizes="(max-width: 768px) 100vw, 50vw"
     src={image_medium}
     alt="..."
   />
   ```

3. Use WebP format (với fallback)

4. Compress images (use Cloudinary transformations)
```

**React Performance:**
```
1. Memoization:
   ```jsx
   import { memo, useMemo, useCallback } from 'react';

   // Memo component
   const ExpensiveComponent = memo(({ data }) => {
     // Component logic
   });

   // useMemo for expensive calculations
   const filteredData = useMemo(() => {
     return data.filter(item => item.active);
   }, [data]);

   // useCallback for functions passed as props
   const handleClick = useCallback(() => {
     // Handler logic
   }, [dependencies]);
   ```

2. Virtual scrolling cho long lists:
   - Use react-window hoặc react-virtualized
   - Example: Passenger list, search results

3. Debounce search inputs:
   ```jsx
   const debouncedSearch = useDebounce(searchTerm, 500);

   useEffect(() => {
     if (debouncedSearch) {
       fetchResults(debouncedSearch);
     }
   }, [debouncedSearch]);
   ```

4. Avoid inline functions và objects:
   ```jsx
   // Bad
   <Component onClick={() => handleClick()} style={{ color: 'red' }} />

   // Good
   const handleClickMemo = useCallback(() => handleClick(), []);
   const styles = useMemo(() => ({ color: 'red' }), []);
   <Component onClick={handleClickMemo} style={styles} />
   ```
```

**Bundle Size Optimization:**
```
1. Analyze bundle:
   - npm run build
   - Check bundle size
   - Use webpack-bundle-analyzer

2. Tree shaking:
   - Import only what you need:
     ```jsx
     // Bad
     import _ from 'lodash';

     // Good
     import debounce from 'lodash/debounce';
     ```

3. Remove unused dependencies:
   - Check package.json
   - Remove unused packages

4. Use lighter alternatives:
   - moment.js → dayjs (smaller)
   - lodash → lodash-es (tree-shakeable)
```

---

## 📦 BƯỚC 7.5: UI/UX POLISH

### A. Loading States

**Create Loading Components:**

```jsx
// frontend/src/components/common/LoadingSkeleton.jsx
const LoadingSkeleton = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="skeleton-card animate-pulse">
        <div className="h-48 bg-gray-300 rounded"></div>
        <div className="p-4 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }
  // Other skeleton types...
};

// Usage:
{loading ? <LoadingSkeleton type="card" /> : <ActualComponent />}
```

**Progress Indicators:**
- Linear progress for page loads
- Circular progress for actions
- Skeleton screens for content loading

### B. Error Handling

**Error Boundary:**
```jsx
// frontend/src/components/common/ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
    // Log to error tracking service (Sentry)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Oops! Something went wrong</h2>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap App:
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**User-friendly Error Messages:**
```
Replace technical errors with friendly messages:

API Error → Display:
- 400: "Please check your input"
- 401: "Please login to continue"
- 403: "You don't have permission"
- 404: "Not found"
- 500: "Something went wrong, please try again"

Network Error → "Connection issue, please check internet"
Timeout → "Request took too long, please try again"
```

### C. Responsive Design

**Mobile Optimization:**
```
1. Touch-friendly:
   - Minimum touch target: 44x44px
   - Adequate spacing between interactive elements

2. Mobile navigation:
   - Hamburger menu
   - Bottom tab bar (customer app)

3. Forms:
   - Large input fields
   - Appropriate input types (tel, email)
   - Mobile-friendly date pickers

4. Tables:
   - Horizontal scroll on mobile
   - Or convert to cards

5. Test on devices:
   - iPhone (Safari)
   - Android (Chrome)
   - Tablets
```

**Breakpoints (Tailwind):**
```
- sm: 640px (mobile landscape)
- md: 768px (tablets)
- lg: 1024px (small laptops)
- xl: 1280px (desktops)
- 2xl: 1536px (large screens)

Design mobile-first, then scale up
```

### D. Accessibility (A11y)

**Semantic HTML:**
```jsx
// Use proper HTML tags
<header>, <nav>, <main>, <article>, <section>, <footer>

// Proper heading hierarchy
<h1> → <h2> → <h3>

// Buttons vs Links
<button> for actions
<a> for navigation
```

**ARIA Attributes:**
```jsx
// Labels
<button aria-label="Close modal">×</button>

// Roles
<div role="dialog" aria-modal="true">

// States
<button aria-expanded={isOpen}>

// Live regions
<div aria-live="polite" aria-atomic="true">
```

**Keyboard Navigation:**
```
- All interactive elements focusable
- Visible focus indicators
- Tab order logical
- Escape to close modals
- Enter to submit forms
- Arrow keys for navigation
```

**Color Contrast:**
```
- WCAG AA compliance
- Minimum contrast ratio: 4.5:1
- Use tools to check contrast
- Don't rely on color alone for information
```

### E. Animations & Transitions

**Smooth Transitions:**
```css
/* Tailwind utility classes */
.transition-all {
  transition: all 0.3s ease;
}

/* Hover effects */
.hover:scale-105 {
  transform: scale(1.05);
}

/* Fade in animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in;
}
```

**Micro-interactions:**
- Button hover/active states
- Input focus states
- Success checkmarks
- Loading spinners
- Progress indicators

**Page Transitions:**
```jsx
// Use framer-motion
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
>
  {/* Page content */}
</motion.div>
```

---

## 📦 BƯỚC 7.6: TESTING & QUALITY ASSURANCE

### A. Backend Testing

**Unit Tests:**
```javascript
// Example: tests/unit/services/loyalty.service.test.js
const { calculatePoints } = require('../../../src/services/loyalty.service');

describe('Loyalty Service', () => {
  describe('calculatePoints', () => {
    test('should calculate points correctly', () => {
      expect(calculatePoints(10000)).toBe(10);
      expect(calculatePoints(5500)).toBe(5);
    });

    test('should handle zero amount', () => {
      expect(calculatePoints(0)).toBe(0);
    });
  });
});
```

**Integration Tests:**
```javascript
// Example: tests/integration/auth.test.js
const request = require('supertest');
const app = require('../../src/server');

describe('Auth API', () => {
  test('POST /api/v1/auth/register', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user');
  });
});
```

**Test Coverage Target: ≥ 70%**

### B. Frontend Testing

**Component Tests:**
```jsx
// Example: tests/components/StarRating.test.jsx
import { render, fireEvent } from '@testing-library/react';
import StarRating from '../../src/components/customer/StarRating';

describe('StarRating', () => {
  test('renders 5 stars', () => {
    const { getAllByText } = render(<StarRating value={0} />);
    const stars = getAllByText('★');
    expect(stars).toHaveLength(5);
  });

  test('handles click', () => {
    const handleChange = jest.fn();
    const { getAllByText } = render(
      <StarRating value={0} onChange={handleChange} />
    );
    const stars = getAllByText('★');
    fireEvent.click(stars[2]); // Click 3rd star
    expect(handleChange).toHaveBeenCalledWith(3);
  });
});
```

**E2E Tests (Cypress):**
```javascript
// Example: cypress/e2e/booking-flow.cy.js
describe('Booking Flow', () => {
  it('should complete booking successfully', () => {
    cy.visit('/');

    // Search
    cy.get('[data-testid="from-input"]').type('Ha Noi');
    cy.get('[data-testid="to-input"]').type('Da Nang');
    cy.get('[data-testid="date-picker"]').click();
    cy.get('[data-testid="search-button"]').click();

    // Select trip
    cy.get('[data-testid="trip-card"]').first().click();

    // Select seats
    cy.get('[data-testid="seat-A1"]').click();
    cy.get('[data-testid="continue-button"]').click();

    // Fill passenger info
    cy.get('[data-testid="passenger-name"]').type('John Doe');
    cy.get('[data-testid="passenger-phone"]').type('0901234567');
    cy.get('[data-testid="continue-payment"]').click();

    // Payment
    cy.get('[data-testid="payment-vnpay"]').click();
    cy.get('[data-testid="pay-button"]').click();

    // Verify success
    cy.url().should('include', '/booking/success');
    cy.contains('Booking confirmed').should('be.visible');
  });
});
```

### C. Manual Testing Checklist

**Functional Testing:**
- [ ] User registration & login works
- [ ] Operator registration & approval works
- [ ] Trip search returns correct results
- [ ] Seat selection works real-time
- [ ] Booking flow completes successfully
- [ ] Payment integration works
- [ ] Ticket generation works
- [ ] QR scanner verifies tickets
- [ ] Cancellation & refund works
- [ ] Reviews can be submitted
- [ ] Vouchers can be created & applied
- [ ] All CRUD operations work
- [ ] Admin panel functions correctly

**Browser Testing:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome)

**Device Testing:**
- [ ] Desktop (1920x1080, 1366x768)
- [ ] Tablet (iPad, Android tablet)
- [ ] Mobile (iPhone, Android phone)

**Performance Testing:**
- [ ] Page load < 3s
- [ ] API response < 500ms
- [ ] Search results < 2s
- [ ] No memory leaks
- [ ] Handles 100+ concurrent users

**Security Testing:**
- [ ] XSS protection works
- [ ] SQL injection prevented
- [ ] CSRF protection works
- [ ] Authentication required for protected routes
- [ ] Authorization checks work
- [ ] Passwords hashed
- [ ] Sensitive data encrypted

---

## 📦 BƯỚC 7.7: DOCUMENTATION

### A. API Documentation (Swagger)

**Setup Swagger:**
```
1. Install: npm install swagger-jsdoc swagger-ui-express

2. Create swagger config:
   File: backend/src/config/swagger.js
```

```javascript
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QuikRide API',
      version: '1.0.0',
      description: 'API documentation for QuikRide bus booking system'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] // Path to route files
};

const specs = swaggerJsdoc(options);
module.exports = specs;
```

**Document APIs:**
```javascript
// Example: In routes/auth.routes.js

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 */
router.post('/login', authController.login);
```

**Mount Swagger UI:**
```javascript
// In server.js
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
```

Access: http://localhost:5000/api-docs

### B. User Guides

**Create user documentation:**

1. **User Manual** (Customer):
   - Getting started
   - How to search for trips
   - How to book tickets
   - Payment methods
   - Managing bookings
   - FAQs

2. **Operator Manual**:
   - Registration process
   - Setting up routes and buses
   - Creating trips
   - Managing bookings
   - Reports and analytics
   - Best practices

3. **Trip Manager Guide**:
   - How to use QR scanner
   - Managing passenger list
   - Updating trip status

4. **Admin Manual**:
   - Dashboard overview
   - User management
   - Operator approval
   - Content management
   - Handling complaints

**Format**: PDF hoặc online documentation site

### C. Code Documentation

**JSDoc comments:**
```javascript
/**
 * Calculate refund amount based on cancellation policy
 * @param {Object} booking - The booking object
 * @param {Object} trip - The trip object
 * @returns {Object} Refund details { canCancel, refundAmount, reason }
 */
function calculateRefund(booking, trip) {
  // Implementation
}
```

**README files:**
- Root README.md (overview)
- Backend README.md (setup, API structure)
- Frontend README.md (setup, component structure)

---

## 📦 BƯỚC 7.8: DEPLOYMENT PREPARATION

### A. Environment Configuration

**Production .env:**
```
Create .env.production với production values:

NODE_ENV=production
PORT=5000

# Database (production)
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...

# Security
JWT_SECRET=<strong-secret-256-chars>
JWT_EXPIRE=7d

# HTTPS
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/key.pem

# External services (production keys)
VNPAY_TMN_CODE=<production-code>
CLOUDINARY_CLOUD_NAME=<production-cloud>
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=<production-key>
SMS_PROVIDER=vnpt
SMS_API_KEY=<production-key>

# Frontend URL (production)
FRONTEND_URL=https://quikride.com

# Logging
LOG_LEVEL=info

# Performance
MAX_REQUEST_SIZE=10mb
RATE_LIMIT_MAX=1000
```

### B. Docker Configuration

**Dockerfile (Backend):**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
```

**Dockerfile (Frontend):**
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  redis:
    image: redis:6-alpine
    volumes:
      - redis-data:/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
      - redis
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://admin:password@mongodb:27017/quikride
      - REDIS_URL=redis://redis:6379

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongo-data:
  redis-data:
```

### C. CI/CD Pipeline (GitHub Actions)

**File: .github/workflows/deploy.yml**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/quikride
            git pull
            docker-compose down
            docker-compose up -d --build
```

### D. Monitoring & Logging

**Setup PM2 (Alternative to Docker):**
```
1. Install PM2: npm install -g pm2

2. Create ecosystem.config.js:
```

```javascript
module.exports = {
  apps: [{
    name: 'quikride-api',
    script: './src/server.js',
    instances: 4,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    max_memory_restart: '1G',
    autorestart: true
  }]
};
```

```
3. Start: pm2 start ecosystem.config.js
4. Monitor: pm2 monit
5. Logs: pm2 logs
```

**Error Tracking (Sentry):**
```
1. Install: npm install @sentry/node

2. Initialize in server.js:
```

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

// Before routes
app.use(Sentry.Handlers.requestHandler());

// After routes, before error handler
app.use(Sentry.Handlers.errorHandler());
```

---

## ✅ DELIVERABLES PHASE 7

Sau khi hoàn thành Phase 7:

### Features
- ✅ Rating & review system
- ✅ Loyalty program hoàn chỉnh
- ✅ Notification system (in-app + real-time)
- ✅ Responsive design (mobile + tablet)
- ✅ Accessibility improvements

### Performance
- ✅ Code splitting
- ✅ Image optimization
- ✅ Caching implemented
- ✅ Database indexes optimized
- ✅ Bundle size optimized

### Quality
- ✅ Test coverage ≥ 70%
- ✅ E2E tests
- ✅ Error handling
- ✅ Loading states
- ✅ User-friendly error messages

### Documentation
- ✅ API documentation (Swagger)
- ✅ User manuals
- ✅ Admin guides
- ✅ Code documentation

### Deployment
- ✅ Docker setup
- ✅ CI/CD pipeline
- ✅ Monitoring & logging
- ✅ Production-ready configuration

---

## 🎯 KẾT LUẬN TOÀN BỘ DỰ ÁN

### TỔNG KẾT 7 PHASES

**MVP (Phases 1-4) - 9 tuần:**
✅ Authentication & Infrastructure
✅ Route & Bus Management
✅ Booking System
✅ Electronic Ticketing

**Advanced Features (Phases 5-6) - 3.5 tuần:**
✅ Operator Dashboard & Reports
✅ System Admin Panel

**Polish & Production (Phase 7) - 2 tuần:**
✅ Reviews & Loyalty
✅ Performance Optimization
✅ Testing & Documentation
✅ Deployment Ready

### TỔNG THỜI GIAN: ~14.5 tuần (3.5 tháng)

### HỆ THỐNG HOÀN CHỈNH

**4 Web Applications:**
1. Customer Web (quikride.com)
2. Operator Dashboard (operator.quikride.com)
3. Trip Manager Web (trip.quikride.com)
4. System Admin (admin.quikride.com)

**Core Features:**
- Tìm kiếm & đặt vé real-time
- Thanh toán online (VNPay, MoMo, etc.)
- Vé điện tử với QR code
- Soát vé tự động
- Dashboard & analytics
- Review & rating
- Loyalty program
- Voucher system
- Complaint management
- System reports

**Technical Stack:**
- Backend: Node.js + Express + MongoDB + Redis
- Frontend: React + Vite + Tailwind + Ant Design
- Real-time: Socket.IO
- Payment: VNPay, MoMo, ZaloPay
- Notifications: Email (SendGrid) + SMS
- Cloud: Cloudinary (files)
- Deployment: Docker + PM2

### SẴN SÀNG PRODUCTION

Hệ thống đã hoàn thiện và sẵn sàng triển khai production với:
- Security best practices
- Performance optimization
- Comprehensive testing
- Complete documentation
- Monitoring & logging
- CI/CD pipeline

---

**Chúc bạn thành công với dự án QuikRide!** 🚀

