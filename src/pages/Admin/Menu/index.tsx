// Libs
// Components
import React from "react"
import MenuContainer from "~/features/admin/menu"
import withMainLayout from "~/hoc/create-main-layout"
// Styles

interface IAdminMenuProps {}

const MenuPage: React.FC<IAdminMenuProps> = (props) => {
  return <MenuContainer {...props} />
}

export default withMainLayout(MenuPage)
