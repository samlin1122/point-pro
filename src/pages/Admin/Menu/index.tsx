// Libs
import { FC } from "react";
// Components
import MenuContainer from "~/features/admin/menu";
import withMainLayout from "~/hoc/create-main-layout";

interface IAdminMenuProps {}

const MenuPage: FC<IAdminMenuProps> = (props) => {
  return <MenuContainer {...props} />;
};

export default withMainLayout(MenuPage);
