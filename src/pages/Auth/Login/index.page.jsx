import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../../components/AuthElement";
import { updateUserAuthdataLogin } from "../../../redux/AuthSlice/index.slice";
import { baseRoutes } from "../../../helpers/baseRoutes";
import { toast } from "react-toastify";
import { AuthServices } from "../../../services/Employee/Auth/index.service";

function GlobalLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    const { username, password } = values || {};

    try {
      // Super Admin (hardcoded)
      if (username === "scpl" && password === "scpl@2025") {
        const userData = { username, role: "superadmin" }; // don't store password
        dispatch(updateUserAuthdataLogin(userData));
        navigate(`${baseRoutes.superAdminBaseRoutes}/dashboard`);
        return;
      }else {
        const payload = { userId: username, password };
        const res = await AuthServices.Login(payload);

        if (res?.message === "Login successfully") {
          toast.success("Login successfully");
          const userData = { username: username, token:  res?.data, role: "employee" };
          dispatch(updateUserAuthdataLogin(userData));
          navigate(`${baseRoutes.employeeBaseRoutes}/dashboard`);
        } else {
          toast.error(res?.message || "Login failed");
        }
        return;
      }

      // Fallback for other creds
      toast.error("Invalid credentials");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong during login");
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}

export default GlobalLogin;
