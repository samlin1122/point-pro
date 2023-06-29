// Libs
import { Fragment, SyntheticEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  BottomNavigation,
  BottomNavigationAction,
  BottomNavigationActionProps,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  Tab,
  Tabs,
  ToggleButton,
  Typography,
  styled,
  tabsClasses
} from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import CartIcon from "@mui/icons-material/ShoppingCart";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
// Others
import { formatFullDateWithTime } from "~/utils/dayjs.util";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { openDialog, setCurrentCategory, viewCartItemCustomized, openModal } from "./slice";
import { CartItem, DialogType, Meal } from "./type";
import usePrevious from "~/hooks/usePrevious";
import { OrderStatus, MobileModal } from "~/types/common";

export const Header = () => {
  const { pathname } = useLocation();

  return (
    <>
      <Breadcrumbs separator=">" sx={{ userSelect: "none" }}>
        <Link href="/" underline="hover" color="inherit">
          首頁
        </Link>
        <Typography fontWeight={500} color="common.black">
          {pathname === "/orders" ? "我要點餐" : "我要預約"}
        </Typography>
      </Breadcrumbs>
      <Typography
        variant="h1"
        fontWeight={900}
        sx={{
          padding: ".5rem 0 1rem",
          position: "sticky",
          top: 0,
          zIndex: 2,
          bgcolor: "background.paper",
          userSelect: "none"
        }}
      >
        港都熱炒
      </Typography>
    </>
  );
};

export const SeatInfo = () => {
  const userInfo = useAppSelector(({ takeOrder }) => takeOrder.userInfo);

  return (
    <>
      {userInfo && (
        <Box sx={{ padding: "0 0 1rem", userSelect: "none" }}>
          <Typography variant="h3" fontWeight={900} sx={{ paddingBottom: "1rem" }}>
            內用資訊
          </Typography>
          <Grid
            container
            sx={{
              padding: "1rem 0",
              borderRadius: "5px",
              bgcolor: "common.black_20",
              color: "common.black_60"
            }}
          >
            <Grid item xs={6} sx={{ padding: "0 1rem" }}>
              <Box sx={{ color: "common.black_60", fontWeight: 500 }}>座位</Box>
              <Box sx={{ fontSize: "h5.fontSize", fontWeight: 900, color: "common.black" }}>{userInfo.seatNo}</Box>
            </Grid>
            <Grid item xs={6} sx={{ padding: "0 1rem", borderLeft: "1px solid", borderColor: "common.black_40" }}>
              <Box sx={{ color: "common.black_60", fontWeight: 500 }}>入座時間</Box>
              <Box sx={{ fontSize: "h5.fontSize", fontWeight: 900, color: "common.black" }}>
                {formatFullDateWithTime(userInfo.startTime)}
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export const StyledTab = styled(Tab)(({ theme }) => ({
  backgroundColor: theme.palette.common.black_20,
  borderRadius: "5rem",
  margin: ".2rem",
  fontSize: "1rem",
  minHeight: "auto",
  minWidth: "auto",
  "&:focus": {
    outline: "none"
  },
  "&.Mui-selected[aria-selected='true']": {
    color: theme.palette.common.black,
    backgroundColor: theme.palette.primary.main
  }
}));

export const CategoryNavbar = () => {
  const dispatch = useAppDispatch();

  const [isShowDropdown, setIsShowDropdown] = useState(false);

  const categories = useAppSelector(({ takeOrder }) => takeOrder.categories);
  const currentCategory = useAppSelector(({ takeOrder }) => takeOrder.currentCategory);

  const handleClickCategory = (categoryId: string) => {
    setIsShowDropdown(false);
    dispatch(setCurrentCategory(categoryId));
  };

  const handleToggleCategoryDropdown = () => {
    setIsShowDropdown((prev: boolean) => !prev);
  };

  return (
    <>
      <Typography variant="h3" sx={{ fontWeight: 900, paddingBottom: "1rem", userSelect: "none" }}>
        菜單
      </Typography>
      <Box
        sx={{
          position: "sticky",
          top: "4.5rem",
          zIndex: 2,
          bgcolor: "background.paper",
          transform: "translateY(10%)", // sticky jumping when scroll in mobile
          userSelect: "none"
        }}
        id="category-tabs"
      >
        <Box sx={{ display: "flex" }}>
          {/* 菜單類別 */}
          <Tabs
            value={currentCategory}
            onChange={(_, value) => handleClickCategory(value)}
            variant="scrollable"
            sx={{
              [`& .${tabsClasses.scrollButtons}`]: {
                display: "none"
              },
              "& .MuiTabs-indicator": {
                display: "none"
              },
              marginBottom: "10px"
            }}
          >
            {categories.map(({ id, title }) => (
              <StyledTab key={id} value={id} label={title} />
            ))}
          </Tabs>
          {/* 下拉菜單按鈕 */}
          <ToggleButton
            value="check"
            size="small"
            selected={isShowDropdown}
            onChange={handleToggleCategoryDropdown}
            sx={{
              "&.MuiToggleButton-root[value='check']": { outline: "none", border: "none", bgcolor: "transparent" }
            }}
          >
            <ExpandMoreIcon
              sx={{
                rotate: isShowDropdown ? "180deg" : "0deg",
                transition: ".3s"
              }}
            />
          </ToggleButton>
        </Box>
        {/* 下拉式菜單 */}
        <Box
          sx={{
            display: isShowDropdown ? "block" : "none",
            maxHeight: "60vh",
            border: "1px solid",
            borderColor: "common.black_40",
            position: "absolute",
            overflowY: "auto",
            zIndex: 2,
            bgcolor: "common.white",
            width: "100%"
          }}
        >
          <List>
            {categories.map(({ id, title }) => (
              <Fragment key={id}>
                <ListItemButton onClick={() => handleClickCategory(id)} sx={{ padding: "1rem" }}>
                  {title}
                </ListItemButton>
                <Divider light />
              </Fragment>
            ))}
          </List>
        </Box>
      </Box>
    </>
  );
};

export const Meals = () => {
  const dispatch = useAppDispatch();

  const userInfo = useAppSelector(({ takeOrder }) => takeOrder.userInfo);
  const menu = useAppSelector(({ takeOrder }) => takeOrder.menu);
  const currentCategory = useAppSelector(({ takeOrder }) => takeOrder.currentCategory);
  const prevCategory = usePrevious(currentCategory);
  const showMenu = menu.find((category) => category.id === currentCategory);
  const cart = useAppSelector(({ takeOrder }) => takeOrder.cart);

  const getItemAmountInCart = useCallback(
    (mealId: string) => cart.reduce((acc, cur) => (cur.id === mealId ? acc + cur.amount : acc), 0),
    [cart]
  );

  const handleSelectedMeal = (meal: Meal) => () => {
    dispatch(openDialog({ type: DialogType.CUSTOMIZED, data: { ...meal, amount: 1, specialties: [] } }));
  };

  useEffect(() => {
    // Don't scroll when it's the first-mounted.
    if (prevCategory && currentCategory && prevCategory !== currentCategory) {
      window.scroll({ top: userInfo ? 252 : 0, behavior: "smooth" });
    }
  }, [prevCategory, currentCategory, userInfo]);

  return (
    <Box sx={{ padding: "0 .2rem 5rem", userSelect: "none" }}>
      <List sx={{ width: "100%", zIndex: 0, "& ul": { padding: 0 } }} subheader={<li />} id="meal-list">
        {showMenu &&
          showMenu.meals.map((meal, idx) => (
            <Box key={`${meal.id}-${idx}`}>
              <ListItem sx={{ padding: ".5rem" }}>
                <ListItemButton sx={{ padding: "0" }} onClick={handleSelectedMeal(meal)}>
                  <Grid container gap={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
                    <Grid item sx={{ position: "relative" }}>
                      <Box
                        component="img"
                        src={meal.coverUrl.split(".jpeg")[0] + "s" + ".jpeg"}
                        alt={`${meal.title}-img`}
                        sx={{ width: "5rem", verticalAlign: "middle" }}
                      />
                      {meal?.isPopular && (
                        <Box
                          sx={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bgcolor: "primary.main",
                            display: "flex",
                            padding: ".1rem"
                          }}
                        >
                          <ThumbUpIcon sx={{ width: "1rem", height: "1rem" }} />
                        </Box>
                      )}
                    </Grid>
                    <Grid item sx={{ flexGrow: 1 }}>
                      <Box sx={{ fontWeight: "700" }}>{meal.title}</Box>
                      <Box>{meal.price}元</Box>
                    </Grid>

                    {getItemAmountInCart(meal.id) > 0 && (
                      <Grid item>
                        <Box
                          sx={{
                            bgcolor: "common.black",
                            color: "common.white",
                            borderRadius: "50%",
                            width: "2rem",
                            height: "2rem",
                            textAlign: "center"
                          }}
                        >
                          {getItemAmountInCart(meal.id)}
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </ListItemButton>
              </ListItem>
              <Divider light />
            </Box>
          ))}
      </List>
    </Box>
  );
};

const StyledBottomNavigationAction = styled(BottomNavigationAction)<BottomNavigationActionProps & { amount?: number }>(
  ({ theme, amount }) => ({
    borderRadius: ".6rem",
    minWidth: "auto",
    padding: "0",
    gap: ".3rem",
    backgroundColor: theme.palette.common.black_20,
    "&:focus": { outline: "none" },
    "&.Mui-selected": { color: "#F0F0F0" },
    "&.MuiBottomNavigationAction-root::after": {
      content: `"${amount}"`,
      display: `${amount ? "flex" : "none"}`,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      top: 0,
      right: 0,
      width: "1.5rem",
      height: "1.5rem",
      fontSize: "small.fontSize",
      color: theme.palette.common.black,
      borderRadius: "0 .6rem 0 0",
      backgroundColor: theme.palette.primary.main
    }
  })
);

export const Footer = () => {
  const dispatch = useAppDispatch();

  const userInfo = useAppSelector(({ takeOrder }) => takeOrder.userInfo);
  const currentDialog = useAppSelector(({ takeOrder }) => takeOrder.currentDialog);
  const cart = useAppSelector(({ takeOrder }) => takeOrder.cart);
  const orders = useAppSelector(({ order }) => order.orders);

  const cartAmount = useMemo(() => cart.reduce((acc, item) => (acc += item.amount), 0), [cart]);
  const unPaidOrderAmount = useMemo(
    () => orders.filter(({ status }) => status === OrderStatus.UNPAID || status === OrderStatus.PENDING).length,
    [orders]
  );

  const handleClickFooter = (e: SyntheticEvent<Element, Event>, currentDialog: DialogType) => {
    if (currentDialog) dispatch(openDialog({ type: currentDialog }));
  };

  return (
    <>
      {userInfo && (
        <Box
          sx={{
            position: "fixed",
            bottom: ".5rem",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "5px",
            borderRadius: ".6rem",
            height: "4.5rem",
            display: "flex",
            width: "14rem",
            bgcolor: "common.white"
          }}
        >
          <BottomNavigation
            showLabels
            value={currentDialog}
            onChange={handleClickFooter}
            sx={{
              gap: "5px",
              height: "100%",
              width: "100%",
              bgcolor: "common.white",
              "& .Mui-selected": { bgcolor: "common.black" },
              "& .MuiSvgIcon-root": { fontSize: "body1.fontSize" }
            }}
          >
            <StyledBottomNavigationAction label="菜單" value="" icon={<RestaurantMenuIcon />} />
            <StyledBottomNavigationAction
              label="購物車"
              value={DialogType.CART}
              icon={<CartIcon />}
              amount={cartAmount}
            />
            <StyledBottomNavigationAction
              label="訂單"
              value={DialogType.ORDER}
              icon={<StickyNote2Icon />}
              amount={unPaidOrderAmount}
            />
          </BottomNavigation>
        </Box>
      )}
    </>
  );
};

type InputNumberProps = {
  value: number;
  onMinus: () => void;
  onAdd: () => void;
};
export const InputNumber = (props: InputNumberProps) => {
  const { value, onMinus, onAdd } = props;

  const handleStopPropagation = (e: SyntheticEvent<Element, Event>) => {
    e.stopPropagation();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid ",
        borderColor: "common.black_40",
        borderRadius: ".5rem",
        bgcolor: "common.white",
        userSelect: "none"
      }}
      onClick={handleStopPropagation}
    >
      <Button
        sx={{
          "&.MuiButtonBase-root": {
            bgcolor: "transparent",
            color: "common.black",
            outline: "none"
          }
        }}
        disableRipple
        onClick={() => onMinus()}
      >
        <RemoveIcon />
      </Button>
      <Typography variant="h6" fontWeight={900} sx={{ minWidth: "2rem", textAlign: "center" }}>
        {value}
      </Typography>
      <Button
        sx={{
          "&.MuiButtonBase-root": {
            bgcolor: "transparent",
            color: "common.black",
            outline: "none"
          }
        }}
        disableRipple
        onClick={() => onAdd()}
      >
        <AddIcon />
      </Button>
    </Box>
  );
};

type CartMealProps = {
  cartItem: CartItem;
  idx: number;
};
export const CartMeal = (props: CartMealProps) => {
  const dispatch = useAppDispatch();

  const { cartItem, idx } = props;

  const { id, title, coverUrl, specialties, price, amount } = cartItem;

  const specialtiesPrice = useMemo(
    () =>
      specialties.reduce(
        (acc, specialty) => (acc += specialty.items.reduce((acc, specialtyItem) => (acc += specialtyItem.price), 0)),
        0
      ),
    [specialties]
  );
  const totalPrice = (price + specialtiesPrice) * amount;

  const handleCustomized = (cartItem: CartItem, idx: number) => () => {
    dispatch(viewCartItemCustomized({ cartItem, idx }));
  };

  const handleRemoveCartItem = (idx: number) => (e: SyntheticEvent<Element, Event>) => {
    e.stopPropagation();
    dispatch(openModal({ type: MobileModal.REMOVE_CART_CONFIRM, data: props }));
  };

  return (
    <Fragment key={`${id}-${idx}`}>
      <ListItemButton
        onClick={handleCustomized(cartItem, idx)}
        sx={{ padding: ".5rem", userSelect: "none" }}
        disableRipple
      >
        <Box sx={{ width: "100%" }}>
          <Grid container gap={1} sx={{ justifyContent: "space-between", marginBottom: "1rem" }}>
            <Grid item sx={{ position: "relative" }} xs={3}>
              <Box
                component="img"
                src={coverUrl}
                alt={`${title}-img`}
                sx={{ width: "5rem", verticalAlign: "middle" }}
              />
              {cartItem.isPopular && (
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bgcolor: "primary.main",
                    display: "flex",
                    padding: ".1rem"
                  }}
                >
                  <ThumbUpIcon sx={{ width: "1rem", height: "1rem" }} />
                </Box>
              )}
            </Grid>
            <Grid item xs={7}>
              <Typography fontWeight={700}>
                {title} x {amount}
              </Typography>
              {specialties.map((specialty, idx) => (
                <Box sx={{ color: "common.black_80", fontSize: "small.fontSize" }} key={`${specialty.id}-${idx}`}>
                  {specialty.type === "SINGLE"
                    ? specialty.items[0]?.title ?? ""
                    : specialty.items.map((i) => i.title).join("、")}
                </Box>
              ))}
            </Grid>
            <Grid item xs={1}>
              <DeleteIcon onClick={handleRemoveCartItem(idx)} />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              width: "100%"
            }}
          >
            <Typography variant="h6" fontWeight={900}>
              {`${price}${specialtiesPrice ? `(+${specialtiesPrice})` : ""} x ${amount} = ${totalPrice}元`}
            </Typography>
          </Box>
        </Box>
      </ListItemButton>
      <Divider light />
    </Fragment>
  );
};
