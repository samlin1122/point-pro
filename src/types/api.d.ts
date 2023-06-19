import { Menu, Order, Specialty, UserInfo } from "~/features/orders/type";
import { Member, IMeal, ICategory, ISpecialty, ISpecialtyItem, IPaymentLog } from ".";

type Id = string;

interface ApiResponse<result> {
  message: string;
  result;
}

interface LoginPayload {
  account: string;
  password: string;
}

type LoginResponse = ApiResponse<{
  authToken: string;
  member: Member;
}>;

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
  orderId: Id;
  confirmUrl: string;
  cancelUrl: string;
}

interface LinePayConfirmProps {
  transactionId: string;
  orderId: string;
}

interface EcPayResponseBody {
  orderId: Id;
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

interface CashPaymentPayload {
  order: Order[];
  paymentLog: IPaymentLog;
}

type LinePayResponse = ApiResponse<LinePayPayload>;
type EcPayResponse = ApiResponse<EcPayPayload>;
type CashPaymentResponse = ApiResponse<CashPaymentPayload>;

type PaymentSliceState = {
  isLoading: boolean;
  error: string | null;
  linePayResponse: LinePayResponse;
  ecPayResponse: EcPayResponse;
  cashPaymentResponse: CashPaymentResponse;
};
