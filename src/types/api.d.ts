import { Menu, Order, ParentOrder, Specialty, UserInfo } from "~/features/orders/type";
import {
  Member,
  IMeal,
  ICategory,
  ISpecialty,
  ISpecialtyItem,
  IPaymentLog,
  IOrder,
  SeatInfo,
  ReservationInfo,
  DatePeriodInfo
} from ".";

type Id = string;

interface ApiResponse<result> {
  message: string;
  result;
}

interface GenerateTokenPayload {
  reservationLogId: string;
}

interface LoginPayload {
  account: string;
  password: string;
}

type LoginResponse = ApiResponse<{
  authToken: string;
  member: Member;
}>;

type GenerateTokenResponse = ApiResponse<{ token: string }>;

type GetUserInfoResponse = ApiResponse<UserInfo>; // [TODO]

type MealResponse = ApiResponse<IMeal>;
type MealsResponse = ApiResponse<IMeal[]>;

interface PostMealPayload extends IMeal {}
interface IMealWithOptionalKey extends IMeal {
  id?: string;
  title?: string;
}
interface PatchMealByIdPayload {
  mealId: string;
  payload: IMealWithOptionalKey;
}

type CategoryResponse = ApiResponse<ICategory>;
type CategoriesResponse = ApiResponse<ICategory[]>;

interface PostCategoryPayload {}

type SpecialtyResponse = ApiResponse<ISpecialty>;
type SpecialtiesResponse = ApiResponse<ISpecialty[]>;

interface PostSpecialtyPayload extends ISpecialty {}
interface PatchSpecialtyPayload {
  specialtyId: string;
  payload: ISpecialty;
}

interface PatchSpecialtyById {
  specialtyId: string;
  payload: ISpecialty;
}
type SpecialtyItemsResponse = ApiResponse<ISpecialtyItem[]>;

type PostOrderResponse = ApiResponse<Order>;
type DeleteOrderResponse = ApiResponse<Order>;
type PatchOrderResponse = ApiResponse<Order>;
type GetOrdersResponse = ApiResponse<Order[]>;
type PostOrderPayload = {
  orderMeals: {
    amount: number;
    id: string;
    price: number;
    specialties: Specialty[];
  }[];
};
type PatchOrderPayload = {
  orderMeals: {
    amount: number;
    id: string;
    price: number;
    specialties: Specialty[];
  }[];
};

type GetMenuResponse = ApiResponse<Menu[]>;

interface updateImgPayload {}
type updateImgResponse = ApiResponse<{ string }>;

interface LinePayRequestBody {
  orderId: Id | Id[];
  confirmUrl: string;
  cancelUrl: string;
}

interface PaymentConfirmProps {
  transactionId: string;
  orderId: string;
}

interface EcPayResponseBody {
  orderId: Id | Id[];
  confirmUrl: string;
}

interface LinePayPayload {
  returnCode: string;
  returnMessage: string;
  info: {
    paymentUrl: {
      web: string;
      app: string;
    };
    transactionId: string;
    paymentAccessToken: string;
  };
}

interface EcPayPayload {
  RtnCode: string;
  RtnMsg: string;
  TradeNo: string;
  TradeAmt: string;
  PaymentDate: string;
  PaymentType: string;
  PaymentTypeChargeFee: string;
  TradeDate: string;
  SimulatePaid: string;
}

type PayInfo = {
  method: string;
  amount: number;
  creditCardNickname?: string;
  creditCardBrand?: string;
  maskedCreditCardNumber?: string;
};

type Product = {
  id?: string;
  name: string;
  imageUrl?: string;
  quantity: number;
  price: number;
  originalPrice?: number;
};

type Package = {
  id: string;
  name?: string;
  amount: number;
  userFeeAmount?: number;
  products: Product[];
};

interface ConfirmResponseBody {
  orderId: string;
  transactionId: string;
  authorizationExpireDate?: string;
  regKey?: string;
  payInfo: PayInfo[];
  packages: Package[];
  shipping?: Shipping;
}

interface CashPaymentPayload {
  order: Order[];
  paymentLog: IPaymentLog;
}

interface LinePayConfirmPayload {
  paymentLogs: PaymentLogsResponse[];
  response: {
    body: {
      info: Info;
      returnCode: string;
      returnMessage: string;
    };
  };
}

interface EcPayConfirmPayload {
  paymentLogs: PaymentLogsResponse[];
}

type LinePayResponse = ApiResponse<LinePayPayload>;
type EcPayResponse = ApiResponse<EcPayPayload>;
type CashPaymentResponse = ApiResponse<CashPaymentPayload>;
type LinePayConfirmResponse = ApiResponse<LinePayConfirmPayload>;
type EcPayConfirmResponse = ApiResponse<EcPayConfirmPayload>;

type PaymentSliceState = {
  isLoading: boolean;
  error: string | null;
  paymentItem: ParentOrder | null;
  isOpenPaymentDrawer: boolean;
  linePayResponse: LinePayResponse;
  ecPayResponse: EcPayResponse;
  cashPaymentResponse: CashPaymentResponse;
  linePayConfirmResponse: LinePayConfirmResponse;
  ecPayConfirmResponse: EcPayConfirmResponse;
};

interface PostReservationPayload {
  type: string;
  options: { [key as string]: any };
  amount: number;
  periodStartedAt: Date;
}

type PartialSeat = {
  id: string;
  seatNo: string;
  amount: number;
};

type CreateReservation = {
  id: string;
  reservedAt: Date;
  options: { [key: string]: any };
  periodStartedAt: Date;
  periodEndedAt: Date;
  token: string;
  seats: PartialSeat[];
};

export type PayInfo = {
  method: string;
  amount: number;
  creditCardNickname?: string;
  creditCardBrand?: string;
  maskedCreditCardNumber?: string;
};

export type Package = {
  id: string;
  name?: string;
  amount: number;
  userFeeAmount?: number;
};

export type Shipping = {
  methodId: string;
  feeAmount: number;
  address: Address;
};

export type Info = {
  orderId: string;
  transactionId: string;
  authorizationExpireDate?: string;
  regKey?: string;
  payInfo: PayInfo[];
  packages: Package[];
  shipping?: Shipping;
};

type PaymentLogsResponse = {
  orderId: string;
  price: number;
  status: string;
  gateway: string;
  createdAt: string;
  paymentNo: string;
  updateAt: string;
  order: {
    id: string;
    orderId: string;
    mealId: string;
    mealTitle: string;
    price: number;
    mealDetails: string;
    amount: string;
    servedAmount: string;
    meal: Meal;
    orderMeals: OrderMeal[];
  };
  parentOrder: {
    id: string;
    parentOrderId: string;
    reservationLogId: string;
    type: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
};

export interface OrderMealWithMeal {
  id: string;
  orderId: string;
  mealId: string;
  mealTitle: string;
  price: number;
  mealDetails: string;
  amount: number;
  servedAmount: number;
  meal: Meal;
  order: Order;
}
export interface OrderWithMeal {
  id: string;
  status: OrderStatus;
  type: OrderType;
  paymentLogs: any[];
  createdAt?: number | undefined;
  updatedAt?: number | undefined;
  seats?: string[] | undefined;
  orderMeals: OrderMealWithMeal[];
}

interface CashPaymentResponse {
  result: {
    paymentLogs: PaymentLogsResponse[];
  };
}

interface MealDetails {
  id: string;
  title: string;
  type: string;
  price?: number;
  items?: MealDetails[];
}


type PostReservationResponse = ApiResponse<CreateReservation>;

type PeriodsResponse = ApiResponse<DatePeriodInfo>;

type ReservationResponse = ApiResponse<ReservationInfo>;

type ReservationsResponse = ApiResponse<ReservationInfo[]>;

type SeatsResponse = ApiResponse<SeatInfo[]>;
