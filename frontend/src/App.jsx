import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages (to be created)
// import HomePage from '@pages/HomePage';
// import SearchPage from '@pages/SearchPage';
// import LoginPage from '@pages/auth/LoginPage';
// import RegisterPage from '@pages/auth/RegisterPage';

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
        <Route path="/" element={<div className="p-8 text-center">
          <h1 className="text-4xl font-bold text-primary-600 mb-4">
            🚌 QuikRide
          </h1>
          <p className="text-gray-600">
            Hệ thống đặt vé xe khách trực tuyến
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Frontend đang được phát triển...
          </p>
        </div>} />

        {/* Auth routes */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/register" element={<RegisterPage />} /> */}

        {/* Search & Booking routes */}
        {/* <Route path="/search" element={<SearchPage />} /> */}

        {/* Add more routes as needed */}
      </Routes>
    </>
  );
}

export default App;
