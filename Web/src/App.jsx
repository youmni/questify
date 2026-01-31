import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import PrivateRoute from "./components/PrivateRoute";
import AccountActivation from "./pages/auth/AccountActivation";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ForgotPasswordConfirm from "./pages/auth/ForgotPasswordConfirm";
import Logout from "./pages/auth/Logout";

// Example protected components
import Dashboard from "./pages/Dashboard";  // You'll create this
import AdminPanel from "./pages/AdminPanel";  // You'll create this

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/activate" element={<AccountActivation />} />
          <Route path="/auth/password-reset" element={<ForgotPassword />} />
          <Route path="/auth/password-reset/confirm" element={<ForgotPasswordConfirm />} />
          <Route path="/auth/logout" element={<Logout />} />

          {/* Protected Routes - Any authenticated user */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Protected Routes - Admin only */}
          <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;