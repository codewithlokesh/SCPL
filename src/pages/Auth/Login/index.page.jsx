import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../../components/AuthElement";
import { updateUserAuthdataLogin } from "../../../redux/AuthSlice/index.slice";
import { baseRoutes } from "../../../helpers/baseRoutes";
// import { AuthPage } from "../../../components/SuperAdmin";

function GlobalLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async (values) => {
    if (values.username === "scpl" && values.password === "scpl@2025") {
      const userData = {
        username: values?.username,
        password: values?.password,
      };
      dispatch(updateUserAuthdataLogin(userData));
      navigate(`${baseRoutes.superAdminBaseRoutes}/dashboard`);
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <>
      {/* <AuthPage
        titleText="Sign In to your Edulitic Account "
        paraText="Enter your credentials to access your account"
      > */}
        <LoginForm onSubmit={handleLogin} />
      {/* </AuthPage> */}
    </>
  );
}

export default GlobalLogin;
