import { OrderStatus, OrderType, SpecialtyType } from "~/types/common";

export enum BookingType {
  OnlineBooking = "OnlineBooking",
  PhoneBooking = "PhoneBooking",
  WalkInSeating = "WalkInSeating"
}

export enum DialogType {
  CUSTOMIZED = "CUSTOMIZED",
  CART = "CART",
  ORDER = "ORDER"
}

// [TODO]
export type UserInfo = {
  periodEndTime: string;
  periodStartTime: string;
  seatNo: string;
  startTime: string;
  reservationType: BookingType;
  reservationLogId: string;
  iat: number;
  exp: number;
  role: "USER";
} | null;

export type Category = {
  id: string;
  title: string;
  position: number;
  createAt?: number;
  updatedAt?: number;
};

export type Meal = {
  id: string;
  title: string;
  coverUrl: string;
  description: string;
  price: number;
  position: number;
  createAt?: number;
  updatedAt?: number;
  publishedAt?: number;
  isPopular: boolean;
  categories: Category[];
  specialties: Specialty[];
};

export type Specialty = {
  id: string;
  title: string;
  type: SpecialtyType;
  items: SpecialtyItem[];
  createAt?: number;
  updatedAt?: number;
};

export type SpecialtyItem = {
  id: string;
  title: string;
  price: number;
  createAt?: number;
  updatedAt?: number;
};

export type Menu = Category & {
  meals: Meal[];
};

export type OrderMeal = {
  id: string;
  mealId: string;
  title: string;
  specialties: Specialty[];
  price: number;
  amount: number;
  servedAmount: number;
  categories: Category[];
  mealPrice: number;
};

export type Order = {
  id: string;
  status: OrderStatus;
  type: OrderType;
  orderMeals: OrderMeal[];
  paymentLogs: any[]; //[TODO]: type definition
  createdAt?: number;
  updatedAt?: number;
  seats?: string[];
  reservationLogId?: string;
};

export type ParentOrder = {
  id: string;
  status: OrderStatus;
  type: OrderType;
  seats: string[];
  paymentLogs: any[];
  orders: Order[];
  reservationLogId?: string;
};

export type CartItem = Meal & { amount: number };
