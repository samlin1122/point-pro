// Libs
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Others
import appDayjs from "~/utils/dayjs.util";
import { createAppAsyncThunk } from "~/app/hook";
import { IAvailableBooking, IBookingInfo, ICustomerBookingSliceState } from "~/types";
import { BookingType, CustomerBookingDialog, Gender } from "~/types/common";
import { getAvailablePeriods } from "~/api/BookingApi";
import { DatePeriodInfo, PeriodInfo } from "~/types/api";

const name = "customerBooking";
const initialState: ICustomerBookingSliceState = {
  step: 0,
  availableBookings: [],
  choosedDate: appDayjs().startOf("day").valueOf(),
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
  dialog: null,
  isAgreedPrivacyPolicy: false,
  isLoading: false
};

export const getAvailableBooking = createAppAsyncThunk(`${name}/getAvailableBooking`, async (arg, thunkAPI) => {
  try {
    const periodsResp = await getAvailablePeriods();
    const periodInfos = periodsResp.result;
    const availableBookings: IAvailableBooking[] = periodInfos.map((info: DatePeriodInfo) => {
      return {
        date: new Date(info.date).valueOf(),
        availablePeriods: info.periods.map((period: PeriodInfo) => ({
          startedAt: new Date(period.periodStartedAt).valueOf(),
          endedAt: appDayjs(period.periodStartedAt).add(2, "hour").toDate().valueOf(),
          bookedAmount: period.amount - period.available,
          peopleAmount: period.available
        }))
      };
    });

    return { availableBookings: availableBookings.sort((a, b) => a.date - b.date) };
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
        (availableBooking) => availableBooking.date === action.payload
      );

      state.availablePeriod =
        (availableBooking?.availablePeriods &&
          availableBooking?.availablePeriods.filter((availablePeriod) => availablePeriod.peopleAmount > 0)) ??
        [];
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
