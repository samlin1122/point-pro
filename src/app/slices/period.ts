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
      return await PeriodApi.getPeriodByDate(payload);
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
