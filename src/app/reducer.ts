import { customerSlice } from "~/features/customer/slice"
import { counterSlice } from "../features/home/slice"

const reducer = {
  [counterSlice.name]: counterSlice.reducer,
  [customerSlice.name]: customerSlice.reducer
}

export default reducer
