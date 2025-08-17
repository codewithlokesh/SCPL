import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserAuthData } from '../../redux/AuthSlice/index.slice';
import { baseRoutes } from '../../helpers/baseRoutes';

// HOC for private routes - redirects to login if no user data
const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const userData = useSelector(getUserAuthData);
    const navigate = useNavigate();

    useEffect(() => {
      // Check if user has userData
      if (!userData || Object.keys(userData).length === 0) {
        // Redirect to login page if no user data
        navigate('/login');
      }
    }, [userData, navigate]);

    // If no user data, don't render the component
    if (!userData || Object.keys(userData).length === 0) {
      return null; // or a loading spinner
    }

    // If user has data, render the wrapped component
    return <WrappedComponent {...props} />;
  };
};

// HOC for public routes (like login) - redirects to dashboard if user already has data
const withPublicAuth = (WrappedComponent) => {
  return function PublicAuthenticatedComponent(props) {
    const userData = useSelector(getUserAuthData);
    const navigate = useNavigate();

    useEffect(() => {
      // Check if user already has userData
      if (userData && Object.keys(userData).length > 0) {

        if(userData.role === "superadmin"){
          // Redirect to dashboard if user already has data
          navigate(`${baseRoutes.superAdminBaseRoutes}/dashboard`);
        }else if(userData.role === "employee"){
          // Redirect to dashboard if user already has data
          navigate(`${baseRoutes.employeeBaseRoutes}/dashboard`);
        }
      }
    }, [userData, navigate]);

    // If user has data, don't render the component (will redirect)
    if (userData && Object.keys(userData).length > 0) {
      return null; // or a loading spinner
    }

    // If no user data, render the wrapped component (login page)
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
export { withPublicAuth }; 