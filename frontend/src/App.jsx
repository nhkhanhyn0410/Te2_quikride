import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import DashboardLayout from './components/operator/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import OperatorLoginPage from './pages/auth/OperatorLoginPage';

// Operator Dashboard Pages
import DashboardPage from './pages/operator/DashboardPage';
import RoutesPage from './pages/operator/RoutesPage';
import BusesPage from './pages/operator/BusesPage';
import EmployeesPage from './pages/operator/EmployeesPage';

// Customer Booking Pages
import SearchPage from './pages/SearchPage';
import TripsPage from './pages/TripsPage';
import TripDetailPage from './pages/TripDetailPage';
import PassengerInfoPage from './pages/PassengerInfoPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';

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
