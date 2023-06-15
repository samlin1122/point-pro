// Libs
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ImgurApi } from "~/api";
// Others
import { createAppAsyncThunk } from "~/app/hook";
import { updateImgPayload, updateImgResponse } from "~/types/api";

const name = "imgur";

export const uploadImg = createAppAsyncThunk<updateImgResponse, updateImgPayload>(
  `${name}/uploadImg`,
  async (payload, { rejectWithValue }) => {
    try {
      return await ImgurApi.uploadImg(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

interface ImgurState {}
const initialState: ImgurState = {};

export const imgurSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: {}
});

export const {} = imgurSlice.actions;
