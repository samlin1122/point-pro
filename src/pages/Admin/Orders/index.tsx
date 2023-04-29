// Libs
// Components
import React from "react"
import OrderContainer from "~/features/admin/orders"
import withMainLayout from "~/hoc/create-main-layout"
// Styles

interface IAdminOrderProps {}

const OrdersPage: React.FC<IAdminOrderProps> = (props) => {
  return <OrderContainer {...props} />
}

export default withMainLayout(OrdersPage)
