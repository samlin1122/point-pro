import { customerOrderSlice } from "~/features/orders/slice";
import { counterSlice } from "../features/home/slice";

const reducer = {
  [counterSlice.name]: counterSlice.reducer,
  [customerOrderSlice.name]: customerOrderSlice.reducer
};

export default reducer;
