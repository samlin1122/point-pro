export enum BookingType {
  OnlineBooking = "OnlineBooking",
  PhoneBooking = "PhoneBooking",
  WalkInSeating = "WalkInSeating"
}

export enum SpecialtyType {
  SINGLE = "SINGLE",
  MULTIPLE = "MULTIPLE"
}

export enum OrderStatus {
  UNPAID = "UNPAID",
  SUCCESS = "SUCCESS",
  CANCEL = "CANCEL",
  PENDING = "PENDING"
}

export enum OrderType {
  DineIn = "DineIn",
  TakeOut = "TakeOut"
}

export enum MobileDialog {
  CUSTOMIZED = "CUSTOMIZED",
  CART = "CART",
  ORDER = "ORDER"
}

export enum CustomerBookingDialog {
  RECORD_QUERY = "RECORD_QUERY",
  PRIVACY_POLICY = "PRIVACY_POLICY",
  REMINDER = "REMINDER",
  QRCODE = "QRCODE"
}

export enum MobileModal {
  PAYMENT = "PAYMENT",
  COUNTER_REMINDER = "COUNTER_REMINDER",
  REMOVE_CART_CONFIRM = "REMOVE_CART_CONFIRM"
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

export type Order = {
  id: string;
  status: OrderStatus;
  type: OrderType;
  orderMeals: {
    id: string;
    mealId: string;
    title: string;
    specialties: Specialty[];
    price: number;
    amount: number;
    servedAmount: number;
    categories: Category[];
  }[];
  paymentLogs: any[];
  createdAt?: number;
  updatedAt?: number;
  seats?: string[];
};

export type CartItem = {
  id: string;
  title: string;
  position: number;
  coverUrl: string;
  description: string;
  price: number;
  isPopular?: boolean;
  specialties: Specialty[];
  amount: number;
};
