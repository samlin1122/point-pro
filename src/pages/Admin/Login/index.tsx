// Libs
// Components
import LoginContainer from "~/features/admin/login";
// Styles

interface LoginProps {}

const LoginPage: React.FC<LoginProps> = (props) => {
  return <LoginContainer {...props} />;
};

export default LoginPage;
