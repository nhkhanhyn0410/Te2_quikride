import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import DashboardLayout from './components/operator/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import OperatorLoginPage from './pages/auth/OperatorLoginPage';
import TripManagerLoginPage from './pages/auth/TripManagerLoginPage';

// Operator Dashboard Pages
import DashboardPage from './pages/operator/DashboardPage';
import RoutesPage from './pages/operator/RoutesPage';
import BusesPage from './pages/operator/BusesPage';
import EmployeesPage from './pages/operator/EmployeesPage';
import ReportsPage from './pages/operator/ReportsPage';
import VouchersPage from './pages/operator/VouchersPage';

// Customer Pages
import SearchPage from './pages/SearchPage';
import TripsPage from './pages/TripsPage';
import TripDetailPage from './pages/TripDetailPage';
import PassengerInfoPage from './pages/PassengerInfoPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import MyTicketsPage from './pages/customer/MyTicketsPage';
import GuestTicketLookupPage from './pages/GuestTicketLookupPage';

// Trip Manager Pages
import TripManagerDashboard from './pages/trip-manager/TripManagerDashboard';
import QRScannerPage from './pages/trip-manager/QRScannerPage';
import PassengersPage from './pages/trip-manager/PassengersPage';

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
        {/* Customer Booking Flow */}
        <Route path="/" element={<SearchPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trips/:tripId" element={<TripDetailPage />} />
        <Route path="/booking/passenger-info" element={<PassengerInfoPage />} />
        <Route path="/booking/confirmation/:bookingCode" element={<BookingConfirmationPage />} />

        {/* Customer Ticket Management */}
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        <Route path="/tickets/lookup" element={<GuestTicketLookupPage />} />

        {/* Payment Success/Failure Pages */}
        <Route
          path="/payment/success"
          element={<BookingConfirmationPage />}
        />
        <Route
          path="/payment/failure"
          element={
            <div className="flex items-center justify-center h-screen bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600">❌</h1>
                <h2 className="text-2xl font-semibold mt-4">Thanh toán thất bại</h2>
                <p className="text-gray-600 mt-2">Đã có lỗi xảy ra trong quá trình thanh toán</p>
                <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">
                  Về trang chủ
                </a>
              </div>
            </div>
          }
        />
        <Route
          path="/payment/error"
          element={
            <div className="flex items-center justify-center h-screen bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-orange-600">⚠️</h1>
                <h2 className="text-2xl font-semibold mt-4">Lỗi hệ thống</h2>
                <p className="text-gray-600 mt-2">Vui lòng thử lại sau</p>
                <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">
                  Về trang chủ
                </a>
              </div>
            </div>
          }
        />

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
