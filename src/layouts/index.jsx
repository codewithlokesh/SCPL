import React from "react";
//SuperAdminexport const SuperAdminLayout = React.lazy(() => import("./SuperAdmin/index.layout"));
export const SuperAdminPublicLayout = React.lazy(() => import("./SuperAdmin/public.layout"));
export const SuperAdminPrivateLayout = React.lazy(() => import("./SuperAdmin/private.layout"));
export const SuperAdminLayout = React.lazy(() => import("./SuperAdmin/index.layout"));

// Employee
export const EmployeePublicLayout = React.lazy(() => import("./Employee/Public.layout"));
export const EmployeePrivateLayout = React.lazy(() => import("./Employee/private.layout"));
export const EmployeeLayout = React.lazy(() => import("./Employee/index.layout"));
