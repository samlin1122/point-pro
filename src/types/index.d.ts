import { Params, NavigateFunction, Location } from "react-router-dom";
import {
  BookingModal,
  BookingStepType,
  BookingType,
  Gender,
  OrderStatus,
  OrderType,
  PaymentGateway,
  SpecialtyType,
  SeatStatus
} from "./common";

export type IBasicKey = Record<"id" | "title", string>;

export type Timestamp = number;

export interface ICategory extends IBasicKey {}

export interface IMeal extends IBasicKey {
  coverUrl?: string;
  description?: string;
  price?: number;
  position?: number;
  publishedAt?: string | null;
  isPopular?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  categories?: string[];
  specialties?: string[];
}

export interface ICombineMenu extends ICategory {
  allMeals: IMeal[];
}

export interface ISpecialty extends IBasicKey {
  type: SpecialtyType;
  items: ISpecialtyItem[];
  [key: string]: any;
}

export interface ISpecialtyItem extends IBasicKey {
  price?: number;
}

export interface ISelectedSpecialty {
  id: string;
  value: ISpecialtyItem["id"][];
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
  order: any;
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
  categories: ICategory[];
  mealDetails?: string;
  meal?: IMeal;
}

export interface MealDetail {
  id: string;
  type: string;
  title: string;
  items: {
    id: string;
    title: string;
    price: number;
  }[];
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
  token?: string;
  availableBookings: IAvailableBooking[];
  choosedDate: Timestamp;
  availablePeriod: IAvailableBookingPeriod[];
  reservationParams: ICreateBookingParams;
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

export type Member = {
  id: string;
  account: string;
  email: string;
  name: string;
  role: "MERCHANT" | "CUSTOMER";
};

export type CategoriesOnMeals = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  mealId: string;
};

export type SpecialtiesOnMeals = {
  id: string;
  position: number | null;
  createdAt: Date;
  updatedAt: Date;
  specialtyId: string;
  mealId: string;
};

type PeriodInfo = {
  id: string;
  periodStartedAt: Date;
  amount: number;
  available: number;
};

type DatePeriodInfo = {
  date: Date;
  periods: PeriodInfo[];
  totalAmount: number;
  totalAvailable: number;
};

interface ReservationHistory extends ReservationInfo {
  periodId: string;
}
export type ReservationRecord = {
  periodId?: string;
  startedAt: Date;
  startOfMeal: Date | null;
  endOfMeal: Date | null;
  options?: { [key: string]: any };
};

export type ReservationInfo = {
  id: string;
  reservedAt: Date;
  type: BookingType;
  options: { [key: string]: any };
  periodStartedAt: Date;
  periodEndedAt: Date;
  startOfMeal: Date | null;
  endOfMeal: Date | null;
  seats: PartialSeat[];
};

type SeatInfo = {
  id: string;
  seatNo: string;
  status: "RESERVED" | "AVAILABLE" | "OCCUPIED";
  date: Date;
  currentReservation: ReservationRecord;
};

type SeatDetails = {
  id: string;
  seatNo: string;
  status: "RESERVED" | "AVAILABLE" | "OCCUPIED";
  date: Date;
  history: ReservationHistory[];
};
