import { GlobalLogin } from "../../../pages";
import frontendRouteMap from "../../../routes/Frontend/frontendRouteMap";

export default function route() {
  return [
    {
      path: frontendRouteMap.GLOBAL_LOGIN.path,
      key: frontendRouteMap.GLOBAL_LOGIN.path,
      name: "Login",
      private: false,
      // element: <span>22222222</span>,
      element: <GlobalLogin />,
    },
    {
      path: frontendRouteMap.USERHOME.path,
      key: frontendRouteMap.USERHOME.path,
      name: "Home",
      private: false,
      // element: <span>1111111</span>,
      element: <GlobalLogin />,
    },
  ];
}
