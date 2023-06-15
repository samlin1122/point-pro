import { CartItem, Order, Specialty } from "~/features/orders/type";

export const calculateSpecialtiesPrice = (specialties: Specialty[]) => {
  const specialtiesPrice = specialties.reduce((acc, specialty) => {
    const specialtyItemsPrice = specialty.items.reduce((acc, specialtyItem) => (acc += specialtyItem.price), 0);
    return (acc += specialtyItemsPrice);
  }, 0);

  return specialtiesPrice;
};

export const calculateCartItemPrice = (cartItem: CartItem) => {
  const specialtiesPrice = calculateSpecialtiesPrice(cartItem.specialties);
  const cartItemPrice = (cartItem.price + specialtiesPrice) * cartItem.amount;

  return cartItemPrice;
};

export const calculateCartPrice = (cart: CartItem[]) => {
  const cartPrice = cart.reduce((acc, cartItem) => (acc += calculateCartItemPrice(cartItem)), 0);

  return cartPrice;
};

export const calculateOrderPrice = (order: Order) => {
  const { orderMeals = [] } = order;
  const orderPrice = orderMeals.reduce((acc, orderMeal) => (acc += orderMeal.price), 0);

  return orderPrice;
};
