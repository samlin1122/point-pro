import { useLocation, useNavigate, useParams } from "react-router-dom";
export interface Props {}

export interface IMenuCategory {
  id: string;
  title: string;
}

export interface IMeal {
  id: string;
  title: string;
  coverUrl: string;
  description: string;
  price: number;
  position: number;
  specialties: ISpecialty[];
  categories: IMenuCategory[];
}

export interface ISpecialty {
  id: string;
  title: string;
  type: "single" | "multiple";
  items: ISpecialtyOption[];
}

export interface ISpecialtyOption {
  id: string;
  title: string;
  price?: number;
}

export interface ICartItem {}

export interface IOrder {}

export interface IMobileSlice {
  categories: IMenuCategory[];
  meals: IMeal[];
  cart: ICartItem[];
  orders: IOrder[];
  currentCategory: string;
  currentMealId: string;
  currentDialog: string;
  isShowDialog: boolean;
  isLoading: boolean;
}
export interface RouterProps {
  location: ReturnType<typeof useLocation>;
  navigate: ReturnType<typeof useNavigate>;
  params: ReturnType<typeof useParams>;
}
