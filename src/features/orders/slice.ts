// Libs
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AuthApi, MenuApi } from "~/api";

// Others
import { createAppAsyncThunk } from "~/app/hook";
import { CartItem, Category, DialogType, Meal, Menu, Order, Specialty, SpecialtyItem, UserInfo } from "./type";
import { SpecialtyType, MobileModal } from "~/types/common";

type TakeOrderSliceState = {
  userInfo: UserInfo;
  menu: Menu[];
  categories: Category[];
  meals: Meal[];
  customized: CartItem | null;
  cart: CartItem[];
  currentCategory: Category["id"];
  currentDialog: DialogType | "";
  currentModal: MobileModal | "";
  modalData: any;
  modifiedCartItemIndex: number;
  isModifiedCartItem: boolean;
  isLoading: boolean;
};

const name = "takeOrder";
const initialState: TakeOrderSliceState = {
  userInfo: null,
  menu: [],
  categories: [],
  meals: [],
  customized: null,
  cart: [],
  currentCategory: "",
  currentDialog: "",
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

export const takeOrderSlice = createSlice({
  name,
  initialState,
  reducers: {
    // Category Tab Focus
    setCurrentCategory: (state, action: PayloadAction<TakeOrderSliceState["currentCategory"]>) => {
      state.currentCategory = action.payload;
    },
    // Modal
    openModal: (state, action: PayloadAction<{ type: TakeOrderSliceState["currentModal"]; data?: any }>) => {
      const { type, data = {} } = action.payload;
      state.currentModal = type;
      state.modalData = data;
    },
    closeModal: (state) => {
      state.currentModal = initialState.currentModal;
      state.modalData = initialState.modalData;
    },
    // Dialog
    openDialog: (
      state,
      action: PayloadAction<{
        type: TakeOrderSliceState["currentDialog"];
        data?: TakeOrderSliceState["customized"];
      }>
    ) => {
      const { type, data = null } = action.payload;
      state.currentDialog = type;
      if (type === DialogType.CUSTOMIZED) {
        state.customized = data as TakeOrderSliceState["customized"];
      }
    },
    closeDialog: (state) => {
      state.currentDialog = initialState.currentDialog;
      takeOrderSlice.caseReducers.resetCustomized(state);
      takeOrderSlice.caseReducers.setNotModifiedCartItem(state);
    },
    updateSpecialty: (state, action: PayloadAction<{ selectedSpecialty: Specialty; selectedItem: SpecialtyItem }>) => {
      const { selectedSpecialty, selectedItem } = action.payload;
      const { id, title, type } = selectedSpecialty;
      if (state.customized) {
        const includedSpecialty = state.customized.specialties.find(
          (specialty) => specialty.id === selectedSpecialty.id
        );
        const isItemChecked = !!includedSpecialty?.items.find((item) => item.id === selectedItem.id);
        const isSingle = selectedSpecialty.type === SpecialtyType.SINGLE;

        // [TODO]: refactor
        // 有選擇過該客製化類別
        if (includedSpecialty) {
          if (isItemChecked) {
            // 該客製化選項已勾選，則取消勾選
            includedSpecialty.items = includedSpecialty.items.filter((item) => item.id !== selectedItem.id);
            // 該客製化類別中選項為空，移除該客製化類別
            if (includedSpecialty.items.length === 0) {
              state.customized.specialties = state.customized.specialties.filter(
                (item) => item.id !== includedSpecialty.id
              );
            }
          } else {
            // 該客製化選項未勾選，則勾選
            includedSpecialty.items = isSingle ? [selectedItem] : [...includedSpecialty.items, selectedItem];
          }
        } else {
          // 無選擇過該客製化類別，將類別與選項塞入
          state.customized.specialties.push({ id, type, title, items: [selectedItem] });
        }
      }
    },
    increaseMealAmount: (state) => {
      if (state.customized) {
        state.customized.amount < 5 && state.customized.amount++;
      }
    },
    decreaseMealAmount: (state) => {
      if (state.customized) {
        state.customized.amount > 1 && state.customized.amount--;
      }
    },
    setNotModifiedCartItem: (state) => {
      state.isModifiedCartItem = initialState.isModifiedCartItem;
      state.modifiedCartItemIndex = initialState.modifiedCartItemIndex;
    },
    createCartItem: (state) => {
      if (state.customized) {
        state.cart.push(state.customized);
        takeOrderSlice.caseReducers.closeDialog(state);
      }
    },
    viewCartItemCustomized: (state, action: PayloadAction<{ cartItem: CartItem; idx: number }>) => {
      const { cartItem, idx } = action.payload;
      state.customized = cartItem;
      state.currentDialog = DialogType.CUSTOMIZED;
      state.modifiedCartItemIndex = idx;
      state.isModifiedCartItem = true;
    },
    updateCartItem: (state) => {
      if (state.customized) {
        state.cart.splice(state.modifiedCartItemIndex, 1, state.customized);
        state.currentDialog = DialogType.CART;
      }
    },
    deleteCartItem: (state, action: PayloadAction<number>) => {
      state.cart.splice(action.payload, 1);
    },
    clearCart: (state) => {
      state.cart = initialState.cart;
      takeOrderSlice.caseReducers.closeModal(state);
      takeOrderSlice.caseReducers.closeDialog(state);
    },
    resetCustomized: (state) => {
      state.customized = initialState.customized;
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
        if (state.currentCategory === initialState.currentCategory) {
          state.currentCategory = categories[0]?.id ?? "";
        }
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
  openModal,
  closeModal,
  setCurrentCategory,
  updateSpecialty,
  increaseMealAmount,
  decreaseMealAmount,
  setNotModifiedCartItem,
  viewCartItemCustomized,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart
} = takeOrderSlice.actions;
