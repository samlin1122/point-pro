import { createSlice } from "@reduxjs/toolkit";
import { DialogType, Order, GatherOrder } from "~/features/orders/type";
import { createAppAsyncThunk } from "../hook";
import { OrderApi } from "~/api";
import { clearCart, openDialog } from "~/features/orders/slice";
import appDayjs from "~/utils/dayjs.util";
import { calculateCartItemPrice } from "~/utils/price.utils";
import { OrderStatus } from "~/types/common";
import { SocketTopic } from "./socket";
import { openPaymentDrawer } from "./payment";

type OrderSliceState = {
  status: OrderStatus;
  orders: Order[];
  currentOrder: GatherOrder | null;
  mobileOrderStatusTab: number;
  cancelOrderId: string;
  isLoading: boolean;
};

const name = "order";
const initialState: OrderSliceState = {
  status: OrderStatus.PENDING,
  orders: [],
  currentOrder: null,
  mobileOrderStatusTab: 0,
  cancelOrderId: "",
  isLoading: false
};

export const getOrders = createAppAsyncThunk(
  `${name}/getOrders`,
  async (payload: { status?: OrderSliceState["status"] }, { rejectWithValue }) => {
    try {
      const { status = "" } = payload;
      const orderRes = await OrderApi.getOrdersRequest({ status });
      const { result = [] } = orderRes;
      const orders = result.sort(
        (a: Order, b: Order) => appDayjs(b.createdAt).valueOf() - appDayjs(a.createdAt).valueOf()
      );

      return { orders };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const postOrder = createAppAsyncThunk(
  `${name}/postOrder`,
  async (payload: { isUser: boolean }, { getState, dispatch, rejectWithValue }) => {
    try {
      const cart = getState().takeOrder.cart;
      const socket = getState().socket.socket;
      const orderMeals = cart.map((cartItem) => {
        const { amount, id, specialties, title } = cartItem;
        const mealsPrice = calculateCartItemPrice(cartItem);
        return {
          id,
          title,
          amount,
          price: mealsPrice,
          specialties,
          servedAmount: 0
        };
      });

      const response = await OrderApi.postOrderRequest({ orderMeals });
      const { id, status, type, seats = [], paymentLogs, reservationLogId } = response.result;
      const gatherOrder: GatherOrder = {
        id,
        status,
        type,
        seats,
        paymentLogs,
        orders: [response.result],
        reservationLogId
      };
      console.log({ response, gatherOrder });

      if (payload.isUser) {
        dispatch(getOrders({}));
        dispatch(setMobileOrderStatusTab(0));
        dispatch(openDialog({ type: DialogType.ORDER }));
      } else {
        // 後台外帶訂單先結帳
        dispatch(openPaymentDrawer(gatherOrder));
      }
      dispatch(clearCart());
      socket && socket.emit(SocketTopic.ORDER, response);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const cancelOrder = createAppAsyncThunk(
  `${name}/cancelOrder`,
  async (arg, { getState, dispatch, rejectWithValue }) => {
    try {
      const orderId = getState()[name].cancelOrderId;
      const socket = getState().socket.socket;
      const cancelOrder = await OrderApi.deleteOrderRequest({ orderId });
      socket && socket.emit(SocketTopic.ORDER, cancelOrder);
      dispatch(getOrders({ status: getState()[name].status }));
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const patchOrder = createAppAsyncThunk(
  `${name}/patchOrder`,
  async (order: Order, { getState, dispatch, rejectWithValue }) => {
    try {
      const socket = getState().socket.socket;
      const updatedOrder = await OrderApi.patchOrderRequest(order);
      socket && socket.emit(SocketTopic.ORDER, updatedOrder);
      dispatch(getOrders({ status: getState()[name].status }));
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const orderSlice = createSlice({
  name,
  initialState,
  reducers: {
    setOrderStatus: (state, action) => {
      state.status = action.payload;
    },
    setMobileOrderStatusTab: (state, action) => {
      state.mobileOrderStatusTab = action.payload;
    },
    setCancelOrder: (state, action) => {
      state.cancelOrderId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // get order
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        const { orders } = action.payload;
        state.isLoading = false;
        state.orders = orders;
      })
      .addCase(getOrders.rejected, (state) => {
        state.isLoading = false;
        state.orders = initialState.orders;
      })
      // post order
      .addCase(postOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postOrder.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(postOrder.rejected, (state) => {
        state.isLoading = false;
      })
      // delete order
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelOrder.fulfilled, (state) => {
        state.cancelOrderId = initialState.cancelOrderId;
        state.isLoading = false;
      })
      .addCase(cancelOrder.rejected, (state) => {
        state.cancelOrderId = initialState.cancelOrderId;
        state.isLoading = false;
      })
      // patch order
      .addCase(patchOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(patchOrder.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(patchOrder.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const { setOrderStatus, setMobileOrderStatusTab, setCancelOrder } = orderSlice.actions;
