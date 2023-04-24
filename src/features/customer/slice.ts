// Libs
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
// Others
import { IMeal, IMenuCategory, IMobileSlice } from "~/types"

const name = "customer"
const initialState: IMobileSlice = {
  categories: [],
  meals: [],
  cart: [],
  orders: [],
  currentMealId: "",
  isShowBottomDrawer: false,
  isLoading: false
}

export const fetchMenu = createAsyncThunk(`${name}/fetchMenu`, async (arg, thunkAPI) => {
  const categoriesRes = await axios.get("/src/data/dummyCategories.json")
  const mealsRes = await axios.get("/src/data/dummyMeals.json")

  const categories = (categoriesRes.data.categories as IMenuCategory[]) || []
  const meals = (mealsRes.data.meals as IMeal[]) || []

  return { categories, meals }
})

export const customerSlice = createSlice({
  name,
  initialState,
  reducers: {
    showBottomDrawer: (state, { payload }) => {
      const { currentMealId } = payload
      state.currentMealId = currentMealId
      state.isShowBottomDrawer = true
    },
    closeBottomDrawer: (state) => {
      state.currentMealId = initialState.currentMealId
      state.isShowBottomDrawer = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchMenu.fulfilled, (state, { payload }) => {
        const { categories, meals } = payload
        state.categories = categories
        state.meals = meals
        state.isLoading = false
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.isLoading = false
      })
  }
})

export const { showBottomDrawer, closeBottomDrawer } = customerSlice.actions
