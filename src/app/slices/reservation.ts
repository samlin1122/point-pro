// Libs
import { createSlice } from "@reduxjs/toolkit";
import { ReservationApi } from "~/api";
// Others
import { createAppAsyncThunk } from "~/app/hook";
import {
  ReservationsResponse,
  ReservationResponse,
  PostReservationPayload,
  PatchReservationPayload,
  Id
} from "~/types/api";
import { SocketTopic } from "./socket";

const name = "reservation";

export const getReservations = createAppAsyncThunk<ReservationsResponse, Date>(
  `${name}/getReservations`,
  async (payload, { rejectWithValue }) => {
    try {
      return await ReservationApi.getReservations(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const postReservation = createAppAsyncThunk<ReservationResponse, PostReservationPayload>(
  `${name}/postReservation`,
  async (payload, { getState, rejectWithValue }) => {
    try {
      const socket = getState().socket.socket;
      const response = await ReservationApi.postReservation(payload);
      socket && socket.emit(SocketTopic.RESERVATION, response);
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

export const getReservationById = createAppAsyncThunk<ReservationResponse, Id>(
  `${name}/getReservationById`,
  async (payload, { rejectWithValue }) => {
    try {
      return await ReservationApi.getReservationById(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const patchReservationById = createAppAsyncThunk<ReservationResponse, PatchReservationPayload>(
  `${name}/patchReservationById`,
  async (payload, { getState, rejectWithValue }) => {
    try {
      const socket = getState().socket.socket;
      const response = await ReservationApi.patchReservationById(payload);
      socket && socket.emit(SocketTopic.RESERVATION, response);
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

interface ReservationState {}
const initialState: ReservationState = {};

export const reservationSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: {}
});

export const {} = reservationSlice.actions;
