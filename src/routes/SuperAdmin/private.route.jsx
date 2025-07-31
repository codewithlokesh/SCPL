import superAdminRouteMap from "./superAdminRouteMap";
import { AdminDashboard, AdminMasters } from "../../pages/SuperAdmin";

export default function route() {
  return [
    {
      path: superAdminRouteMap.DASHBOARD.path,
      key: superAdminRouteMap.DASHBOARD.path,
      name: "Admin Profile",
      private: true,
      element: <AdminDashboard />,
    },
    {
      path: superAdminRouteMap.MASTERS.path,
      key: superAdminRouteMap.MASTERS.path,
      name: "Masters",
      private: true,
      element: <AdminMasters />,
    },
  ];
}
