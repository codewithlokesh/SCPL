import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
// import "../../assets/frontend/scss/main.scss";

function EmployeeLayout() {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  useEffect(() => {
    if (currentPath === "/") {
      navigate("/login");
    }
  }, []);
  return <Outlet />;
}

export default EmployeeLayout;
