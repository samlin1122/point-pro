import { createSlice } from "@reduxjs/toolkit";

type LoadingSliceState = {
  isLoading: boolean;
};

const name = "loading";
const initialState: LoadingSliceState = {
  isLoading: false
};

export const loadingSlice = createSlice({
  name,
  initialState,
  reducers: {
    openLoading: (state) => {
      state.isLoading = true;
    },
    closeLoading: (state) => {
      state.isLoading = false;
    }
  }
});

export const { openLoading, closeLoading } = loadingSlice.actions;
