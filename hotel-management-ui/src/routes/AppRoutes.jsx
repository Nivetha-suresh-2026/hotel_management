import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PATHS } from "./paths";

import Login from "../pages/auth/Login";
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


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path="/admin" element={<Navigate to={PATHS.ADMIN_DASHBOARD} replace />} />
        <Route path={PATHS.ADMIN_DASHBOARD} element={<AdminDashboard />} />

        <Route path={PATHS.ADMIN_ROOMS} element={<RoomCreation />} />
        <Route path={PATHS.ADMIN_BRANCHES} element={<BranchCreation />} />
        <Route path={PATHS.ADMIN_STAFF} element={<StaffCreation />} />
        <Route path={PATHS.ADMIN_DEPARTMENTS} element={<DepartmentManagement />} />
        <Route path={PATHS.ADMIN_GUESTS} element={<GuestDetails />} />
        <Route path={PATHS.ADMIN_STAFF_DETAILS} element={<StaffDetails />} />
        <Route path={PATHS.OWNER_DASHBOARD} element={<OwnerDashboard />} />
        <Route path={PATHS.OWNER_REVENUE} element={<RevenueAnalytics />} />
        <Route path={PATHS.OWNER_PERFORMANCE} element={<HotelPerformance />} />
        <Route path={PATHS.OWNER_ACTIVITY} element={<ActivityLogs />} />
        <Route path={PATHS.OWNER_ALERTS} element={<Alerts />} />
        <Route path={PATHS.OWNER_REVIEWS} element={<Reviews />} />
        <Route path={PATHS.OWNER_USERS} element={<UserManagement />} />
        <Route path={PATHS.BOOKING} element={<BookingForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;