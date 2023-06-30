// Libs
import { useCallback, useEffect, useState } from "react";
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
  styled
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
// Components
import { Column, Row } from "~/components/layout";
// Others
import { useAppDispatch } from "~/app/hook";
import { patchOrder, setCancelOrder } from "~/app/slices/order";
import { Order, OrderMeal, ParentOrder } from "~/features/orders/type";
import appDayjs from "~/utils/dayjs.util";
import { calculateOrderPrice, calculateParentOrderPrice } from "~/utils/price.utils";
import theme from "~/theme";
import { OrderStatus, OrderType } from "~/types/common";
import { openPaymentDrawer } from "~/app/slices/payment";
import LinearProgressWithLabel from "./LinearProgressWithLabel";

function useAccordion() {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = useCallback(() => {
    setExpanded((prevExpand) => !prevExpand);
  }, []);

  return { expanded, handleExpand };
}

const VerticalDivider = styled("div")(({ theme }) => ({
  height: "32px",
  width: "1px",
  background: theme.palette.common.black_40,
  margin: "0 1rem"
}));

interface orderMealItemProps {
  idx: number;
  orderMeal: OrderMeal;
  status: OrderStatus;
  isShowServedAmount?: boolean;
  tempServedAmount?: string;
  handleChangeServedAmount?: (idx: number, value: number | string) => void;
}
function OrderMealItem(props: orderMealItemProps) {
  const { handleChangeServedAmount, tempServedAmount, orderMeal, isShowServedAmount, idx } = props;
  const { id, title, mealPrice, price, amount, specialties } = orderMeal;

  return (
    <ListItem
      sx={{
        borderBottom: `1px solid ${theme.palette.common.black_20}`,
        padding: ".5rem"
      }}
    >
      <Row justifyContent="space-between" width="100%" gap={2} sx={{ padding: ".5rem" }}>
        <Typography sx={{ minWidth: "15rem" }}>{title}</Typography>
        <Typography sx={{ minWidth: "5rem" }}>{mealPrice}</Typography>
        <Typography sx={{ minWidth: "5rem" }}>x {amount}</Typography>
        <List sx={{ margin: 0, padding: 0, flexGrow: 1 }}>
          {specialties.map((specialty) => (
            <ListItem key={specialty.id} sx={{ margin: 0, padding: 0, color: theme.palette.text.secondary }}>
              [{specialty.title}]: {specialty.items.map((item) => item.title).join("、")}
            </ListItem>
          ))}
        </List>
        <Typography fontWeight={700} sx={{ minWidth: "6rem", textAlign: "right" }}>
          {price}元
        </Typography>
        {isShowServedAmount && handleChangeServedAmount && tempServedAmount && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              minWidth: "7rem",
              gap: ".5rem"
            }}
          >
            <Typography>已出餐數量</Typography>
            <Select
              value={tempServedAmount.split("")[idx]}
              onChange={(e) => handleChangeServedAmount(idx, e.target.value)}
              sx={{ width: "80%", height: "2rem" }}
            >
              {Array.from({ length: orderMeal.amount + 1 }, (_, idx) => idx).map((amount) => (
                <MenuItem key={`${id}-${amount}`} value={amount}>
                  {amount}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
      </Row>
    </ListItem>
  );
}

type PendingAndCancelOrderItemProps = {
  order: Order;
};
export const PendingAndCancelOrderItem = (props: PendingAndCancelOrderItemProps) => {
  const dispatch = useAppDispatch();
  const { expanded, handleExpand } = useAccordion();
  const { order } = props;

  const { id, status, type, orderMeals, createdAt, seats = [], paymentLogs = [] } = order;
  const [totalMeals, servedMeals] = orderMeals.reduce(
    (acc, meal) => {
      acc[0] = acc[0] + meal.amount;
      acc[1] = acc[1] + meal.servedAmount;
      return acc;
    },
    [0, 0]
  );
  const progress = (servedMeals / totalMeals) * 100;

  const [tempServedAmount, setUpdatedServedAmount] = useState("");
  const [isServedAmountUpdated, setIsServedAmountUpdated] = useState(false);

  useEffect(() => {
    const originServedAmount = orderMeals.map((meal) => meal.servedAmount).join("");
    setUpdatedServedAmount(originServedAmount);
  }, [orderMeals]);

  const handleChangeServedAmount = (idx: number, value: number | string) => {
    let newServedAmount = tempServedAmount.split("");
    newServedAmount[idx] = `${value}`;
    setUpdatedServedAmount(newServedAmount.join(""));
    setIsServedAmountUpdated(tempServedAmount !== newServedAmount.join(""));
  };

  const handleCancelOrder = (orderId: string) => {
    dispatch(setCancelOrder(orderId));
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
        boxShadow: `0 0 0.5rem #d1d1d181`,
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
          <VerticalDivider />
          <Column sx={{ flex: "0 70%" }}>
            <Typography>訂單編號</Typography>
            <Typography>{id.slice(-5)}</Typography>
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
        <List>
          {orderMeals.map((orderMeal, idx) => (
            <OrderMealItem
              idx={idx}
              key={orderMeal.id}
              status={status}
              orderMeal={orderMeal}
              isShowServedAmount={status === OrderStatus.PENDING}
              tempServedAmount={tempServedAmount}
              handleChangeServedAmount={handleChangeServedAmount}
            />
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
                disabled={!isServedAmountUpdated}
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
  const { expanded, handleExpand } = useAccordion();

  const handlePayment = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      dispatch(openPaymentDrawer(parentOrder));
    },
    [dispatch, parentOrder]
  );

  return (
    <Accordion
      expanded={expanded}
      onChange={handleExpand}
      sx={{
        bgcolor: "white",
        boxShadow: `0 0 0.5rem #d1d1d181`,
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
          <Column sx={{ flexGrow: 1 }}>
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
              <Column sx={{ flexGrow: 1 }}>
                <Typography>訂單編號</Typography>
                <Typography>{id.slice(-5)}</Typography>
              </Column>
            </>
          )}
          <VerticalDivider />
          <Column sx={{ minWidth: "13rem", textAlign: "right" }}>
            <Typography variant="h6" fontWeight={700}>
              總金額：{totalPrice}元
            </Typography>
          </Column>
          {status === OrderStatus.UNPAID && (
            <>
              <VerticalDivider />
              <Button
                variant="contained"
                onClick={handlePayment}
                sx={{ fontSize: theme.typography.body1.fontSize, fontWeight: 700, height: "100%" }}
              >
                收款
              </Button>
            </>
          )}
        </Row>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: "0 1rem .5rem" }}>
        {orders.map((order) => (
          <Box key={order.id} sx={{ margin: "1rem 0" }}>
            <Accordion
              sx={{
                boxShadow: `0 0 0.25rem #b8b8b881`
              }}
            >
              {type === OrderType.DineIn && (
                <AccordionSummary>
                  <Row sx={{ width: "100%" }}>
                    <Column sx={{ flexGrow: 1 }}>
                      <Typography>訂單編號</Typography>
                      <Typography>{order.id.slice(-5)}</Typography>
                    </Column>
                    <VerticalDivider />
                    <Typography sx={{ minWidth: "13rem" }}>
                      {appDayjs(order.createdAt).format("YYYY/MM/DD HH:mm:ss")}
                    </Typography>
                    {status === OrderStatus.SUCCESS && (
                      <>
                        <VerticalDivider />
                        <Column sx={{ minWidth: "13rem" }}>
                          <Typography fontWeight={700}>付款方式：{order.paymentLogs[0]?.gateway ?? null}</Typography>
                        </Column>
                      </>
                    )}
                    <VerticalDivider />
                    <Column sx={{ minWidth: "12rem", textAlign: "right" }}>
                      <Typography fontWeight={700}>金額：{calculateOrderPrice(order)}元</Typography>
                    </Column>
                  </Row>
                </AccordionSummary>
              )}
              <AccordionDetails sx={{ bgcolor: theme.palette.secondary.contrastText }}>
                <List>
                  {order.orderMeals.map((orderMeal, idx) => (
                    <OrderMealItem idx={idx} key={orderMeal.id} status={status} orderMeal={orderMeal} />
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};
