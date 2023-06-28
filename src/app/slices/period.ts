// Libs
import { createSlice } from "@reduxjs/toolkit";
import { PeriodApi } from "~/api";
// Others
import { createAppAsyncThunk } from "~/app/hook";
import { DatePeriodInfo } from "~/types";
import appDayjs from "~/utils/dayjs.util";

const name = "period";

export const getPeriods = createAppAsyncThunk(`${name}/getPeriods`, async (payload, { rejectWithValue }) => {
  try {
    return await PeriodApi.getPeriods();
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
  async (payload: Date, { rejectWithValue }) => {
    try {
      let data = await PeriodApi.getPeriodByDate(payload);
      // need to remove
      data.result = data.result.find((e: DatePeriodInfo) => appDayjs(e.date).isSame(payload ?? appDayjs(), "day"));
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

const initialState = {};

export const periodSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: {}
});
