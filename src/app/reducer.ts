import { customerOrderSlice } from "~/features/orders/slice";
import { counterSlice } from "../features/home/slice";
import { customerBookingSlice } from "~/features/booking/slice";

const reducer = {
  [counterSlice.name]: counterSlice.reducer,
  [customerOrderSlice.name]: customerOrderSlice.reducer,
  [customerBookingSlice.name]: customerBookingSlice.reducer
};

export default reducer;
