import { customerOrderSlice } from "~/features/customer-order/slice";
import { counterSlice } from "../features/home/slice";

const reducer = {
  [counterSlice.name]: counterSlice.reducer,
  [customerOrderSlice.name]: customerOrderSlice.reducer
};

export default reducer;
