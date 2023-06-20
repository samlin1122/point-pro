export enum SpecialtyType {
  SINGLE = "SINGLE",
  MULTIPLE = "MULTIPLE"
}

export enum OrderType {
  DineIn = "DineIn",
  TakeOut = "TakeOut"
}

export enum OrderStatus {
  PENDING = "PENDING",
  UNPAID = "UNPAID",
  SUCCESS = "SUCCESS",
  CANCEL = "CANCEL"
}

export enum OrderStatusTitle {
  PENDING = "準備中",
  UNPAID = "未付款",
  SUCCESS = "已付款",
  CANCEL = "已取消"
}

export enum PaymentGateway {
  LINE_PAY = "LINE_PAY",
  CASH = "CASH",
  EC_PAY = "EC_PAY"
}

export enum BookingType {
  "online-booking" = "online-booking",
  "phone-booking" = "phone-booking",
  "walk-in-seating" = "walk-in-seating"
}

export enum Gender {
  male,
  female,
  other
}

export enum CustomerBookingDialog {
  RECORD_QUERY = "RECORD_QUERY",
  PRIVACY_POLICY = "PRIVACY_POLICY",
  REMINDER = "REMINDER",
  QRCODE = "QRCODE"
}

export enum MobileModal {
  PAYMENT = "PAYMENT",
  COUNTER_REMINDER = "COUNTER_REMINDER",
  REMOVE_CART_CONFIRM = "REMOVE_CART_CONFIRM",
  CART_ITEM_IS_OFF = "CART_ITEM_IS_OFF"
}

export enum MemberRole {
  MERCHANT = "MERCHANT",
  CUSTOMER = "CUSTOMER"
}

export enum SeatStatus {
  AVAILABLE = "AVAILABLE",
  BOOKED = "BOOKED",
  INUSE = "INUSE"
}
