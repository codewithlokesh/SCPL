import React from "react";
//SuperAdminexport const SuperAdminLayout = React.lazy(() => import("./SuperAdmin/index.layout"));
export const SuperAdminPublicLayout = React.lazy(() => import("./SuperAdmin/public.layout"));
export const SuperAdminPrivateLayout = React.lazy(() => import("./SuperAdmin/private.layout"));
export const SuperAdminLayout = React.lazy(() => import("./SuperAdmin/index.layout"));