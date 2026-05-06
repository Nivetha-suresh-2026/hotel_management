import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PATHS } from "./paths";

import Login from "../pages/auth/Login";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import OwnerDashboard from "../pages/dashboard/OwnerDashboard";
import BookingForm from "../pages/bookings/BookingForm";
import { 
  RoomCreation, 
  BranchCreation,
  StaffCreation, 
  DepartmentManagement, 
  GuestDetails, 
  StaffDetails,
  AdminHub,
  CreationHub
} from "../pages/admin/AdminManagementPages";

import { 
  RevenueAnalytics, 
  HotelPerformance, 
  ActivityLogs, 
  Alerts, 
  Reviews 
} from "../pages/owner/OwnerPortalPages";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.ADMIN_HOME} element={<AdminHub />} />
        <Route path={PATHS.ADMIN_DASHBOARD} element={<AdminDashboard />} />
        <Route path={PATHS.ADMIN_CREATION} element={<CreationHub />} />
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
        <Route path={PATHS.BOOKING} element={<BookingForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;