import { EmployeePrivateLayout, EmployeePublicLayout } from "../../layouts";
import publicRoutes from "./public.route";
import privateRoutes from "./private.route";
export const EmployeeRoutes = () => {
  return [
    {
      element: <EmployeePublicLayout />,
      children: [...publicRoutes()],
    },
    {
      element: <EmployeePrivateLayout />,
      children: [...privateRoutes()],
    },
  ];
};
