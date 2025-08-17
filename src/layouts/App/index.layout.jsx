import PropTypes from "prop-types";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { generatePath, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { baseRoutes } from "../../helpers/baseRoutes";
import { getUserAuthData } from "../../redux/AuthSlice/index.slice";
import { getCompletePathList } from "../../routes";
// import coachPortalRouteMap from "../../routes/CoachPortal/coachPortalRouteMap";
// import studentPortalRouteMap from "../../routes/StudentPortal/studentPortalRouteMap";
import superAdminRouteMap from "../../routes/SuperAdmin/superAdminRouteMap";
// import universityAdminRouteMap from "../../routes/UniversityAdmin/universityAdminRouteMap";
import authDriver from "../../utils/auth.util";
import logger from "../../utils/logger";
import employeeRouteMap from "../../routes/Employee/employeeRouteMap";

/**
 * Functional component representing the main application layout.
 * Manages user authentication, redirects, and renders children components.
 * @param {Object} setRedirectPath - Function to set the redirection path.
 * @param {ReactNode} children - The components to be rendered within the layout.
 */
function AppLayout({ setRedirectPath, children }) {
  const location = useLocation(); 
  const params = useParams();
  const userData = useSelector(getUserAuthData);
  /**
   * Function to generate a path based on the provided data and parameters.
   * @param {string} data - The path template.
   * @returns {string} - The generated path.
   */

  function getGeneratedPath(data) {
    try {
      return generatePath(data, params);
    } catch (error) {
      logger(error);
      return data;
    }
  }

  // Find the active route based on the current browser path
  const activeRoute = getCompletePathList().find((e) => {
    const routePath = getGeneratedPath(e.key);
    const browserPath = location.pathname;
    return routePath === browserPath;
  });
//   const activeRoute = getCompletePathList().find((e) =>
//   matchPath({ path: e.key, end: true }, location.pathname)
// );
  const roleRedirectMap = {
    Admin: superAdminRouteMap.DASHBOARD.path,
    SubAdmin: superAdminRouteMap.DASHBOARD.path,
    Employee: employeeRouteMap.DASHBOARD.path,
    // University: universityAdminRouteMap.DASHBOARD.path,
    // Student: studentPortalRouteMap.MYENROLLMENTS.path,
    // Coach: coachPortalRouteMap.DASHBOARD.path,
  };
  // const activeRoute = getCompletePathList().find(e => e.key === location.pathname);
  // const activeRoute = getCompletePathList().find(e => e.key.search(location.pathname.replace(/[0-9]/g, '')) >=0)
  const isPrivate = activeRoute?.private;
  const isValid = authDriver(activeRoute, userData, location.pathname);
  
  const superAdminBase = baseRoutes.superAdminBaseRoutes; // e.g. "/superadmin"
  const employeeBase = baseRoutes.employeeBaseRoutes;     // e.g. "/employee"

  const isInSuperAdminArea =
    typeof superAdminBase === "string" &&
    location.pathname.startsWith(superAdminBase);

  const isInEmployeeArea =
    typeof employeeBase === "string" &&
    location.pathname.startsWith(employeeBase);

  const superAdminDashboard = `${superAdminRouteMap.DASHBOARD.path}`;
  const employeeDashboard = `${employeeRouteMap.DASHBOARD.path}`;

  /**
   * Function to check the validity of the user and redirect accordingly.
   */
  function checkValid() {
    const currentRole = userData?.role; // expects "superadmin" or "employee"

    if (currentRole === "superadmin" && isInEmployeeArea) {
      toast.info("You do not have access to Employee pages.");
      setRedirectPath(superAdminDashboard);
      return;
    }
    if (currentRole === "employee" && isInSuperAdminArea) {
      toast.info("You do not have access to Super Admin pages.");
      setRedirectPath(employeeDashboard);
      return;
    }

    if (!isValid) {
      let publicPath = "/login";
      let privatePath = "";
      let path = "";

      let checkData =
        Array.isArray(userData?.UserRoles) && userData.UserRoles.length > 0
          ? userData.UserRoles[0].Role?.name
          : path;

      if (
        ["Admin", "SubAdmin", "University", "Student", "Coach"].includes(
          checkData
        )
      ) {
        privatePath = `${roleRedirectMap[checkData]}`;
        publicPath = `${baseRoutes.frontendBaseRoutes}/login`;
      } else {
        privatePath = "/login";
      }

      if (isPrivate === true) {
        /** ******* If route type is private but not*****************
         * ******* able to prove their identity as valid entity*****
         * ********* so redirect it to public route******** */
        toast.warning("Your Token is expired. Please login again.");
        setRedirectPath(publicPath);
        // return false;
      } else if (isPrivate === false) {
        /** ******* If route type is public but not*****************
         * ******* able to prove their identity as valid entity*****
         * ********* so redirect it to private route******** */
        setRedirectPath(privatePath);
      }
    } else {
      // setRedirectPath(location.pathname);
    }
  }

  useEffect(() => {
    checkValid();
  }, [location.pathname, userData?.role]);

  // Render children components only if the user is valid
  // return <>{isValid && children}</>;
  return <>{true && children}</>;
}

export default AppLayout;
AppLayout.propTypes = {
  setRedirectPath: PropTypes.func.isRequired,
  children: PropTypes.node,
};
