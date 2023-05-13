import { FC, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { OrderList, OrderTabs } from "./index.style";
import { OrderStatus } from "~/types/common";
import { useAppDispatch } from "~/app/hook";
import { getOrders } from "~/features/orders/slice";

interface IOrdersContainerPros {}

const STATUS = [
  { value: OrderStatus.UNPAID, title: "未付款", id: OrderStatus.UNPAID },
  { value: OrderStatus.SUCCESS, title: "已付款", id: OrderStatus.SUCCESS },
  { value: OrderStatus.CANCEL, title: "已取消", id: OrderStatus.CANCEL },
  { value: OrderStatus.PENDING, title: "準備中", id: OrderStatus.PENDING }
];

export const OrdersContainer: FC<IOrdersContainerPros> = ({}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getOrders());
  }, []);
  const [orderStatus, setOrderStatus] = useState(STATUS[0].value);
  return (
    <Box>
      <OrderTabs orderStatus={orderStatus} setOrderStatus={setOrderStatus} />
      <OrderList orderStatus={orderStatus} setOrderStatus={setOrderStatus} />
    </Box>
  );
};

export default OrdersContainer;
