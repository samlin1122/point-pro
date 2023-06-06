// Libs
import { createSlice } from "@reduxjs/toolkit";
import { CategoryApi } from "~/api";
// Others
import { createAppAsyncThunk } from "~/app/hook";
import { ICategory } from "~/types";
import { CategoryResponse, CategoriesResponse, PostCategoryPayload, Id } from "~/types/api";

const name = "category";

export const getCategories = createAppAsyncThunk<CategoriesResponse>(
  `${name}/getCategories`,
  async (payload, { rejectWithValue }) => {
    try {
      return await CategoryApi.getCategories();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const postCategory = createAppAsyncThunk<CategoryResponse, PostCategoryPayload>(
  `${name}/postCategory`,
  async (payload, { rejectWithValue }) => {
    try {
      return await CategoryApi.postCategory(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const deleteCategory = createAppAsyncThunk<CategoryResponse, Id>(
  `${name}/deleteCategory`,
  async (payload, { rejectWithValue }) => {
    try {
      return await CategoryApi.deleteCategory(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

interface ICategoryState {
  categories: ICategory[];
}
const initialState: ICategoryState = {
  categories: []
};

export const categorySlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCategories.fulfilled, (state, { payload }) => {
      state.categories = payload.result;
    });
  }
});

export const {} = categorySlice.actions;
