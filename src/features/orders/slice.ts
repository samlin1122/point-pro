// Libs
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// Others
import { createAppAsyncThunk } from "~/app/hook";
import {
  ICartItem,
  ICustomerOrderSliceState,
  IMeal,
  IMenuCategory,
  IOrder,
  ISpecialty,
  ISpecialtyOption
} from "~/types";
import { CustomerOrderDialog, MobileModal } from "~/types/common";

const name = "customerOrder";
const initialState: ICustomerOrderSliceState = {
  categories: [],
  meals: [],
  combinedMenu: [],
  cart: [],
  orders: [],
  currentCategory: "",
  currentMealId: "",
  currentMealAmount: 1,
  currentSpecialty: [],
  currentDialog: "",
  currentModal: "",
  modifiedCartItemIndex: 0,
  isModifiedCartItem: false,
  isLoading: false
};

export const getMenu = createAppAsyncThunk(`${name}/getMenu`, async (_, thunkAPI) => {
  try {
    const categoriesRes = await fetch("/data/dummyCategories.json");
    const mealsRes = await fetch("/data/dummyMeals.json");

    const { categories = [] }: { categories: IMenuCategory[] } = await categoriesRes.json();
    const { meals = [] }: { meals: IMeal[] } = await mealsRes.json();

    const combinedMenu = categories.map((category) => {
      let allMeals: IMeal[] = [];
      meals.forEach((meal) => meal.categories[0].id === category.id && allMeals.push(meal));
      return { ...category, allMeals };
    });

    return { categories, meals, combinedMenu };
  } catch (error) {
    // [TODO]: handle error
    console.log(error);
    return thunkAPI.rejectWithValue({ message: "Something went wrong..." });
  }
});

export const getOrders = createAppAsyncThunk(`${name}/getOrders`, async (_, thunkAPI) => {
  try {
    const ordersRes = await fetch("/data/dummyOrders.json");
    const { orders = [] }: { orders: IOrder[] } = await ordersRes.json();
    return { orders };
  } catch (error) {
    // [TODO]: handle error
    console.log(error);
    return thunkAPI.rejectWithValue({ message: "Something went wrong..." });
  }
});

export const postOrder = createAppAsyncThunk(`${name}/postOrder`, async (_, thunkAPI) => {
  const customerOrderSlice = thunkAPI.getState()[name];
  try {
    // [TODO]: handle order request data
  } catch (error) {
    // [TODO]: handle error
    console.log(error);
    return thunkAPI.rejectWithValue({ message: "Something went wrong..." });
  }
});

export const customerOrderSlice = createSlice({
  name,
  initialState,
  reducers: {
    openDialog: (state, action: PayloadAction<ICustomerOrderSliceState["currentDialog"]>) => {
      state.currentDialog = action.payload;
    },
    closeDialog: (state) => {
      state.currentDialog = initialState.currentDialog;
    },
    openCustomizeDialog: (state, action: PayloadAction<ICustomerOrderSliceState["currentMealId"]>) => {
      state.currentMealId = action.payload;
      state.currentDialog = CustomerOrderDialog.CUSTOMIZED;
    },
    closeCustomizeDialog: (state) => {
      state.currentMealId = initialState.currentMealId;
      state.currentMealAmount = initialState.currentMealAmount;
      state.currentSpecialty = initialState.currentSpecialty;
      state.currentDialog = initialState.currentDialog;
      state.modifiedCartItemIndex = initialState.modifiedCartItemIndex;
      state.isModifiedCartItem = initialState.isModifiedCartItem;
    },
    setCurrentCategory: (state, action: PayloadAction<ICustomerOrderSliceState["currentCategory"]>) => {
      state.currentCategory = action.payload;
    },
    updateSpecialty: (
      state,
      action: PayloadAction<{ selectedSpecialty: ISpecialty; selectedItem: ISpecialtyOption }>
    ) => {
      const { selectedSpecialty, selectedItem } = action.payload;
      const { id, title, type } = selectedSpecialty;
      const includedSpecialty = state.currentSpecialty.find((specialty) => specialty.id === id);
      const isItemChecked = includedSpecialty?.items.find((item) => item.id === selectedItem.id);
      const isSingle = type === "single";

      if (includedSpecialty) {
        if (isItemChecked) {
          includedSpecialty.items = includedSpecialty.items.filter((item) => item.id !== selectedItem.id);
        } else {
          includedSpecialty.items = isSingle ? [selectedItem] : [...includedSpecialty.items, selectedItem];
        }
      } else {
        state.currentSpecialty.push({ id, type, title, items: [selectedItem] });
      }
    },
    increaseMealAmount: (state) => {
      if (state.currentMealAmount < 5) state.currentMealAmount++;
    },
    decreaseMealAmount: (state) => {
      if (state.currentMealAmount > 1) state.currentMealAmount--;
    },
    createCartItem: (state) => {
      const { currentMealId, currentMealAmount, currentSpecialty } = state;
      const currentMeal = state.meals.find((meal) => meal.id === currentMealId) as IMeal;
      const { id, title, coverUrl, price, recommended } = currentMeal;
      const newItem = {
        id,
        title,
        coverUrl,
        price,
        recommended,
        amount: currentMealAmount,
        specialties: currentSpecialty
      };
      state.cart.push(newItem);
      customerOrderSlice.caseReducers.closeCustomizeDialog(state);
    },
    viewCartItemCustomized: (state, action: PayloadAction<{ cartItem: ICartItem; idx: number }>) => {
      const { cartItem, idx } = action.payload;
      const { id, specialties, amount } = cartItem;
      state.currentMealId = id;
      state.currentMealAmount = amount;
      state.currentSpecialty = specialties;
      state.currentDialog = CustomerOrderDialog.CUSTOMIZED;
      state.modifiedCartItemIndex = idx;
      state.isModifiedCartItem = true;
    },
    updateCartItem: (state) => {
      const { currentMealId, currentMealAmount, currentSpecialty } = state;
      const currentMeal = state.meals.find((meal) => meal.id === currentMealId) as IMeal;
      const { id, title, coverUrl, price, recommended } = currentMeal;
      const newItem = {
        id,
        title,
        coverUrl,
        price,
        recommended,
        amount: currentMealAmount,
        specialties: currentSpecialty
      };
      state.cart.splice(state.modifiedCartItemIndex, 1, newItem);
      customerOrderSlice.caseReducers.closeCustomizeDialog(state);
      state.currentDialog = CustomerOrderDialog.CART;
    },
    deleteCartItem: (state, action: PayloadAction<number>) => {
      state.cart.splice(action.payload, 1);
    },
    increaseCartItemAmount: (state, action: PayloadAction<number>) => {
      const theCartItem = state.cart.find((cartItem, idx) => idx === action.payload) as ICartItem;
      if (theCartItem.amount < 5) theCartItem.amount++;
    },
    decreaseCartItemAmount: (state, action: PayloadAction<number>) => {
      const theCartItem = state.cart.find((cartItem, idx) => idx === action.payload) as ICartItem;
      if (theCartItem.amount > 1) theCartItem.amount--;
    },
    openModal: (state, action: PayloadAction<MobileModal>) => {
      state.currentModal = action.payload;
    },
    closeModal: (state) => {
      state.currentModal = initialState.currentModal;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMenu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMenu.fulfilled, (state, action) => {
        const { categories, meals, combinedMenu } = action.payload;
        state.categories = categories;
        state.meals = meals;
        state.combinedMenu = combinedMenu;
        state.currentCategory = categories[0]?.id ?? "";
        state.isLoading = false;
      })
      .addCase(getMenu.rejected, (state) => {
        // [TODO]: handle error
        state.isLoading = false;
      })

      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        const { orders } = action.payload;
        state.orders = orders;
        state.isLoading = false;
      })
      .addCase(getOrders.rejected, (state) => {
        // [TODO]: handle error
        state.isLoading = false;
      })

      .addCase(postOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        // [TODO]: handle order data
        state.isLoading = false;
      })
      .addCase(postOrder.rejected, (state) => {
        // [TODO]: handle error
        state.isLoading = false;
      });
  }
});

export const {
  openDialog,
  closeDialog,
  openCustomizeDialog,
  closeCustomizeDialog,
  setCurrentCategory,
  updateSpecialty,
  increaseMealAmount,
  decreaseMealAmount,
  createCartItem,
  viewCartItemCustomized,
  updateCartItem,
  deleteCartItem,
  increaseCartItemAmount,
  decreaseCartItemAmount,
  openModal,
  closeModal
} = customerOrderSlice.actions;
