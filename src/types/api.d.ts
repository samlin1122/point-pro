import { Member, IMeal } from ".";

type Id = string;

interface ApiResopnse<result> {
  message: string;
  result;
}

export interface LoginPayload {
  account: string;
  password: string;
}

export type LoginResponse = ApiResponse<{
  authToken: string;
  member: Member;
}>;

export type MealResponse = ApiResponse<IMeal>;
export type MealsResponse = ApiResponse<IMeal[]>;

export interface PostMealPayload extends IMeal {}
export interface PatchMealByIdPayload {
  mealId: string;
  payload: IMeal;
}
