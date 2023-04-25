// Libs
// Components
import React from "react"
import MenuContainer from "~/features/admin"
import withMainLayout from "~/hoc/create-main-layout"
// Styles

interface IAdminMenuProps {}

const Menu: React.FC<IAdminMenuProps> = (props) => {
  return <MenuContainer {...props} />
}

export default withMainLayout(Menu)
