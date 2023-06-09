// Libs
import { createSlice } from "@reduxjs/toolkit";
import { SpecialtyApi } from "~/api";
// Others
import { createAppAsyncThunk } from "~/app/hook";
import { ISpecialty } from "~/types";
import {
  Id,
  SpecialtiesResponse,
  SpecialtyResponse,
  PostSpecialtyPayload,
  PatchSpecialtyPayload,
  SpecialtyItemsResponse
} from "~/types/api";

const name = "specialty";

export const getSpecialties = createAppAsyncThunk<SpecialtiesResponse>(
  `${name}/getSpecialties`,
  async (payload, { rejectWithValue }) => {
    try {
      return await SpecialtyApi.getSpecialties();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const getSpecialtyById = createAppAsyncThunk<SpecialtyResponse, Id>(
  `${name}/getSpecialtyById`,
  async (payload, { rejectWithValue }) => {
    try {
      return await SpecialtyApi.getSpecialtyById(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const postSpecialty = createAppAsyncThunk<SpecialtiesResponse, PostSpecialtyPayload>(
  `${name}/postSpecialty`,
  async (payload, { rejectWithValue }) => {
    try {
      return await SpecialtyApi.postSpecialty(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const patchSpecialtyById = createAppAsyncThunk<SpecialtiesResponse, PatchSpecialtyPayload>(
  `${name}/patchSpecialtyById`,
  async (payload, { rejectWithValue }) => {
    try {
      return await SpecialtyApi.patchSpecialtyById(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const deleteSpecialty = createAppAsyncThunk<SpecialtiesResponse, Id>(
  `${name}/deleteSpecialty`,
  async (payload, { rejectWithValue }) => {
    try {
      return await SpecialtyApi.deleteSpecialty(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const getSpecialtyItems = createAppAsyncThunk<SpecialtyItemsResponse>(
  `${name}/getSpecialtyItems`,
  async (payload, { rejectWithValue }) => {
    try {
      return await SpecialtyApi.getSpecialtyItems();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

interface ISpecialtyState {
  specialties: ISpecialty[];
}
const initialState: ISpecialtyState = {
  specialties: []
};

export const specialtySlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSpecialties.fulfilled, (state, { payload }) => {
      state.specialties = payload.result;
    });
  }
});

export const {} = specialtySlice.actions;
