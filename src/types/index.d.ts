import { Params, NavigateFunction, Location } from "react-router-dom";
export interface Props {}

export interface IMenuCategory {
  id: string;
  title: string;
}

export interface IMeal {
  id: string;
  title: string;
  coverUrl: string;
  description: string;
  price: number;
  position: number;
  recommended: boolean;
  specialties: ISpecialty[];
  categories: IMenuCategory[];
}

export interface ICombineMenu extends IMenuCategory {
  allMeals: IMeal[];
}

export interface ISpecialty {
  id: string;
  title: string;
  type: "single" | "multiple";
  items: ISpecialtyOption[];
}

export interface ISpecialtyOption {
  id: string;
  title: string;
  price?: number;
}

export interface ISelectedSpecialty {
  id: string;
  value: string[];
}

export interface ICartItem {
  id: IMeal["id"];
  title: IMeal["title"];
  coverUrl: IMeal["coverUrl"];
  price: Imeal["price"];
  recommended: IMeal["recommended"];
  specialties: IMeal["specialties"];
  amount: number;
}

export interface IOrder {
  id: string;
  status: "UNPAID" | "SUCCESS" | "CANCEL" | "PENDING";
  type: "dine-in" | "checkout";
  reservationId: string;
  createdAt: number;
  updatedAt: number;
  orderMeals: OrderMeal[];
  paymentLogs: IPaymentLog[];
}

export interface IPaymentLog {
  orderId: IOrder["id"];
  paymentNo: string;
  price: number;
  gateway: "linepay" | "cash" | "card";
  status: "UNPAID" | "SUCCESS";
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

export interface IMobileSlice {
  categories: IMenuCategory[];
  meals: IMeal[];
  combinedMenu: ICombineMenu[];
  cart: ICartItem[];
  orders: IOrder[];
  currentCategory: string;
  currentMealId: string;
  currentMealAmount: number;
  currentSpecialty: ISpecialty[];
  currentDialog: string;
  modifiedCartItemIndex: number;
  isModifiedCartItem: boolean;
  isLoading: boolean;
}
export interface RouterProps {
  location: Location;
  navigate: NavigateFunction;
  params: Params;
}
