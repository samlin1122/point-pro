// Libs
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Others
import appDayjs, { formatDateOnly, convertToDatePayload } from "~/utils/dayjs.util";
import { createAppAsyncThunk } from "~/app/hook";
import { IBookingInfo, ICustomerBookingSliceState } from "~/types";
import { BookingType, CustomerBookingDialog, Gender } from "~/types/common";
import { ReservationApi, PeriodApi } from "~/api";
import { SocketTopic } from "~/app/slices/socket";

const name = "customerReservation";
const initialState: ICustomerBookingSliceState = {
  step: 0,
  availableBookings: [],
  token: "",
  choosedDate: appDayjs(),
  availablePeriods: [],
  reservationParams: {
    id: "",
    reservedAt: "",
    user: {
      name: "",
      gender: Gender.other,
      type: BookingType["online-booking"],
      phone: "",
      email: "",
      remark: "",
      adults: 1,
      children: 0
    }
  },
  reservationPhone: "",
  dialog: null,
  isAgreedPrivacyPolicy: false,
  isLoading: false
};

export const getPeriods = createAppAsyncThunk(`${name}/getPeriods`, async (arg, { rejectWithValue }) => {
  try {
    const { result } = await PeriodApi.getPeriods();
    const availableBookings = [...new Set(result.map((item: any) => formatDateOnly(item.periodStartedAt)))] as string[];
    return { availableBookings };
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: "unknown error" });
    }
  }
});

export const getPeriodByDate = createAppAsyncThunk(
  `${name}/getPeriodByDate`,
  async (arg, { getState, rejectWithValue }) => {
    try {
      const choosedDate = getState().customerReservation.choosedDate;
      const { result } = await PeriodApi.getPeriodByDate({
        date: convertToDatePayload(choosedDate),
        excludeTime: false
      });
      const availablePeriods = result[0]?.periods ?? [];
      return { availablePeriods };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const postReservation = createAppAsyncThunk(
  `${name}/postReservation`,
  async (arg, { getState, rejectWithValue }) => {
    try {
      const reservationParams = getState().customerReservation.reservationParams;
      const socket = getState().socket.socket;

      const response = await ReservationApi.postReservation({
        type: "OnlineBooking",
        amount: reservationParams.user.adults + reservationParams.user.children,
        options: reservationParams.user,
        periodStartedAt: new Date(reservationParams.reservedAt)
      });

      socket && socket.emit(SocketTopic.RESERVATION, response);

      return response.result;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const getBookingRecord = createAppAsyncThunk(
  `${name}/getBookingRecord`,
  async (reservationPhone: string, { rejectWithValue, dispatch }) => {
    try {
      // [TODO]
      // const { result } = await ReservationApi.getReservationByPhone(reservationPhone);
      const bookingRecordRes = await fetch(`/data/dummyBookingRecord.json`);
      const bookingRecord = (await bookingRecordRes.json()) as IBookingInfo;
      dispatch(setDialog(CustomerBookingDialog.REMINDER));
      return { bookingRecord };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const customerBookingSlice = createSlice({
  name,
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<ICustomerBookingSliceState["step"]>) => {
      state.step = action.payload;
    },
    setToken: (state, action: PayloadAction<ICustomerBookingSliceState["token"]>) => {
      state.token = action.payload;
    },
    setDate: (state, action: PayloadAction<ICustomerBookingSliceState["choosedDate"]>) => {
      state.choosedDate = action.payload;
      state.reservationParams.reservedAt =
        state.availablePeriods[0]?.periodStartedAt ?? initialState.reservationParams.reservedAt;
      state.reservationParams.user.adults = initialState.reservationParams.user.adults;
    },
    setReservedAt: (state, action: PayloadAction<IBookingInfo["reservedAt"]>) => {
      state.reservationParams.reservedAt = action.payload;
      state.reservationParams.user.adults = initialState.reservationParams.user.adults;
    },
    setName: (state, action: PayloadAction<IBookingInfo["name"]>) => {
      state.reservationParams.user.name = action.payload;
    },
    setGender: (state, action: PayloadAction<IBookingInfo["gender"]>) => {
      state.reservationParams.user.gender = action.payload;
    },
    setPhone: (state, action: PayloadAction<IBookingInfo["phone"]>) => {
      state.reservationParams.user.phone = action.payload;
    },
    setEmail: (state, action: PayloadAction<IBookingInfo["email"]>) => {
      state.reservationParams.user.email = action.payload;
    },
    setRemark: (state, action: PayloadAction<IBookingInfo["remark"]>) => {
      state.reservationParams.user.remark = action.payload;
    },
    setAdultsAmount: (state, action: PayloadAction<IBookingInfo["adults"]>) => {
      state.reservationParams.user.adults = action.payload;
    },
    setReservationPhone: (state, action) => {
      state.reservationPhone = action.payload;
    },
    setDialog: (state, action: PayloadAction<ICustomerBookingSliceState["dialog"]>) => {
      state.dialog = action.payload;
    },
    setAgreedPolicy: (state, action: PayloadAction<ICustomerBookingSliceState["isAgreedPrivacyPolicy"]>) => {
      state.isAgreedPrivacyPolicy = action.payload;
    },
    resetUserInfo: (state) => {
      state.reservationParams.user = initialState.reservationParams.user;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPeriods.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getPeriods.fulfilled, (state, action) => {
        state.availableBookings = action.payload.availableBookings;
        state.isLoading = false;
      })
      .addCase(getPeriodByDate.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getPeriodByDate.fulfilled, (state, action) => {
        state.availablePeriods = action.payload.availablePeriods;
        state.isLoading = false;
      })
      .addCase(postReservation.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.reservationParams.id = action.payload.id;
        state.reservationParams.reservedAt = action.payload.periodStartedAt;
        state.reservationParams.user = action.payload.options;
        state.isLoading = false;
      })
      .addCase(postReservation.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(postReservation.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getPeriods.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getPeriodByDate.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getBookingRecord.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBookingRecord.fulfilled, (state, action) => {
        const { id, reservedAt, ...rest } = action.payload.bookingRecord;
        state.reservationParams.id = id;
        state.reservationParams.reservedAt = reservedAt;
        state.reservationParams.user = rest;
        state.isLoading = false;
      })
      .addCase(getBookingRecord.rejected, (state, action) => {
        state.isLoading = false;
      });
  }
});

export const {
  setStep,
  setDate,
  setReservedAt,
  setName,
  setGender,
  setPhone,
  setEmail,
  setRemark,
  setAdultsAmount,
  setReservationPhone,
  setDialog,
  setAgreedPolicy,
  resetUserInfo
} = customerBookingSlice.actions;
