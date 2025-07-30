import { Outlet, useNavigate } from "react-router-dom";
// import {
//   SuperAdminFooter,
//   SuperAdminHeader,
//   SuperAdminSideBar,
// } from "../../components/SuperAdmin";
// import { moduleRoutesList } from "../../routes";
import AppLayout from "../App/index.layout";
// import { GlobalHeader } from "../../pages";
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/SuperAdmin/Sidebar";
function SuperAdminPrivateLayout() {
  const navigate = useNavigate();
  // const routeList = moduleRoutesList();
  const [redirectpath, setRedirectPath] = useState("");

  useEffect(() => {
    if (redirectpath) {
      navigate(redirectpath);
    }
  }, [redirectpath]);

  return (
    <>
      <AppLayout setRedirectPath={setRedirectPath}>
        <main className="nk-body bg-lighter npc-default has-sidebar" style={{ minHeight: '100vh' }}>
          <div className="nk-app-root">
            <div className="nk-main" style={{ display: 'flex', minHeight: '100vh' }}>
              <AdminSidebar />
              <div className="nk-wrap" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* <SuperAdminHeader /> */}
                {/* <GlobalHeader /> */}
                <div className="nk-content" style={{ flex: 1 }}>
                  <div className="container-fluid">
                    <div className="nk-content-inner">
                      <div className="nk-content-body">
                        <Outlet />
                      </div>
                    </div>
                  </div>
                </div>
                {/* <SuperAdminFooter /> */}
              </div>
            </div>
          </div>
        </main>
      </AppLayout>
    </>
  );
}

export default SuperAdminPrivateLayout;
