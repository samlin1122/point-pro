export const enum SpecialtyType {
  single = "single",
  multiple = "multiple"
}

export const enum OrderType {
  "dine-in" = "dine-in",
  checkout = "checkout"
}

export const enum OrderStatus {
  UNPAID = "UNPAID",
  SUCCESS = "SUCCESS",
  CANCEL = "CANCEL",
  PENDING = "PENDING"
}

export const enum PaymentGateway {
  linepay = "linepay",
  cash = "cash",
  card = "card"
}

export const enum BookingType {
  "online-booking" = "online-booking",
  "phone-booking" = "phone-booking",
  "walk-in-seating" = "walk-in-seating"
}

export const enum Gender {
  male,
  female,
  other
}

export const enum CustomerOrderDialog {
  CUSTOMIZED = "CUSTOMIZED",
  CART = "CART",
  ORDER = "ORDER"
}

export const enum CustomerBookingDialog {
  RECORD_QUERY = "RECORD_QUERY",
  PRIVACY_POLICY = "PRIVACY_POLICY",
  REMINDER = "REMINDER",
  QRCODE = "QRCODE"
}

export const enum MobileModal {
  PAYMENT = "PAYMENT",
  COUNTER_REMINDER = "COUNTER_REMINDER"
}

export const enum MemberRole {
  MERCHANT = "MERCHANT",
  CUSTOMER = "CUSTOMER"
}

export const enum SeatStatus {
  AVAILABLE = "AVAILABLE",
  BOOKED = "BOOKED",
  INUSE = "INUSE"
}
