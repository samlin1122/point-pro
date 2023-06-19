import { Socket } from "socket.io-client";
import { createSlice } from "@reduxjs/toolkit";

const name = "socket";
type SocketSliceState = {
  socket: Socket | undefined;
  notifications: any[];
};
const initialState: SocketSliceState = {
  socket: undefined,
  notifications: JSON.parse(localStorage.getItem("notifications") ?? "[]")
};
export const socketSlice = createSlice({
  name,
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    resetSocket: () => {
      return initialState;
    },
    addNotifications: (state, action) => {
      state.notifications.unshift(action.payload);
      localStorage.setItem("notifications", JSON.stringify(state.notifications));
    }
  }
});

export const { setSocket, resetSocket, addNotifications } = socketSlice.actions;
