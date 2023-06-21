import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { PaymentApi } from "~/api";
import { EcPayResponseBody, Id, LinePayConfirmProps, LinePayRequestBody, PaymentSliceState } from "~/types/api";

const name = "payment";
const initialState: PaymentSliceState = {
  isLoading: false,
  error: null,
  paymentItem: null,
  isOpenPaymentDrawer: false,
  linePayResponse: {
    message: "",
    result: {}
  },
  ecPayResponse: {
    message: "",
    result: {}
  },
  cashPaymentResponse: {
    message: "",
    result: {}
  },
  linePayConfirmResponse: {
    message: "",
    result: {}
  }
};

export const requestCashPayment = createAsyncThunk(
  `${name}/cashPaymentRequest`,
  async (orderId: Id | Id[], { rejectWithValue }) => {
    try {
      const response = await PaymentApi.cashPaymentRequest(orderId);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const requestLinePay = createAsyncThunk(
  `${name}/requestLinePay`,
  async (request: LinePayRequestBody, { rejectWithValue }) => {
    try {
      const response = await PaymentApi.paymentLinePayRequest(request);
      const { message } = response;
      const result = response.result.body;
      return { message, result };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const requestEcPay = createAsyncThunk(
  `${name}/requestEcPay`,
  async (request: EcPayResponseBody, { rejectWithValue }) => {
    try {
      const response = await PaymentApi.paymentEcPayRequest(request);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const confirmLinePay = createAsyncThunk(
  `${name}/confirmLinePay`,
  async (Ids: LinePayConfirmProps, { rejectWithValue }) => {
    try {
      const { transactionId, orderId } = Ids;
      const response = await PaymentApi.paymentLinePayConfirm(transactionId, orderId);
      console.log("Api Response:", response);
      const { message, result } = response;
      const { paymentLog } = result;
      const info = result.response.body.info;
      return {
        message,
        result: {
          paymentLog,
          result: info
        }
      };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const cancelLinePay = createAsyncThunk(`${name}/cancelLinePay`, async (orderId: Id, { rejectWithValue }) => {
  try {
    const response = await PaymentApi.paymentLinePayCancel(orderId);
    const { message } = response;
    const result = response.result.body;
    return { message, result };
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: "unknown error" });
    }
  }
});

export const cancelEcPay = createAsyncThunk(`${name}/cancelEcPay`, async (_, { rejectWithValue }) => {
  try {
    const response = await PaymentApi.paymentEcPayCancel();
    return response;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: "unknown error" });
    }
  }
});

export const paymentSlice = createSlice({
  name,
  initialState,
  reducers: {
    openPaymentDrawer: (state, action: PayloadAction<PaymentSliceState["paymentItem"]>) => {
      state.paymentItem = action.payload;
      state.isOpenPaymentDrawer = true;
    },
    closePaymentDrawer: (state) => {
      state.paymentItem = initialState.paymentItem;
      state.isOpenPaymentDrawer = initialState.isOpenPaymentDrawer;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(requestLinePay.fulfilled, (state, { payload }) => {
      state.linePayResponse = payload;
    });
    builder.addCase(requestEcPay.fulfilled, (state, { payload }) => {
      state.ecPayResponse = payload;
    });
    builder.addCase(confirmLinePay.fulfilled, (state, { payload }) => {
      state.linePayConfirmResponse = payload;
    });
    builder.addCase(cancelLinePay.fulfilled, (state, { payload }) => {
      state.linePayResponse = payload;
    });
    builder.addCase(cancelEcPay.fulfilled, (state, { payload }) => {
      state.ecPayResponse = payload;
    });
    builder.addCase(requestCashPayment.fulfilled, (state, { payload }) => {
      state.cashPaymentResponse = payload;
    });
  }
});

export const { openPaymentDrawer, closePaymentDrawer } = paymentSlice.actions;
