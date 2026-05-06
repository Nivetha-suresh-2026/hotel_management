import { PATHS } from "./paths";

export const ADMIN_HUB_MODULES = [
  { 
    title: "Administration", 
    description: "Manage bookings and front-desk operations.", 
    icon: "📋", 
    path: PATHS.ADMIN_DASHBOARD, 
    color: "#6366f1" 
  },
  { 
    title: "Accounts", 
    description: "Track revenue, expenses and payments.", 
    icon: "💳", 
    path: PATHS.OWNER_REVENUE, 
    color: "#3b82f6" 
  },
  { 
    title: "Creation", 
    description: "System configuration and setup center.", 
    icon: "🛠️", 
    path: PATHS.ADMIN_CREATION, 
    color: "#8b5cf6" 
  },
  { 
    title: "Guest Details", 
    description: "Comprehensive guest database and history.", 
    icon: "👥", 
    path: PATHS.ADMIN_GUESTS, 
    color: "#10b981" 
  },
  { 
    title: "Staff Details", 
    description: "Employee records and directory.", 
    icon: "🏢", 
    path: PATHS.ADMIN_STAFF_DETAILS, 
    color: "#f59e0b" 
  },
  { 
    title: "Staff Enrollment", 
    description: "Onboard new team members.", 
    icon: "📝", 
    path: PATHS.ADMIN_STAFF, 
    color: "#f43f5e" 
  }
];

export const CREATION_HUB_MODULES = [
  { 
    title: "Branch Creation", 
    description: "Register new hotel branches and locations.", 
    icon: "📍", 
    path: PATHS.ADMIN_BRANCHES, 
    color: "#6366f1" 
  },
  { 
    title: "Room Setup", 
    description: "Configure rooms, types, and amenities.", 
    icon: "🏨", 
    path: PATHS.ADMIN_ROOMS, 
    color: "#8b5cf6" 
  },
  { 
    title: "Department", 
    description: "Manage organizational departments.", 
    icon: "🏢", 
    path: PATHS.ADMIN_DEPARTMENTS, 
    color: "#06b6d4" 
  },
  { 
    title: "Staff Enrollment", 
    description: "Onboard new staff members and assign roles.", 
    icon: "📝", 
    path: PATHS.ADMIN_STAFF, 
    color: "#f59e0b" 
  }
];
