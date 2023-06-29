import { createSlice } from "@reduxjs/toolkit";
import { forEach, every } from "lodash";
import { MakeFieldResponse, makeField } from "~/utils/makeField";

interface StateProps {
  [key: string]: MakeFieldResponse;
}
interface ReservationProp {
  amount: string;
  name: string;
  gender: string;
  phone: string;
  email: string;
  period: any;
}

const makeFieldsBase = (payload: ReservationProp): StateProps => {
  return {
    amount: makeField(payload.amount, "amount", true, false),
    name: makeField(payload.name, "name", true, false),
    gender: makeField(payload.gender, "gender", true, false),
    phone: makeField(payload.phone, "phone", true, false),
    email: makeField(payload.email, "email", false, false),
    period: makeField(payload.period, "period", true, false)
  };
};

export const initialState = makeFieldsBase({
  amount: "",
  name: "",
  gender: "",
  phone: "",
  email: "",
  period: ""
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
      console.log(fieldPath, value);
      return false;
    }
  });
};

export const convertToPayload = (state: StateProps, periodStartedAt: Date) => {
  return {
    type: "WalkInSeating",
    amount: state.amount.value,
    options: {
      name: state.name.value,
      gender: state.gender.value,
      phone: state.phone.value,
      email: state.email.value,
      adults: state.amount.value
    },
    periodStartedAt: periodStartedAt
  };
};

export const { defaultSetting, editField, validator } = mainReducer.actions;
export default mainReducer.reducer;
