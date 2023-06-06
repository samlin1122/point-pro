import { GetOrdersResponse, PostOrderPayload, PostOrderResponse } from "~/types/api";
import http from "./http";

export const postOrder = (payload: PostOrderPayload) => {
  return http.post<string, PostOrderResponse>("/order", payload);
};

export const getOrders = () => {
  return http.get<string, GetOrdersResponse>("/order");
};
