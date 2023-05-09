// Libs
import { FC } from "react";
// Components
import LoginContainer from "~/features/admin/login";

interface LoginProps {}

const LoginPage: FC<LoginProps> = (props) => {
  return <LoginContainer {...props} />;
};

export default LoginPage;
