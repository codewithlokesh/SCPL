
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../../components/AuthElement";
// import { AuthPage } from "../../../components/SuperAdmin";

function GlobalLogin() {
  const navigate = useNavigate();
  const handleLogin = async (values) => {
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
