// Lib
import { useEffect, useState } from "react";
import { Box, Chip, List, ListItem, ListItemText, Tab, Tabs, Typography, tabsClasses } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// Components
import { TabPanel } from "~/components/tabs";
import { Column, Row } from "~/components/layout";
import GridBase, { GridItemBase } from "~/components/grid";
import { ButtonBase, ButtonIcon, CloseButton } from "~/components/buttons";
import { TabletModal } from "~/components/modals";
// Others
import { useAppDispatch, useAppSelector } from "~/app/hook";
import {
  closeDialog,
  createCartItem,
  decreaseMealAmount,
  deleteCartItem,
  increaseMealAmount,
  openDialog,
  setCurrentCategory,
  setNotModifiedCartItem,
  updateCartItem,
  updateSpecialty,
  viewCartItemCustomized
} from "~/features/orders/slice";
import { InputNumber } from "~/features/orders/index.styles";
import theme from "~/theme";
import { CartItem, Meal, DialogType, Specialty, SpecialtyItem } from "~/features/orders/type";
import { calculateCartPrice } from "~/utils/price.utils";

export const MenuTabs = () => {
  const dispatch = useAppDispatch();

  const categories = useAppSelector(({ takeOrder }) => takeOrder.categories);
  const currentCategory = useAppSelector(({ takeOrder }) => takeOrder.currentCategory);

  const handleClickCategory = (categoryId: string) => {
    dispatch(setCurrentCategory(categoryId));
    dispatch(closeDialog());
  };

  return (
    <Tabs
      variant="scrollable"
      value={currentCategory}
      onChange={(_, value) => handleClickCategory(value)}
      sx={{
        position: "sticky",
        top: "0",
        zIndex: "2",
        backgroundColor: theme.palette.background.paper,
        [`& .${tabsClasses.scrollButtons}.Mui-disabled`]: {
          opacity: 0.2
        }
      }}
    >
      {categories.map(({ id, title }) => (
        <Tab key={id} value={id} label={title} sx={{ fontSize: theme.typography.body1.fontSize }} />
      ))}
    </Tabs>
  );
};

type MealItemProps = {
  meal: Meal;
};
const MealItem = (props: MealItemProps) => {
  const dispatch = useAppDispatch();

  const { meal } = props;

  const isModifiedCartItem = useAppSelector(({ takeOrder }) => takeOrder.isModifiedCartItem);
  const customized = useAppSelector(({ takeOrder }) => takeOrder.customized);
  const isSelected = meal.id === customized?.id && !isModifiedCartItem;

  const handleSelectedMeal = () => {
    dispatch(openDialog({ type: DialogType.CUSTOMIZED, data: { ...meal, amount: 1, specialties: [] } }));
    dispatch(setNotModifiedCartItem());
  };

  return (
    <Box
      key={meal.id}
      sx={{
        backgroundColor: isSelected ? "primary.main" : "transparent",
        boxShadow: "rgba(0, 0, 0, 0.5) 0px 1px 4px"
      }}
      onClick={handleSelectedMeal}
    >
      <Typography
        fontWeight={600}
        textAlign="center"
        sx={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", padding: ".3rem" }}
      >
        {meal.title}
      </Typography>
      <Box height="6rem" sx={{ bgcolor: theme.palette.common.black, textAlign: "center" }}>
        <Box
          component="img"
          src={meal.coverUrl.split(".jpeg")[0] + "b" + ".jpeg"}
          alt={meal.title}
          sx={{ objectFit: "fill", height: "100%", maxWidth: "100%" }}
        />
      </Box>
      <Typography textAlign="center">{meal.price}元</Typography>
      <Row justifyContent="space-between" alignItems="center"></Row>
    </Box>
  );
};

export const MealDrawer = () => {
  const dispatch = useAppDispatch();

  const meals = useAppSelector(({ takeOrder }) => takeOrder.meals);
  const customized = useAppSelector(({ takeOrder }) => takeOrder.customized);
  const isModifiedCartItem = useAppSelector(({ takeOrder }) => takeOrder.isModifiedCartItem);

  const customizedSpecialties = meals?.find((meal) => meal.id === customized?.id)?.specialties ?? [];

  const items = customized?.specialties?.reduce((acc, cur) => acc.concat(cur.items), [] as SpecialtyItem[]);

  const handleClickItem = (selectedSpecialty: Specialty, selectedItem: SpecialtyItem) => () => {
    dispatch(updateSpecialty({ selectedSpecialty, selectedItem }));
  };

  const handleAdd = () => {
    dispatch(increaseMealAmount());
  };

  const handleMinus = () => {
    dispatch(decreaseMealAmount());
  };

  const handleUpdateCartItem = () => {
    dispatch(updateCartItem());
    dispatch(closeDialog());
  };

  const handleAddToCart = () => {
    dispatch(createCartItem());
  };

  const handleClose = () => {
    dispatch(closeDialog());
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        transition: "transform 0.3s",
        transform: customized ? "translateY(0)" : "translateY(100%)",
        width: "66.6vw"
      }}
    >
      <Box
        bgcolor="white"
        sx={{
          borderTop: `1px solid ${theme.palette.common.black_40}`,
          position: "relative",
          padding: ".5rem"
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 900, color: "common.black" }}>
          {customized?.title}
        </Typography>
        <CloseButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            padding: ".5rem",
            minWidth: 0
          }}
        />
        <Box>
          {customizedSpecialties.length
            ? customizedSpecialties.map((specialty) => (
                <Box key={specialty.id}>
                  <Typography
                    variant="h6"
                    key={specialty.id}
                    sx={{ fontWeight: 900, padding: "1rem 0 1rem", color: theme.palette.common.black_80 }}
                  >
                    {specialty.title}
                  </Typography>
                  <Box
                    sx={{
                      padding: 0,
                      margin: 0,
                      width: "100%",
                      display: "grid",
                      gridTemplateColumns: "repeat(6, 1fr)",
                      gap: ".5rem"
                    }}
                  >
                    {specialty.items.map((item) => (
                      <Chip
                        key={item.id}
                        label={item.title}
                        color="primary"
                        variant={items?.find(({ id }) => id === item.id) ? "filled" : "outlined"}
                        icon={
                          <DoneIcon
                            sx={{
                              display: items?.find(({ id }) => id === item.id) ? "block" : "none",
                              fontSize: theme.typography.body1.fontSize
                            }}
                          />
                        }
                        onClick={handleClickItem(specialty, item)}
                        sx={{
                          color: theme.palette.common.black,
                          fontSize: theme.typography.body1.fontSize,
                          "&:hover": {
                            bgcolor: theme.palette.primary.main
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              ))
            : null}
        </Box>
        {customized && (
          <Box sx={{ marginTop: "1rem", display: "flex", justifyContent: "end" }}>
            <InputNumber value={customized.amount} onAdd={handleAdd} onMinus={handleMinus} />
            <ButtonBase
              sx={{
                backgroundColor: "common.black",
                color: "white",
                padding: ".5rem 1rem",
                marginLeft: "1.5rem",
                "&:hover": {
                  backgroundColor: "common.black_80",
                  color: "common.black_20"
                }
              }}
              onClick={isModifiedCartItem ? handleUpdateCartItem : handleAddToCart}
              startIcon={isModifiedCartItem ? <DoneIcon /> : <ShoppingCartIcon />}
            >
              <Typography variant="body1" fontWeight={700}>
                {isModifiedCartItem ? "確認修改" : "加入購物車"}
              </Typography>
            </ButtonBase>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export const MealList = () => {
  const menu = useAppSelector(({ takeOrder }) => takeOrder.menu);
  const currentCategory = useAppSelector(({ takeOrder }) => takeOrder.currentCategory);

  return (
    <>
      <Box
        sx={{
          p: 2,
          overflowY: "scroll",
          height: "calc(100vh - 88px - 4rem)"
        }}
      >
        {menu.map(
          (category) =>
            category.id === currentCategory && (
              <TabPanel
                key={category.id}
                value={category.position}
                index={category.position}
                sx={{ paddingBottom: "26rem" }}
              >
                <GridBase columns="5" gap="1rem">
                  {category.meals.length > 0 &&
                    category.meals.map((meal) => (
                      <GridItemBase
                        sx={{
                          cursor: "pointer"
                        }}
                        key={meal.id}
                      >
                        <MealItem meal={meal} />
                      </GridItemBase>
                    ))}
                </GridBase>
              </TabPanel>
            )
        )}
      </Box>
    </>
  );
};

type CartMealProps = {
  idx: number;
  cartItem: CartItem;
};
const CartMeal = ({ idx, cartItem }: CartMealProps) => {
  const dispatch = useAppDispatch();

  const { title, amount, specialties, price } = cartItem;

  const specialtiesPrice = specialties.reduce(
    (acc, specialty) => (acc += specialty.items.reduce((acc, specialtyItem) => (acc += specialtyItem.price), 0)),
    0
  );
  const totalPrice = (price + specialtiesPrice) * amount;

  const handleEditCartItem = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    dispatch(viewCartItemCustomized({ cartItem, idx }));
  };

  const handleDeleteCartItem = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(deleteCartItem(idx));
  };

  return (
    <Column
      sx={{
        flex: 1,
        padding: ".2rem .5rem",
        gap: ".2rem",
        borderBottom: `1px solid ${theme.palette.common.black_20}`,
        boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
        cursor: "pointer"
      }}
      onClick={handleEditCartItem}
    >
      <Row>
        <Typography variant="h6" fontWeight={700} mb={0.5}>
          {title} x {amount}
        </Typography>
        <ButtonIcon sx={{ marginLeft: "auto" }} size="large" color="inherit" onClick={handleDeleteCartItem}>
          <DeleteIcon />
        </ButtonIcon>
      </Row>
      <Row sx={{ gap: "0.5rem" }} alignItems="flex-start">
        <Column>
          <List dense={true} sx={{ padding: 0, margin: 0 }}>
            {specialties.map((specialty) => (
              <ListItem key={specialty.id} sx={{ padding: 0, margin: 0 }}>
                <ListItemText
                  secondary={specialty.items.map((item) => (
                    <Typography
                      component="span"
                      variant="body1"
                      key={item.id}
                      lineHeight={1.2}
                      sx={{ marginRight: "0.5rem" }}
                    >
                      {item.title}
                    </Typography>
                  ))}
                />
              </ListItem>
            ))}
          </List>
        </Column>
      </Row>
      <Box sx={{ width: "100%", textAlign: "right" }}>
        <Typography variant="body1" sx={{ fontWeight: 900 }}>
          {`${price}${specialtiesPrice ? `(+${specialtiesPrice})` : ""} x ${amount} = ${totalPrice}元`}
        </Typography>
      </Box>
    </Column>
  );
};

export const CartList = () => {
  const dispatch = useAppDispatch();
  const meals = useAppSelector(({ takeOrder }) => takeOrder.meals);
  const cart = useAppSelector(({ takeOrder }) => takeOrder.cart);
  const hasCartItems = cart.length > 0;
  const [openClearCartConfirmModal, setOpenClearCartConfirmModal] = useState(false);
  const [openSubmitOrderConfirmModal, setOpenSubmitOrderConfirmModal] = useState(false);

  const handleSubmitOrders = () => {
    setOpenSubmitOrderConfirmModal(true);
  };

  const totalPrice = calculateCartPrice(cart);

  useEffect(() => {
    cart.forEach((cartItem, idx) => {
      const meal = meals.find((meal) => meal.id === cartItem.id);
      if (!meal) {
        dispatch(deleteCartItem(idx));
      }
    });
  }, [cart, meals]);

  // [TODO] cart item remove reminder

  return (
    <>
      <Column bgcolor="background.paper" height="100%">
        {hasCartItems ? (
          <>
            <Row justifyContent="space-between" sx={{ padding: "0.5rem" }}>
              <Typography variant="h5" fontWeight={900}>
                已點項目
              </Typography>
              <Box>
                <ButtonBase
                  size={"small"}
                  color="inherit"
                  disableRipple
                  onClick={() => setOpenClearCartConfirmModal(true)}
                >
                  <Typography
                    component="span"
                    variant="body1"
                    color="common.black"
                    sx={{ textDecorationLine: "underline", textUnderlineOffset: "0.25rem" }}
                  >
                    清空購物車
                  </Typography>
                </ButtonBase>
              </Box>
            </Row>
            {/* 購物車項目 */}
            <List
              sx={{
                overflowY: "scroll",
                flexGrow: 1,
                height: `calc(100vh - 88px - 16rem)`,
                padding: ".5rem"
              }}
            >
              {cart.map((cartItem, idx) => (
                <ListItem key={`${cartItem.title}-${idx}`} sx={{ padding: 0, margin: ".5rem 0" }}>
                  <CartMeal idx={idx} cartItem={cartItem} />
                </ListItem>
              ))}
            </List>
            <Box sx={{ borderTop: `1px dashed ${theme.palette.common.black_40}` }} bgcolor={"background.paper"}>
              <Column sx={{ padding: "0.75rem 1.5rem", gap: "0.75rem" }}>
                <Row justifyContent={"space-between"} alignItems={"flex-end"}>
                  <Typography variant="body1" fontWeight={700}>
                    數量
                  </Typography>
                  <Typography variant="h6" fontWeight={900}>
                    {cart.reduce((acc, cur) => (acc += cur.amount), 0)}
                  </Typography>
                </Row>
                <Row justifyContent="space-between" alignItems="flex-end">
                  <Typography variant="body1" fontWeight={700}>
                    小計
                  </Typography>
                  <Typography variant="h6" fontWeight={900}>
                    {totalPrice}元
                  </Typography>
                </Row>
              </Column>
              <ButtonBase
                sx={{ width: "100%", padding: "1rem", borderRadius: 0, boxShadow: "none" }}
                variant="contained"
                onClick={handleSubmitOrders}
                color="primary"
              >
                <Typography variant="h6" fontWeight={900} textAlign="center">
                  送出訂單
                </Typography>
              </ButtonBase>
            </Box>
          </>
        ) : (
          <Typography
            variant="h5"
            fontWeight={900}
            align="center"
            p={3}
            sx={{ margin: "auto" }}
            color={theme.palette.common.black_40}
          >
            無項目
          </Typography>
        )}
      </Column>
      <TabletModal.ClearCartConfirm open={openClearCartConfirmModal} setOpen={setOpenClearCartConfirmModal} />
      <TabletModal.SubmitOrderConfirm open={openSubmitOrderConfirmModal} setOpen={setOpenSubmitOrderConfirmModal} />
    </>
  );
};
