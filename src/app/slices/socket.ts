import { Socket } from "socket.io-client";
import { createSlice } from "@reduxjs/toolkit";

const name = "socket";
type SocketSliceState = {
  socket: Socket | undefined;
};
const initialState: SocketSliceState = {
  socket: undefined
};
export const socketSlice = createSlice({
  name,
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    resetSocket: (state) => {
      return initialState;
    }
  }
});

export const { setSocket, resetSocket } = socketSlice.actions;
