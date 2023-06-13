import { createSlice } from "@reduxjs/toolkit";
import { isEmpty, forEach, every } from "lodash";
import { IMeal } from "~/types";
import appDayjs from "~/utils/dayjs.util";
import { MakeFieldResponse, makeField } from "~/utils/makeField";

interface StateProps {
  [key: string]: MakeFieldResponse;
}

const makeFieldsBase = (payload: IMeal): StateProps => {
  return {
    id: makeField(payload.id, "id", false, false),
    title: makeField(payload.title, "title", true, false),
    coverUrl: makeField(payload.coverUrl, "coverUrl", false, false),
    description: makeField(payload.description, "description", false, false),
    price: makeField(payload.price, "price", true, false),
    publishedAt: makeField(payload.publishedAt ? appDayjs(payload.publishedAt) : null, "publishedAt", true, false),
    isPopular: makeField(payload.isPopular, "isPopular", false, false),
    categories: makeField(payload.categories, "categories", true, false),
    specialties: makeField(payload.specialties, "specialties", false, false)
  };
};

export const initialState = makeFieldsBase({
  id: "",
  title: "",
  coverUrl: "",
  description: "",
  price: 0,
  publishedAt: null,
  isPopular: false,
  categories: [],
  specialties: []
});

const mainReducer = createSlice({
  name: "mainReducer",
  initialState,
  reducers: {
    defaultSetting(state, { payload }) {
      return payload ? makeFieldsBase(payload) : initialState;
    },
    editField(state, { payload }) {
      let { id, value } = payload;
      console.log({ id, value });

      if (id === "publishedAt") {
        state[id].value = value.toISOString();
      } else {
        state[id].value = value;
      }
    },
    validator(state) {
      forEach(state, (data, key) => {
        if (data.isRequired) {
          state[key].invalid = data.value == "";
        }
        if (state[key].invalid) {
          console.log("invalid : ", key);
        }
      });
    }
  }
});

export const validateCheck = (state: StateProps) => {
  return every(state, ({ value, fieldPath, isRequired }) => {
    if (!(isRequired && value === "")) {
      return true;
    } else {
      console.log(fieldPath);
      return false;
    }
  });
};

export const convertToPayload = (state: StateProps) => {
  let payload: { [key: string]: any } = {};
  forEach(state, ({ value }, key) => {
    if (key === "categories") {
      payload.categoryIds = value;
    } else if (key === "specialties") {
      payload.specialtyIds = value;
    } else {
      payload[key] = value;
    }
  });
  return payload as IMeal;
};

export const { defaultSetting, editField, validator } = mainReducer.actions;
export default mainReducer.reducer;
