import superAdminRouteMap from "./superAdminRouteMap";
import { AdminDashboard, AdminMasters, AdminCompany, AdminCompanyAdd } from "../../pages/SuperAdmin";

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
      {
        path: superAdminRouteMap.COMPANY.path,
        key: superAdminRouteMap.COMPANY.path,
        name: "Company",
        private: true,
        element: <AdminCompany />,
      },
      {
        path: superAdminRouteMap.COMPANY_ADD.path,
        key: superAdminRouteMap.COMPANY_ADD.path,
        name: "Company Add",
        private: true,
        element: <AdminCompanyAdd />,
      },
  ];
}
