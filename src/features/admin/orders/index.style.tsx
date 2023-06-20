// Libs
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Typography,
  List,
  ListItem,
  LinearProgress,
  LinearProgressProps,
  Box,
  linearProgressClasses,
  Select,
  MenuItem
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
// Components
import { Column, Row } from "~/components/layout";
import TabsBase from "~/components/tabs";
// Others
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { getOrders, patchOrder, setOrderStatus } from "~/app/slices/order";
import { Order } from "~/features/orders/type";
import { ORDER_STATUS } from "~/utils/constants";
import appDayjs from "~/utils/dayjs.util";
import { calculateOrderPrice } from "~/utils/price.utils";
import theme from "~/theme";
import { TabletModal } from "~/components/modals";
import { OrderStatus, OrderType } from "~/types/common";
import { headerHeight } from "~/components/header";

const VerticalDivider = styled("div")(({ theme }) => ({
  height: "32px",
  width: "1px",
  background: theme.palette.common.black_40,
  margin: "0 1rem"
}));

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: "0.6875rem",
  borderRadius: "0.5rem",
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.common.black_20
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: "0.5rem"
  }
}));

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <BorderLinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

type PendingOrderItemProps = {
  order: Order;
  setDeleteOrderId: React.Dispatch<React.SetStateAction<string>>;
  setOpenPayment: React.Dispatch<React.SetStateAction<boolean>>;
  onPayment: (order: Order) => void;
};
export const PendingOrderItem = (props: PendingOrderItemProps) => {
  const dispatch = useAppDispatch();

  const { order, setDeleteOrderId, setOpenPayment, onPayment } = props;

  const { id, status, type, orderMeals, createdAt, seats = [], paymentLogs = [] } = order;

  const totalMeals = orderMeals.reduce((acc, meal) => (acc += meal.amount), 0);
  const servedMeals = orderMeals.reduce((acc, meal) => (acc += meal.servedAmount), 0);
  const progress = (servedMeals / totalMeals) * 100;

  const [expanded, setExpanded] = useState(false);
  const originServedAmount = order.orderMeals.map((meal) => meal.servedAmount).join("");
  const [tempServedAmount, setUpdatedServedAmount] = useState(originServedAmount);
  const isUpdated = originServedAmount !== tempServedAmount;

  const handleExpand = () => {
    setExpanded((prevExpand) => !prevExpand);
  };

  const handleChangeServedAmount = (idx: number, value: number | string) => {
    let newServedAmount = tempServedAmount.split("");
    newServedAmount[idx] = `${value}`;
    setUpdatedServedAmount(newServedAmount.join(""));
  };

  const handleCancelOrder = (orderId: string) => {
    setDeleteOrderId(orderId);
  };

  const handleUpdateOrder = () => {
    dispatch(
      patchOrder({
        id,
        status,
        type,
        orderMeals: order.orderMeals.map((meal, idx) => ({
          ...meal,
          servedAmount: +tempServedAmount.split("")[idx]
        })),
        paymentLogs
      })
    );
  };

  const handlePayment = () => {
    onPayment(order);
    setOpenPayment(true);
  };


  return (
    <Accordion
      expanded={expanded}
      onChange={handleExpand}
      sx={{
        bgcolor: "white",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        "&:before": {
          height: 0
        }
      }}
    >
      <AccordionSummary
        sx={{
          flexDirection: "row-reverse",
          borderBottom: expanded ? `1px solid ${theme.palette.common.black_20}` : null
        }}
        expandIcon={expanded ? <RemoveIcon /> : <AddIcon />}
      >
        <Row sx={{ width: "100%" }}>
          <VerticalDivider />
          <Column sx={{ flex: "0 70%" }}>
            <Typography>訂單編號</Typography>
            <Typography>{id.slice(-5)}</Typography>
          </Column>
          <VerticalDivider />
          <Column sx={{ flex: "0 70%" }}>
            <Typography variant="body1" fontWeight={700}>
              {type === OrderType.DineIn ? "內用" : "外帶"}
            </Typography>
            <Typography variant="h6" fontWeight={900}>
              {/* [TODO] */}
              {seats[0] !== "-0" && seats.join(", ")}
            </Typography>
          </Column>
          <VerticalDivider />
          <Typography sx={{ flex: "0 50%" }}>{appDayjs(createdAt).format("YYYY/MM/DD HH:mm:ss")}</Typography>
          <VerticalDivider />
          <Box sx={{ flex: "0 50%" }}>
            <LinearProgressWithLabel value={progress} />
          </Box>
        </Row>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: "0 1rem .5rem" }}>
        <List>
          {orderMeals.map((orderMeal, idx) => (
            <ListItem
              key={orderMeal.id}
              sx={{ borderBottom: `1px solid ${theme.palette.common.black_20}`, padding: ".5rem" }}
            >
              <Row sx={{ width: "100%", gap: "1rem" }}>
                <Typography variant="body1" sx={{ minWidth: "9rem" }}>
                  {orderMeal.categories[0].title}
                </Typography>
                <Typography variant="h6" fontWeight={700} sx={{ minWidth: "12rem" }}>
                  {orderMeal.title}
                </Typography>
                <Typography variant="h6" fontWeight={700} sx={{ minWidth: "5rem" }}>
                  x{orderMeal.amount}
                </Typography>
                <List sx={{ margin: 0, padding: 0 }}>
                  {orderMeal.specialties.map((specialty) => (
                    <ListItem key={specialty.id} sx={{ margin: 0, padding: 0, color: theme.palette.text.secondary }}>
                      [{specialty.title}]: {specialty.items.map((item) => item.title).join("、")}
                    </ListItem>
                  ))}
                </List>
                {status === OrderStatus.PENDING && (
                  <Box
                    sx={{
                      marginLeft: "auto",
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      minWidth: "7rem"
                    }}
                  >
                    <Typography>已出餐數量</Typography>
                    <Select
                      value={tempServedAmount.split("")[idx]}
                      onChange={(e) => handleChangeServedAmount(idx, e.target.value)}
                      sx={{ width: "80%", height: "2rem" }}
                    >
                      {Array.from({ length: orderMeal.amount + 1 }, (_, idx) => idx).map((amount) => (
                        <MenuItem key={amount} value={amount}>
                          {amount}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                )}
                {status === OrderStatus.UNPAID && (
                  <Box
                    sx={{
                      marginLeft: "auto",
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      minWidth: "7rem"
                    }}
                  >
                    <Typography>{orderMeal.price}元</Typography>
                  </Box>
                )}
              </Row>
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: "flex" }}>
          {status === OrderStatus.PENDING && (
            <>
              {progress === 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleCancelOrder(id)}
                  sx={{ fontSize: theme.typography.body1.fontSize, fontWeight: 700 }}
                >
                  取消訂單
                </Button>
              )}
              <Button
                variant="contained"
                disabled={!isUpdated}
                onClick={handleUpdateOrder}
                sx={{ fontSize: theme.typography.body1.fontSize, fontWeight: 700, marginLeft: "auto" }}
              >
                更新訂單
              </Button>
            </>
          )}
          {status === OrderStatus.UNPAID && (
            <Button
              variant="contained"
              onClick={handlePayment}
              sx={{ fontSize: theme.typography.body1.fontSize, fontWeight: 700, marginLeft: "auto" }}
            >
              收款 {calculateOrderPrice(order)} 元
            </Button>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

type UnpaidOrderItemProps = {};
export const UnpaidOrderItem = (props: UnpaidOrderItemProps) => {
  return <></>;
};

export const OrderTabs = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(({ order }) => order.status);

  const handleSelected = (orderStatus: OrderStatus) => {
    dispatch(setOrderStatus(orderStatus));
  };

  return (
    <TabsBase
      sx={{ position: "sticky", top: "0", zIndex: "10", backgroundColor: theme.palette.background.paper }}
      tabs={ORDER_STATUS}
      onChange={(_, value) => handleSelected(value as OrderStatus)}
      value={status}
    />
  );
};

type OrderListProps = {
  setOpenPayment: React.Dispatch<React.SetStateAction<boolean>>;
  onPayment: (order: Order) => void;
};
export const OrderList = (props: OrderListProps) => {
  const { setOpenPayment, onPayment } = props;

  const dispatch = useAppDispatch();
  const status = useAppSelector(({ order }) => order.status);
  const orders = useAppSelector(({ order }) => order.orders);
  const [deleteOrderId, setDeleteOrderId] = useState("");

  useEffect(() => {
    dispatch(getOrders({ status }));
  }, [status]);

  return (
    <>
      {orders.length === 0 ? (
        <Column justifyContent="center" bgcolor="background.paper" height={`calc(80ch - ${headerHeight})`}>
          <Typography variant="h4" textAlign="center" color="text.disabled">
            無此分類訂單
          </Typography>
        </Column>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "0.75rem" }}>
          {orders.map((order) => (
            <PendingOrderItem
              key={order.id}
              order={order}
              setDeleteOrderId={setDeleteOrderId}
              setOpenPayment={setOpenPayment}
              onPayment={onPayment}
            />
          ))}
        </Box>
      )}
      <TabletModal.CancelOrderConfirm deleteOrderId={deleteOrderId} setDeleteOrderId={setDeleteOrderId} />
    </>
  );
};
