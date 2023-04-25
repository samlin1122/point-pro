// Libs
// Components
import React from "react"
import OrderContainer from "~/features/admin"
import withMainLayout from "~/hoc/create-main-layout"
// Styles

interface IAdminOrderProps {}

const Orders: React.FC<IAdminOrderProps> = (props) => {
  return <OrderContainer {...props} />
}

export default withMainLayout(Orders)
