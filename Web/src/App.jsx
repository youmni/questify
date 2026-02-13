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
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import MuseumsAdmin from "./pages/admin/MuseumsAdmin";
import RoutesAdmin from "./pages/admin/RoutesAdmin";
import PaintingsAdmin from "./pages/admin/PaintingsAdmin";
import RouteStopsAdmin from "./pages/admin/RouteStopsAdmin";
import StartPage from "./pages/StartPage";
import MuseumsList from "./pages/MuseumsList";
import RouteDetail from "./pages/RouteDetail";
import StopScan from "./pages/StopScan";

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

          {/* Protected quest routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<MuseumsList />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quest" element={<StartPage />} />
            <Route
              path="/quest/museums/:museumId/routes/:routeId/start"
              element={<StartPage />}
            />
            <Route
              path="/quest/museums/:museumId/routes/:routeId/stops/:stopNumber"
              element={<StopScan />}
            />
            <Route path="/quest/museums" element={<MuseumsList />} />
            <Route
              path="/quest/museums/:museumId/routes/:routeId"
              element={<RouteDetail />}
            />
            <Route
              path="/quest/museums/:museumId/routes/:routeId/stops/:stopNumber"
              element={<StopScan />}
            />
          </Route>

          {/* Protected Routes - Admin only */}
          <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/museums" element={<MuseumsAdmin />} />
            <Route path="/admin/routes" element={<RoutesAdmin />} />
            <Route path="/admin/paintings" element={<PaintingsAdmin />} />
            <Route path="/admin/route-stops" element={<RouteStopsAdmin />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;