import http from "./http";
import { Id, MealsResponse, MealResponse, PostMealPayload, PatchMealByIdPayload } from "~/types/api";

export const getMeals = () => {
  return http.get<string, MealsResponse>("meal", { params: { maxResult: 999 } });
};

export const getMealById = (mealId: Id) => {
  return http.get<string, MealResponse>(`meal/${mealId}`);
};

export const postMeal = (payload: PostMealPayload) => {
  return http.post<string, MealResponse>("meal", payload);
};

export const patchMealById = ({ mealId, payload }: PatchMealByIdPayload) => {
  return http.patch<string, MealResponse>(`meal/${mealId}`, payload);
};

export const deleteMeal = (mealId: Id) => {
  return http.delete<string, MealResponse>(`meal/${mealId}`);
};
