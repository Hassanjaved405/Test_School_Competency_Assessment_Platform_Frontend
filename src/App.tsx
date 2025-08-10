import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOTP from './pages/auth/VerifyOTP';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/assessment/Assessment';
import AssessmentStep from './pages/assessment/AssessmentStep';
import AssessmentResult from './pages/assessment/AssessmentResult';
import Results from './pages/assessment/Results';
import Certificates from './pages/Certificates';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import QuestionManagement from './pages/admin/QuestionManagement';
import Reports from './pages/admin/Reports';
import { UserRole } from './types';

const App: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={
                user?.role === UserRole.ADMIN ? <AdminDashboard /> : <Dashboard />
              } />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/assessment/step/:step" element={<AssessmentStep />} />
              <Route path="/assessment/result" element={<AssessmentResult />} />
              <Route path="/results" element={<Results />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/profile" element={<Profile />} />
              
              {user?.role === UserRole.ADMIN && (
                <>
                  <Route path="/admin/users" element={<UserManagement />} />
                  <Route path="/admin/questions" element={<QuestionManagement />} />
                  <Route path="/admin/reports" element={<Reports />} />
                </>
              )}
            </Route>
          </Route>

          <Route path="/" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          } />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default App;