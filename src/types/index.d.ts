export interface Props {}

export interface IMenuCategory {
  id: string
  title: string
}

export interface IMeal {
  id: string
  title: string
  coverUrl: string
  description: string
  price: number
  position: number
  specialities: ISpeciality[]
  categories: IMenuCategory[]
}

export interface ISpeciality {
  id: string
  title: string
  type: "single" | "multiple"
  items: ISpecialityOption[]
}

export interface ISpecialityOption {
  id: string
  title: string
  price?: number
}

export interface ICartItem {}

export interface IOrder {}

export interface IMobileSlice {
  categories: IMenuCategory[]
  meals: IMeal[]
  cart: ICartItem[]
  orders: IOrder[]
  currentMealId: string
  isShowBottomDrawer: boolean
  isLoading: boolean
}
