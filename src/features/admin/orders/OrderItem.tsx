// Libs
import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Typography,
  List,
  ListItem,
  Box,
  Select,
  MenuItem,
  styled,
  LinearProgressProps,
  LinearProgress,
  linearProgressClasses
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
// Components
import { Column, Row } from "~/components/layout";
// Others
import { useAppDispatch } from "~/app/hook";
import { patchOrder } from "~/app/slices/order";
import { Order, OrderMeal, ParentOrder } from "~/features/orders/type";
import appDayjs from "~/utils/dayjs.util";
import { calculateParentOrderPrice } from "~/utils/price.utils";
import theme from "~/theme";
import { OrderStatus, OrderType } from "~/types/common";
import { openPaymentDrawer } from "~/app/slices/payment";

const VerticalDivider = styled("div")(({ theme }) => ({
  height: "32px",
  width: "1px",
  background: theme.palette.common.black_40,
  margin: "0 1rem"
}));

const LinearProgressWithLabel = (props: LinearProgressProps & { value: number }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          variant="determinate"
          value={props.value}
          sx={{
            height: "0.6875rem",
            borderRadius: "0.5rem",
            [`&.${linearProgressClasses.colorPrimary}`]: {
              backgroundColor: theme.palette.common.black_20
            },
            [`& .${linearProgressClasses.bar}`]: {
              borderRadius: "0.5rem"
            }
          }}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
};

type OrderItemsDetailProps = {
  status: OrderStatus;
  orderMeals: OrderMeal[];
  tempServedAmount?: string;
  handleChangeServedAmount?: (idx: number, value: number | string) => void;
};
const OrderItemsDetail = (props: OrderItemsDetailProps) => {
  const { status, orderMeals, tempServedAmount, handleChangeServedAmount } = props;

  return (
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
            {(status === OrderStatus.UNPAID || status === OrderStatus.SUCCESS) && (
              <Typography variant="h6" fontWeight={700} sx={{ flexGrow: "1", textAlign: "right" }}>
                {orderMeal.price}元
              </Typography>
            )}
            {status === OrderStatus.PENDING && tempServedAmount && handleChangeServedAmount && (
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
          </Row>
        </ListItem>
      ))}
    </List>
  );
};

type PendingAndCancelOrderItemProps = {
  order: Order;
  setDeleteOrderId: React.Dispatch<React.SetStateAction<string>>;
};
export const PendingAndCancelOrderItem = (props: PendingAndCancelOrderItemProps) => {
  const dispatch = useAppDispatch();

  const { order, setDeleteOrderId } = props;

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
            {type === OrderType.DineIn && (
              <Typography variant="h6" fontWeight={900}>
                {seats.join(", ")}
              </Typography>
            )}
          </Column>
          <VerticalDivider />
          <Typography sx={{ flex: "0 50%" }}>{appDayjs(createdAt).format("YYYY/MM/DD HH:mm:ss")}</Typography>
          {status === OrderStatus.PENDING && (
            <>
              <VerticalDivider />
              <Box sx={{ flex: "0 50%" }}>
                <LinearProgressWithLabel value={progress} />
              </Box>
            </>
          )}
        </Row>
      </AccordionSummary>

      <AccordionDetails sx={{ padding: "0 1rem .5rem" }}>
        <OrderItemsDetail
          status={status}
          orderMeals={orderMeals}
          tempServedAmount={tempServedAmount}
          handleChangeServedAmount={handleChangeServedAmount}
        />
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
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

type UnpaidAndSuccessOrderItemProps = {
  parentOrder: ParentOrder;
};
export const UnpaidAndSuccessOrderItem = (props: UnpaidAndSuccessOrderItemProps) => {
  const { parentOrder } = props;
  const { id, type, status, seats = [], orders = [], paymentLogs } = parentOrder;
  const totalPrice = calculateParentOrderPrice(parentOrder);

  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded((prevExpand) => !prevExpand);
  };

  const handlePayment = () => {
    dispatch(openPaymentDrawer(parentOrder));
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
            <Typography variant="body1" fontWeight={700}>
              {type === OrderType.DineIn ? "內用" : "外帶"}
            </Typography>
            {type === OrderType.DineIn && (
              <Typography variant="h6" fontWeight={900}>
                {seats.join(", ")}
              </Typography>
            )}
          </Column>
          {type === OrderType.TakeOut && (
            <>
              <VerticalDivider />
              <Column sx={{ flex: "0 70%" }}>
                <Typography>訂單編號</Typography>
                <Typography>{id.slice(-5)}</Typography>
              </Column>
            </>
          )}
          {status === OrderStatus.SUCCESS && paymentLogs && (
            <>
              <VerticalDivider />
              <Column sx={{ flexGrow: "1", textAlign: "right" }}>
                <Typography variant="h6" fontWeight={700}>
                  付款方式：{paymentLogs[0]?.gateway ?? null}
                </Typography>
              </Column>
            </>
          )}
        </Row>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: "0 1rem .5rem" }}>
        {orders.map(({ id, orderMeals, createdAt }) => (
          <Box key={id} sx={{ margin: "1rem 0" }}>
            <Accordion>
              {type === OrderType.DineIn && (
                <AccordionSummary>
                  <Row sx={{ width: "100%" }}>
                    <Column sx={{ flex: "0 70%" }}>
                      <Typography>訂單編號</Typography>
                      <Typography>{id.slice(-5)}</Typography>
                    </Column>
                    <VerticalDivider />
                    <Typography sx={{ flex: "0 50%" }}>{appDayjs(createdAt).format("YYYY/MM/DD HH:mm:ss")}</Typography>
                  </Row>
                </AccordionSummary>
              )}
              <AccordionDetails sx={{ bgcolor: theme.palette.secondary.contrastText }}>
                <OrderItemsDetail status={status} orderMeals={orderMeals} />
              </AccordionDetails>
            </Accordion>
          </Box>
        ))}
        {status === OrderStatus.UNPAID && (
          <Box sx={{ display: "flex" }}>
            <Button
              variant="contained"
              onClick={handlePayment}
              sx={{ fontSize: theme.typography.body1.fontSize, fontWeight: 700, marginLeft: "auto" }}
            >
              收款 {totalPrice} 元
            </Button>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
