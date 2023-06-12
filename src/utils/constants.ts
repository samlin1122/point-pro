import { SpecialtyType } from "~/types/common";
// 專門放固定參數
export const genderList = [
  { id: "male", name: "男生" },
  { id: "female", name: "女生" }
];

export const SpecialtyTypeList = [
  { id: SpecialtyType.SINGLE, title: "單選" },
  { id: SpecialtyType.MULTIPLE, title: "多選" }
];

export const ORDER_STATUS = [
  { value: OrderStatus.PENDING, title: "準備中", id: OrderStatus.PENDING },
  { value: OrderStatus.UNPAID, title: "未付款", id: OrderStatus.UNPAID },
  { value: OrderStatus.SUCCESS, title: "已付款", id: OrderStatus.SUCCESS },
  { value: OrderStatus.CANCEL, title: "已取消", id: OrderStatus.CANCEL }
];

// route
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import { OrderStatus } from "~/features/orders/type";

export const sideBarItemList = [
  {
    id: "orders",
    name: "訂單系統",
    src: RestaurantMenuIcon,
    path: "orders"
  },
  {
    id: "menu",
    name: "點餐系統",
    src: StickyNote2Icon,
    path: "menu"
  },
  {
    id: "seat",
    name: "座位系統",
    src: EventSeatIcon,
    path: "seat"
  },
  {
    id: "meal",
    name: "菜單系統",
    src: MenuBookIcon,
    list: [
      {
        id: "list",
        name: "菜單列表",
        src: "frame-204",
        path: "meal/list"
      },
      {
        id: "settings",
        name: "菜單設置",
        src: "frame-204",
        path: "meal/settings"
      }
    ]
  }
];
