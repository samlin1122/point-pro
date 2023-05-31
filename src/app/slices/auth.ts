// Libs
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AuthApi } from "~/api";
// Others
import { createAppAsyncThunk } from "~/app/hook";
import { LoginPayload, LoginResponse } from "~/types/api";

const name = "auth";

export const login = createAppAsyncThunk<LoginResponse, LoginPayload>(
  `${name}/postLogin`,
  async (payload, { rejectWithValue }) => {
    try {
      const { result } = await AuthApi.postLogin(payload);

      const { authToken, member } = result;

      if (authToken) {
        localStorage.setItem("token", authToken);
      }
      return { authToken, member };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

interface IAuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  authToken: string | null;
}

const initialState: IAuthState = {
  isLoading: false,
  isAuthenticated: false,
  authToken: null
};

export const authSlice = createSlice({
  name,
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<IAuthState>) {
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.authToken = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      const { authToken } = action.payload;
      state.authToken = authToken;
      state.isAuthenticated = true;
      state.isLoading = false;
    }),
      builder.addCase(login.pending, (state) => {
        state.isLoading = true;
      }),
      builder.addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.authToken = null;
      });
  }
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
