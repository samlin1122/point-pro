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

type MealResponse = ApiResponse<IMeal>;
type MealsResponse = ApiResponse<IMeal[]>;

interface PostMealPayload extends IMeal {}
interface PatchMealByIdPayload {
  mealId: string;
  payload: IMeal;
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

interface PatchSpecialtyByIdPayload {
  specialtyId: string;
  payload: ISpecialty;
}
type SpecialtyItemsResponse = ApiResponse<ISpecialtyItem[]>;
