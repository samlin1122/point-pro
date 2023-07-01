// Libs
import { createSlice } from "@reduxjs/toolkit";
import { MailApi } from "~/api";
// Others
import { createAppAsyncThunk } from "~/app/hook";
import { MailerRequestBody } from "~/types/api";

const name = "mail";

const initialState = {};

export const sendMail = createAppAsyncThunk(
  `${name}/sendMailRequest`,
  async (payload: MailerRequestBody, { rejectWithValue }) => {
    try {
      return await MailApi.sendMailRequest(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const mailerSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(sendMail.fulfilled, (state, action) => {
      console.log(action.payload);
    });
  }
});
