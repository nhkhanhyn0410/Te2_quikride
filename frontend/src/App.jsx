import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import DashboardLayout from './components/operator/DashboardLayout';
import AdminDashboardLayout from './components/admin/AdminDashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import OperatorLoginPage from './pages/auth/OperatorLoginPage';
import TripManagerLoginPage from './pages/auth/TripManagerLoginPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import CustomerLoginPage from './pages/auth/CustomerLoginPage';
import CustomerRegisterPage from './pages/auth/CustomerRegisterPage';

// Operator Dashboard Pages
import DashboardPage from './pages/operator/DashboardPage';
import RoutesPage from './pages/operator/RoutesPage';
import BusesPage from './pages/operator/BusesPage';
import OperatorTripsPage from './pages/operator/TripsPage';
import EmployeesPage from './pages/operator/EmployeesPage';
import ReportsPage from './pages/operator/ReportsPage';
import VouchersPage from './pages/operator/VouchersPage';

// Customer Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import TripsPage from './pages/TripsPage';
import TripDetailPage from './pages/TripDetailPage';
import PassengerInfoPage from './pages/PassengerInfoPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import MyTicketsPage from './pages/customer/MyTicketsPage';
import GuestTicketLookupPage from './pages/GuestTicketLookupPage';
import CancelTicketPage from './pages/CancelTicketPage';

// Payment Pages
import VNPayReturn from './pages/payment/VNPayReturn';
import BookingSuccess from './pages/payment/BookingSuccess';
import BookingFailure from './pages/payment/BookingFailure';

// Trip Manager Pages
import TripManagerDashboard from './pages/trip-manager/TripManagerDashboard';
import ActiveTripPage from './pages/trip-manager/ActiveTripPage';
import QRScannerPage from './pages/trip-manager/QRScannerPage';
import PassengersPage from './pages/trip-manager/PassengersPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import OperatorManagementPage from './pages/admin/OperatorManagementPage';
import ComplaintManagementPage from './pages/admin/ComplaintManagementPage';
import ContentManagementPage from './pages/admin/ContentManagementPage';
// import ReportsPage from './pages/admin/ReportsPage';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Customer Auth Routes */}
        <Route path="/login" element={<CustomerLoginPage />} />
        <Route path="/register" element={<CustomerRegisterPage />} />

        {/* Customer Booking Flow */}
        <Route path="/" element={<HomePage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trips/:tripId" element={<TripDetailPage />} />
        <Route path="/booking/passenger-info" element={<PassengerInfoPage />} />
        <Route path="/booking/confirmation/:bookingCode" element={<BookingConfirmationPage />} />

        {/* Customer Ticket Management */}
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        <Route path="/tickets/lookup" element={<GuestTicketLookupPage />} />
        <Route path="/tickets/cancel" element={<CancelTicketPage />} />

        {/* Payment Routes */}
        <Route path="/payment/vnpay-return" element={<VNPayReturn />} />
        <Route path="/booking/success" element={<BookingSuccess />} />
        <Route path="/booking/failure" element={<BookingFailure />} />
        <Route path="/payment/success" element={<BookingSuccess />} />
        <Route path="/payment/failure" element={<BookingFailure />} />
        <Route path="/payment/error" element={<BookingFailure />} />

        {/* Operator Auth Routes */}
        <Route path="/operator/login" element={<OperatorLoginPage />} />

        {/* Operator Dashboard Routes - Protected */}
        <Route
          path="/operator"
          element={
            <ProtectedRoute allowedRoles={['operator']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/operator/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="buses" element={<BusesPage />} />
          <Route path="trips" element={<OperatorTripsPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="vouchers" element={<VouchersPage />} />
        </Route>

        {/* Trip Manager Auth Routes */}
        <Route path="/trip-manager/login" element={<TripManagerLoginPage />} />

        {/* Trip Manager Routes - Protected */}
        <Route
          path="/trip-manager/dashboard"
          element={
            <ProtectedRoute allowedRoles={['trip_manager']}>
              <TripManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trip-manager/active-trip"
          element={
            <ProtectedRoute allowedRoles={['trip_manager']}>
              <ActiveTripPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trip-manager/trips/:tripId/scan"
          element={
            <ProtectedRoute allowedRoles={['trip_manager']}>
              <QRScannerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trip-manager/trips/:tripId/passengers"
          element={
            <ProtectedRoute allowedRoles={['trip_manager']}>
              <PassengersPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Auth Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Dashboard Routes - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="operators" element={<OperatorManagementPage />} />
          <Route path="complaints" element={<ComplaintManagementPage />} />
          <Route path="content" element={<ContentManagementPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>

        {/* 404 Not Found */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen bg-gray-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800">404</h1>
                <p className="text-gray-600 mt-4">Trang không tồn tại</p>
                <a href="/" className="text-blue-600 hover:underline mt-2 inline-block">
                  Về trang chủ
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
