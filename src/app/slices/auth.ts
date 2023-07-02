// Libs
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AuthApi } from "~/api";
// Others
import { createAppAsyncThunk } from "~/app/hook";
import { UserInfo } from "~/features/orders/type";
import {
  GenerateTokenPayload,
  GenerateTokenResponse,
  GetUserInfoResponse,
  LoginPayload,
  LoginResponse
} from "~/types/api";

const name = "auth";

export const login = createAppAsyncThunk<LoginResponse, LoginPayload>(
  `${name}/postLogin`,
  async (payload, { rejectWithValue }) => {
    try {
      const data = await AuthApi.postLogin(payload);

      if (data.result.authToken) {
        sessionStorage.setItem("token", data.result.authToken);
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const getUserInfo = createAppAsyncThunk<GetUserInfoResponse>(
  `${name}/getUserInfo`,
  async (payload, { rejectWithValue }) => {
    try {
      const data = await AuthApi.getUserInfo();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const getUserTokenByReservationLogId = createAppAsyncThunk<GenerateTokenResponse, GenerateTokenPayload>(
  `${name}/getUserTokenByReservationLogId`,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await AuthApi.generateToken({ reservationLogId: payload.reservationLogId });
      return response;
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
  userRole: UserInfo | null;
  userToken: string | null;
}

const initialState: IAuthState = {
  isLoading: false,
  isAuthenticated: false,
  authToken: null,
  userRole: null,
  userToken: null
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
    builder
      .addCase(login.fulfilled, (state, action) => {
        const { result } = action.payload;
        if (result.authToken) {
          state.authToken = result.authToken;
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
        }
        state.isLoading = false;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.authToken = null;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.userRole = action.payload.result;
      })
      .addCase(getUserTokenByReservationLogId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserTokenByReservationLogId.fulfilled, (state, action) => {
        state.userToken = action.payload.result.token;
        state.isLoading = true;
      })
      .addCase(getUserTokenByReservationLogId.rejected, (state) => {
        state.userToken = initialState.userToken;
      });
  }
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
