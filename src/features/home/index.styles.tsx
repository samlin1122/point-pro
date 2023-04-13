import type { RootState } from "../../app/store"
import { useSelector, useDispatch } from "react-redux"
import { decrement, increment } from "./slice"

import { ButtonBase } from "../../components/buttons"

interface CounterButton {}

export const CounterButton: React.FC<CounterButton> = () => {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <>
      <ButtonBase aria-label="Increment value" onClick={() => dispatch(increment())}>
        Increment
      </ButtonBase>
      <span>{count}</span>
      <ButtonBase aria-label="Decrement value" onClick={() => dispatch(decrement())}>
        Decrement
      </ButtonBase>
    </>
  )
}
