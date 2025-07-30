import superAdminRouteMap from "./superAdminRouteMap";
import { AdminDashboard } from "../../pages/SuperAdmin";

export default function route() {
  return [
    {
      path: superAdminRouteMap.DASHBOARD.path,
      key: superAdminRouteMap.DASHBOARD.path,
      name: "Admin Profile",
      private: true,
      element: <AdminDashboard />,
    },
  ];
}
