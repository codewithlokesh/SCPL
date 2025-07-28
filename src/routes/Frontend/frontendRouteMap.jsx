import { baseRoutes } from "../../helpers/baseRoutes";

const frontendRouteMap = {  
  USERHOME: { path: `${baseRoutes.frontendBaseRoutes}`},
  GLOBAL_LOGIN : { path: `${baseRoutes.frontendBaseRoutes}/login`},
  GLOBAL_FORGOT : { path: `${baseRoutes.frontendBaseRoutes}/forgot-password`},
  GLOBAL_RESET : { path: `${baseRoutes.frontendBaseRoutes}/reset-password`}
};
export default frontendRouteMap;