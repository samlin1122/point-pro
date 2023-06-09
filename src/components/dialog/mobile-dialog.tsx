// Libs
import { Fragment, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  Tabs,
  Typography,
  tabsClasses
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// Components
import { MobileDialogLayout } from "~/components/dialog";
import { CheckboxBase } from "~/components/checkbox";
import { CartMeal, InputNumber, StyledTab } from "~/features/orders/index.styles";
// Others
import { formatFullDateWithTime } from "~/utils/dayjs.util";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import {
  closeDialog,
  updateSpecialty,
  increaseMealAmount,
  decreaseMealAmount,
  createCartItem,
  updateCartItem,
  openModal,
  deleteCartItem
} from "~/features/orders/slice";
import { SpecialtyItem, Specialty, Order, DialogType } from "~/features/orders/type";
import { postOrder, setMobileOrderStatusTab } from "~/app/slices/order";
import { MOBILE_ORDER_STATUS_TAB, ORDER_STATUS } from "~/utils/constants";
import { calculateCartItemPrice, calculateCartPrice, calculateOrderPrice } from "~/utils/price.utils";
import { CustomerBookingDialog, MobileModal, OrderStatus, OrderType } from "~/types/common";
import { getToken } from "~/utils/token.utils";
import { QRCodeSVG } from "qrcode.react";
import { setDialog } from "~/features/booking/slice";

const CustomizedSpecialties = () => {
  const dispatch = useAppDispatch();
  const token = getToken();

  const meals = useAppSelector(({ takeOrder }) => takeOrder.meals);
  const customized = useAppSelector(({ takeOrder }) => takeOrder.customized);

  const customizedSpecialties = meals?.find((meal) => meal.id === customized?.id)?.specialties ?? [];

  const items = customized?.specialties?.reduce((acc, cur) => acc.concat(cur.items), [] as SpecialtyItem[]);

  const handleClickItem = (selectedSpecialty: Specialty, selectedItem: SpecialtyItem) => () => {
    if (!token) return;
    dispatch(updateSpecialty({ selectedSpecialty, selectedItem }));
  };

  return (
    <>
      {customizedSpecialties.length ? (
        <List subheader={<li />} sx={{ "& ul": { padding: 0 }, userSelect: "none" }}>
          {customizedSpecialties.map((specialty) => (
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
                        {token && <CheckboxBase checked={!!items?.find(({ id }) => id === item.id)} />}
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
        <Typography
          sx={{
            textAlign: "center",
            margin: "auto",
            color: "text.disabled",
            userSelect: "none"
          }}
        >
          此餐點無客製化選項
        </Typography>
      )}
    </>
  );
};

const Customized = () => {
  const dispatch = useAppDispatch();

  const token = getToken();
  const currentDialog = useAppSelector(({ takeOrder }) => takeOrder.currentDialog);
  const customized = useAppSelector(({ takeOrder }) => takeOrder.customized);
  const isModifiedCartItem = useAppSelector(({ takeOrder }) => takeOrder.isModifiedCartItem);

  const handleClose = () => {
    dispatch(closeDialog());
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

  if (!customized) return null;

  return (
    <MobileDialogLayout
      title={customized.title}
      isOpen={currentDialog === DialogType.CUSTOMIZED}
      onCloseDialog={handleClose}
      actionButton={
        <>
          {token && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  userSelect: "none"
                }}
              >
                <InputNumber value={customized.amount} onAdd={handleAdd} onMinus={handleMinus} />
                <Typography variant="h5" fontWeight={900}>
                  {customized.id ? calculateCartItemPrice(customized) : 0}元
                </Typography>
              </Box>
              {isModifiedCartItem ? (
                <Button onClick={handleUpdateCartItem}>確認修改</Button>
              ) : (
                <Button onClick={handleAddToCart}>加入購物車</Button>
              )}
            </>
          )}
        </>
      }
    >
      <CustomizedSpecialties />
    </MobileDialogLayout>
  );
};

const Cart = () => {
  const dispatch = useAppDispatch();

  const currentDialog = useAppSelector(({ takeOrder }) => takeOrder.currentDialog);
  const meals = useAppSelector(({ takeOrder }) => takeOrder.meals);
  const cart = useAppSelector(({ takeOrder }) => takeOrder.cart);

  const totalAmount = cart.reduce((acc, cur) => (acc += cur.amount), 0);
  const totaPrice = calculateCartPrice(cart);

  const handleClose = () => {
    dispatch(closeDialog());
  };

  const handleSubmitOrders = () => {
    dispatch(postOrder({ isUser: true }));
  };

  useEffect(() => {
    cart.forEach((cartItem, idx) => {
      const meal = meals.find((meal) => meal.id === cartItem.id);
      if (!meal) {
        dispatch(openModal({ type: MobileModal.CART_ITEM_IS_OFF, data: cartItem }));
        dispatch(deleteCartItem(idx));
      }
    });
  }, [meals, cart]);

  return (
    <MobileDialogLayout
      title="購物車"
      titleSize="h2"
      isOpen={currentDialog === DialogType.CART}
      onCloseDialog={handleClose}
      actionButton={
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              userSelect: "none"
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <Typography variant="h6" fontWeight={900}>
                數量
              </Typography>
              <Typography variant="h6" fontWeight={900}>
                {totalAmount}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <Typography variant="h6" fontWeight={900}>
                小計
              </Typography>
              <Typography variant="h6" fontWeight={900}>
                {totaPrice}元
              </Typography>
            </Box>
          </Box>
          <Button onClick={handleSubmitOrders} disabled={cart.length === 0}>
            送出訂單
          </Button>
        </>
      }
    >
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", userSelect: "none" }}>
        {cart.length > 0 ? (
          <List>
            {cart.map((cartItem, idx) => (
              <Fragment key={`${cartItem.id}-${idx}`}>
                <CartMeal cartItem={cartItem} idx={idx} />
                <Divider />
              </Fragment>
            ))}
          </List>
        ) : (
          <Typography sx={{ textAlign: "center", margin: "auto", color: "text.disabled", userSelect: "none" }}>
            快去點餐囉！
          </Typography>
        )}
      </Box>
    </MobileDialogLayout>
  );
};

const Orders = () => {
  const dispatch = useAppDispatch();
  const currentDialog = useAppSelector(({ takeOrder }) => takeOrder.currentDialog);
  const orders = useAppSelector(({ order }) => order.orders);
  const mobileOrderStatusTab = useAppSelector(({ order }) => order.mobileOrderStatusTab);

  const [toggleList, setToggleList] = useState<Order["id"][]>([]);
  const [canPay, setCanPay] = useState<boolean>(false);

  const showOrders = orders.filter(({ status }) => MOBILE_ORDER_STATUS_TAB[mobileOrderStatusTab].type.includes(status));

  const totalPrice = useMemo(
    () => showOrders.reduce((acc, cur) => acc + cur.orderMeals.reduce((acc, cur) => acc + cur.price, 0), 0),
    [showOrders]
  );

  useEffect(() => {
    const newOrder = orders[0];
    if (newOrder) {
      setToggleList((prevToggleList) => [...prevToggleList, newOrder.id]);
    }
  }, [orders]);

  useEffect(() => {
    orders.filter(({ status }) => status === "UNPAID").length === showOrders.length
      ? setCanPay(true)
      : setCanPay(false);
  }, [showOrders]);

  const handleClose = () => {
    dispatch(closeDialog());
  };

  const handleClickOrderStatus = (orderStatus: number) => {
    dispatch(setMobileOrderStatusTab(orderStatus));
  };

  const handleToggleListItem = (orderId: Order["id"]) => () => {
    let newToggleList: Order["id"][];
    if (toggleList.includes(orderId)) {
      newToggleList = toggleList.filter((id) => id !== orderId);
    } else {
      newToggleList = [...toggleList, orderId];
    }
    setToggleList(newToggleList);
  };

  const handleCheckout = () => {
    dispatch(openModal({ type: MobileModal.PAYMENT }));
  };

  return (
    <MobileDialogLayout
      title="訂單"
      titleSize="h2"
      isOpen={currentDialog === DialogType.ORDER}
      onCloseDialog={handleClose}
      actionButton={
        <>
          {mobileOrderStatusTab !== 2 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                userSelect: "none"
              }}
            >
              <Typography variant="h6" fontWeight={900}>
                總計
              </Typography>
              <Typography variant="h6" fontWeight={900}>
                {totalPrice}元
              </Typography>
            </Box>
          )}
          {mobileOrderStatusTab === 0 && showOrders.length > 0 && (
            <Button disabled={!canPay} variant="contained" color="primary" onClick={handleCheckout}>
              前往結帳
            </Button>
          )}
        </>
      }
    >
      <Box
        sx={{
          position: "fixed",
          zIndex: 5,
          bgcolor: "background.paper",
          width: "100%",
          userSelect: "none"
        }}
      >
        {/* 訂單狀態分類 */}
        <Tabs
          value={mobileOrderStatusTab}
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
          {MOBILE_ORDER_STATUS_TAB.map((status, idx) => (
            <StyledTab key={`${status.title}-${idx}`} value={idx} label={status.title} />
          ))}
        </Tabs>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          paddingTop: "4rem",
          paddingBottom: "10rem",
          userSelect: "none"
        }}
      >
        {/* 訂單記錄 */}
        {showOrders.length > 0 ? (
          <List>
            {showOrders.map((order, idx) => (
              <ListItem
                key={`${order.id}-${idx}`}
                sx={{
                  bgcolor: "common.white",
                  display: "flex",
                  flexDirection: "column",
                  padding: ".5rem",
                  borderRadius: ".5rem",
                  marginBottom: "1rem",
                  border: "1px solid",
                  borderColor: "common.black_40"
                }}
                onClick={handleToggleListItem(order.id)}
              >
                <Box sx={{ width: "100%", borderBottom: "1px solid common.black_60" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ fontWeight: 700 }}>{order.type === OrderType.DineIn ? "內用訂單" : "外帶訂單"}</Box>
                    <Box>{formatFullDateWithTime(order.createdAt)}</Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "body1.fontSize",
                      padding: ".5rem 0"
                    }}
                  >
                    {/* 訂單狀態 */}
                    <Box>
                      <Box component="span" sx={{ color: "common.black_80" }}>
                        狀態：
                      </Box>
                      <Box component="span" sx={{ fontWeight: 700 }}>
                        {ORDER_STATUS.find((status) => status.id === order.status)?.title}
                      </Box>
                    </Box>
                    {/* 訂單總金額 */}
                    {order.status !== OrderStatus.CANCEL && (
                      <Box sx={{ fontWeight: 700 }}>{calculateOrderPrice(order)}元</Box>
                    )}
                  </Box>
                </Box>
                <Divider sx={{ width: "100%", margin: ".5rem 0" }} />
                <Box sx={{ width: "100%", display: toggleList.includes(order.id) ? "block" : "none" }}>
                  {order.orderMeals.map((orderMeal) => (
                    <Grid container key={orderMeal.id} sx={{ borderBottom: "1px solid common.black_60" }}>
                      <Grid item xs={1}>
                        {/* 出餐狀態 */}
                        {order.status !== OrderStatus.CANCEL && (
                          <Checkbox
                            checked={orderMeal.amount === orderMeal.servedAmount}
                            size="small"
                            sx={{ padding: 0 }}
                          />
                        )}
                      </Grid>
                      <Grid item sx={{ flexGrow: 1 }} xs={7}>
                        {/* 餐點名稱 */}
                        <Typography sx={{ paddingBottom: ".5rem" }}>{orderMeal.title}</Typography>
                        {/* 客製化項目 */}
                        {orderMeal.specialties.map((specialty) => (
                          <Box
                            key={specialty.id}
                            sx={{
                              fontSize: "small.fontSize",
                              fontWeight: 300,
                              color: "common.black_60",
                              paddingBottom: ".5rem"
                            }}
                          >
                            {specialty.title}:
                            <br />
                            {specialty.items.map((i) => i.title).join(", ")}
                          </Box>
                        ))}
                      </Grid>
                      {/* 數量 */}
                      <Grid item xs={1}>
                        <Box>x{orderMeal.amount}</Box>
                      </Grid>
                      {/* 金額 */}
                      <Grid item sx={{ textAlign: "right" }} xs={3}>
                        {order.status !== OrderStatus.CANCEL && <Box>{orderMeal.price}元</Box>}
                      </Grid>
                    </Grid>
                  ))}
                </Box>
                <Box
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
                      <Box sx={{ cursor: "pointer" }}>收合</Box>
                      <ExpandMoreIcon sx={{ rotate: "180deg" }} fontSize="small" />
                    </>
                  ) : (
                    <>
                      <Box sx={{ cursor: "pointer" }}>點擊查看訂單內容</Box>
                      <ExpandMoreIcon fontSize="small" />
                    </>
                  )}
                </Box>
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

const BookingQRCodeModal = () => {
  const dispatch = useAppDispatch();

  const dialog = useAppSelector(({ customerReservation }) => customerReservation.dialog);
  const token = useAppSelector(({ auth }) => auth.userToken);

  const checkInQRCode =
    (import.meta.env.DEV ? "http://" : "https://") + window.location.host + "/orders?token=" + token ?? "";

  const handleClose = () => {
    dispatch(setDialog(""));
  };

  return (
    <MobileDialogLayout
      title="客人桌邊點餐 QR Code"
      titleSize="h2"
      isOpen={dialog === CustomerBookingDialog.QRCODE}
      onCloseDialog={handleClose}
      actionButton={<Button onClick={handleClose}>關閉</Button>}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          m: "auto"
        }}
      >
        <QRCodeSVG size={300} value={checkInQRCode}></QRCodeSVG>
      </Box>
    </MobileDialogLayout>
  );
};

export default { Customized, Cart, Orders, BookingQRCodeModal };
