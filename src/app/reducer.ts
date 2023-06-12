import { combineReducers } from "@reduxjs/toolkit";

import { customerOrderSlice } from "~/features/orders/slice";
import { counterSlice } from "../features/home/slice";
import { customerBookingSlice } from "~/features/booking/slice";
// api
import { authSlice } from "~/app/slices/auth";
import { categorySlice } from "./slices/category";
import { specialtySlice } from "./slices/specialty";
import { orderSlice } from "./slices/order";

const reducer = combineReducers({
  [counterSlice.name]: counterSlice.reducer,
  [customerOrderSlice.name]: customerOrderSlice.reducer,
  [customerBookingSlice.name]: customerBookingSlice.reducer,
  [authSlice.name]: authSlice.reducer,
  [categorySlice.name]: categorySlice.reducer,
  [specialtySlice.name]: specialtySlice.reducer,
  [orderSlice.name]: orderSlice.reducer
});

export default reducer;
