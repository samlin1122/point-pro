import { customerOrderSlice } from "~/features/orders/slice";
import { counterSlice } from "../features/home/slice";
import { customerBookingSlice } from "~/features/booking/slice";
import { authSlice } from "~/app/slices/auth";

const reducer = {
  [counterSlice.name]: counterSlice.reducer,
  [customerOrderSlice.name]: customerOrderSlice.reducer,
  [customerBookingSlice.name]: customerBookingSlice.reducer,
  [authSlice.name]: authSlice.reducer
};

export default reducer;
