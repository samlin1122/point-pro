// Libs
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
// Others
import { createAppAsyncThunk } from "~/app/hook";

type Member = {
  id: string;
  account: string;
  email: string;
  name: string;
  role: "MERCHANT" | "CUSTOMER";
};

type LoginResponse = {
  authToken: string;
  member: Member;
};

type RejectError = {
  message: string;
};
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

const name = "auth";
const apiHost = import.meta.env.DEV ? import.meta.env.VITE_API_HOST_DEV : import.meta.env.VITE_API_HOST_PROD;

export const login = createAppAsyncThunk<
  LoginResponse,
  { account: string; password: string },
  { rejectValue: RejectError }
>(`${name}/login`, async ({ account, password }, thunkAPI) => {
  try {
    const { data } = await Axios.post(`${apiHost}/api/auth/login`, { account, password }, { withCredentials: true });

    const { authToken, member } = data.result;
    return { authToken, member };
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    } else {
      return thunkAPI.rejectWithValue({ message: "unknown error" });
    }
  }
});

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
