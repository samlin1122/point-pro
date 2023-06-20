import {
  CashPaymentResponse,
  EcPayResponse,
  EcPayResponseBody,
  Id,
  LinePayRequestBody,
  LinePayConfirmResponse,
  LinePayResponse
} from "~/types/api";
import http from "./http";

export const paymentLinePayRequest = (payload: LinePayRequestBody) => {
  return http.post<string, LinePayResponse>(`/payment/line-pay/request`, payload);
};

export const paymentLinePayConfirm = (transactionId: string, orderId: string) => {
  return http.get<string, LinePayConfirmResponse>(
    `/payment/line-pay/confirm?transactionId=${transactionId}&orderId=${orderId}`
  );
};

export const paymentLinePayCancel = (orderId: Id) => {
  return http.get<string, LinePayResponse>(`/payment/line-pay/cancel`, {
    params: {
      orderId
    }
  });
};

export const paymentEcPayRequest = (payload: EcPayResponseBody) => {
  return http.post<string, EcPayResponse>(`/payment/ec-pay/request`, payload);
};

export const paymentEcPayCancel = () => {
  return http.post<string, EcPayResponse>("/payment/ec-pay/cancel");
};

export const cashPaymentRequest = (orderId: Id | Id[]) => {
  return http.post<string, CashPaymentResponse>(`/payment/cash/request`, {
    orderId
  });
};
