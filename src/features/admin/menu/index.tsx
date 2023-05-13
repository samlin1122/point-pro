import { FC, useEffect } from "react";
import { CartList, MealList, MenuTabs } from "./index.style";

import { useAppDispatch } from "~/app/hook";
import { getMenu, getOrders } from "~/features/orders/slice";
import { Grid } from "@mui/material";
import theme from "~/theme";

interface IMenuContainerPros {}

export const MenuContainer: FC<IMenuContainerPros> = ({}) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getMenu());
    dispatch(getOrders());
  }, []);

  return (
    <Grid container spacing={0} sx={{ height: "calc(100ch - 88px)" }}>
      <Grid item xs={8} sx={{ position: "relative" }}>
        <MenuTabs />
        <MealList />
      </Grid>
      <Grid item xs={4} sx={{ borderLeft: `1px solid ${theme.palette.common.black_40}`, position: "relative" }}>
        <CartList />
      </Grid>
    </Grid>
  );
};

export default MenuContainer;
