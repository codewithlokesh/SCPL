import { Outlet, useNavigate } from "react-router-dom";
import AppLayout from "../App/index.layout";
import { useEffect, useState } from "react";
import EmployeeSidebar from "../../components/Employee/Sidebar";
import EmployeeNavbar from "../../components/Employee/Navbar";
import withAuth from "../SuperAdmin/withAuth";
import "./private.layout.css";

function SuperAdminPrivateLayout() {
  const navigate = useNavigate();
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
            <div className="nk-main" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              {/* Fixed Sidebar */}
              <EmployeeSidebar />
              
              {/* Top Navbar - Fixed position */}
              <EmployeeNavbar />
              
              {/* Main Content Area */}
              <div className="nk-wrap">
                <div className="nk-content" style={{ flex: 1, marginTop: '60px' }}>
                  <div className="container-fluid">
                    <div className="nk-content-inner">
                      <div className="nk-content-body">
                        <Outlet />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </AppLayout>
    </>
  );
}

// Export the component wrapped with authentication
export default withAuth(SuperAdminPrivateLayout);
