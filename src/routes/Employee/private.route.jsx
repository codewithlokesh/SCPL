import employeeRouteMap from "./employeeRouteMap";
import {
  EmployeeDashboard,
  EmployeeEditProfile,
  EmployeeLeaveRequest,
  EmployeeResetPassword,
} from "../../pages/Employee";

export default function route() {
  return [
    {
      path: employeeRouteMap.DASHBOARD.path,
      key: employeeRouteMap.DASHBOARD.path,
      name: "Employee Profile",
      private: true,
      element: <EmployeeDashboard />,
    },
    {
      path: employeeRouteMap.RESETPASSWORD.path,
      key: employeeRouteMap.RESETPASSWORD.path,
      name: "Reset Password",
      private: true,
      element: <EmployeeResetPassword />,
    },
    {
      path: employeeRouteMap.EDITPROFILE.path,
      key: employeeRouteMap.EDITPROFILE.path,
      name: "Edit Profile",
      private: true,
      element: <EmployeeEditProfile />,
    },
    {
      path: employeeRouteMap.LEAVEREQUEST.path,
      key: employeeRouteMap.LEAVEREQUEST.path,
      name: "Leave Request",
      private: true,
      element: <EmployeeLeaveRequest />,
    },
  ];
}
