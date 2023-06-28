// Libs
import { createSlice } from "@reduxjs/toolkit";
import { SeatApi } from "~/api";
// Others
import { createAppAsyncThunk } from "~/app/hook";
import { Id, SeatsPayload, SeatsResponse } from "~/types/api";

const name = "seat";

export const getSeats = createAppAsyncThunk<SeatsResponse, SeatsPayload>(
  `${name}/getSeats`,
  async (payload, { rejectWithValue }) => {
    try {
      return await SeatApi.getSeats(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);
export const getSeatById = createAppAsyncThunk<SeatsResponse, Id>(
  `${name}/getSeatById`,
  async (payload, { rejectWithValue }) => {
    try {
      return await SeatApi.getSeatById(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

interface SeatState {}
const initialState: SeatState = {};

export const seatSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: {}
});

export const {} = seatSlice.actions;
