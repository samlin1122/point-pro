import { FC, useEffect, useRef } from "react";
import { CartList, MealList, MenuTabs, MealDrawer } from "./index.style";

import { useAppDispatch } from "~/app/hook";
import { getMenu } from "~/features/orders/slice";
import { Grid } from "@mui/material";
import theme from "~/theme";
import { getOrders } from "~/app/slices/order";

interface IMenuContainerPros {}

export const MenuContainer: FC<IMenuContainerPros> = ({}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getMenu());
  }, []);

  return (
    <Grid container sx={{ height: "calc(100vh - 88px)" }}>
      <Grid item xs={8} sx={{ overflow: "hidden" }}>
        <MenuTabs />
        <MealList />
        <MealDrawer />
      </Grid>
      <Grid item xs={4} sx={{ borderLeft: `1px solid ${theme.palette.common.black_40}` }}>
        <CartList />
      </Grid>
    </Grid>
  );
};

export default MenuContainer;
