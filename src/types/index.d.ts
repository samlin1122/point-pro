import { Params, NavigateFunction, Location } from "react-router-dom";
import {
  BookingModal,
  BookingStepType,
  BookingType,
  Gender,
  CustomerOrderDialog,
  OrderStatus,
  OrderType,
  PaymentGateway,
  SpecialtyType,
  SeatStatus
} from "./common";

export type IBasicKey = Record<"id" | "title", string>;

export type Timestamp = number;

export interface IMenuCategory extends IBasicKey {}

export interface IMeal extends IBasicKey {
  coverUrl: boolean;
  description: boolean;
  price: boolean;
  position: boolean;
  published_at: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  specialties: ISpecialty[];
  categories: IMenuCategory[];
}

export interface ICombineMenu extends IMenuCategory {
  allMeals: IMeal[];
}

export interface ISpecialty extends IBasicKey {
  type: SpecialtyType;
  items: ISpecialtyOption[];
}

export interface ISpecialtyOption extends IBasicKey {
  price?: number;
}

export interface ISelectedSpecialty {
  id: string;
  value: ISpecialtyOption["id"][];
}

export interface ICartItem extends Pick<IMeal, "id" | "title" | "coverUrl" | "price" | "recommended" | "specialties"> {
  amount: number;
}

export interface IOrder {
  id: string;
  status: OrderStatus;
  type: OrderType;
  reservationId: IBookingInfo["id"];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  orderMeals: OrderMeal[];
  paymentLogs: IPaymentLog[];
}

export interface IPaymentLog {
  orderId: IOrder["id"];
  paymentNo: string;
  price: number;
  gateway: PaymentGateway;
  status: OrderStatus.UNPAID | OrderStatus.SUCCESS;
}

export interface OrderMeal {
  id: string;
  orderId: IOrder["id"];
  mealId: IMeal["id"];
  mealTitle: IMeal["title"];
  price: IMeal["price"];
  amount: number;
  servedAmount: number;
  isServed: boolean;
  specialties: ISpecialty[];
  categories: IMenuCategory[];
}

export interface ICustomerOrderSliceState {
  categories: IMenuCategory[];
  menu: IMeal[];
  combinedMenu: ICombineMenu[];
  cart: ICartItem[];
  orders: IOrder[];
  currentCategory: IMenuCategory["id"];
  currentMealId: IMeal["id"];
  currentMealAmount: number;
  currentSpecialty: ISpecialty[];
  currentDialog: string;
  currentModal: string;
  modifiedCartItemIndex: number;
  isModifiedCartItem: boolean;
  isLoading: boolean;
}

export interface IBookingInfo {
  id: string;
  reservedAt: Timestamp;
  name: string;
  gender: Gender;
  type: BookingType;
  phone: string;
  email: string;
  remark: string;
  adults: number;
  children: number;
}

export interface IAvailableBookingPeriod {
  startedAt: Timestamp;
  endAt: Timestamp;
  bookedAmount: number;
  peopleAmount: number;
}

export interface IAvailableBooking {
  date: Timestamp;
  availablePeriods: IAvailableBookingPeriod[];
}

export interface ICreateBookingParams {
  id: IBookingInfo["id"];
  reservedAt: IBookingInfo["reservedAt"];
  user: Omit<IBookingInfo, "id" | "reservedAt">;
}

export interface ICustomerBookingSliceState {
  step: number;
  availableBookings: IAvailableBooking[];
  choosedDate: Timestamp;
  availablePeriod: IAvailableBookingPeriod[];
  bookingParams: ICreateBookingParams;
  queryString: string;
  dialog: CustomerBookingDialog;
  isAgreedPrivacyPolicy: boolean;
  isLoading: boolean;
}

export interface RouterProps {
  location: Location;
  navigate: NavigateFunction;
  params: Params;
}

export type SeatReservationInfo = {
  seatNo: string;
  status: SeatStatus;
  details: ReservationInfo[];
};

export type ReservationInfo = {
  reservationTime: Date;
  id: string;
  seats: string[];
  options: { [key: string]: any };
};

type Seat = {
  seatNo: string;
  currentStatus: SeatStatus;
  reservations: ReservationInfo[];
};

export type Member = {
  id: string;
  account: string;
  email: string;
  name: string;
  role: "MERCHANT" | "CUSTOMER";
};
