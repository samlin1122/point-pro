// Libs
import { createSlice } from "@reduxjs/toolkit";
import { MealApi } from "~/api";
// Others
import { createAppAsyncThunk } from "~/app/hook";
import { MealsResponse, MealResponse, PostMealPayload, PutMealByIdPayload, Id } from "~/types/api";

const name = "meal";

export const getMeals = createAppAsyncThunk<MealsResponse>(`${name}/getMeals`, async (payload, { rejectWithValue }) => {
  try {
    return await MealApi.getMeals();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: "unknown error" });
    }
  }
});

export const getMealById = createAppAsyncThunk<MealResponse, Id>(
  `${name}/getMealById`,
  async (payload, { rejectWithValue }) => {
    try {
      return await MealApi.getMealById(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const postMeal = createAppAsyncThunk<MealResponse, PostMealPayload>(
  `${name}/postMeal`,
  async (payload, { rejectWithValue }) => {
    try {
      return await MealApi.postMeal(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const putMealById = createAppAsyncThunk<MealResponse, PutMealByIdPayload>(
  `${name}/putMealById`,
  async (payload, { rejectWithValue }) => {
    try {
      return await MealApi.putMealById(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const deleteMeal = createAppAsyncThunk<MealResponse, Id>(
  `${name}/deleteMeal`,
  async (payload, { rejectWithValue }) => {
    try {
      return await MealApi.deleteMeal(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

interface IMealState {}
const initialState: IMealState = {};

export const mealSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: {}
});

export const {} = mealSlice.actions;
