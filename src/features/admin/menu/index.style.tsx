import { FC, Fragment, SyntheticEvent, useCallback, useEffect, useRef, useState } from "react";
import { Box, Divider, Grid, List, ListItem, ListItemButton, ListItemText, Typography, styled } from "@mui/material";

import TabsBase from "~/components/tabs";
import { Column, Row } from "~/components/layout";
import GridBase, { GridItemBase } from "~/components/grid";
import { ButtonBase, ButtonIcon } from "~/components/buttons";

import { useAppDispatch, useAppSelector } from "~/app/hook";
import usePrevious from "~/hooks/usePrevious";

import {
  decreaseCartItemAmount,
  deleteCartItem,
  increaseCartItemAmount,
  openCustomizeDialog,
  setCurrentCategory,
  viewCartItemCustomized
} from "~/features/orders/slice";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

import { ICartItem, IMeal } from "~/types";
import { InputNumber } from "~/features/orders/index.styles";
import theme from "~/theme";

export const MenuTabs: FC = () => {
  const dispatch = useAppDispatch();

  const categories = useAppSelector(({ customerOrder }) => customerOrder.categories);
  const currentCategory = useAppSelector(({ customerOrder }) => customerOrder.currentCategory);

  const handleClickCategory = (categoryId: string) => {
    dispatch(setCurrentCategory(categoryId));
  };

  console.log("categories", categories);
  console.log("currentCategory", currentCategory);

  return (
    <TabsBase
      sx={{ position: "sticky", top: "0", zIndex: "10", backgroundColor: theme.palette.background.paper }}
      tabs={categories}
      value={currentCategory}
      onChange={(_, value) => handleClickCategory(value)}
    />
  );
};

const MealCard: FC<IMeal> = ({ id, title, price, coverUrl }) => (
  <Column key={id} py="0.75rem" width={"100%"} height={"100%"} sx={{ gap: "0.75rem" }}>
    <Box component={"img"} width={"100%"} height={"100%"} src={coverUrl} alt={title} sx={{ objectFit: "cover" }} />
    <Row justifyContent={"space-between"} alignItems={"center"}>
      <Typography component="h3" variant="h6" fontWeight={900}>
        {title}
      </Typography>
      <Typography component="h3" variant="h6">
        {price}
      </Typography>
    </Row>
  </Column>
);

interface IMealsProps {}

export const MealList: FC<IMealsProps> = () => {
  const dispatch = useAppDispatch();

  const combinedMenu = useAppSelector(({ customerOrder }) => customerOrder.combinedMenu);
  const currentCategory = useAppSelector(({ customerOrder }) => customerOrder.currentCategory);
  const cart = useAppSelector(({ customerOrder }) => customerOrder.cart);

  const getItemAmountInCart = useCallback(
    (mealId: string) => cart.reduce((acc, cur) => (cur.id === mealId ? acc + cur.amount : acc), 0),
    [cart]
  );

  const handleSelectedMeal = (currentMealId: string) => () => {
    dispatch(openCustomizeDialog(currentMealId));
  };

  console.log("combinedMenu", combinedMenu);
  console.log("currentCategory", currentCategory);

  return (
    <Box sx={{ padding: "1.5rem", overflowY: "scroll", height: "calc(100vh - 88px - 55px)" }}>
      <GridBase columns="3" gap="1.5rem">
        {combinedMenu.map((category) =>
          category.id === currentCategory.toString() ? (
            <Fragment key={category.id}>
              {category.allMeals.length > 0 &&
                category.allMeals.map((meal, idx) => (
                  <GridItemBase sx={{ zIndex: 0 }} key={category.id}>
                    <Box
                      key={meal.id}
                      sx={{ listStyle: "none", padding: "0", margin: "0" }}
                      onClick={handleSelectedMeal(meal.id)}
                    >
                      <MealCard {...meal} />
                    </Box>
                  </GridItemBase>
                ))}
            </Fragment>
          ) : null
        )}
      </GridBase>
    </Box>
  );
};

const CartTitle = styled(Row)`
  padding: 1.5rem 1.5rem 0.75rem 1.5rem;
`;

const StyledCartItem = styled(Column)(({ theme }) => ({
  flex: 1,
  justifyContent: "space-between",
  padding: "0.75rem 1.5rem",
  gap: "0.75rem",
  borderBottom: `1px solid ${theme.palette.common.black_20}`
}));

interface ICartItemProps {
  title: string;
  price: number;
  coverUrl: string;
  handleDeleteCartItem: (idx: number) => (e: SyntheticEvent<Element, Event>) => void;
  handleAdd: (idx: number) => void;
  handleMinus: (idx: number) => void;
}

const CartItem: FC<ICartItemProps> = ({ title, price, coverUrl, handleDeleteCartItem, handleAdd, handleMinus }) => {
  return (
    <>
      <StyledCartItem>
        <Row justifyContent={"flex-start"} align={"flex-start"} sx={{ gap: "0.75rem" }}>
          <Box
            component="img"
            height={64}
            width={64}
            src={`https://picsum.photos/200/300?random=${coverUrl}`}
            alt={title}
            sx={{ objectFit: "cover" }}
          />
          <Column justifyContent={"flex-start"} alignItems={"flex-start"}>
            <Typography component="h3" variant="body1" fontWeight={700} mb={0.5}>
              {title}
            </Typography>
            <List dense={true} sx={{ padding: 0 }}>
              <ListItem sx={{ padding: 0 }}>
                <ListItemText primary="冰塊" secondary="正常" sx={{ margin: 0 }} />
              </ListItem>
            </List>
          </Column>
          <ButtonIcon sx={{ marginLeft: "auto" }} size="large" color="inherit">
            <DeleteIcon onClick={handleDeleteCartItem(0)} sx={{ height: "100%" }} />
          </ButtonIcon>
        </Row>
        <Row
          justifyContent={"space-between"}
          alignItems={"center"}
          sx={{
            width: "100%"
          }}
        >
          <InputNumber value={1} onAdd={() => handleAdd(0)} onMinus={() => handleMinus(0)} />
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {price}
          </Typography>
        </Row>
      </StyledCartItem>
    </>
  );
};

export const CartList: FC = () => {
  const dispatch = useAppDispatch();

  const currentDialog = useAppSelector(({ customerOrder }) => customerOrder.currentDialog);
  const cart = useAppSelector(({ customerOrder }) => customerOrder.cart);

  const totalAmount = cart.reduce((acc, cur) => (acc += cur.amount * cur.price), 0);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    if (headerRef.current && footerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
      setFooterHeight(footerRef.current.offsetHeight);
    }
  }, []);

  const handleCustomized = (cartItem: ICartItem, idx: number) => () => {
    dispatch(viewCartItemCustomized({ cartItem, idx }));
  };

  const handleDeleteCartItem = (idx: number) => (e: SyntheticEvent<Element, Event>) => {
    e.stopPropagation();
    dispatch(deleteCartItem(idx));
  };

  const handleAdd = (idx: number) => {
    dispatch(increaseCartItemAmount(idx));
  };

  const handleMinus = (idx: number) => {
    dispatch(decreaseCartItemAmount(idx));
  };

  const handleSubmitOrders = () => {
    console.log("handleSubmitOrders");
  };

  return (
    <Column bgcolor={"background.paper"}>
      <CartTitle justifyContent={"space-between"} alignItems={"flex-end"} ref={headerRef}>
        <Typography component="h2" variant="h3" fontWeight={900}>
          已點項目
        </Typography>
        <Box>
          <ButtonBase size={"small"} color="inherit">
            <Typography
              component="span"
              variant="body1"
              color="common.black"
              sx={{ textDecorationLine: "underline", textUnderlineOffset: "0.25rem" }}
            >
              清空訂單
            </Typography>
          </ButtonBase>
        </Box>
      </CartTitle>
      <List sx={{ padding: 0, overflowY: "scroll", height: `calc(100vh - ${headerHeight + footerHeight}px)` }}>
        {[1, 2, 3, 4].map((idx) => (
          <ListItem key={idx} sx={{ padding: 0 }}>
            <CartItem
              title={`商品-${idx}`}
              price={100}
              coverUrl={`${idx}`}
              handleDeleteCartItem={handleDeleteCartItem}
              handleAdd={handleAdd}
              handleMinus={handleMinus}
            />
          </ListItem>
        ))}
      </List>
      <Box
        ref={footerRef}
        sx={{ position: "sticky", bottom: 0, borderTop: `1px dashed ${theme.palette.common.black_40}` }}
        bgcolor={"background.paper"}
      >
        <Column sx={{ padding: "0.75rem 1.5rem", gap: "0.75rem" }}>
          <Row justifyContent={"space-between"} alignItems={"flex-end"}>
            <Typography component="h3" variant="body1" fontWeight={700}>
              數量
            </Typography>
            <Typography component="h3" variant="h6" fontWeight={900}>
              {cart.length}
            </Typography>
          </Row>
          <Row justifyContent={"space-between"} alignItems={"flex-end"}>
            <Typography component="h3" variant="body1" fontWeight={700}>
              小記
            </Typography>
            <Typography component="h3" variant="h6" fontWeight={900}>
              {cart.reduce((acc, cur) => (acc += cur.amount * cur.price), 0)}
            </Typography>
          </Row>
        </Column>
        <ButtonBase
          sx={{ width: "100%", padding: "1.5rem 2rem", borderRadius: 0, boxShadow: "none" }}
          variant="contained"
          onClick={handleSubmitOrders}
          color="primary"
        >
          <Typography component="h3" variant="h6" fontWeight={900} textAlign={"center"}>
            結帳
          </Typography>
        </ButtonBase>
      </Box>
    </Column>
  );
};
