// Libs
import { useEffect } from "react";
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

const OrderList = () => {
  const dispatch = useAppDispatch();

  const tabStatus = useAppSelector(({ order }) => order.status);
  const orders = useAppSelector(({ order }) => order.orders);

  const gatherOrders = () => {
    let showNewOrders: ParentOrder[] = [];

    orders.forEach((order) => {
      const { id, status, type, seats = [], paymentLogs, reservationLogId } = order;
      const parentOrder: ParentOrder = { id, status, type, seats, paymentLogs, orders: [order], reservationLogId };

      if (seats !== undefined) {
        // 內用單
        const sameGroupOrderIndex = showNewOrders.findIndex(
          (item) => item.seats?.join(",") === seats.join(",") && item.reservationLogId === reservationLogId
        );

        if (sameGroupOrderIndex === -1 && !showNewOrders[sameGroupOrderIndex]) {
          showNewOrders.push(parentOrder);
        } else {
          (showNewOrders[sameGroupOrderIndex] as ParentOrder).orders.push(order);
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
            height: `calc(100vh - ${headerHeight} - 54px)`,
            userSelect: "none"
          }}
        >
          {isPendingOrCancelOrder
            ? // 準備中、已取消
              orders.map((order) => <PendingAndCancelOrderItem key={order.id} order={order} />)
            : // 未付款、已付款
              gatherOrders().map((order) => <UnpaidAndSuccessOrderItem key={order.id} parentOrder={order} />)}
        </Box>
      ) : (
        <Column
          justifyContent="center"
          bgcolor="background.paper"
          height={`calc(100vh - ${headerHeight} - 54px)`}
          sx={{
            userSelect: "none"
          }}
        >
          <Typography variant="h4" textAlign="center" color="text.disabled">
            無此分類訂單
          </Typography>
        </Column>
      )}
      <TabletModal.CancelOrderConfirm />
    </>
  );
};

export default OrderList;
