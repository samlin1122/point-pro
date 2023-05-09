import { FC, useEffect } from "react";
import { CartList, MealList, MenuTabs } from "./index.style";

import { useAppDispatch } from "~/app/hook";
import { getMenu, getOrders } from "~/features/orders/slice";
import GridBase, { GridItemBase } from "~/components/grid";

interface IMenuContainerPros {}

export const MenuContainer: FC<IMenuContainerPros> = ({}) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getMenu());
    dispatch(getOrders());
  }, []);

  return (
    <GridBase columns="12" sx={{ height: "calc(100vh - 88px)" }}>
      <GridItemBase column="8" sx={{ position: "relative" }}>
        <MenuTabs />
        <MealList />
      </GridItemBase>
      <GridItemBase column="4" sx={{ borderLeft: "1px solid", borderColor: "common.black_40", position: "relative" }}>
        <CartList />
      </GridItemBase>
    </GridBase>
  );
};

export default MenuContainer;
