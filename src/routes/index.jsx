import {
    SuperAdminLayout,
} from "../layouts";
import { superAdminRoutes } from "./SuperAdmin";
// import { universityAdminRoutes } from "./UniversityAdmin";

export const routes = () => {
    return [
        {
            element: <SuperAdminLayout />,
            children: [...superAdminRoutes()],
        },
        //   {
        //     element: <StudentPortalLayout />,
        //     children: [...studentPortalRoutes()],
        //   },
        {
            path: "*",
            element: <div>Page not found</div>,
        },
    ];
};
export const routesList = () => {
    // Retrieve the routes from user and admin sections
    const [superAdminRoutesConfig] = [superAdminRoutes()];
    // const [universityAdminRoutesConfig] = [universityAdminRoutes()];

    // Concatenate the children arrays from both user and admin routes
    const routeArr = [
        ...superAdminRoutesConfig[0].children,
        // ...superAdminRoutesConfig[1].children,
        // ...universityAdminRoutesConfig[0].children,
        // ...universityAdminRoutesConfig[1].children,
    ];
    return [...routeArr];
};
export const moduleRoutesList = () => {
    let routeArr = {
        superAdmin: [...superAdminRoutes()[0].children],
        // universityAdmin: [
        //     ...universityAdminRoutes()[0].children,
        //     ...universityAdminRoutes()[1].children,
        // ],
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