// routes/RoleAwareIndex.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { getUserAuthData } from "../redux/AuthSlice/index.slice";
import { baseRoutes } from "../helpers/baseRoutes";
import superAdminRouteMap from "../routes/SuperAdmin/superAdminRouteMap";
import employeeRouteMap from "../routes/Employee/employeeRouteMap";

export default function RoleAwareIndex() {
  const user = useSelector(getUserAuthData);
  const location = useLocation();

  // If we were sent to login from a protected route, go back there post-login
  const from = location.state?.from?.pathname;
  if (user && from) return <Navigate to={from} replace />;

  // No user? Go to login
  if (!user || !user.role) return <Navigate to="/login" replace />;

  // Decide default dashboard by role
  const role = String(user.role).toLowerCase();
  if (role === "superadmin") {
    return <Navigate to={superAdminRouteMap.DASHBOARD.path} replace />;
  }
  if (role === "employee") {
    return <Navigate to={employeeRouteMap.DASHBOARD.path} replace />;
  }

  // Fallback
  return <Navigate to="/login" replace />;
}
