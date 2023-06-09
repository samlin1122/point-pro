import { createSlice } from "@reduxjs/toolkit";
import { forEach, some, every } from "lodash";
import { ISpecialty } from "~/types";
import { SpecialtyType } from "~/types/common";
import { MakeFieldResponse, makeField } from "~/utils/makeField";

interface StateProps {
  [key: string]: MakeFieldResponse;
}
interface ItemType {
  id: string;
  title: string;
  price: number;
}

const makeFieldsBase = (payload: ISpecialty): StateProps => {
  return {
    id: makeField(payload.id, "id", false, false),
    title: makeField(payload.title, "title", true, false),
    type: makeField(payload.type, "type", true, false),
    items: makeField(payload.items ?? [], "type", false, false)
  };
};
const initialItem = { id: "", title: "", price: 0 };

export const initialState = makeFieldsBase({
  id: "",
  title: "",
  type: SpecialtyType.SINGLE,
  items: []
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

      state[id].value = value;
    },
    addItem(state) {
      if (!some(state.items.value, initialItem)) {
        state.items.value = [...state.items.value, initialItem];
      }
    },
    deleteItem(state, { payload }) {
      state.items.value.splice(payload, 1);
    },
    editItem(state, { payload }) {
      let { index, key, value } = payload;
      console.log(index, key, value);
      let data = value?.inputValue ? value.inputValue : value;
      if (typeof data === "string" || data === null) {
        // input
        if (key === "title" && state.items.value[index][key] !== data) {
          state.items.value[index] = { ...initialItem };
        }
        state.items.value[index][key] = data;
      } else {
        // select
        state.items.value[index] = data;
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
    if (key === "items") {
      payload[key] = value
        .filter(({ title }: ItemType) => title)
        .map(({ id, title, price }: ItemType) => ({ id, title, price: Number(price) }));
    } else {
      payload[key] = value;
    }
  });
  return payload as ISpecialty;
};

export const { defaultSetting, editField, addItem, deleteItem, editItem, validator } = mainReducer.actions;
export default mainReducer.reducer;
