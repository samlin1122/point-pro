// Libs
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AuthApi, MenuApi } from "~/api";

// Others
import { createAppAsyncThunk } from "~/app/hook";
import {
  CartItem,
  Category,
  MobileDialog,
  Meal,
  Menu,
  MobileModal,
  Order,
  Specialty,
  SpecialtyItem,
  UserInfo
} from "./type";

type CustomerOrderSliceState = {
  userInfo: UserInfo;
  menu: Menu[];
  categories: Category[];
  meals: Meal[];
  cart: CartItem[];
  orders: Order[];
  currentCategory: Category["id"];
  currentMealId: Meal["id"];
  currentMealAmount: number;
  currentSpecialty: Specialty[];
  currentDialog: MobileDialog | "";
  dialogData: any;
  currentModal: MobileModal | "";
  modalData: any;
  modifiedCartItemIndex: number;
  isModifiedCartItem: boolean;
  isLoading: boolean;
};

const name = "customerOrder";
const initialState: CustomerOrderSliceState = {
  userInfo: null,
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
  dialogData: {},
  currentModal: "",
  modalData: {},
  modifiedCartItemIndex: 0,
  isModifiedCartItem: false,
  isLoading: false
};

export const getUserInfo = createAppAsyncThunk(`${name}/getUserInfo`, async (_, { rejectWithValue }) => {
  try {
    const userRes = await AuthApi.getUserInfo();
    const { result = {} } = userRes;
    return result;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: "unknown error" });
    }
  }
});

export const getMenu = createAppAsyncThunk(`${name}/getMenu`, async (_, { rejectWithValue }) => {
  try {
    const menuRes = await MenuApi.getMenu();
    const { result = [] } = menuRes;
    const menu = result;
    const categories = result.map(({ meals, ...category }: Menu) => category);
    const meals = result.map((category: Menu) => category.meals).flat();

    return { menu, meals, categories };
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: "unknown error" });
    }
  }
});

export const customerOrderSlice = createSlice({
  name,
  initialState,
  reducers: {
    // Category Tab Focus
    setCurrentCategory: (state, action: PayloadAction<CustomerOrderSliceState["currentCategory"]>) => {
      state.currentCategory = action.payload;
    },
    // Modal
    openModal: (state, action: PayloadAction<{ type: CustomerOrderSliceState["currentModal"]; data?: any }>) => {
      const { type, data = {} } = action.payload;
      state.currentModal = type;
      state.modalData = data;
    },
    closeModal: (state) => {
      state.currentModal = initialState.currentModal;
      state.modalData = initialState.modalData;
    },
    // Dialog
    openDialog: (state, action: PayloadAction<{ type: CustomerOrderSliceState["currentDialog"]; data?: any }>) => {
      const { type, data = {} } = action.payload;
      state.currentDialog = type;
      state.dialogData = data;
    },
    closeDialog: (state) => {
      state.currentDialog = initialState.currentDialog;
      state.dialogData = initialState.dialogData;
    },
    // [TODO] replace to openDialog
    openCustomizeDialog: (state, action: PayloadAction<CustomerOrderSliceState["currentMealId"]>) => {
      state.currentMealId = action.payload;
      state.currentDialog = MobileDialog.CUSTOMIZED;
    },
    closeCustomizeDialog: (state) => {
      customerOrderSlice.caseReducers.resetSpecialty(state);
      state.currentDialog = initialState.currentDialog;
      state.modifiedCartItemIndex = initialState.modifiedCartItemIndex;
      state.isModifiedCartItem = initialState.isModifiedCartItem;
    },
    // Specialty
    resetSpecialty: (state) => {
      state.currentMealId = initialState.currentMealId;
      state.currentMealAmount = initialState.currentMealAmount;
      state.currentSpecialty = initialState.currentSpecialty;
      state.modifiedCartItemIndex = initialState.modifiedCartItemIndex;
      state.isModifiedCartItem = initialState.isModifiedCartItem;
    },
    updateSpecialty: (state, action: PayloadAction<{ selectedSpecialty: Specialty; selectedItem: SpecialtyItem }>) => {
      const { selectedSpecialty, selectedItem } = action.payload;
      const { id, title, type } = selectedSpecialty;
      const includedSpecialty = state.currentSpecialty.find((specialty) => specialty.id === id);
      const isItemChecked = includedSpecialty?.items.find((item) => item.id === selectedItem.id);
      const isSingle = type === "SINGLE";

      if (includedSpecialty) {
        if (isItemChecked) {
          includedSpecialty.items = includedSpecialty.items.filter((item) => item.id !== selectedItem.id);
          if (includedSpecialty.items.length === 0) {
            state.currentSpecialty = state.currentSpecialty.filter((item) => item.id !== includedSpecialty.id);
          }
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
      const currentMeal = state.meals.find((meal) => meal.id === currentMealId);
      if (currentMeal) {
        const { id, title, position, description, coverUrl, price } = currentMeal;
        const newItem = {
          id,
          title,
          position,
          description,
          coverUrl,
          price,
          isPopular: false,
          amount: currentMealAmount,
          specialties: currentSpecialty
        };
        state.cart.push(newItem);
        customerOrderSlice.caseReducers.closeCustomizeDialog(state);
      }
    },
    viewCartItemCustomized: (state, action: PayloadAction<{ cartItem: CartItem; idx: number }>) => {
      const { cartItem, idx } = action.payload;
      const { id, specialties, amount } = cartItem;
      state.currentMealId = id;
      state.currentMealAmount = amount;
      state.currentSpecialty = specialties;
      state.currentDialog = MobileDialog.CUSTOMIZED;
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
        isPopular: false,
        amount: currentMealAmount,
        specialties: currentSpecialty
      };
      state.cart.splice(state.modifiedCartItemIndex, 1, newItem);
      customerOrderSlice.caseReducers.closeCustomizeDialog(state);
      state.currentDialog = MobileDialog.CART;
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.isLoading = false;
      })
      .addCase(getUserInfo.rejected, (state) => {
        state.userInfo = initialState.userInfo;
        state.isLoading = false;
      })
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
      });
  }
});

export const {
  openDialog,
  closeDialog,
  openCustomizeDialog,
  closeCustomizeDialog,
  resetSpecialty,
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
