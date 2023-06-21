// Libs
import { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
// Components
import { Column } from "~/components/layout";
// Others
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { getOrders } from "~/app/slices/order";
import { ParentOrder } from "~/features/orders/type";
import { TabletModal } from "~/components/modals";
import { headerHeight } from "~/components/header";
import { PendingAndCancelOrderItem, UnpaidAndSuccessOrderItem } from "./OrderItem";
import { OrderStatus } from "~/types/common";

type OrderListProps = {};

const OrderList = (props: OrderListProps) => {
  const dispatch = useAppDispatch();

  const [deleteOrderId, setDeleteOrderId] = useState("");

  const tabStatus = useAppSelector(({ order }) => order.status);
  const orders = useAppSelector(({ order }) => order.orders);

  const gatherOrders = () => {
    let showNewOrders: ParentOrder[] = [];
    orders.forEach((order) => {
      const orderSeats = order.seats;
      const { id, status, type, seats = [], paymentLogs } = order;
      const parentOrder: ParentOrder = { id, status, type, seats, paymentLogs, orders: [order] };

      if (orderSeats !== undefined) {
        // 內用單
        const sameTableOrderIndex = showNewOrders.findIndex((item) => item.seats?.join(",") === orderSeats.join(","));

        if (sameTableOrderIndex === -1 && !showNewOrders[sameTableOrderIndex]) {
          showNewOrders.push(parentOrder);
        } else {
          (showNewOrders[sameTableOrderIndex] as ParentOrder).orders.push(order);
        }
      } else {
        // 外帶單
        showNewOrders.push(parentOrder);
      }
    });
    return showNewOrders;
  };

  const isPendingOrCancelOrder = tabStatus === OrderStatus.PENDING || tabStatus === OrderStatus.CANCEL;
  const isShowOrders = (isPendingOrCancelOrder ? orders.length : gatherOrders().length) > 0;

  useEffect(() => {
    dispatch(getOrders({ status: tabStatus }));
  }, [tabStatus]);

  return (
    <>
      {isShowOrders ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            padding: "0.75rem",
            height: `calc(100vh - ${headerHeight} - 54px)`
          }}
        >
          {isPendingOrCancelOrder
            ? // 準備中、已取消
              orders.map((order) => (
                <PendingAndCancelOrderItem key={order.id} order={order} setDeleteOrderId={setDeleteOrderId} />
              ))
            : // 未付款、已付款
              gatherOrders().map((order) => <UnpaidAndSuccessOrderItem key={order.id} parentOrder={order} />)}
        </Box>
      ) : (
        <Column justifyContent="center" bgcolor="background.paper" height={`calc(100vh - ${headerHeight} - 54px)`}>
          <Typography variant="h4" textAlign="center" color="text.disabled">
            無此分類訂單
          </Typography>
        </Column>
      )}
      <TabletModal.CancelOrderConfirm deleteOrderId={deleteOrderId} setDeleteOrderId={setDeleteOrderId} />
    </>
  );
};

export default OrderList;
