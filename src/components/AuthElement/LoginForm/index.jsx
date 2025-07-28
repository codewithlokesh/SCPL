import { useFormik } from "formik";
import PropTypes from "prop-types";
import { Form, FormGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button } from "../../../components/SuperAdmin";
import frontendRouteMap from "../../../routes/Frontend/frontendRouteMap";
import validation from "./validation";
import "./index.css";

export default function LoginForm({ onSubmit = () => { }, isSubmitting }) {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: validation,
    onSubmit,
  });

  return (
    <>
      <div className="login-container">
        <div className="container">
          <div className="login-box">
            <h2>Welcome Back!</h2>
            <div className="login-form">
              <form onSubmit={formik.handleSubmit}>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email Address..."
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="error">{formik.errors.email}</div>
                )}
                
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="error">{formik.errors.password}</div>
                )}
                
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="remember"
                    name="rememberMe"
                    checked={formik.values.rememberMe}
                    onChange={formik.handleChange}
                  />
                  <label htmlFor="remember">Remember Me</label>
                </div>
                
                <button 
                  type="submit" 
                  className="login-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </form>
              
              <hr />
              <button className="google-btn">
                <i className="fab fa-google"></i> Login with Google
              </button>
              <button className="facebook-btn">
                <i className="fab fa-facebook-f"></i> Login with Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
};
