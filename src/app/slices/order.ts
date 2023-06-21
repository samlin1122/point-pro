import { createSlice } from "@reduxjs/toolkit";
import { DialogType, Order, ParentOrder } from "~/features/orders/type";
import { createAppAsyncThunk } from "../hook";
import { OrderApi } from "~/api";
import { clearCart, openDialog } from "~/features/orders/slice";
import appDayjs from "~/utils/dayjs.util";
import { calculateCartItemPrice } from "~/utils/price.utils";
import { OrderStatus } from "~/types/common";
import { SocketTopic } from "~/hooks/useSocket";

type OrderSliceState = {
  status: OrderStatus;
  orders: Order[];
  isLoading: boolean;
  currentOrder: ParentOrder | null;
};

const name = "order";
const initialState: OrderSliceState = {
  status: OrderStatus.PENDING,
  orders: [],
  isLoading: false,
  currentOrder: null
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
  async (_, { getState, dispatch, rejectWithValue }) => {
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
          specialties
        };
      });

      const order = await OrderApi.postOrderRequest({ orderMeals });

      socket && socket.emit(SocketTopic.ORDER, order);
      dispatch(clearCart());
      dispatch(getOrders({}));
      dispatch(openDialog({ type: DialogType.ORDER }));

      return order;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const deleteOrder = createAppAsyncThunk(
  `${name}/deleteOrder`,
  async (payload: { orderId: string }, { getState, dispatch, rejectWithValue }) => {
    try {
      const socket = getState().socket.socket;
      const deleteOrder = await OrderApi.deleteOrderRequest(payload);
      socket && socket.emit(SocketTopic.ORDER, deleteOrder);
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
      .addCase(deleteOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteOrder.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteOrder.rejected, (state) => {
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

export const { setOrderStatus } = orderSlice.actions;
