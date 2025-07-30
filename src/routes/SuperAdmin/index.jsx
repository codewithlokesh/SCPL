import { SuperAdminPrivateLayout, SuperAdminPublicLayout } from "../../layouts";
import publicRoutes from "./public.route";
import privateRoutes from "./private.route";
export const superAdminRoutes = () => {
  return [
    {
      element: <SuperAdminPublicLayout />,
      children: [...publicRoutes()],
    },
    {
      element: <SuperAdminPrivateLayout />,
      children: [...privateRoutes()],
    },
  ];
};
