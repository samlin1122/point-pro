// Libs
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// Others
import { IMeal, IMenuCategory, IMobileSlice } from "~/types";

export const CUSTOMIZED = "CUSTOMIZED";
export const CART = "CART";
export const ORDER = "ORDER";

const name = "customerOrder";
const initialState: IMobileSlice = {
  categories: [],
  meals: [],
  cart: [],
  orders: [],
  currentCategory: "",
  currentMealId: "",
  currentDialog: "",
  isShowDialog: false,
  isLoading: false
};

export const fetchMenu = createAsyncThunk(`${name}/fetchMenu`, async (arg, thunkAPI) => {
  const categoriesRes = await axios.get("/src/data/dummyCategories.json");
  const mealsRes = await axios.get("/src/data/dummyMeals.json");

  const categories = (categoriesRes.data.categories as IMenuCategory[]) || [];
  const meals = (mealsRes.data.meals as IMeal[]) || [];

  return { categories, meals };
});

export const customerOrderSlice = createSlice({
  name,
  initialState,
  reducers: {
    openDialog: (state, { payload }) => {
      console.log({ payload });
      const { currentDialog } = payload;
      state.currentDialog = currentDialog;
      state.isShowDialog = true;
    },
    closeDialog: (state) => {
      state.currentDialog = initialState.currentDialog;
      state.isShowDialog = false;
    },
    openCustomizeDialog: (state, { payload }) => {
      const { currentMealId } = payload;
      state.currentMealId = currentMealId;
      state.currentDialog = CUSTOMIZED;
      state.isShowDialog = true;
    },
    closeCustomizeDialog: (state) => {
      state.currentMealId = initialState.currentMealId;
      state.currentDialog = initialState.currentDialog;
      state.isShowDialog = false;
    },
    setCurrentCategory: (state, { payload }) => {
      state.currentCategory = payload.currentCategory;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMenu.fulfilled, (state, { payload }) => {
        const { categories, meals } = payload;
        state.categories = categories;
        state.currentCategory = categories[0]?.id ?? "";
        state.meals = meals;
        state.isLoading = false;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.isLoading = false;
      });
  }
});

export const { openDialog, closeDialog, openCustomizeDialog, closeCustomizeDialog, setCurrentCategory } =
  customerOrderSlice.actions;
