// Libs
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// Others
import { createAppAsyncThunk } from "~/app/hook";
import { OrderType } from "~/types/common";
import { CustomerOrderDialog, MobileModal, OrderStatus } from "~/types/common";
import appDayjs from "~/utils/dayjs.util";

export interface Category {
  id: string;
  title: string;
  position: number;
  createAt?: number;
  updatedAt?: number;
}

export interface Meal {
  id: string;
  title: string;
  position: number;
  coverUrl: string;
  description: string;
  price: number;
  recommended?: boolean;
  categories: Category[];
  specialties: Specialty[];
  publishedAt?: number;
  createAt?: number;
  updatedAt?: number;
}

export interface Specialty {
  id: string;
  title: string;
  type: "SINGLE" | "MULTIPLE";
  specialtyItems: SpecialtyItem[];
  createAt?: number;
  updatedAt?: number;
}

export interface SpecialtyItem {
  id: string;
  title: string;
  price: number;
  createAt?: number;
  updatedAt?: number;
}

export interface Menu extends Category {
  meals: Meal[];
}

export interface Order {
  id: string;
  status: OrderStatus;
  type: OrderType;
  orderMeals: {
    id: string;
    title: string;
    specialties: Specialty[];
    price: number;
    amount: number;
    servedAmount: number;
  }[];
  paymentLogs: any[];
  createdAt: number;
  updatedAt: number;
}

export interface CartItem {
  id: string;
  title: string;
  position: number;
  coverUrl: string;
  description: string;
  price: number;
  recommended?: boolean;
  specialties: Specialty[];
  amount: number;
}

type CustomerOrderSliceState = {
  menu: Menu[];
  categories: Category[];
  meals: Meal[];
  cart: CartItem[];
  orders: Order[];
  currentCategory: Category["id"];
  currentMealId: Meal["id"];
  currentMealAmount: number;
  currentSpecialty: Specialty[];
  currentDialog: string;
  currentModal: string;
  modifiedCartItemIndex: number;
  isModifiedCartItem: boolean;
  isLoading: boolean;
};

const name = "customerOrder";
const initialState: CustomerOrderSliceState = {
  menu: [],
  categories: [],
  meals: [],
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
  const menuRes = await fetch("http://localhost:8081/api/menu");
  const { message = "", result = [] } = (await menuRes.json()) as unknown as { message: string; result: Menu[] };

  const menu = result;
  const categories = result.map(({ meals, ...category }) => category);
  const meals = result.map((category) => category.meals).flat();

  if (message === "success") {
    return { menu, meals, categories };
  } else {
    return thunkAPI.rejectWithValue({ message });
  }
});

export const getOrders = createAppAsyncThunk(`${name}/getOrders`, async (_, thunkAPI) => {
  const res = await fetch("http://localhost:8081/api/order");
  const { message = "", result = [] } = (await res.json()) as unknown as { message: string; result: Order[] };

  const orders = result.sort((a, b) => appDayjs(b.createdAt).valueOf() - appDayjs(a.createdAt).valueOf());

  if (message === "success") {
    return { orders };
  } else {
    return thunkAPI.rejectWithValue({ message });
  }
});

export const postOrder = createAppAsyncThunk(
  `${name}/postOrder`,
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const cart = getState()[name].cart;
      const orderMeals = cart.map(({ amount, id, price, specialties }) => {
        // mealsPrice = amount * price + specialties price
        const mealsPrice =
          price * amount +
          specialties.reduce((acc, cur) => (acc += cur.specialtyItems.reduce((acc, cur) => (acc += cur.price), 0)), 0);
        return {
          amount,
          id,
          price: mealsPrice,
          specialties
        };
      });

      // [TODO]
      const res = await fetch("http://localhost:8081/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderMeals
        })
      });

      const { message, result } = (await res.json()) as { message: string; result: any }; // [TODO] type

      if (message === "success") {
        dispatch(clearCart());
        dispatch(getOrders());
        dispatch(openDialog("ORDER"));
      }
    } catch (error) {
      // [TODO]: handle error
      console.log(error);
      return rejectWithValue({ message: "Something went wrong..." });
    }
  }
);

export const customerOrderSlice = createSlice({
  name,
  initialState,
  reducers: {
    openDialog: (state, action: PayloadAction<CustomerOrderSliceState["currentDialog"]>) => {
      state.currentDialog = action.payload;
    },
    closeDialog: (state) => {
      state.currentDialog = initialState.currentDialog;
    },
    openCustomizeDialog: (state, action: PayloadAction<CustomerOrderSliceState["currentMealId"]>) => {
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
    setCurrentCategory: (state, action: PayloadAction<CustomerOrderSliceState["currentCategory"]>) => {
      state.currentCategory = action.payload;
    },
    updateSpecialty: (state, action: PayloadAction<{ selectedSpecialty: Specialty; selectedItem: SpecialtyItem }>) => {
      const { selectedSpecialty, selectedItem } = action.payload;
      const { id, title, type } = selectedSpecialty;
      const includedSpecialty = state.currentSpecialty.find((specialty) => specialty.id === id);
      const isItemChecked = includedSpecialty?.specialtyItems.find((item) => item.id === selectedItem.id);
      const isSingle = type === "SINGLE";

      if (includedSpecialty) {
        if (isItemChecked) {
          includedSpecialty.specialtyItems = includedSpecialty.specialtyItems.filter(
            (item) => item.id !== selectedItem.id
          );
        } else {
          includedSpecialty.specialtyItems = isSingle
            ? [selectedItem]
            : [...includedSpecialty.specialtyItems, selectedItem];
        }
      } else {
        state.currentSpecialty.push({ id, type, title, specialtyItems: [selectedItem] });
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
      const currentMeal = state.meals.find((meal) => meal.id === currentMealId) as Meal;
      const { id, title, position, description, coverUrl, price } = currentMeal;
      const newItem = {
        id,
        title,
        position,
        description,
        coverUrl,
        price,
        recommended: false,
        amount: currentMealAmount,
        specialties: currentSpecialty
      };
      state.cart.push(newItem);
      customerOrderSlice.caseReducers.closeCustomizeDialog(state);
    },
    viewCartItemCustomized: (state, action: PayloadAction<{ cartItem: CartItem; idx: number }>) => {
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
      const currentMeal = state.meals.find((meal) => meal.id === currentMealId) as Meal;
      const { id, title, position, description, coverUrl, price } = currentMeal;
      const newItem = {
        id,
        title,
        position,
        description,
        coverUrl,
        price,
        recommended: false,
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
    clearCart: (state) => {
      state.cart = initialState.cart;
      state.modifiedCartItemIndex = initialState.modifiedCartItemIndex;
      state.isModifiedCartItem = initialState.isModifiedCartItem;
      state.currentMealId = initialState.currentMealId;
      state.currentMealAmount = initialState.currentMealAmount;
      state.currentSpecialty = initialState.currentSpecialty;
      state.currentDialog = initialState.currentDialog;
      state.currentModal = initialState.currentModal;
    },
    increaseCartItemAmount: (state, action: PayloadAction<number>) => {
      const theCartItem = state.cart.find((cartItem, idx) => idx === action.payload) as CartItem;
      if (theCartItem.amount < 5) theCartItem.amount++;
    },
    decreaseCartItemAmount: (state, action: PayloadAction<number>) => {
      const theCartItem = state.cart.find((cartItem, idx) => idx === action.payload) as CartItem;
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
        const { menu, categories, meals } = action.payload;
        state.menu = menu;
        state.categories = categories;
        state.currentCategory = categories[0]?.id ?? "";
        state.meals = meals;
        state.isLoading = false;
      })
      .addCase(getMenu.rejected, (state) => {
        state.menu = initialState.menu;
        state.categories = initialState.categories;
        state.currentCategory = initialState.currentCategory;
        state.meals = initialState.meals;
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
      .addCase(getOrders.rejected, (state, action) => {
        // const { message } = action.payload;
        state.orders = initialState.orders;
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
  clearCart,
  increaseCartItemAmount,
  decreaseCartItemAmount,
  openModal,
  closeModal
} = customerOrderSlice.actions;
