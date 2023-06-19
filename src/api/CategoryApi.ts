import http from "./http";
import { Id, CategoriesResponse, CategoryResponse, PostCategoryPayload } from "~/types/api";

export const getCategories = () => {
  return http.get<string, CategoriesResponse>("category");
};

export const getCategoryById = (categoryId: Id) => {
  return http.get<string, CategoryResponse>(`category/${categoryId}`);
};

export const postCategory = (payload: PostCategoryPayload) => {
  return http.post<string, CategoryResponse>("category", payload);
};

export const deleteCategory = (categoryId: Id) => {
  return http.delete<string, CategoryResponse>(`category/${categoryId}`);
};
