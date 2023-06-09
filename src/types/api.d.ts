import { Menu, Order, Specialty, UserInfo } from "~/features/orders/type";
import { Member, IMeal, ICategory, ISpecialty, ISpecialtyItem } from ".";

type Id = string;

interface ApiResopnse<result> {
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
type GetOrdersResponse = ApiResponse<Order[]>;
type PostOrderPayload = {
  orderMeals: {
    amount: number;
    id: string;
    price: number;
    specialties: Specialty[];
  }[];
};

type GetMenuResponse = ApiResponse<Menu[]>;
