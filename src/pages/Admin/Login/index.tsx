// Libs
// Components
import LoginContainer from "~/features/admin/login"
import withMainLayout from "~/hoc/create-main-layout"
// Styles

interface LoginProps {}

const LoginPage: React.FC<LoginProps> = (props) => {
  return <LoginContainer {...props} />
}

export default withMainLayout(LoginPage)
