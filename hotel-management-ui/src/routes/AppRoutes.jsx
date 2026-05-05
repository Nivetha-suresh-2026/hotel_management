import { BrowserRouter, Routes, Route } from "react-router-dom";

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
  StaffDetails 
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
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/rooms" element={<RoomCreation />} />
        <Route path="/admin/branches" element={<BranchCreation />} />
        <Route path="/admin/staff" element={<StaffCreation />} />
        <Route path="/admin/departments" element={<DepartmentManagement />} />
        <Route path="/admin/guests" element={<GuestDetails />} />
        <Route path="/admin/staff-details" element={<StaffDetails />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/owner/revenue" element={<RevenueAnalytics />} />
        <Route path="/owner/performance" element={<HotelPerformance />} />
        <Route path="/owner/activity" element={<ActivityLogs />} />
        <Route path="/owner/alerts" element={<Alerts />} />
        <Route path="/owner/reviews" element={<Reviews />} />
        <Route path="/booking" element={<BookingForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;