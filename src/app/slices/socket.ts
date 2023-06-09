import { Socket } from "socket.io-client";
import { createSlice } from "@reduxjs/toolkit";
import { Gender, OrderStatus, OrderType } from "~/types/common";
import { BookingType, OrderMeal } from "~/features/orders/type";
import { IBookingInfo } from "~/types";

const name = "socket";
// [TODO]: type refactor

export enum SocketTopic {
  MENU = "MENU",
  ORDER = "ORDER",
  RESERVATION = "RESERVATION"
}

export enum NotificationsOrderMessage {
  CREATE_ORDER = "CREATE_ORDER",
  UPDATE_ORDER = "UPDATE_ORDER",
  CANCEL_ORDER = "CANCEL_ORDER",
  PAY_ORDER = "PAY_ORDER"
}

export enum NotificationsMenuMessage {
  CREATE_MEAL = "CREATE_MEAL",
  UPDATE_MEAL = "UPDATE_MEAL",
  DELETE_MEAL = "DELETE_MEAL"
}

export enum NotificationReservationMssage {
  CREATE_RESERVATION = "CREATE_RESERVATION",
  UPDATE_RESERVATION = "UPDATE_RESERVATION"
}

type OrderNotification = {
  notiType: SocketTopic.ORDER;
  message: NotificationsOrderMessage;
  result: {
    id: string;
    type: OrderType;
    status: OrderStatus;
    parentOrderId: string | null;
    reservationLogId: string | null;
    createAt: string | null;
    updatedAt: string | null;
    orderMeals: OrderMeal[];
    paymentLogs: [];
    seats?: string[];
    reservationsLogs: {
      id: string;
      options: Omit<IBookingInfo, "id" | "reservedAt">;
      bookedSeats: {
        seat: {
          prefix: string;
          no: number;
        };
      }[];
    } | null;
  };
};

type MenuNotification = {
  notiType: SocketTopic.MENU;
  message: NotificationsMenuMessage;
  result: {
    id: string;
    title: string;
    coverUrl: string;
    description: string;
    price: number;
    position: number;
    isPopular: boolean;
    publishedAt: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    categories: any[];
    specialties: any[];
  };
};

type ReservationNotification = {
  notiType: SocketTopic.RESERVATION;
  message: NotificationReservationMssage;
  result: {
    id: string;
    reservedAt: string;
    type: BookingType;
    options: {
      name: string;
      gender: Gender;
      type: BookingType;
      phone: string;
      email: string;
      remark: string;
      adults: number;
      children?: number;
    };
    periodStartedAt: string;
    periodEndedAt: string;
    seats: {
      id: string;
      seatNo: string;
      amount: number;
    }[];
    token?: string;
  };
};

type SocketSliceState = {
  socket: Socket | undefined;
  notifications: (OrderNotification | MenuNotification | ReservationNotification)[];
};
const initialState: SocketSliceState = {
  socket: undefined,
  notifications: JSON.parse(sessionStorage.getItem("notifications") ?? "[]")
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
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      sessionStorage.setItem("notifications", JSON.stringify(state.notifications));
    },
    removeNotification: (state, action) => {
      state.notifications.splice(action.payload, 1);
      sessionStorage.setItem("notifications", JSON.stringify(state.notifications));
    },
    clearNotifications: (state) => {
      state.notifications = [];
      sessionStorage.setItem("notifications", JSON.stringify(state.notifications));
    }
  }
});

export const { setSocket, resetSocket, addNotification, removeNotification, clearNotifications } = socketSlice.actions;
