// Libs
import { createSlice } from "@reduxjs/toolkit";
import { MealApi } from "~/api";
// Others
import { createAppAsyncThunk } from "~/app/hook";
import { MealsResponse } from "~/types/api";

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

interface IMealState {}
const initialState: IMealState = {};

export const mealSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: {}
});

export const {} = mealSlice.actions;
