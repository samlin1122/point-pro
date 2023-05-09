// Libs
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";

// Others
import { createAppAsyncThunk } from "~/app/hook";
import { IAvailableBooking, IBookingInfo, ICustomerBookingSliceState } from "~/types";
import { BookingType, CustomerBookingDialog, Gender } from "~/types/common";

const name = "customerBooking";
const initialState: ICustomerBookingSliceState = {
  step: 0,
  availableBookings: [],
  choosedDate: dayjs().startOf("day").valueOf(),
  availablePeriod: [],
  bookingParams: {
    id: "",
    reservedAt: 0,
    user: {
      name: "",
      gender: Gender["male"],
      type: BookingType["online-booking"],
      phone: "",
      email: "",
      remark: "",
      adults: 1,
      children: 0
    }
  },
  queryString: "",
  dialog: CustomerBookingDialog.QRCODE,
  isAgreedPrivacyPolicy: false,
  isLoading: false
};

export const getAvailableBooking = createAppAsyncThunk(`${name}/getAvailableBooking`, async (arg, thunkAPI) => {
  try {
    const availableBookingRes = await fetch("/data/dummyAvailableBooking.json");

    const { availableBookings = [] }: { availableBookings: IAvailableBooking[] } = await availableBookingRes.json();

    return { availableBookings };
  } catch (error) {
    // [TODO]: handle error
    console.log(error);
    return thunkAPI.rejectWithValue({ message: "Something went wrong..." });
  }
});

export const postBookingRecord = createAppAsyncThunk(`${name}/postBookingRecord`, async (arg, thunkAPI) => {
  try {
    const bookingParams = thunkAPI.getState().customerBooking.bookingParams;
    console.log({ bookingParams });
  } catch (error) {
    // [TODO]: handle error
    console.log(error);
    return thunkAPI.rejectWithValue({ message: "Something went wrong..." });
  }
});

export const getBookingRecord = createAppAsyncThunk(`${name}/getBookingRecord`, async (arg, thunkAPI) => {
  try {
    // [TODO]: replace to correct API
    // const queryString = thunkAPI.getState().customerBooking.queryString;
    // const bookingRecordRes = await fetch(`api/reservation?input=${queryString}`);
    const bookingRecordRes = await fetch(`/data/dummyBookingRecord.json`);
    const bookingRecord = (await bookingRecordRes.json()) as IBookingInfo;
    return { bookingRecord };
  } catch (error) {
    // [TODO]: handle error
    console.log(error);
    return thunkAPI.rejectWithValue({ message: "Something went wrong..." });
  }
});

export const customerBookingSlice = createSlice({
  name,
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<ICustomerBookingSliceState["step"]>) => {
      state.step = action.payload;
    },
    setDate: (state, action: PayloadAction<ICustomerBookingSliceState["choosedDate"]>) => {
      state.choosedDate = action.payload;
      const availableBooking = state.availableBookings.find(
        (availableBooking) => availableBooking.date === state.choosedDate
      );
      state.availablePeriod =
        availableBooking?.availablePeriods.filter((availablePeriod) => availablePeriod.peopleAmount > 0) ?? [];
      state.bookingParams.reservedAt = state.availablePeriod[0]?.startedAt ?? initialState.bookingParams.reservedAt;
      state.bookingParams.user.adults = initialState.bookingParams.user.adults;
    },
    setReservedAt: (state, action: PayloadAction<IBookingInfo["reservedAt"]>) => {
      state.bookingParams.reservedAt = action.payload;
      state.bookingParams.user.adults = initialState.bookingParams.user.adults;
    },
    // [TODO]: simplify to one set function, function overload of setBookerInfo
    setName: (state, action: PayloadAction<IBookingInfo["name"]>) => {
      state.bookingParams.user.name = action.payload;
    },
    setGender: (state, action: PayloadAction<IBookingInfo["gender"]>) => {
      state.bookingParams.user.gender = action.payload;
    },
    setPhone: (state, action: PayloadAction<IBookingInfo["phone"]>) => {
      state.bookingParams.user.phone = action.payload;
    },
    setEmail: (state, action: PayloadAction<IBookingInfo["email"]>) => {
      state.bookingParams.user.email = action.payload;
    },
    setRemark: (state, action: PayloadAction<IBookingInfo["remark"]>) => {
      state.bookingParams.user.remark = action.payload;
    },
    setAdultsAmount: (state, action: PayloadAction<IBookingInfo["adults"]>) => {
      state.bookingParams.user.adults = action.payload;
    },
    setQueryString: (state, action) => {
      state.queryString = action.payload;
    },
    setDialog: (state, action: PayloadAction<ICustomerBookingSliceState["dialog"]>) => {
      state.dialog = action.payload;
    },
    setAgreedPolicy: (state, action: PayloadAction<ICustomerBookingSliceState["isAgreedPrivacyPolicy"]>) => {
      state.isAgreedPrivacyPolicy = action.payload;
    },
    resetUserInfo: (state) => {
      state.bookingParams.user = initialState.bookingParams.user;
    }
    // [TODO]
    // setChildrenAmount: (state, action: PayloadAction<IBookingInfo["children"]>) => {
    //   state.bookingParams.user.children = action.payload;
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAvailableBooking.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAvailableBooking.fulfilled, (state, action) => {
        state.availableBookings = action.payload.availableBookings;
        customerBookingSlice.caseReducers.setDate(state, {
          payload: state.availableBookings[0].date ?? initialState.choosedDate,
          type: ""
        });
        state.isLoading = false;
      })
      .addCase(getAvailableBooking.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getBookingRecord.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBookingRecord.fulfilled, (state, action) => {
        const { id, reservedAt, ...rest } = action.payload.bookingRecord;
        state.bookingParams.id = id;
        state.bookingParams.reservedAt = reservedAt;
        state.bookingParams.user = rest;
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
  setQueryString,
  setDialog,
  setAgreedPolicy,
  resetUserInfo
} = customerBookingSlice.actions;
