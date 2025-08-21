import {
    EmployeeLayout,
    SuperAdminLayout,
} from "../layouts";
import { superAdminRoutes } from "./SuperAdmin";
import { EmployeeRoutes } from "./Employee";
import { Unknown } from "../components/Unknown";
import { Navigate } from "react-router-dom";
import RoleAwareIndex from "./RoleAwareIndex";
// import { universityAdminRoutes } from "./UniversityAdmin";

export const routes = () => {
    return [
        {
            path: "/",
            element: <RoleAwareIndex />,
        },
        {
            element: <SuperAdminLayout />,
            children: [...superAdminRoutes()],
        },
          {
            element: <EmployeeLayout />,
            children: [...EmployeeRoutes()],
          },
        {
            path: "*",
            element: <Unknown />,
        },
    ];
};
export const routesList = () => {
    const [superAdminRoutesConfig, employeeRoutesConfig] = [superAdminRoutes(), EmployeeRoutes()];
    const routeArr = [
        ...superAdminRoutesConfig[0].children,
        ...employeeRoutesConfig[0].children,
    ];
    return [...routeArr];
};
export const moduleRoutesList = () => {
    let routeArr = {
        superAdmin: [...superAdminRoutes()[0].children],
        employee: [...EmployeeRoutes()[0].children],
    };
    return routeArr;
};

export const getCompletePathList = () => {
    return routesList().reduce((prev, curr) => {
        prev.push(curr);
        if (curr.children) {
            prev.push(...curr.children);
        }
        return prev;
    }, []);
};