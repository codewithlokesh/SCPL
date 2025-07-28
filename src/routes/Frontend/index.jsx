import { FrontendPrivateLayout, FrontendPublicLayout } from "../../layouts";
import publicRoutes from "./public.route";
import privateRoutes from "./private.route";

export const frontendRoutes = () => {
  return [
    {
      element: <FrontendPublicLayout />,
      children: [...publicRoutes()],
    },
    {
      element: <FrontendPrivateLayout />,
      children: [...privateRoutes()],
    },
  ];
};
