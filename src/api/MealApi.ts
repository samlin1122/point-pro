import http from "./http";
import { Id, MealsResponse, MealResponse, PostMealPayload, PutMealByIdPayload } from "~/types/api";

export const getMeals = () => {
  return http.get<string, MealsResponse>("meal");
};

export const getMealById = (mealId: Id) => {
  return http.get<string, MealResponse>(`meal/${mealId}`);
};

export const postMeal = (payload: PostMealPayload) => {
  return http.post<string, MealResponse>("meal", payload);
};

export const putMealById = ({ mealId, payload }: PutMealByIdPayload) => {
  return http.put<string, MealResponse>(`meal/${mealId}`, payload);
};

export const deleteMeal = (mealId: Id) => {
  return http.delete<string, MealResponse>(`meal/${mealId}`);
};
