import { combineReducers } from "@reduxjs/toolkit";

import { takeOrderSlice } from "~/features/orders/slice";
import { counterSlice } from "../features/home/slice";
import { customerBookingSlice } from "~/features/booking/slice";
// api
import { authSlice } from "~/app/slices/auth";
import { categorySlice } from "./slices/category";
import { specialtySlice } from "./slices/specialty";
import { orderSlice } from "./slices/order";
import { paymentSlice } from "./slices/payment";
import { socketSlice } from "./slices/socket";
import { loadingSlice } from "./slices/loading";

const reducer = combineReducers({
  [counterSlice.name]: counterSlice.reducer,
  [takeOrderSlice.name]: takeOrderSlice.reducer,
  [customerBookingSlice.name]: customerBookingSlice.reducer,
  [authSlice.name]: authSlice.reducer,
  [categorySlice.name]: categorySlice.reducer,
  [specialtySlice.name]: specialtySlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [paymentSlice.name]: paymentSlice.reducer,
  [socketSlice.name]: socketSlice.reducer,
  [loadingSlice.name]: loadingSlice.reducer
});

export default reducer;
