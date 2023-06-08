import { createSlice } from "@reduxjs/toolkit";
import { isEmpty, forEach } from "lodash";
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
    coverUrl: makeField(payload.coverUrl, "coverUrl", true, false),
    description: makeField(payload.description, "description", true, false),
    price: makeField(payload.price, "price", true, false),
    publishedAt: makeField(
      payload.publishedAt ? appDayjs(payload.publishedAt) : payload.publishedAt,
      "publishedAt",
      true,
      false
    ),
    isPopular: makeField(payload.isPopular, "isPopular", true, false),
    categories: makeField(payload.categories, "categories", true, false),
    specialties: makeField(payload.specialties, "specialties", true, false)
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
      } else if (id === "price") {
        state[id].value = Number(value);
      } else {
        state[id].value = value;
      }
    }
  }
});

export const convertToPayload = (state: StateProps) => {
  let payload: { [key: string]: any } = {};
  forEach(state, ({ value }, key) => {
    payload[key] = value;
  });
  return payload as IMeal;
};

export const { defaultSetting, editField } = mainReducer.actions;
export default mainReducer.reducer;
