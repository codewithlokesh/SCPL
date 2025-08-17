import { baseRoutes } from "../../helpers/baseRoutes";

const employeeRouteMap = {
  // Dashboard
  DASHBOARD: { path: `${baseRoutes.employeeBaseRoutes}/dashboard`},
  RESETPASSWORD: { path: `${baseRoutes.employeeBaseRoutes}/reset-password`},
  EDITPROFILE: { path: `${baseRoutes.employeeBaseRoutes}/edit-profile`},
  LEAVEREQUEST: { path: `${baseRoutes.employeeBaseRoutes}/leave-request`},
};
export default employeeRouteMap;