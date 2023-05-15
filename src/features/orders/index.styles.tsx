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
  Checkbox,
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
import MoneyIcon from "@mui/icons-material/Money";
import CreditCardIcon from "@mui/icons-material/CreditCard";
// Components
import { MobileDialogLayout } from "~/components/dialog";
import { ModalBase } from "~/components/modals";
import { CheckboxBase } from "~/components/checkbox";
// Others
import appDayjs from "~/utils/dayjs.util";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import {
  openDialog,
  closeDialog,
  openCustomizeDialog,
  closeCustomizeDialog,
  setCurrentCategory,
  updateSpecialty,
  increaseMealAmount,
  decreaseMealAmount,
  createCartItem,
  viewCartItemCustomized,
  deleteCartItem,
  updateCartItem,
  increaseCartItemAmount,
  decreaseCartItemAmount,
  openModal,
  closeModal
} from "./slice";
import usePrevious from "~/hooks/usePrevious";
import linePay from "~/assets/images/line-pay.png";
import { ICartItem, IOrder, IPaymentLog, ISpecialty, ISpecialtyOption } from "~/types";
import { CustomerOrderDialog, MobileModal, OrderStatus } from "~/types/common";

export const Header = () => {
  const { pathname } = useLocation();

  return (
    <>
      <Breadcrumbs separator=">">
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
          bgcolor: "background.paper"
        }}
      >
        港都熱炒
      </Typography>
    </>
  );
};

export const SeatInfo = () => {
  return (
    <>
      {true && (
        <Box sx={{ padding: "0 0 1rem" }}>
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
              <Box sx={{ fontSize: "h5.fontSize", fontWeight: 900, color: "common.black" }}>{"A03-1"}</Box>
            </Grid>
            <Grid item xs={6} sx={{ padding: "0 1rem", borderLeft: "1px solid", borderColor: "common.black_40" }}>
              <Box sx={{ color: "common.black_60", fontWeight: 500 }}>入座時間</Box>
              <Box sx={{ fontSize: "h5.fontSize", fontWeight: 900, color: "common.black" }}>{"17:30"}</Box>
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

  const categories = useAppSelector(({ customerOrder }) => customerOrder.categories);
  const currentCategory = useAppSelector(({ customerOrder }) => customerOrder.currentCategory);

  const handleClickCategory = (categoryId: string) => {
    setIsShowDropdown(false);
    dispatch(setCurrentCategory(categoryId));
  };

  const handleToggleCategoryDropdown = () => {
    setIsShowDropdown((prev: boolean) => !prev);
  };

  return (
    <>
      <Typography variant="h3" sx={{ fontWeight: 900, paddingBottom: "1rem" }}>
        菜單
      </Typography>
      <Box
        sx={{
          position: "sticky",
          top: "4.5rem",
          zIndex: 2,
          bgcolor: "background.paper",
          transform: "translateY(10%)" // sticky jumping when scroll in mobile
        }}
        id="category-tabs"
      >
        <Box sx={{ display: "flex" }}>
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
        <Box
          sx={{
            display: isShowDropdown ? "block" : "none",
            maxHeight: "60vh",
            border: "1px solid common.black_20",
            position: "absolute",
            overflowY: "scroll",
            zIndex: 2,
            bgcolor: "common.white",
            width: "100%"
          }}
        >
          <List>
            {categories.map((category) => (
              <Fragment key={category.id}>
                <ListItemButton onClick={() => handleClickCategory(category.id)} sx={{ padding: "1rem" }}>
                  {category.title}
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

const subHeaderHeight = 48;
const stickyTopOffset = 128;

export const Meals = () => {
  const dispatch = useAppDispatch();

  const combinedMenu = useAppSelector(({ customerOrder }) => customerOrder.combinedMenu);
  const currentCategory = useAppSelector(({ customerOrder }) => customerOrder.currentCategory);
  const cart = useAppSelector(({ customerOrder }) => customerOrder.cart);

  const prevCategory = usePrevious(currentCategory);
  const getItemAmountInCart = useCallback(
    (mealId: string) => cart.reduce((acc, cur) => (cur.id === mealId ? acc + cur.amount : acc), 0),
    [cart]
  );

  const handleSelectedMeal = (currentMealId: string) => () => {
    dispatch(openCustomizeDialog(currentMealId));
  };

  useEffect(() => {
    if (prevCategory && currentCategory) {
      const categoryDividerEl = document.getElementById(currentCategory) as HTMLHRElement;
      const categoryFirstElTop = categoryDividerEl.getBoundingClientRect().top;
      const scrollToTop = categoryFirstElTop - (stickyTopOffset + subHeaderHeight) + window.scrollY;
      window.scroll({ top: scrollToTop, behavior: "smooth" });
    }
  }, [currentCategory]);

  // [TODO]: scrolling change tab focus

  return (
    <Box sx={{ padding: "0 .2rem 5rem" }}>
      <List sx={{ width: "100%", zIndex: 0, "& ul": { padding: 0 } }} subheader={<li />} id="meal-list">
        {combinedMenu.map((category) => (
          <li key={category.id}>
            <ul>
              <ListSubheader sx={{ padding: ".5rem 0", color: "common.black", top: stickyTopOffset }}>
                <Typography variant="h6" fontWeight={900}>
                  {category.title}
                </Typography>
              </ListSubheader>
              <Divider light id={category.id} />
              {category.allMeals.map((meal, idx) => (
                <Box key={`${meal.id}-${idx}`}>
                  <ListItem sx={{ padding: ".5rem" }}>
                    <ListItemButton sx={{ padding: "0" }} onClick={handleSelectedMeal(meal.id)}>
                      <Grid container gap={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Grid item sx={{ position: "relative" }}>
                          <Box
                            component="img"
                            src={meal.coverUrl}
                            alt={`${meal.title}-img`}
                            sx={{ width: "5rem", verticalAlign: "middle" }}
                          />
                          {meal.recommended && (
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
                          <Box>${meal.price}</Box>
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
            </ul>
          </li>
        ))}
      </List>
    </Box>
  );
};

interface IStyledBottomNavigationActionProps extends BottomNavigationActionProps {
  amount?: number;
}
const StyledBottomNavigationAction = styled(BottomNavigationAction)<IStyledBottomNavigationActionProps>(
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

  const currentDialog = useAppSelector(({ customerOrder }) => customerOrder.currentDialog);
  const cart = useAppSelector(({ customerOrder }) => customerOrder.cart);
  const orders = useAppSelector(({ customerOrder }) => customerOrder.orders);

  const cartAmount = useMemo(() => cart.reduce((acc, item) => (acc += item.amount), 0), [cart]);
  const unPaidOrderAmount = useMemo(
    () => orders.filter(({ paymentLogs }) => paymentLogs[0].status === "UNPAID").length,
    [orders]
  );

  const handleClickFooter = (e: SyntheticEvent<Element, Event>, currentDialog: string) => {
    if (currentDialog) dispatch(openDialog(currentDialog));
  };

  return (
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
          value={CustomerOrderDialog.CART}
          icon={<CartIcon />}
          amount={cartAmount}
        />
        <StyledBottomNavigationAction
          label="訂單"
          value={CustomerOrderDialog.ORDER}
          icon={<StickyNote2Icon />}
          amount={unPaidOrderAmount}
        />
      </BottomNavigation>
    </Box>
  );
};

interface IInputNumberProps {
  value: number;
  onMinus: () => void;
  onAdd: () => void;
}
export const InputNumber = (props: IInputNumberProps) => {
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
        border: "1px solid common.black_20",
        borderRadius: ".5rem",
        bgcolor: "common.white"
      }}
      onClick={handleStopPropagation}
    >
      <Button
        sx={{
          "&.MuiButtonBase-root": {
            bgcolor: "transparent",
            color: "common.black",
            outline: "none",
            padding: ".5rem"
          }
        }}
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
            outline: "none",
            padding: ".5rem"
          }
        }}
        onClick={() => onAdd()}
      >
        <AddIcon />
      </Button>
    </Box>
  );
};

export const CustomizedDialog = () => {
  const dispatch = useAppDispatch();

  const meals = useAppSelector(({ customerOrder }) => customerOrder.meals);
  const currentDialog = useAppSelector(({ customerOrder }) => customerOrder.currentDialog);
  const currentMealId = useAppSelector(({ customerOrder }) => customerOrder.currentMealId);
  const currentMealAmount = useAppSelector(({ customerOrder }) => customerOrder.currentMealAmount);
  const currentSpecialty = useAppSelector(({ customerOrder }) => customerOrder.currentSpecialty);
  const isModifiedCartItem = useAppSelector(({ customerOrder }) => customerOrder.isModifiedCartItem);

  const currentMeal = meals.find((meal) => meal.id === currentMealId);
  const specialtyItems = currentSpecialty.reduce((acc, cur) => acc.concat(cur.items), [] as ISpecialtyOption[]);

  const handleClose = () => {
    dispatch(closeCustomizeDialog());
  };

  const handleClickItem = (selectedSpecialty: ISpecialty, selectedItem: ISpecialtyOption) => () => {
    dispatch(updateSpecialty({ selectedSpecialty, selectedItem }));
  };

  const handleAdd = () => {
    dispatch(increaseMealAmount());
  };

  const handleMinus = () => {
    dispatch(decreaseMealAmount());
  };

  const handleAddToCart = () => {
    dispatch(createCartItem());
  };

  const handleUpdateCartItem = () => {
    dispatch(updateCartItem());
  };

  return (
    <MobileDialogLayout
      title={currentMeal?.title}
      isOpen={currentDialog === CustomerOrderDialog.CUSTOMIZED}
      onCloseDialog={handleClose}
      actionButton={
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <InputNumber value={currentMealAmount} onAdd={handleAdd} onMinus={handleMinus} />
            <Typography variant="h5" fontWeight={900}>
              ${currentMealAmount * (currentMeal?.price ?? 0)}
            </Typography>
          </Box>
          {isModifiedCartItem ? (
            <Button onClick={handleUpdateCartItem}>確認修改</Button>
          ) : (
            <Button onClick={handleAddToCart}>加入購物車</Button>
          )}
        </>
      }
    >
      {currentMeal?.specialties.length ? (
        <List subheader={<li />} sx={{ "& ul": { padding: 0 } }}>
          {currentMeal?.specialties.map((specialty) => (
            <li key={specialty.id}>
              <ul>
                <ListSubheader sx={{ padding: "1rem 0", color: "common.black" }} disableSticky>
                  <Typography variant="h6" fontWeight={900}>
                    {specialty.title}
                  </Typography>
                </ListSubheader>
                {specialty.items.map((item) => (
                  <Fragment key={item.id}>
                    <ListItemButton onClick={handleClickItem(specialty, item)}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <Typography>{item.title}</Typography>
                        <CheckboxBase checked={!!specialtyItems.find(({ id }) => id === item.id)} />
                      </Box>
                    </ListItemButton>
                    <Divider light />
                  </Fragment>
                ))}
              </ul>
            </li>
          ))}
        </List>
      ) : (
        <Typography sx={{ textAlign: "center", margin: "auto", color: "text.disabled" }}>此餐點無客製化選項</Typography>
      )}
    </MobileDialogLayout>
  );
};

export const CartDialog = () => {
  const dispatch = useAppDispatch();

  const currentDialog = useAppSelector(({ customerOrder }) => customerOrder.currentDialog);
  const cart = useAppSelector(({ customerOrder }) => customerOrder.cart);

  const totalAmount = cart.reduce((acc, cur) => (acc += cur.amount * cur.price), 0);

  const handleClose = () => {
    dispatch(closeDialog());
  };

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
    // [TODO]: api post new order
    console.log("handleSubmitOrders");
  };

  return (
    <MobileDialogLayout
      title="購物車"
      titleSize="h2"
      isOpen={currentDialog === CustomerOrderDialog.CART}
      onCloseDialog={handleClose}
      actionButton={
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <Typography variant="h6" fontWeight={900}>
              小計
            </Typography>
            <Typography variant="h6" fontWeight={900}>
              ${totalAmount}
            </Typography>
          </Box>
          <Button onClick={handleSubmitOrders} disabled={cart.length === 0}>
            送出訂單
          </Button>
        </>
      }
    >
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {cart.length > 0 ? (
          <List>
            {cart.map((cartItem, idx) => (
              <Fragment key={`${cartItem.id}-${idx}`}>
                <ListItemButton onClick={handleCustomized(cartItem, idx)} sx={{ padding: ".5rem" }}>
                  <Box sx={{ width: "100%" }}>
                    <Grid container gap={1} sx={{ justifyContent: "space-between", marginBottom: "1rem" }}>
                      <Grid item sx={{ position: "relative" }}>
                        <Box
                          component="img"
                          src={cartItem.coverUrl}
                          alt={`${cartItem.title}-img`}
                          sx={{ width: "5rem", verticalAlign: "middle" }}
                        />
                        {cartItem.recommended && (
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
                        <Typography fontWeight={700}>{cartItem.title}</Typography>
                        {cartItem.specialties.map((specialty, idx) => (
                          <Box
                            sx={{ color: "common.black_80", fontSize: "small.fontSize" }}
                            key={`${specialty.id}-${idx}`}
                          >
                            {specialty.type === "single"
                              ? specialty.items[0]?.title ?? ""
                              : specialty.items.map((item) => item.title).join("、")}
                          </Box>
                        ))}
                      </Grid>
                      <Grid item>
                        <DeleteIcon onClick={handleDeleteCartItem(idx)} sx={{ height: "100%" }} />
                      </Grid>
                    </Grid>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%"
                      }}
                    >
                      <InputNumber
                        value={cartItem.amount}
                        onAdd={() => handleAdd(idx)}
                        onMinus={() => handleMinus(idx)}
                      />
                      <Typography variant="h6" fontWeight={900}>
                        ${cartItem.amount * cartItem.price}
                      </Typography>
                    </Box>
                  </Box>
                </ListItemButton>
                <Divider light />
              </Fragment>
            ))}
            <Divider />
          </List>
        ) : (
          <Typography sx={{ textAlign: "center", margin: "auto", color: "text.disabled" }}>快去點餐囉！</Typography>
        )}
      </Box>
    </MobileDialogLayout>
  );
};

const STATUS = [
  { value: OrderStatus.UNPAID, title: "未付款" },
  { value: OrderStatus.SUCCESS, title: "已付款" }
];
export const OrderDialog = () => {
  const dispatch = useAppDispatch();
  const [orderStatus, setOrderStatus] = useState(STATUS[0].value);
  const [toggleList, setToggleList] = useState<IOrder["id"][]>([]);
  const currentDialog = useAppSelector(({ customerOrder }) => customerOrder.currentDialog);
  const orders = useAppSelector(({ customerOrder }) => customerOrder.orders);

  const showOrders = orders.filter(({ paymentLogs }) => paymentLogs[0].status === orderStatus);

  const handleClose = () => {
    dispatch(closeDialog());
  };

  const handleClickOrderStatus = (orderStatus: IPaymentLog["status"]) => {
    setOrderStatus(orderStatus);
  };

  const handleToggleListItem = (orderId: IOrder["id"]) => () => {
    let newToggleList: IOrder["id"][];
    if (toggleList.includes(orderId)) {
      newToggleList = toggleList.filter((id) => id !== orderId);
    } else {
      newToggleList = [...toggleList, orderId];
    }
    setToggleList(newToggleList);
  };

  const handleCheckout = () => {
    dispatch(openModal(MobileModal.PAYMENT));
  };

  return (
    <MobileDialogLayout
      title="訂單"
      titleSize="h2"
      isOpen={currentDialog === CustomerOrderDialog.ORDER}
      onCloseDialog={handleClose}
      actionButton={
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <Typography variant="h6" fontWeight={900}>
              總計
            </Typography>
            <Typography variant="h6" fontWeight={900}>
              ${showOrders.reduce((acc, order) => acc + order.paymentLogs[0].price, 0)}
            </Typography>
          </Box>
          {orderStatus === "UNPAID" && (
            <Button onClick={handleCheckout} disabled={showOrders.length === 0}>
              前往結帳
            </Button>
          )}
        </>
      }
    >
      <Tabs
        value={orderStatus}
        onChange={(_, value) => handleClickOrderStatus(value)}
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
        {STATUS.map((status, idx) => (
          <StyledTab key={`${status.value}-${idx}`} value={status.value} label={status.title} />
        ))}
      </Tabs>
      <Divider />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          paddingTop: "1rem",
          paddingBottom: "10rem"
        }}
      >
        {showOrders.length > 0 ? (
          <List>
            {showOrders.map((order) => (
              <ListItem
                key={order.id}
                sx={{
                  bgcolor: "common.white",
                  display: "flex",
                  flexDirection: "column",
                  padding: ".5rem",
                  borderRadius: ".5rem",
                  marginBottom: "1rem"
                }}
              >
                <Box sx={{ width: "100%", borderBottom: "1px solid common.black_60" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ fontWeight: 700 }}>{order.type === "dine-in" ? "內用訂單" : "外帶訂單"}</Box>
                    <Box>{`${appDayjs(order.createdAt).format("YYYY/MM/DD HH:mm")}`}</Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "h6.fontSize",
                      padding: ".5rem 0"
                    }}
                  >
                    <Box>
                      <Box component="span" sx={{ color: "common.black_80" }}>
                        狀態：
                      </Box>
                      <Box component="span" sx={{ fontWeight: 900 }}>
                        {order.status === "SUCCESS" ? "已完成" : "準備中"}
                      </Box>
                    </Box>
                    <Box sx={{ fontWeight: 900 }}>${order.paymentLogs[0].price}</Box>
                  </Box>
                </Box>
                <Box sx={{ width: "100%", display: toggleList.includes(order.id) ? "block" : "none" }}>
                  {order.orderMeals.map((meal) => (
                    <Grid
                      container
                      key={meal.id}
                      sx={{ borderBottom: "1px solid common.black_60", fontWeight: 700, padding: ".5rem 0" }}
                    >
                      <Grid item xs={2}>
                        <Checkbox checked={meal.isServed} sx={{ padding: 0 }} />
                      </Grid>
                      <Grid item sx={{ flexGrow: 1 }}>
                        <Box>{meal.mealTitle}</Box>
                        {meal.specialties.map((specialty) => (
                          <Box
                            key={specialty.id}
                            sx={{
                              fontSize: "small.fontSize",
                              fontWeight: 300,
                              color: "common.black_80",
                              paddingBottom: ".5rem"
                            }}
                          >
                            {specialty.items.map((item) => item.title).join(", ")}
                          </Box>
                        ))}
                      </Grid>
                      <Grid item xs={1.5}>
                        <Box>x{meal.amount}</Box>
                      </Grid>
                      <Grid item sx={{ textAlign: "right" }}>
                        <Box>${meal.price}</Box>
                      </Grid>
                    </Grid>
                  ))}
                </Box>
                <ListItemButton
                  onClick={handleToggleListItem(order.id)}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "small.fontSize",
                    fontWeight: 700,
                    width: "100%"
                  }}
                >
                  {toggleList.includes(order.id) ? (
                    <>
                      <Box>收合</Box>
                      <ExpandMoreIcon sx={{ rotate: "180deg" }} fontSize="small" />
                    </>
                  ) : (
                    <>
                      <Box>點擊查看訂單內容</Box>
                      <ExpandMoreIcon fontSize="small" />
                    </>
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography sx={{ textAlign: "center", margin: "auto", color: "text.disabled" }}>沒有訂單記錄</Typography>
        )}
      </Box>
    </MobileDialogLayout>
  );
};

interface IMobileModalLayout {
  children: React.ReactNode;
  open: boolean;
}
export const MobileModalLayout = (props: IMobileModalLayout) => {
  const { children, open } = props;

  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <ModalBase open={open} onClose={handleClose}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          width: "80%",
          bgcolor: "common.white",
          textAlign: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "1rem"
        }}
      >
        {children}
      </Box>
    </ModalBase>
  );
};

export const PaymentModal = () => {
  const dispatch = useAppDispatch();

  const currentModal = useAppSelector(({ customerOrder }) => customerOrder.currentModal);

  const handlePaymentByCash = () => {
    dispatch(openModal(MobileModal.COUNTER_REMINDER));
  };

  const handlePaymentByCard = () => {
    // [TODO]: jump to NewebPay
  };

  const handlePaymentByLinePay = () => {
    // [TODO]: jump to LINEPay
  };

  return (
    <MobileModalLayout open={currentModal === MobileModal.PAYMENT}>
      <>
        <Typography variant="h6" fontWeight={900}>
          請選擇付款方式
        </Typography>
        <Button onClick={handlePaymentByCash} startIcon={<MoneyIcon />}>
          現金付款
        </Button>
        <Button onClick={handlePaymentByCard} startIcon={<CreditCardIcon />}>
          信用卡
        </Button>
        <Button onClick={handlePaymentByLinePay}>
          <img src={linePay} alt="LINE Pay" style={{ height: "1.5rem" }} />
        </Button>
      </>
    </MobileModalLayout>
  );
};

export const CounterReminderModal = () => {
  const currentModal = useAppSelector(({ customerOrder }) => customerOrder.currentModal);

  return (
    <MobileModalLayout open={currentModal === MobileModal.COUNTER_REMINDER}>
      <Typography variant="h6" fontWeight={700}>
        請至臨櫃結帳
      </Typography>
    </MobileModalLayout>
  );
};
