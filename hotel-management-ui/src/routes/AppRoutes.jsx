import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PATHS } from "./paths";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import OwnerDashboard from "../pages/dashboard/OwnerDashboard";
import BookingForm from "../pages/bookings/BookingForm";
import { BranchCreation } from "../pages/admin/BranchCreation";
import { RoomCreation } from "../pages/admin/RoomCreation";
import { StaffCreation } from "../pages/admin/StaffCreation";
import { DepartmentManagement } from "../pages/admin/DepartmentManagement";
import { GuestDetails } from "../pages/admin/GuestDetails";
import { StaffDetails } from "../pages/admin/StaffDetails";


import {
  Alerts,
  Reviews,
  RevenueAnalytics
} from "../pages/owner/OwnerPortalPages";
import { UserManagement } from "../pages/owner/UserManagement";
import HotelPerformance from "../pages/owner/HotelPerformance";
import ActivityLogs from "../pages/owner/ActivityLogs";
import { 
  StaffDashboard, 
  StaffProfile, 
  StaffTasks, 
  StaffLeave 
} from "../pages/staff/StaffPortalPages";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children, allowedRole }) {
  const { session, role, loading } = useAuth();
  
  if (loading) return null; // Let AuthContext handle its own spinner

  if (!session) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    // Redirect to their own dashboard if they have the wrong role
    if (role === 'admin') return <Navigate to={PATHS.ADMIN_DASHBOARD} replace />;
    if (role === 'owner') return <Navigate to={PATHS.OWNER_DASHBOARD} replace />;
    if (role === 'staff') return <Navigate to={PATHS.STAFF_DASHBOARD} replace />;
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.SIGNUP} element={<Signup />} />
        <Route path="/admin" element={<Navigate to={PATHS.ADMIN_DASHBOARD} replace />} />
        <Route path={PATHS.ADMIN_DASHBOARD} element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path={PATHS.ADMIN_ROOMS} element={<ProtectedRoute allowedRole="admin"><RoomCreation /></ProtectedRoute>} />
        <Route path={PATHS.ADMIN_BRANCHES} element={<ProtectedRoute allowedRole="admin"><BranchCreation /></ProtectedRoute>} />
        <Route path={PATHS.ADMIN_STAFF} element={<ProtectedRoute allowedRole="admin"><StaffCreation /></ProtectedRoute>} />
        <Route path={PATHS.ADMIN_DEPARTMENTS} element={<ProtectedRoute allowedRole="admin"><DepartmentManagement /></ProtectedRoute>} />
        <Route path={PATHS.ADMIN_GUESTS} element={<ProtectedRoute allowedRole="admin"><GuestDetails /></ProtectedRoute>} />
        <Route path={PATHS.ADMIN_STAFF_DETAILS} element={<ProtectedRoute allowedRole="admin"><StaffDetails /></ProtectedRoute>} />
        
        <Route path={PATHS.OWNER_DASHBOARD} element={<ProtectedRoute allowedRole="owner"><OwnerDashboard /></ProtectedRoute>} />
        <Route path={PATHS.OWNER_REVENUE} element={<ProtectedRoute allowedRole="owner"><RevenueAnalytics /></ProtectedRoute>} />
        <Route path={PATHS.OWNER_PERFORMANCE} element={<ProtectedRoute allowedRole="owner"><HotelPerformance /></ProtectedRoute>} />
        <Route path={PATHS.OWNER_ACTIVITY} element={<ProtectedRoute allowedRole="owner"><ActivityLogs /></ProtectedRoute>} />
        <Route path={PATHS.OWNER_ALERTS} element={<ProtectedRoute allowedRole="owner"><Alerts /></ProtectedRoute>} />
        <Route path={PATHS.OWNER_REVIEWS} element={<ProtectedRoute allowedRole="owner"><Reviews /></ProtectedRoute>} />
        <Route path={PATHS.OWNER_USERS} element={<ProtectedRoute allowedRole="owner"><UserManagement /></ProtectedRoute>} />
        
        <Route path={PATHS.BOOKING} element={<BookingForm />} />

        {/* Staff Routes */}
        <Route path={PATHS.STAFF_DASHBOARD} element={<ProtectedRoute allowedRole="staff"><StaffDashboard /></ProtectedRoute>} />
        <Route path={PATHS.STAFF_PROFILE} element={<ProtectedRoute allowedRole="staff"><StaffProfile /></ProtectedRoute>} />
        <Route path={PATHS.STAFF_TASKS} element={<ProtectedRoute allowedRole="staff"><StaffTasks /></ProtectedRoute>} />
        <Route path={PATHS.STAFF_LEAVE} element={<ProtectedRoute allowedRole="staff"><StaffLeave /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;