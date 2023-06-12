import { DeleteOrderResponse, GetOrdersResponse, PostOrderPayload, PostOrderResponse } from "~/types/api";
import http from "./http";
import { Order, OrderStatus } from "~/features/orders/type";
import { PatchOrderResponse } from "~/types/api";

export const postOrderRequest = (payload: PostOrderPayload) => {
  return http.post<string, PostOrderResponse>("/order", payload);
};

export const getOrdersRequest = (payload: { status: OrderStatus | "" }) => {
  return http.get<string, GetOrdersResponse>("/order", {
    params: payload
  });
};

export const deleteOrderRequest = (payload: { orderId: string }) => {
  return http.delete<string, DeleteOrderResponse>("/order", {
    params: payload
  });
};

export const patchOrderRequest = (order: Order) => {
  return http.patch<string, PatchOrderResponse>("/order", order);
};
