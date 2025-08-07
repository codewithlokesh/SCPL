import superAdminRouteMap from "./superAdminRouteMap";
import { AdminDashboard, AdminMasters, AdminCompany, AdminCompanyAdd, AdminCountry, AdminState, AdminCity } from "../../pages/SuperAdmin";

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
      {
        path: superAdminRouteMap.COUNTRY.path,
        key: superAdminRouteMap.COUNTRY.path,
        name: "Country",
        private: true,
        element: <AdminCountry />,
      },
      {
        path: superAdminRouteMap.STATE.path,
        key: superAdminRouteMap.STATE.path,
        name: "State",
        private: true,
        element: <AdminState />,
      },
      {
        path: superAdminRouteMap.CITY.path,
        key: superAdminRouteMap.CITY.path,
        name: "City",
        private: true,
        element: <AdminCity />,
      },

  ];
}
