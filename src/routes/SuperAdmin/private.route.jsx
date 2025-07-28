// import {
//   AdminProfile,
// } from "../../pages";

import superAdminRouteMap from "./superAdminRouteMap";

export default function route() {
  return [
    {
      path: superAdminRouteMap.PROFILE.path,
      key: superAdminRouteMap.PROFILE.path,
      name: "Admin Profile",
      private: true,
      element: <span>1111111111</span>,
      // element: <AdminProfile />,
    },
  ];
}
